import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, isDemoMode } from "@/lib/auth";

const DEMO_ORG = {
  id: "demo-org",
  name: "Deppio Demo",
  cnpj: "00.000.000/0001-00",
  phone: "(11) 9999-9999",
  email: "contato@deppio.com.br",
  address: "Rua das Flores, 123",
  city: "São Paulo",
  state: "SP",
  zipCode: "01310-100",
  website: "https://deppio.com.br",
  logoUrl: null,
  businessType: "varejo",
  description: "Empresa demonstração do Deppio",
  onboardingCompleted: true,
  plan: "ESSENCIAL",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (isDemoMode()) {
    return NextResponse.json(DEMO_ORG);
  }

  try {
    const org = await prisma.organization.findUnique({
      where: { id: user.organizationId },
    });
    if (!org) return NextResponse.json({ error: "Organização não encontrada" }, { status: 404 });
    return NextResponse.json(org);
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (isDemoMode()) {
    return NextResponse.json({ ...DEMO_ORG, ...await req.json() });
  }

  try {
    const body = await req.json();
    const { name, cnpj, phone, email, address, city, state, zipCode, website, logoUrl, businessType, description } = body;

    const org = await prisma.organization.update({
      where: { id: user.organizationId },
      data: {
        ...(name !== undefined && { name }),
        ...(cnpj !== undefined && { cnpj }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(website !== undefined && { website }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(businessType !== undefined && { businessType }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(org);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar organização" }, { status: 500 });
  }
}
