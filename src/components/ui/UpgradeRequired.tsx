"use client";

import { useRouter } from "next/navigation";
import { Lock, Zap, ArrowRight } from "lucide-react";
import { Button } from "./Button";

interface UpgradeRequiredProps {
  feature: string;
}

export function UpgradeRequired({ feature }: UpgradeRequiredProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm space-y-5">
        <div className="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{feature}</h2>
          <p className="text-sm text-zinc-500 mt-1.5">
            Este recurso está disponível apenas no plano <strong className="text-primary-400">Pro</strong>.
            Faça upgrade para desbloquear.
          </p>
        </div>
        <div className="bg-surface-400 border border-surface-200 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Incluído no Pro</p>
          {["Matérias-primas e BOM", "Assistente IA integrado", "Relatórios avançados", "Usuários ilimitados"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-zinc-300">
              <Zap className="w-3.5 h-3.5 text-primary-400 shrink-0" />
              {f}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button className="flex-1 gap-1.5" onClick={() => router.push("/planos")}>
            Ver planos
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
