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
  console.log("[ORG_GET] Iniciando...");
  const user = await getAuthUser();
  if (!user) {
    console.log("[ORG_GET] Usuário não autenticado");
    return unauthorized();
  }
  console.log("[ORG_GET] Usuário:", user.id, "OrgId:", user.organizationId);

  if (isDemoMode()) {
    return NextResponse.json(DEMO_ORG);
  }

  try {
    const org = await prisma.organization.findUnique({
      where: { id: user.organizationId },
    });
    console.log("[ORG_GET] Org encontrada:", org ? org.id : "NULL");
    if (!org) return NextResponse.json({ error: "Organização não encontrada" }, { status: 404 });

    // Se a org não tem email, usa o email do usuário como fallback
    const orgData = {
      ...org,
      email: org.email || user.email || "",
    };

    return NextResponse.json(orgData);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[ORG_GET] Erro:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  console.log("[ORG_PUT] Iniciando...");
  const user = await getAuthUser();
  if (!user) {
    console.log("[ORG_PUT] Usuário não autenticado");
    return unauthorized();
  }
  console.log("[ORG_PUT] Usuário:", user.id, "OrgId:", user.organizationId);

  if (isDemoMode()) {
    return NextResponse.json({ ...DEMO_ORG, ...await req.json() });
  }

  try {
    const body = await req.json();
    console.log("[ORG_PUT] Body recebido:", JSON.stringify(body));

    // Converter strings vazias em null para campos opcionais (evita violação de @unique no cnpj)
    const emptyToNull = (v: string | undefined | null): string | null | undefined => {
      if (v === undefined) return undefined;
      if (typeof v === "string") return v.trim() || null;
      return null;
    };

    const updateData = {
      ...(body.name !== undefined && body.name.trim() !== "" && { name: body.name.trim() }),
      ...(body.cnpj !== undefined && { cnpj: emptyToNull(body.cnpj) }),
      ...(body.phone !== undefined && { phone: emptyToNull(body.phone) }),
      ...(body.email !== undefined && { email: emptyToNull(body.email) }),
      ...(body.address !== undefined && { address: emptyToNull(body.address) }),
      ...(body.city !== undefined && { city: emptyToNull(body.city) }),
      ...(body.state !== undefined && { state: emptyToNull(body.state) }),
      ...(body.zipCode !== undefined && { zipCode: emptyToNull(body.zipCode) }),
      ...(body.website !== undefined && { website: emptyToNull(body.website) }),
      ...(body.logoUrl !== undefined && { logoUrl: emptyToNull(body.logoUrl) }),
      ...(body.businessType !== undefined && { businessType: emptyToNull(body.businessType) }),
      ...(body.description !== undefined && { description: emptyToNull(body.description) }),
    };

    console.log("[ORG_PUT] Update data:", JSON.stringify(updateData));

    const org = await prisma.organization.update({
      where: { id: user.organizationId },
      data: updateData,
    });

    console.log("[ORG_PUT] Sucesso! Org atualizada:", org.id);
    return NextResponse.json(org);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[ORG_PUT] Erro:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
