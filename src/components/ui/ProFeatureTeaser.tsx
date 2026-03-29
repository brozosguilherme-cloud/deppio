"use client";

import Link from "next/link";
import { Crown, Lock, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ProFeatureTeaserProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

export function ProFeatureTeaser({ title, description, icon: Icon, features }: ProFeatureTeaserProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{description}</p>
      </div>

      <div className="bg-surface-400 border border-surface-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center gap-5">
          {/* Ícone */}
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary-400" />
          </div>

          {/* Título */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary-400">Recurso Pro</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">
              {title}
            </h2>
            <p className="text-sm text-zinc-400 max-w-md">
              Este recurso está disponível no plano Pro. Faça o upgrade para desbloquear.
            </p>
          </div>

          {/* Lista de benefícios */}
          <div className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 text-left">
              O que você ganha
            </p>
            <ul className="space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-zinc-300 text-left">
                  <div className="w-5 h-5 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                    <Crown className="w-3 h-3 text-primary-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Link
            href="/planos"
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01]"
          >
            <Crown className="w-4 h-4" />
            Ver planos e fazer upgrade
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
