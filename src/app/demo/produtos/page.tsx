"use client";

import { useState } from "react";
import { Search, Package } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { DEMO_PRODUCTS } from "@/lib/demo-data";

export default function DemoProdutosPage() {
  const [search, setSearch] = useState("");

  const filtered = DEMO_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Produtos</h1>
          <p className="text-sm text-zinc-500">{DEMO_PRODUCTS.length} produtos no catálogo</p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por nome ou SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-surface-400 border border-surface-200 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Tabela */}
      <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-500">
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Produto</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Categoria</th>
                <th className="text-right px-5 py-3 font-medium text-zinc-500 text-xs">Custo</th>
                <th className="text-right px-5 py-3 font-medium text-zinc-500 text-xs">Venda</th>
                <th className="text-right px-5 py-3 font-medium text-zinc-500 text-xs">Estoque</th>
                <th className="text-center px-5 py-3 font-medium text-zinc-500 text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {filtered.map((p) => {
                const isLow = p.currentStock < p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-surface-300 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-300 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{p.name}</p>
                          <p className="text-xs text-zinc-500 font-mono">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge color="blue">{p.category.name}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right text-zinc-400">{formatCurrency(p.costPrice)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-white">{formatCurrency(p.salePrice)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={isLow ? "text-red-400 font-semibold" : "text-white"}>
                        {p.currentStock} {p.unit}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {isLow ? (
                        <Badge color="red">Crítico</Badge>
                      ) : (
                        <Badge color="green">OK</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
