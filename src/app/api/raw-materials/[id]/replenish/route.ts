import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, isDemoMode, planForbidden } from "@/lib/auth";
import { canAccess } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { DEMO_RAW_MATERIALS } from "@/lib/demo-data";

// POST /api/raw-materials/[id]/replenish — entrada de estoque de matéria-prima
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const plan = (user.organization?.plan ?? "ESSENCIAL") as "ESSENCIAL" | "PRO";
  if (!isDemoMode() && !canAccess(plan, "rawMaterials")) {
    return planForbidden("Matérias-primas");
  }

  if (isDemoMode()) {
    const { quantity } = await request.json();
    const rm = DEMO_RAW_MATERIALS.find(r => r.id === params.id);
    return NextResponse.json({
      success: true,
      demo: true,
      newStock: (rm?.currentStock ?? 0) + Number(quantity),
    });
  }

  try {
    const { quantity, note } = await request.json();
    if (!quantity || quantity <= 0)
      return NextResponse.json({ error: "Quantidade deve ser maior que zero" }, { status: 400 });

    const rm = await prisma.rawMaterial.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
    });
    if (!rm) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

    const [updated] = await prisma.$transaction([
      prisma.rawMaterial.update({
        where: { id: params.id },
        data: { currentStock: { increment: Number(quantity) } },
      }),
      prisma.rawMaterialMovement.create({
        data: {
          organizationId: user.organizationId,
          rawMaterialId: params.id,
          type: "IN",
          quantity: Number(quantity),
          note: note ?? "Reposição de estoque",
        },
      }),
    ]);

    return NextResponse.json({ success: true, newStock: updated.currentStock });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao repor estoque" }, { status: 500 });
  }
}
