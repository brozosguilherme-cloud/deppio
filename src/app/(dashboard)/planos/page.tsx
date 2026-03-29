"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Zap, Crown, Loader2 } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { PLANS } from "@/lib/plans";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const COMPARISON = [
  { label: "Produtos, estoque e PDV",       essencial: true,  pro: true },
  { label: "Controle de vendas",             essencial: true,  pro: true },
  { label: "Fornecedores",                   essencial: true,  pro: true },
  { label: "Faturamento básico",             essencial: true,  pro: true },
  { label: "Relatórios essenciais",          essencial: true,  pro: true },
  { label: "Matérias-primas e BOM",          essencial: false, pro: true },
  { label: "Relatórios avançados",           essencial: false, pro: true },
  { label: "Suporte prioritário",            essencial: false, pro: true },
];

export default function PlanosPage() {
  const currentPlan = usePlan();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleSelect(plan: "ESSENCIAL" | "PRO") {
    if (plan === currentPlan) {
      toast.info("Você já está neste plano.");
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error("Erro ao iniciar checkout");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      toast.error("Não foi possível abrir o checkout. Tente novamente.");
      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white">Planos e Preços</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Escolha o plano ideal para o seu negócio. Cancele quando quiser.
        </p>
      </div>

      {/* Cards de planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(["ESSENCIAL", "PRO"] as const).map((planKey) => {
          const plan = PLANS[planKey];
          const isCurrent = currentPlan === planKey;
          const isPro = planKey === "PRO";

          return (
            <div
              key={planKey}
              className={`relative rounded-2xl border p-6 flex flex-col gap-5 ${
                isPro
                  ? "bg-primary-500/5 border-primary-500/40"
                  : "bg-surface-400 border-surface-200"
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-primary-500 text-zinc-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                    <Crown className="w-3 h-3" />
                    Recomendado
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isPro
                    ? <Zap className="w-4 h-4 text-primary-400" />
                    : <div className="w-4 h-4 rounded-full border-2 border-zinc-600" />
                  }
                  <span className={`text-sm font-bold ${isPro ? "text-primary-400" : "text-zinc-300"}`}>
                    {plan.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">
                      Atual
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-1 mt-3">
                  <span className="text-3xl font-black text-white">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-zinc-500 text-sm mb-1">/mês</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-2 flex-1">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check className={`w-4 h-4 shrink-0 ${isPro ? "text-primary-400" : "text-zinc-500"}`} />
                    {h}
                  </li>
                ))}
              </ul>

              <Button
                variant={isCurrent ? "outline" : isPro ? "primary" : "outline"}
                className="w-full"
                onClick={() => handleSelect(planKey)}
                disabled={isCurrent || loadingPlan !== null}
              >
                {loadingPlan === planKey ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Abrindo checkout...
                  </span>
                ) : isCurrent ? (
                  "Plano atual"
                ) : (
                  `Assinar ${plan.label}`
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Tabela de comparação */}
      <div className="bg-surface-400 rounded-2xl border border-surface-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200">
          <h2 className="text-sm font-semibold text-white">Comparação detalhada</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-500">
                <th className="text-left px-6 py-3 text-zinc-500 font-medium">Recurso</th>
                <th className="text-center px-6 py-3 text-zinc-400 font-semibold w-32">Essencial</th>
                <th className="text-center px-6 py-3 text-primary-400 font-semibold w-32">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {COMPARISON.map((row) => (
                <tr key={row.label} className="hover:bg-surface-300 transition-colors">
                  <td className="px-6 py-3 text-zinc-300">{row.label}</td>
                  <td className="px-6 py-3 text-center">
                    {row.essencial
                      ? <Check className="w-4 h-4 text-zinc-500 mx-auto" />
                      : <X className="w-4 h-4 text-zinc-700 mx-auto" />
                    }
                  </td>
                  <td className="px-6 py-3 text-center">
                    {row.pro
                      ? <Check className="w-4 h-4 text-primary-400 mx-auto" />
                      : <X className="w-4 h-4 text-zinc-700 mx-auto" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-surface-400 border border-surface-200 rounded-xl px-6 py-4 flex items-center gap-4">
        <Zap className="w-5 h-5 text-primary-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Assine e comece a usar agora mesmo</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cancele a qualquer momento. Sem multa ou fidelidade.
          </p>
        </div>
      </div>
    </div>
  );
}
