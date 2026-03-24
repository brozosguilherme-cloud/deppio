import { isDemoMode } from "@/lib/auth";
import { DEMO_SUPPLIERS } from "@/lib/demo-data";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";

  if (isDemoMode()) return NextResponse.json({ suppliers: DEMO_SUPPLIERS });
  try {
    const suppliers = await prisma.supplier.findMany({
      where: {
        organizationId: user.organizationId,
        ...(search && { OR: [{ name: { contains: search, mode: "insensitive" } }, { cnpj: { contains: search } }] }),
      },
      include: { _count: { select: { products: true, purchaseOrders: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ suppliers });
  } catch {
    return NextResponse.json({ suppliers: [] });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  if (isDemoMode()) return NextResponse.json({ suppliers: DEMO_SUPPLIERS });
  try {
    const body = await request.json();
    const { name, cnpj, contactName, phone, email, website, address, deliveryDays, notes } = body;
    if (!name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

    const supplier = await prisma.supplier.create({
      data: {
        organizationId: user.organizationId, name,
        cnpj: cnpj || null, contactName: contactName || null,
        phone: phone || null, email: email || null,
        website: website || null, address: address || null,
        deliveryDays: deliveryDays ? parseInt(deliveryDays) : null,
        notes: notes || null,
      },
    });
    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error("[API] POST /suppliers error:", error);
    return NextResponse.json({ error: "Erro ao criar fornecedor" }, { status: 500 });
  }
}
