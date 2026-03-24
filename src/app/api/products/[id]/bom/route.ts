import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, isDemoMode } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_BOM } from "@/lib/demo-data";

// GET /api/products/[id]/bom — retorna ficha técnica do produto
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (isDemoMode()) {
    return NextResponse.json({ bom: DEMO_BOM[params.id] ?? [] });
  }

  try {
    const bom = await prisma.productRawMaterial.findMany({
      where: { productId: params.id, product: { organizationId: user.organizationId } },
      include: { rawMaterial: { select: { id: true, name: true, unit: true, currentStock: true, costPerUnit: true } } },
      orderBy: { rawMaterial: { name: "asc" } },
    });
    return NextResponse.json({ bom });
  } catch (e) {
    return NextResponse.json({ bom: [] });
  }
}

// PUT /api/products/[id]/bom — salva ficha técnica completa (substitui)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  if (isDemoMode()) {
    return NextResponse.json({ success: true, demo: true });
  }

  try {
    const { items } = await request.json();
    // items: Array<{ rawMaterialId: string; quantity: number }>

    const product = await prisma.product.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
    });
    if (!product) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

    await prisma.$transaction([
      prisma.productRawMaterial.deleteMany({ where: { productId: params.id } }),
      ...(items && items.length > 0
        ? [prisma.productRawMaterial.createMany({
            data: items.map((item: { rawMaterialId: string; quantity: number }) => ({
              productId: params.id,
              rawMaterialId: item.rawMaterialId,
              quantity: Number(item.quantity),
            })),
          })]
        : []
      ),
    ]);

    // Recalcula custo do produto com base no BOM
    const bom = await prisma.productRawMaterial.findMany({
      where: { productId: params.id },
      include: { rawMaterial: { select: { costPerUnit: true } } },
    });

    if (bom.length > 0) {
      const newCost = bom.reduce((sum, item) => sum + Number(item.rawMaterial.costPerUnit) * item.quantity, 0);
      await prisma.product.update({
        where: { id: params.id },
        data: { costPrice: newCost },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[API] PUT /products/[id]/bom error:", e);
    return NextResponse.json({ error: "Erro ao salvar ficha técnica" }, { status: 500 });
  }
}
