import { isDemoMode } from "@/lib/auth";
import { DEMO_RELATORIO } from "@/lib/demo-data";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const orgId = user.organizationId;

  if (isDemoMode()) return NextResponse.json(DEMO_RELATORIO);
  try {
    const salesByProduct = await prisma.saleItem.groupBy({
      by: ["productId"],
      where: { sale: { organizationId: orgId, status: "COMPLETED" } },
      _sum: { quantity: true, subtotal: true },
    });

    const productIds = salesByProduct.map((s) => s.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true, costPrice: true, salePrice: true, currentStock: true, category: { select: { name: true } } },
    });

    const productReport = salesByProduct.map((s) => {
      const product = products.find((p) => p.id === s.productId);
      const totalRevenue = Number(s._sum.subtotal ?? 0);
      const totalQuantity = s._sum.quantity ?? 0;
      const totalCost = Number(product?.costPrice ?? 0) * totalQuantity;
      const grossProfit = totalRevenue - totalCost;
      const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
      return {
        productId: s.productId, productName: product?.name ?? "Produto removido",
        sku: product?.sku ?? "", category: product?.category?.name ?? "Sem categoria",
        costPrice: Number(product?.costPrice ?? 0), salePrice: Number(product?.salePrice ?? 0),
        currentStock: product?.currentStock ?? 0, totalQuantitySold: totalQuantity,
        totalRevenue, totalCost, grossProfit, margin,
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    const byCategory: Record<string, { revenue: number; cost: number; quantity: number }> = {};
    productReport.forEach((p) => {
      if (!byCategory[p.category]) byCategory[p.category] = { revenue: 0, cost: 0, quantity: 0 };
      byCategory[p.category].revenue += p.totalRevenue;
      byCategory[p.category].cost += p.totalCost;
      byCategory[p.category].quantity += p.totalQuantitySold;
    });

    const categoryReport = Object.entries(byCategory).map(([name, data]) => ({
      name, totalRevenue: data.revenue, totalCost: data.cost,
      grossProfit: data.revenue - data.cost,
      margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
      totalQuantity: data.quantity,
    })).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return NextResponse.json({
      products: productReport,
      categories: categoryReport,
      lowMarginProducts: productReport.filter((p) => p.margin < 10),
      summary: {
        totalRevenue: productReport.reduce((s, p) => s + p.totalRevenue, 0),
        totalCost: productReport.reduce((s, p) => s + p.totalCost, 0),
        avgMargin: productReport.length > 0 ? productReport.reduce((s, p) => s + p.margin, 0) / productReport.length : 0,
      },
    });
  } catch {
    return NextResponse.json({ products: [], categories: [], lowMarginProducts: [], summary: { totalRevenue: 0, totalCost: 0, avgMargin: 0 } });
  }
}
