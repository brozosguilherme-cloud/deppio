"use client";

import { useRouter } from "next/navigation";
import { Lock, Zap } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { canAccess } from "@/lib/plans";
import type { PlanFeature } from "@/lib/plans";
import { Button } from "./Button";

interface PlanGateProps {
  feature: PlanFeature;
  children: React.ReactNode;
  /** Se true, renderiza o children com overlay. Se false, não renderiza nada. */
  overlay?: boolean;
}

export function PlanGate({ feature, children, overlay = true }: PlanGateProps) {
  const plan = usePlan();
  const router = useRouter();

  if (canAccess(plan, feature)) {
    return <>{children}</>;
  }

  if (!overlay) return null;

  return (
    <div className="relative">
      {/* Conteúdo desfocado */}
      <div className="pointer-events-none select-none opacity-40 blur-sm">
        {children}
      </div>

      {/* Overlay de upgrade */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-700/80 backdrop-blur-sm rounded-xl z-10 gap-4 p-6 text-center">
        <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Recurso exclusivo do plano Pro</p>
          <p className="text-zinc-500 text-xs mt-1">Faça upgrade para desbloquear esta funcionalidade</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/planos")}
          className="gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          Ver planos
        </Button>
      </div>
    </div>
  );
}

/** Badge inline para indicar que o item é Pro */
export function ProBadge() {
  return (
    <span className="ml-auto text-[10px] font-bold tracking-wider uppercase bg-primary-500/20 text-primary-400 border border-primary-500/30 px-1.5 py-0.5 rounded">
      Pro
    </span>
  );
}
