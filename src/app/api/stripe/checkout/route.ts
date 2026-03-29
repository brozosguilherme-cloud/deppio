import { NextResponse } from "next/server";
import { STRIPE_PRICES } from "@/lib/stripe";
import { getAuthUser, unauthorized } from "@/lib/auth";

/**
 * POST /api/stripe/checkout
 * Cria uma sessão de checkout no Stripe para o plano selecionado.
 * Usa fetch direto à API do Stripe (sem SDK) para evitar problemas de conexão no Vercel.
 */
export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { plan } = await request.json();
  const priceId = STRIPE_PRICES[plan as string];
  if (!priceId) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://deppio.com.br";
  const secretKey = (process.env.STRIPE_SECRET_KEY || "").trim();

  if (!secretKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY não configurada" }, { status: 500 });
  }

  try {
    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("payment_method_types[0]", "card");
    params.append("customer_email", user.email);
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${appUrl}/dashboard?checkout=success&plan=${plan}`);
    params.append("cancel_url", `${appUrl}/planos`);
    params.append("metadata[organizationId]", user.organizationId);
    params.append("metadata[plan]", plan);
    params.append("subscription_data[metadata][organizationId]", user.organizationId);
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
      console.error("[CHECKOUT] Stripe error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Erro ao criar checkout" },
        { status: res.status }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[CHECKOUT] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
