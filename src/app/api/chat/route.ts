import { NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { generateResponse } from "@/lib/chat-engine";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

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
