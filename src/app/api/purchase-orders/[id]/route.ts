import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/**
 * PUT /api/purchase-orders/[id] — Atualiza status da ordem de compra.
 * Ao marcar como RECEIVED, cria movimentações de entrada no estoque.
 */
export async function PUT(request: Request, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;
  const { status } = await request.json();

  const order = await prisma.purchaseOrder.findFirst({
    where: { id, organizationId: user.organizationId },
    include: { items: true },
  });

  if (!order) return NextResponse.json({ error: "Ordem não encontrada" }, { status: 404 });

  if (status === "RECEIVED" && order.status !== "RECEIVED") {
    // Dá entrada no estoque para cada item
    await prisma.$transaction(async (tx) => {
      await tx.purchaseOrder.update({ where: { id }, data: { status: "RECEIVED" } });

      for (const item of order.items) {
        await tx.stockMovement.create({
          data: {
            organizationId: user.organizationId,
            productId: item.productId,
            userId: user.id,
            type: "PURCHASE",
            quantity: item.quantity,
            unitCost: item.unitCost,
            reference: `OC #${id.slice(-6).toUpperCase()}`,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { increment: item.quantity } },
        });
      }
    });
  } else {
    await prisma.purchaseOrder.update({ where: { id }, data: { status } });
  }

  return NextResponse.json({ message: "Ordem atualizada" });
}
