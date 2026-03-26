import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, isDemoMode, planForbidden } from "@/lib/auth";
import { canAccess } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { DEMO_RAW_MATERIALS } from "@/lib/demo-data";

function checkPlan(user: Awaited<ReturnType<typeof getAuthUser>>) {
  const plan = (user?.organization?.plan ?? "ESSENCIAL") as "ESSENCIAL" | "PRO";
  return !isDemoMode() && !canAccess(plan, "rawMaterials");
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (checkPlan(user)) return planForbidden("Matérias-primas");

  if (isDemoMode()) {
    const rm = DEMO_RAW_MATERIALS.find(r => r.id === params.id);
    if (!rm) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(rm);
  }

  try {
    const rm = await prisma.rawMaterial.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
      include: {
        supplier: { select: { id: true, name: true } },
        movements: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
    if (!rm) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(rm);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao buscar matéria-prima" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  if (checkPlan(user)) return planForbidden("Matérias-primas");

  if (isDemoMode()) {
    const body = await request.json();
    return NextResponse.json({ ...body, id: params.id, demo: true });
  }

  try {
    const body = await request.json();
    const { name, description, unit, minStock, costPerUnit, supplierId, notes, isActive } = body;

    const rm = await prisma.rawMaterial.updateMany({
      where: { id: params.id, organizationId: user.organizationId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(unit && { unit }),
        ...(minStock !== undefined && { minStock: Number(minStock) }),
        ...(costPerUnit !== undefined && { costPerUnit: Number(costPerUnit) }),
        ...(supplierId !== undefined && { supplierId: supplierId ?? null }),
        ...(notes !== undefined && { notes }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    if (rm.count === 0) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao atualizar matéria-prima" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  if (checkPlan(user)) return planForbidden("Matérias-primas");

  if (isDemoMode()) return NextResponse.json({ success: true, demo: true });

  try {
    await prisma.rawMaterial.updateMany({
      where: { id: params.id, organizationId: user.organizationId },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao remover matéria-prima" }, { status: 500 });
  }
}
