import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** Modo demo: ativo quando as credenciais do Supabase não estão configuradas */
export function isDemoMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return !url || url.includes("your-project") || url.includes("placeholder");
}

/** Usuário/organização fictícios para o modo demo */
const DEMO_USER = {
  id: "demo-user",
  organizationId: "demo-org",
  supabaseUserId: "demo",
  name: "Demo",
  email: "demo@example.com",
  role: "ADMIN" as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  organization: {
    id: "demo-org",
    name: "Demo Empresa",
    slug: "demo",
    plan: "ESSENCIAL",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Retorna o usuário autenticado (Supabase + Prisma) ou null se não autenticado.
 * Em modo demo, retorna um usuário fictício.
 */
export async function getAuthUser() {
  if (isDemoMode()) return DEMO_USER;

  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: supabaseUser.id },
    include: { organization: true },
  });

  return dbUser;
}

/** Resposta padrão de não autorizado */
export function unauthorized() {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}

/** Resposta padrão de forbidden (sem permissão) */
export function forbidden() {
  return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
}

/** Resposta de recurso bloqueado pelo plano */
export function planForbidden(feature: string) {
  return NextResponse.json(
    { error: `"${feature}" requer o plano Pro.`, upgrade: true },
    { status: 403 }
  );
}
