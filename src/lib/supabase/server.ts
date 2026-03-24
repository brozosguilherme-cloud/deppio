import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cria um cliente Supabase para uso no servidor (Server Components, API Routes).
 * Lê e grava cookies para manter a sessão do usuário.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorar em Server Components — o middleware lida com a sessão
          }
        },
      },
    }
  );
}
