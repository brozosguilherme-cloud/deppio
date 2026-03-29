import { NextResponse } from "next/server";
import { stripe, PRICE_TO_PLAN } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

/**
 * POST /api/stripe/webhook
 * Recebe eventos do Stripe e atualiza o plano da organização.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Sem assinatura Stripe" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Pagamento confirmado — ativa o plano
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { organizationId, plan } = session.metadata ?? {};
        if (!organizationId || !plan) break;

        await prisma.organization.update({
          where: { id: organizationId },
          data: {
            plan,
            planStatus: "ACTIVE",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
        break;
      }

      // Assinatura atualizada (upgrade/downgrade ou status mudou)
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price.id;
        const newPlan = PRICE_TO_PLAN[priceId];
        if (!newPlan) break;

        const planStatus = sub.status === "active" ? "ACTIVE" : "PAST_DUE";
        await prisma.organization.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { plan: newPlan, planStatus },
        });
        break;
      }

      // Assinatura cancelada — volta para ESSENCIAL inativo
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.organization.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { plan: "ESSENCIAL", planStatus: "CANCELED" },
        });
        break;
      }

      // Pagamento falhou
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await prisma.organization.updateMany({
          where: { stripeCustomerId: customerId },
          data: { planStatus: "PAST_DUE" },
        });
        break;
      }
    }
  } catch (err) {
    console.error("[Stripe Webhook] Erro ao processar evento:", event.type, err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
