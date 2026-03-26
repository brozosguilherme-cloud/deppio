import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRequestIp } from "@/lib/rate-limit";

const registerSchema = z.object({
  supabaseUserId: z.string().min(1).max(255),
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).trim(),
  companyName: z.string().min(1).max(100).trim(),
});

/**
 * POST /api/auth/register
 * Cria a Organization e o User (admin) após o cadastro no Supabase Auth.
 */
export async function POST(request: Request) {
  // Rate limiting: máx 10 cadastros por IP por 10 minutos
  const ip = getRequestIp(request);
  const { allowed } = rateLimit(`register:${ip}`, 10, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { supabaseUserId, email, name, companyName } = parsed.data;

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
