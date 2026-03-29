"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { DEMO_RELATORIO } from "@/lib/demo-data";

const data = DEMO_RELATORIO;

function marginColor(m: number): "red" | "yellow" | "green" {
  if (m < 0) return "red";
  if (m < 10) return "yellow";
  return "green";
}

export default function DemoRelatoriosPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "low-margin">("products");

  const tabs = [
    { id: "products" as const, label: "Por produto", count: data.products.length },
    { id: "categories" as const, label: "Por categoria", count: data.categories.length },
    { id: "low-margin" as const, label: "Margem baixa", count: data.lowMarginProducts.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Relatórios</h1>
          <p className="text-sm text-zinc-500">Análise de lucratividade por produto e categoria</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Sumário */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Receita total</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(data.summary.totalRevenue)}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Custo total</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(data.summary.totalCost)}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Margem média</p>
          <p className="text-xl font-bold mt-1 text-green-500">{data.summary.avgMargin.toFixed(1)}%</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-primary-600 text-primary-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
            <span className="text-xs bg-zinc-800 rounded-full px-2 py-0.5">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Por produto */}
      {activeTab === "products" && (
        <div className="bg-surface-400 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-surface-500">
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Produto</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Categoria</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Custo</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Venda</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Qtd vendida</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Receita</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Lucro</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.products.map((p) => (
                  <tr key={p.productId} className="hover:bg-surface-500">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{p.productName}</p>
                      <p className="text-xs text-zinc-600 font-mono">{p.sku}</p>
                    </td>
                    <td className="px-4 py-3"><Badge color="blue">{p.category}</Badge></td>
                    <td className="px-4 py-3 text-right text-zinc-400">{formatCurrency(p.costPrice)}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(p.salePrice)}</td>
                    <td className="px-4 py-3 text-right text-zinc-400">{p.totalQuantitySold}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(p.totalRevenue)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={p.grossProfit < 0 ? "text-red-500" : "text-green-500"}>
                        {formatCurrency(p.grossProfit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge color={marginColor(p.margin)}>{p.margin.toFixed(1)}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Por categoria */}
      {activeTab === "categories" && (
        <div className="bg-surface-400 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-surface-500">
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Categoria</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Receita</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Custo</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Lucro</th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-400">Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.categories.map((c) => (
                  <tr key={c.name} className="hover:bg-surface-500">
                    <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(c.totalRevenue)}</td>
                    <td className="px-4 py-3 text-right text-zinc-400">{formatCurrency(c.totalCost)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={c.grossProfit < 0 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                        {formatCurrency(c.grossProfit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge color={marginColor(c.margin)}>{c.margin.toFixed(1)}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Margem baixa */}
      {activeTab === "low-margin" && (
        <Card>
          <CardContent className="text-center py-12 text-sm text-zinc-600">
            Todos os produtos têm margem acima de 10%.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
