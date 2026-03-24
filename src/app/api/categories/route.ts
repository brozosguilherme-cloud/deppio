import { isDemoMode } from "@/lib/auth";
import { DEMO_CATEGORIES } from "@/lib/demo-data";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (isDemoMode()) return NextResponse.json(DEMO_CATEGORIES);
  try {
    const categories = await prisma.category.findMany({
      where: { organizationId: user.organizationId },
      include: { children: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  if (isDemoMode()) return NextResponse.json(DEMO_CATEGORIES);
  try {
    const { name, parentId, color } = await request.json();
    if (!name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

    const category = await prisma.category.create({
      data: { organizationId: user.organizationId, name, parentId: parentId || null, color: color || null },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("[API] POST /categories error:", error);
    return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
  }
}
