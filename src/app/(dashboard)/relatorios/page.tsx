"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, TrendingDown, Download } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

interface ProductProfit {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  costPrice: number;
  salePrice: number;
  currentStock: number;
  totalQuantitySold: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  margin: number;
}

interface CategoryProfit {
  name: string;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  margin: number;
  totalQuantity: number;
}

interface ReportData {
  products: ProductProfit[];
  categories: CategoryProfit[];
  lowMarginProducts: ProductProfit[];
  summary: { totalRevenue: number; totalCost: number; avgMargin: number };
}

export default function RelatoriosPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "low-margin">("products");

  useEffect(() => {
    fetch("/api/relatorios/lucratividade")
      .then((r) => r.json())
      .then(setData)
      .catch(() => toast.error("Erro ao carregar relatório"))
      .finally(() => setIsLoading(false));
  }, []);

  function exportCSV() {
    if (!data) return;

    const rows = [
      ["Produto", "SKU", "Categoria", "Custo", "Venda", "Qtd Vendida", "Receita", "Lucro Bruto", "Margem %"],
      ...data.products.map((p) => [
        p.productName,
        p.sku,
        p.category,
        p.costPrice.toFixed(2),
        p.salePrice.toFixed(2),
        p.totalQuantitySold,
        p.totalRevenue.toFixed(2),
        p.grossProfit.toFixed(2),
        p.margin.toFixed(1),
      ]),
    ];

    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lucratividade_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Relatório exportado!");
  }

  function marginColor(margin: number): "red" | "yellow" | "green" {
    if (margin < 0) return "red";
    if (margin < 10) return "yellow";
    return "green";
  }

  if (isLoading) return <PageLoader />;
  if (!data) return null;

  const tabs = [
    { id: "products", label: "Por produto", count: data.products.length },
    { id: "categories", label: "Por categoria", count: data.categories.length },
    { id: "low-margin", label: "Margem baixa", count: data.lowMarginProducts.length },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Relatórios</h1>
          <p className="text-sm text-zinc-500">Análise de lucratividade por produto e categoria</p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Sumário */}
      <div className="grid grid-cols-3 gap-4">
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
          <p
            className={`text-xl font-bold mt-1 ${
              data.summary.avgMargin < 10 ? "text-red-600" : "text-green-600"
            }`}
          >
            {data.summary.avgMargin.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Alerta de produtos com margem negativa */}
      {data.lowMarginProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">
              {data.lowMarginProducts.length} produto(s) com margem abaixo de 10%
            </p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Revise os preços de custo e venda destes produtos.
            </p>
          </div>
        </div>
      )}

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

      {/* Tabela de produtos */}
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
                    <td className="px-4 py-3">
                      <Badge color="blue">{p.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-400">{formatCurrency(p.costPrice)}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(p.salePrice)}</td>
                    <td className="px-4 py-3 text-right text-zinc-400">{p.totalQuantitySold}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(p.totalRevenue)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={p.grossProfit < 0 ? "text-red-600" : "text-green-600"}>
                        {formatCurrency(p.grossProfit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge color={marginColor(p.margin)}>
                        {p.margin.toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabela de categorias */}
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
                      <span className={c.grossProfit < 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
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

      {/* Produtos com margem baixa */}
      {activeTab === "low-margin" && (
        <div className="space-y-3">
          {data.lowMarginProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-sm text-zinc-600">
                Todos os produtos têm margem acima de 10%.
              </CardContent>
            </Card>
          ) : (
            data.lowMarginProducts.map((p) => (
              <div key={p.productId} className="bg-surface-400 rounded-xl border border-zinc-800 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <p className="font-semibold text-white">{p.productName}</p>
                      <Badge color="gray">{p.category}</Badge>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1 font-mono">{p.sku}</p>
                  </div>
                  <Badge color={marginColor(p.margin)}>{p.margin.toFixed(1)}%</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Custo</p>
                    <p className="font-medium">{formatCurrency(p.costPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Venda</p>
                    <p className="font-medium">{formatCurrency(p.salePrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Receita total</p>
                    <p className="font-medium">{formatCurrency(p.totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Lucro bruto</p>
                    <p className={`font-medium ${p.grossProfit < 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatCurrency(p.grossProfit)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
