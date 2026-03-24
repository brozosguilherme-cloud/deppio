import { isDemoMode } from "@/lib/auth";
import { DEMO_RECENT_SALES } from "@/lib/demo-data";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const where = {
    organizationId: user.organizationId,
    ...(dateFrom && { createdAt: { gte: new Date(dateFrom) } }),
    ...(dateTo && { createdAt: { ...(dateFrom ? { gte: new Date(dateFrom) } : {}), lte: new Date(dateTo) } }),
  };

  if (isDemoMode()) return NextResponse.json({ sales: DEMO_RECENT_SALES, pagination: { page: 1, limit: 20, total: DEMO_RECENT_SALES.length, pages: 1 } });
  try {
    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          user: { select: { name: true } },
          customer: { select: { name: true } },
          items: { include: { product: { select: { name: true, unit: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sale.count({ where }),
    ]);
    return NextResponse.json({ sales, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ sales: [], pagination: { page, limit, total: 0, pages: 0 } });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  if (isDemoMode()) return NextResponse.json({ sales: DEMO_RECENT_SALES, pagination: { page: 1, limit: 20, total: DEMO_RECENT_SALES.length, pages: 1 } });
  try {
    const body = await request.json();
    const { items, paymentMethod, customerId, discount = 0, notes } = body;

    if (!items || items.length === 0)
      return NextResponse.json({ error: "A venda precisa ter pelo menos um item" }, { status: 400 });

    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, organizationId: user.organizationId, isActive: true },
    });

    if (products.length !== productIds.length)
      return NextResponse.json({ error: "Um ou mais produtos não encontrados" }, { status: 404 });

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (product.currentStock < item.quantity)
        return NextResponse.json({ error: `Estoque insuficiente para "${product.name}". Disponível: ${product.currentStock}` }, { status: 422 });
    }

    let subtotal = 0;
    const saleItems = items.map((item: { productId: string; quantity: number; unitPrice?: number }) => {
      const product = products.find((p) => p.id === item.productId)!;
      const unitPrice = item.unitPrice ?? Number(product.salePrice);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;
      return { productId: item.productId, quantity: item.quantity, unitPrice, unitCost: Number(product.costPrice), subtotal: itemSubtotal };
    });

    const total = subtotal - Number(discount);

    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.sale.create({
        data: {
          organizationId: user.organizationId, userId: user.id,
          customerId: customerId || null, paymentMethod, subtotal,
          discount: Number(discount), total, notes: notes || null,
          items: { create: saleItems },
        },
        include: {
          user: { select: { name: true } },
          customer: { select: { name: true } },
          items: { include: { product: { select: { name: true, unit: true } } } },
        },
      });

      for (const item of saleItems) {
        await tx.stockMovement.create({
          data: { organizationId: user.organizationId, productId: item.productId, userId: user.id, type: "SALE", quantity: -item.quantity, saleId: newSale.id },
        });
        await tx.product.update({ where: { id: item.productId }, data: { currentStock: { decrement: item.quantity } } });
      }
      return newSale;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("[API] POST /sales error:", error);
    return NextResponse.json({ error: "Erro ao registrar venda" }, { status: 500 });
  }
}
