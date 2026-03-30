"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Credenciais inválidas. Verifique seu email e senha.");
    } else {
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    }

    setIsLoading(false);
  }

  const inputCls =
    "w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/50 transition-colors";

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Entrar</h1>
        <p className="text-zinc-400 text-sm">
          Acesse sua conta para gerenciar o estoque
        </p>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8">
        {/* Formulário email/senha */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputCls} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold rounded-xl px-4 py-3 text-sm transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            Entrar
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
