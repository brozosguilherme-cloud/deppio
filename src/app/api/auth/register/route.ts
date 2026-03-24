import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/register
 * Cria a Organization e o User (admin) após o cadastro no Supabase Auth.
 */
export async function POST(request: Request) {
  try {
    const { supabaseUserId, email, name, companyName } = await request.json();

    if (!supabaseUserId || !email || !name || !companyName) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Verifica se usuário já existe (evita duplicata)
    const existing = await prisma.user.findUnique({ where: { supabaseUserId } });
    if (existing) {
      return NextResponse.json({ message: "Usuário já configurado" }, { status: 200 });
    }

    // Cria organização + usuário admin em transação
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: companyName },
      });

      // Cria local de armazenamento padrão
      await tx.stockLocation.create({
        data: {
          organizationId: org.id,
          name: "Principal",
          isDefault: true,
        },
      });

      const user = await tx.user.create({
        data: {
          supabaseUserId,
          organizationId: org.id,
          name,
          email,
          role: "ADMIN",
        },
      });

      return { org, user };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[API] /auth/register error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
