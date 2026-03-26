import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, isDemoMode, planForbidden } from "@/lib/auth";
import { canAccess } from "@/lib/plans";
import { rateLimit, getRequestIp } from "@/lib/rate-limit";
import { generateResponse } from "@/lib/chat-engine";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  // Enforce de plano (em modo demo, libera)
  const plan = (user.organization?.plan ?? "ESSENCIAL") as "ESSENCIAL" | "PRO";
  if (!isDemoMode() && !canAccess(plan, "aiChat")) {
    return planForbidden("Assistente IA");
  }

  // Rate limiting: máx 30 mensagens por IP por minuto
  const ip = getRequestIp(request);
  const { allowed } = rateLimit(`chat:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { message: "Muitas mensagens. Aguarde um momento.", followUps: [] },
      { status: 429 }
    );
  }

  try {
    const { message } = await request.json();
    if (!message?.trim()) {
      return NextResponse.json({ message: "Mensagem vazia.", followUps: [] });
    }

    const response = await generateResponse(
      message.trim(),
      user.organizationId,
      user.id
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] POST /chat error:", error);
    return NextResponse.json({
      message: "Ocorreu um erro ao processar sua mensagem. Tente novamente.",
      followUps: [],
    });
  }
}
