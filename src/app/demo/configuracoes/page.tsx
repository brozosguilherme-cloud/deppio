"use client";

import Link from "next/link";
import { Settings } from "lucide-react";

export default function DemoConfiguracoesPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-zinc-500">Gerencie os dados da sua empresa</p>
      </div>

      <div className="bg-surface-400 rounded-xl border border-surface-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white border-b border-surface-200 pb-3">Dados da empresa</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Nome da empresa", value: "Demo Empresa" },
            { label: "Tipo de negócio", value: "Varejo de moda" },
            { label: "CNPJ", value: "00.000.000/0001-00" },
            { label: "E-mail comercial", value: "contato@demo.com.br" },
            { label: "Telefone", value: "(11) 99000-0000" },
            { label: "Cidade / Estado", value: "São Paulo / SP" },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs text-zinc-500 font-medium">{field.label}</label>
              <input
                type="text"
                defaultValue={field.value}
                disabled
                className="mt-1 w-full px-3 py-2 bg-surface-300 border border-surface-200 rounded-lg text-sm text-zinc-400 cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-surface-400 rounded-xl border border-dashed border-zinc-700">
        <Settings className="w-5 h-5 text-primary-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Configure sua empresa com dados reais</p>
          <p className="text-xs text-zinc-500 mt-0.5">Crie sua conta para personalizar nome, logo, endereço e gerenciar usuários da sua equipe.</p>
        </div>
        <Link
          href="/cadastro"
          className="shrink-0 bg-primary-500 hover:bg-primary-400 text-zinc-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
        >
          Criar conta
        </Link>
      </div>
    </div>
  );
}
