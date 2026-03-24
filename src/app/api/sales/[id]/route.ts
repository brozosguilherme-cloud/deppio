import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/sales/[id] — Detalhe de uma venda
 * DELETE /api/sales/[id] — Cancela a venda (devolve estoque)
 */

export async function GET(_req: Request, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const sale = await prisma.sale.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      user: { select: { name: true } },
      customer: true,
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true, unit: true } },
        },
      },
    },
  });

  if (!sale) {
    return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 });
  }

  return NextResponse.json(sale);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas admins podem cancelar vendas" }, { status: 403 });
  }

  const { id } = await params;
  const sale = await prisma.sale.findFirst({
    where: { id, organizationId: user.organizationId },
    include: { items: true },
  });

  if (!sale) {
    return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 });
  }

  if (sale.status === "CANCELLED") {
    return NextResponse.json({ error: "Venda já está cancelada" }, { status: 400 });
  }

  // Cancela e devolve estoque em transação
  await prisma.$transaction(async (tx) => {
    await tx.sale.update({ where: { id }, data: { status: "CANCELLED" } });

    for (const item of sale.items) {
      // Estorno de movimentação
      await tx.stockMovement.create({
        data: {
          organizationId: user.organizationId,
          productId: item.productId,
          userId: user.id,
          type: "REVERSAL",
          quantity: item.quantity,
          reason: `Cancelamento da venda #${id.slice(-6).toUpperCase()}`,
          saleId: id,
        },
      });

      // Devolve ao estoque
      await tx.product.update({
        where: { id: item.productId },
        data: { currentStock: { increment: item.quantity } },
      });
    }
  });

  return NextResponse.json({ message: "Venda cancelada e estoque revertido" });
}
