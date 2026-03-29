"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { DEMO_MOVEMENTS } from "@/lib/demo-data";

const TYPE_LABELS: Record<string, { label: string; color: "green" | "red" | "blue" | "yellow" | "gray" }> = {
  PURCHASE:   { label: "Compra",      color: "green"  },
  SALE:       { label: "Venda",       color: "red"    },
  RETURN:     { label: "Devolução",   color: "blue"   },
  LOSS:       { label: "Perda",       color: "red"    },
  ADJUSTMENT: { label: "Ajuste",      color: "yellow" },
  INVENTORY:  { label: "Inventário",  color: "gray"   },
  TRANSFER:   { label: "Transferência", color: "blue" },
};

const FILTERS = ["Todos", "Compra", "Venda", "Ajuste", "Perda"];

export default function DemoEstoquePage() {
  const [filter, setFilter] = useState("Todos");

  const movements = DEMO_MOVEMENTS.filter((m) => {
    if (filter === "Todos") return true;
    const type = TYPE_LABELS[m.type];
    return type?.label === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Estoque</h1>
        <p className="text-sm text-zinc-500">Histórico de movimentações</p>
      </div>

      {/* Filtros de tipo */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-surface-400 text-zinc-400 border border-surface-200 hover:bg-surface-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista de movimentações */}
      <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-500">
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Data</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Produto</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Tipo</th>
                <th className="text-right px-5 py-3 font-medium text-zinc-500 text-xs">Quantidade</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Responsável</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {movements.map((m) => {
                const typeInfo = TYPE_LABELS[m.type] ?? { label: m.type, color: "gray" as const };
                const isPositive = m.quantity > 0;
                return (
                  <tr key={m.id} className="hover:bg-surface-300 transition-colors">
                    <td className="px-5 py-3 text-zinc-500 text-xs whitespace-nowrap">
                      {formatDateTime(m.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-white font-medium">{m.product.name}</p>
                      <p className="text-xs text-zinc-500 font-mono">{m.product.sku}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge color={typeInfo.color}>{typeInfo.label}</Badge>
                    </td>
                    <td className={`px-5 py-3 text-right font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                      {isPositive ? "+" : ""}{m.quantity} {m.product.unit}
                    </td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{m.user.name}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{m.reason ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA de ação */}
      <div className="flex items-center gap-3 p-4 bg-surface-400 rounded-xl border border-dashed border-zinc-700">
        <ArrowLeftRight className="w-5 h-5 text-primary-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Registre entradas e saídas de estoque</p>
          <p className="text-xs text-zinc-500 mt-0.5">Crie sua conta para controlar movimentações reais com histórico auditado.</p>
        </div>
      </div>
    </div>
  );
}
