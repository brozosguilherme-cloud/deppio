import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRequestIp } from "@/lib/rate-limit";
import { STRIPE_PRICES } from "@/lib/stripe";

const registerSchema = z.object({
  supabaseUserId: z.string().min(1).max(255),
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).trim(),
  companyName: z.string().min(1).max(100).trim(),
  plan: z.enum(["ESSENCIAL", "PRO"]).optional(),
});

async function createCheckoutSession(email: string, organizationId: string, plan: string) {
  const priceId = STRIPE_PRICES[plan];
  if (!priceId) throw new Error(`Price ID não encontrado para plano: ${plan}. STRIPE_PRICES=${JSON.stringify(STRIPE_PRICES)}`);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://deppio.com.br";
  const secretKey = (process.env.STRIPE_SECRET_KEY || "").trim();

  if (!secretKey) throw new Error("STRIPE_SECRET_KEY não configurada");

  // Chamada direta à API do Stripe via fetch (sem SDK)
  const params = new URLSearchParams();
  params.append("mode", "subscription");
  params.append("payment_method_types[0]", "card");
  params.append("customer_email", email);
  params.append("line_items[0][price]", priceId);
  params.append("line_items[0][quantity]", "1");
  params.append("success_url", `${appUrl}/dashboard?checkout=success`);
  params.append("cancel_url", `${appUrl}/planos`);
  params.append("metadata[organizationId]", organizationId);
  params.append("metadata[plan]", plan);
  params.append("subscription_data[metadata][organizationId]", organizationId);
  params.append("subscription_data[metadata][plan]", plan);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Stripe API ${res.status}: ${data.error?.message || JSON.stringify(data)}`);
  }

  return data.url;
}

/**
 * POST /api/auth/register
 * Cria a Organization e o User (admin) após o cadastro no Supabase Auth.
 */
export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const { allowed } = rateLimit(`register:${ip}`, 10, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos." },
      { status: 429 }
    );
  }

  // 1. Parse body
  let parsed;
  try {
    const body = await request.json();
    parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `[PARSE] ${msg}` }, { status: 400 });
  }

  const { supabaseUserId, email, name, companyName, plan } = parsed.data;

  // 2. Check existing user
  let existing;
  try {
    existing = await prisma.user.findUnique({
      where: { supabaseUserId },
      include: { organization: true },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `[DB_CHECK] ${msg}` }, { status: 500 });
  }

  if (existing) {
    if (plan) {
      try {
        const checkoutUrl = await createCheckoutSession(email, existing.organizationId, plan);
        return NextResponse.json({ message: "Usuário já configurado", checkoutUrl }, { status: 200 });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: `[STRIPE_EXISTING] ${msg}` }, { status: 500 });
      }
    }
    return NextResponse.json({ message: "Usuário já configurado" }, { status: 200 });
  }

  // 3. Create org + user
  let result;
  try {
    result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: companyName, onboardingCompleted: true },
      });
      await tx.stockLocation.create({
        data: { organizationId: org.id, name: "Principal", isDefault: true },
      });
      const user = await tx.user.create({
        data: { supabaseUserId, organizationId: org.id, name, email, role: "ADMIN" },
      });
      return { org, user };
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `[DB_CREATE] ${msg}` }, { status: 500 });
  }

  // 4. Create Stripe checkout
  if (plan) {
    try {
      const checkoutUrl = await createCheckoutSession(email, result.org.id, plan);
      return NextResponse.json({ ...result, checkoutUrl }, { status: 201 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: `[STRIPE_NEW] ${msg}` }, { status: 500 });
    }
  }

  return NextResponse.json(result, { status: 201 });
}
