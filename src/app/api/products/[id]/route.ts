import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id] — Detalhe de um produto
 * PUT /api/products/[id] — Atualiza produto
 * DELETE /api/products/[id] — Desativa produto (soft delete)
 */

export async function GET(_req: Request, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      category: true,
      supplier: true,
      stockMovements: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    // Verifica se produto pertence à organização
    const product = await prisma.product.findFirst({
      where: { id, organizationId: user.organizationId },
    });
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Se SKU foi alterado, verificar unicidade
    if (body.sku && body.sku !== product.sku) {
      const duplicate = await prisma.product.findFirst({
        where: { organizationId: user.organizationId, sku: body.sku, NOT: { id } },
      });
      if (duplicate) {
        return NextResponse.json({ error: "SKU já está em uso" }, { status: 409 });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        sku: body.sku,
        ean: body.ean ?? null,
        description: body.description ?? null,
        categoryId: body.categoryId ?? null,
        supplierId: body.supplierId ?? null,
        unit: body.unit,
        costPrice: body.costPrice,
        salePrice: body.salePrice,
        minStock: body.minStock ?? 0,
        imageUrl: body.imageUrl ?? null,
        isActive: body.isActive ?? true,
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API] PUT /products/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas admins podem desativar produtos" }, { status: 403 });
  }

  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, organizationId: user.organizationId },
  });
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  // Soft delete — apenas desativa
  await prisma.product.update({ where: { id }, data: { isActive: false } });

  return NextResponse.json({ message: "Produto desativado" });
}
