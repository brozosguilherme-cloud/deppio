import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";

  try {
    const customers = await prisma.customer.findMany({
      where: {
        organizationId: user.organizationId,
        ...(search && { OR: [{ name: { contains: search, mode: "insensitive" } }, { cpf: { contains: search } }, { phone: { contains: search } }] }),
      },
      orderBy: { name: "asc" },
      take: 20,
    });
    return NextResponse.json(customers);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const { name, cpf, email, phone, address } = await request.json();
    if (!name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

    const customer = await prisma.customer.create({
      data: { organizationId: user.organizationId, name, cpf: cpf || null, email: email || null, phone: phone || null, address: address || null },
    });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("[API] POST /customers error:", error);
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 });
  }
}
