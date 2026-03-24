import { isDemoMode } from "@/lib/auth";
import { DEMO_PURCHASE_ORDERS } from "@/lib/demo-data";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");
  const status = searchParams.get("status");

  if (isDemoMode()) return NextResponse.json({ orders: DEMO_PURCHASE_ORDERS });
  try {
    const orders = await prisma.purchaseOrder.findMany({
      where: {
        organizationId: user.organizationId,
        ...(supplierId && { supplierId }),
        ...(status && { status: status as never }),
      },
      include: {
        supplier: { select: { name: true } },
        items: { include: { product: { select: { name: true, unit: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  if (isDemoMode()) return NextResponse.json({ orders: DEMO_PURCHASE_ORDERS });
  try {
    const body = await request.json();
    const { supplierId, items, expectedDate, notes } = body;

    if (!supplierId || !items?.length)
      return NextResponse.json({ error: "Fornecedor e itens são obrigatórios" }, { status: 400 });

    const total = items.reduce((sum: number, i: { quantity: number; unitCost: number }) => sum + i.quantity * i.unitCost, 0);

    const order = await prisma.purchaseOrder.create({
      data: {
        organizationId: user.organizationId, supplierId,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        notes: notes || null, total,
        items: { create: items.map((i: { productId: string; quantity: number; unitCost: number }) => ({ productId: i.productId, quantity: i.quantity, unitCost: i.unitCost, subtotal: i.quantity * i.unitCost })) },
      },
      include: { supplier: { select: { name: true } }, items: { include: { product: { select: { name: true, unit: true } } } } },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[API] POST /purchase-orders error:", error);
    return NextResponse.json({ error: "Erro ao criar pedido de compra" }, { status: 500 });
  }
}
