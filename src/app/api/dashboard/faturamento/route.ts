import { isDemoMode } from "@/lib/auth";
import { DEMO_FATURAMENTO } from "@/lib/demo-data";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { startOfDay, endOfDay, format, eachDayOfInterval, parseISO } from "date-fns";

const EMPTY_FATURAMENTO = {
  totalRevenue: 0, totalCost: 0, grossMargin: 0, grossMarginPct: 0,
  totalSales: 0, avgTicket: 0, revenueByDay: [], topProducts: [], byPayment: [],
};

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("from") ?? format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
  const dateTo = searchParams.get("to") ?? format(new Date(), "yyyy-MM-dd");

  const orgId = user.organizationId;
  const fromDate = startOfDay(parseISO(dateFrom));
  const toDate = endOfDay(parseISO(dateTo));

  if (isDemoMode()) return NextResponse.json(DEMO_FATURAMENTO);
  try {
    const [salesData, topProducts, byPayment] = await Promise.all([
      prisma.sale.findMany({
        where: { organizationId: orgId, status: "COMPLETED", createdAt: { gte: fromDate, lte: toDate } },
        select: { id: true, total: true, discount: true, subtotal: true, createdAt: true, items: { select: { quantity: true, unitPrice: true, unitCost: true, subtotal: true } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.saleItem.groupBy({
        by: ["productId"],
        where: { sale: { organizationId: orgId, status: "COMPLETED", createdAt: { gte: fromDate, lte: toDate } } },
        _sum: { subtotal: true, quantity: true },
        orderBy: { _sum: { subtotal: "desc" } },
        take: 10,
      }),
      prisma.sale.groupBy({
        by: ["paymentMethod"],
        where: { organizationId: orgId, status: "COMPLETED", createdAt: { gte: fromDate, lte: toDate } },
        _sum: { total: true },
        _count: { id: true },
      }),
    ]);

    const productIds = topProducts.map((p) => p.productId);
    const productNames = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true } });

    const topProductsWithNames = topProducts.map((tp) => ({
      productId: tp.productId,
      name: productNames.find((p) => p.id === tp.productId)?.name ?? "Produto removido",
      totalRevenue: Number(tp._sum.subtotal ?? 0),
      totalQuantity: tp._sum.quantity ?? 0,
    }));

    const days = eachDayOfInterval({ start: fromDate, end: toDate });
    const revenueByDay = days.map((day) => {
      const dayKey = format(day, "dd/MM");
      const daySales = salesData.filter((s) => format(new Date(s.createdAt), "dd/MM/yyyy") === format(day, "dd/MM/yyyy"));
      const revenue = daySales.reduce((sum, s) => sum + Number(s.total), 0);
      const cost = daySales.reduce((sum, s) => sum + s.items.reduce((is, i) => is + Number(i.unitCost) * i.quantity, 0), 0);
      return { date: dayKey, receita: revenue, custo: cost, margem: revenue - cost };
    });

    const totalRevenue = salesData.reduce((sum, s) => sum + Number(s.total), 0);
    const totalCost = salesData.reduce((sum, s) => sum + s.items.reduce((is, i) => is + Number(i.unitCost) * i.quantity, 0), 0);
    const totalSales = salesData.length;

    return NextResponse.json({
      totalRevenue, totalCost, grossMargin: totalRevenue - totalCost,
      grossMarginPct: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
      totalSales, avgTicket: totalSales > 0 ? totalRevenue / totalSales : 0,
      revenueByDay, topProducts: topProductsWithNames,
      byPayment: byPayment.map((p) => ({ method: p.paymentMethod, total: Number(p._sum.total ?? 0), count: p._count.id })),
    });
  } catch {
    return NextResponse.json(EMPTY_FATURAMENTO);
  }
}
