import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, isDemoMode, planForbidden } from "@/lib/auth";
import { canAccess } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { DEMO_RAW_MATERIALS } from "@/lib/demo-data";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const plan = (user.organization?.plan ?? "ESSENCIAL") as "ESSENCIAL" | "PRO";
  if (!isDemoMode() && !canAccess(plan, "rawMaterials")) {
    return planForbidden("Matérias-primas");
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const lowStock = searchParams.get("lowStock") === "true";

  if (isDemoMode()) {
    let data = DEMO_RAW_MATERIALS;
    if (search) data = data.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    if (lowStock) data = data.filter(r => r.currentStock < r.minStock);
    return NextResponse.json({ rawMaterials: data, total: data.length });
  }

  try {
    const where = {
      organizationId: user.organizationId,
      isActive: true,
      ...(search && { name: { contains: search, mode: "insensitive" as const } }),
      ...(lowStock && { currentStock: { lt: prisma.rawMaterial.fields.minStock } }),
    };

    const rawMaterials = await prisma.rawMaterial.findMany({
      where: { organizationId: user.organizationId, isActive: true,
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      include: { supplier: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    });

    const filtered = lowStock
      ? rawMaterials.filter(r => r.currentStock < r.minStock)
      : rawMaterials;

    return NextResponse.json({ rawMaterials: filtered, total: filtered.length });
  } catch (e) {
    console.error("[API] GET /raw-materials error:", e);
    return NextResponse.json({ rawMaterials: [], total: 0 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const plan = (user.organization?.plan ?? "ESSENCIAL") as "ESSENCIAL" | "PRO";
  if (!isDemoMode() && !canAccess(plan, "rawMaterials")) {
    return planForbidden("Matérias-primas");
  }

  if (isDemoMode()) {
    const body = await request.json();
    return NextResponse.json({ ...body, id: `rm-demo-${Date.now()}`, demo: true }, { status: 201 });
  }

  try {
    const body = await request.json();
    const { name, description, unit, currentStock = 0, minStock = 0, costPerUnit = 0, supplierId, notes } = body;

    if (!name || !unit)
      return NextResponse.json({ error: "Nome e unidade são obrigatórios" }, { status: 400 });

    const rm = await prisma.rawMaterial.create({
      data: {
        organizationId: user.organizationId,
        name, description: description ?? null, unit,
        currentStock: Number(currentStock), minStock: Number(minStock),
        costPerUnit: Number(costPerUnit),
        supplierId: supplierId ?? null, notes: notes ?? null,
      },
      include: { supplier: { select: { id: true, name: true } } },
    });

    return NextResponse.json(rm, { status: 201 });
  } catch (e) {
    console.error("[API] POST /raw-materials error:", e);
    return NextResponse.json({ error: "Erro ao criar matéria-prima" }, { status: 500 });
  }
}
