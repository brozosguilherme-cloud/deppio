import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, isDemoMode } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (isDemoMode()) {
    return NextResponse.json({ success: true });
  }

  try {
    const body = await req.json();
    const { name, cnpj, phone, email, address, city, state, zipCode, website, businessType, description } = body;

    await prisma.organization.update({
      where: { id: user.organizationId },
      data: {
        name,
        cnpj: cnpj || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        website: website || null,
        businessType: businessType || null,
        description: description || null,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao completar onboarding" }, { status: 500 });
  }
}
