"use client";

import { FlaskConical, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DEMO_RAW_MATERIALS } from "@/lib/demo-data";

export default function DemoMateriasPrimasPage() {
  const lowStock = DEMO_RAW_MATERIALS.filter((r) => r.currentStock < r.minStock);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Matérias-Primas</h1>
          <p className="text-sm text-zinc-500">{DEMO_RAW_MATERIALS.length} matérias-primas cadastradas</p>
        </div>
        {lowStock.length > 0 && (
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {lowStock.length} com estoque crítico
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {DEMO_RAW_MATERIALS.map((rm) => {
          const isLow = rm.currentStock < rm.minStock;
          const pct = Math.min(100, (rm.currentStock / rm.minStock) * 100);
          return (
            <div key={rm.id} className="bg-surface-400 rounded-xl border border-surface-200 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isLow ? "bg-red-500/10" : "bg-purple-500/10"}`}>
                    <FlaskConical className={`w-4 h-4 ${isLow ? "text-red-400" : "text-purple-400"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{rm.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{rm.description}</p>
                  </div>
                </div>
                <Badge color={isLow ? "red" : "green"}>{isLow ? "Crítico" : "OK"}</Badge>
              </div>

              {/* Barra de estoque */}
              <div>
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Estoque: {rm.currentStock} {rm.unit}</span>
                  <span>Mínimo: {rm.minStock} {rm.unit}</span>
                </div>
                <div className="h-1.5 bg-surface-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isLow ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Fornecedor: {rm.supplier.name.split(" ").slice(0, 2).join(" ")}</span>
                <span className="text-zinc-400 font-medium">
                  R$ {rm.costPerUnit.toFixed(2)}/{rm.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 p-4 bg-surface-400 rounded-xl border border-dashed border-zinc-700">
        <FlaskConical className="w-5 h-5 text-purple-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Controle matérias-primas com ficha técnica (BOM)</p>
          <p className="text-xs text-zinc-500 mt-0.5">Crie sua conta para vincular matérias-primas a produtos e ter baixa automática na produção.</p>
        </div>
      </div>
    </div>
  );
}
