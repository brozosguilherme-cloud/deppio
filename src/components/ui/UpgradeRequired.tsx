"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Zap, ArrowRight, Crown, FlaskConical, BarChart3 } from "lucide-react";
import { Button } from "./Button";
import { useIsDemo } from "@/contexts/PlanContext";
import { DemoProBanner } from "./DemoProBanner";

// Dados específicos de cada feature Pro
const FEATURE_DATA: Record<string, {
  title: string;
  description: string;
  icon: React.ElementType;
  benefits: string[];
  preview: string;
}> = {
  "Matérias-primas e BOM": {
    title: "Matérias-primas e BOM",
    description: "Gerencie insumos, fichas técnicas e consumo automático por produção.",
    icon: FlaskConical,
    benefits: [
      "Cadastro completo de matérias-primas com controle de estoque",
      "Ficha técnica (BOM) vinculada aos produtos",
      "Consumo automático ao produzir",
      "Alertas de estoque mínimo de insumos",
    ],
    preview: "Ideal para quem fabrica ou manipula produtos e precisa controlar os insumos utilizados.",
  },
  "Relatórios avançados": {
    title: "Relatórios avançados",
    description: "Análises detalhadas de lucratividade, margem por produto e tendências.",
    icon: BarChart3,
    benefits: [
      "Relatório de lucratividade por produto e categoria",
      "Análise de margem de contribuição",
      "Identificação de produtos com margem baixa",
      "Exportação de dados para análise externa",
    ],
    preview: "Tome decisões estratégicas com dados reais sobre a performance dos seus produtos.",
  },
};

// Fallback genérico
const DEFAULT_FEATURE = {
  title: "Recurso Pro",
  description: "Este recurso está disponível no plano Pro.",
  icon: Lock,
  benefits: [
    "Matérias-primas e BOM",
    "Relatórios avançados",
    "Suporte prioritário",
  ],
  preview: "Faça upgrade para desbloquear todos os recursos avançados.",
};

interface UpgradeRequiredProps {
  feature: string;
  children?: React.ReactNode;
}

/**
 * Em modo demo: mostra o conteúdo com banner informativo.
 * Em produção com plano insuficiente: teaser visual com CTA de upgrade.
 */
export function UpgradeRequired({ feature, children }: UpgradeRequiredProps) {
  const router = useRouter();
  const isDemo = useIsDemo();

  if (isDemo && children) {
    return (
      <div>
        <DemoProBanner feature={feature} />
        {children}
      </div>
    );
  }

  const data = FEATURE_DATA[feature] || { ...DEFAULT_FEATURE, title: feature };
  const Icon = data.icon;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white">{data.title}</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{data.description}</p>
      </div>

      <div className="bg-surface-400 border border-surface-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Ícone e badge */}
          <div className="flex flex-col items-center sm:items-start gap-3 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary-400" />
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2.5 py-1 rounded-full">
              <Crown className="w-3 h-3" />
              Plano Pro
            </span>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed">
              {data.preview}
            </p>

            {/* Benefícios */}
            <div className="space-y-2.5">
              {data.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <Zap className="w-3.5 h-3.5 text-primary-400 shrink-0 mt-0.5" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-surface-200">
          <Button variant="outline" className="sm:flex-1" onClick={() => router.back()}>
            Voltar
          </Button>
          <Link
            href="/planos"
            className="sm:flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold py-2.5 px-4 rounded-xl transition-all hover:scale-[1.01] text-sm"
          >
            <Crown className="w-4 h-4" />
            Fazer upgrade para Pro
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Info adicional */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 flex items-start gap-3">
        <Zap className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-600 leading-relaxed">
          O plano Pro também inclui <strong className="text-zinc-500">suporte prioritário</strong>. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
}
