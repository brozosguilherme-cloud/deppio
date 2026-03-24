"use client";

import { useRouter } from "next/navigation";
import { Zap, ArrowRight } from "lucide-react";

interface DemoProBannerProps {
  feature: string;
}

export function DemoProBanner({ feature }: DemoProBannerProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-primary-500/10 border border-primary-500/25 rounded-xl mb-6">
      <div className="w-7 h-7 bg-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
        <Zap className="w-3.5 h-3.5 text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary-300">
          {feature} — exclusivo do plano Pro
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">
          Você está visualizando em modo demonstração. Na sua conta, este recurso requer o plano Pro.
        </p>
      </div>
      <button
        onClick={() => router.push("/planos")}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors shrink-0 whitespace-nowrap"
      >
        Ver planos
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
