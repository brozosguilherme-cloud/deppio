import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;
  const supplier = await prisma.supplier.findFirst({
    where: { id, organizationId: user.organizationId },
  });
  if (!supplier) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });

  const body = await request.json();
  const updated = await prisma.supplier.update({
    where: { id },
    data: {
      name: body.name,
      cnpj: body.cnpj || null,
      contactName: body.contactName || null,
      phone: body.phone || null,
      email: body.email || null,
      website: body.website || null,
      address: body.address || null,
      deliveryDays: body.deliveryDays ? parseInt(body.deliveryDays) : null,
      notes: body.notes || null,
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;
  await prisma.supplier.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ message: "Fornecedor desativado" });
}
