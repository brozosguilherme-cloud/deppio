import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim(), {
  httpClient: Stripe.createFetchHttpClient(),
});

export const STRIPE_PRICES: Record<string, string> = {
  ESSENCIAL: process.env.STRIPE_PRICE_ESSENCIAL!,
  PRO: process.env.STRIPE_PRICE_PRO!,
};

export const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_PRICE_ESSENCIAL!]: "ESSENCIAL",
  [process.env.STRIPE_PRICE_PRO!]: "PRO",
};
