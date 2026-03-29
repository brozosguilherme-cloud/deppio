"use client";

import { Package, Layers, ShoppingCart, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { MovementsChart } from "@/components/dashboard/MovementsChart";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime, paymentMethodLabel } from "@/lib/utils";
import { DEMO_KPIS } from "@/lib/demo-data";

const kpis = DEMO_KPIS;

export default function DemoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Visão geral do seu negócio</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Produtos ativos"
          value={kpis.totalProducts}
          icon={Package}
          color="blue"
          subtitle="Cadastrados e ativos"
        />
        <KPICard
          title="Total em estoque"
          value={kpis.totalStock.toLocaleString("pt-BR")}
          icon={Layers}
          color="purple"
          subtitle="Unidades disponíveis"
        />
        <KPICard
          title="Vendas hoje"
          value={kpis.salesToday}
          icon={ShoppingCart}
          color="green"
          subtitle="Transações finalizadas"
        />
        <KPICard
          title="Receita do mês"
          value={formatCurrency(kpis.revenueMonth)}
          icon={DollarSign}
          color="yellow"
          subtitle="Mês atual"
        />
      </div>

      {/* Gráfico */}
      <div className="bg-surface-400 rounded-xl border border-surface-200 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">
          Movimentações — últimos 30 dias
        </h2>
        <MovementsChart data={kpis.movementsChart} />
      </div>

      {/* Alertas de estoque */}
      <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Alertas de estoque</h2>
          {kpis.lowStockProducts.length > 0 && (
            <Badge color="yellow">{kpis.lowStockProducts.length}</Badge>
          )}
        </div>
        {kpis.lowStockProducts.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-600">
            Todos os produtos estão com estoque adequado.
          </div>
        ) : (
          <ul className="divide-y divide-surface-200">
            {kpis.lowStockProducts.map((alert) => (
              <li key={alert.productId} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{alert.productName}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Estoque: {alert.currentStock} / Mínimo: {alert.minStock}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {alert.currentStock <= 0 ? (
                      <Badge color="red">Zerado</Badge>
                    ) : (
                      <Badge color="yellow">{alert.currentStock}</Badge>
                    )}
                    {alert.daysRemaining !== null && (
                      <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{alert.daysRemaining}d
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Últimas vendas */}
      <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-200">
          <h2 className="text-sm font-semibold text-white">Últimas vendas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-500">
                <th className="text-left px-5 py-2.5 font-medium text-zinc-500 text-xs">Data/Hora</th>
                <th className="text-left px-5 py-2.5 font-medium text-zinc-500 text-xs">Itens</th>
                <th className="text-left px-5 py-2.5 font-medium text-zinc-500 text-xs">Pagamento</th>
                <th className="text-right px-5 py-2.5 font-medium text-zinc-500 text-xs">Total</th>
                <th className="text-left px-5 py-2.5 font-medium text-zinc-500 text-xs">Vendedor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {kpis.recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-surface-300 transition-colors">
                  <td className="px-5 py-3 text-zinc-500 text-xs whitespace-nowrap">
                    {formatDateTime(sale.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-zinc-400 text-xs max-w-48 truncate">
                    {sale.items.map((i) => i.product.name).join(", ")}
                  </td>
                  <td className="px-5 py-3">
                    <Badge color="blue">{paymentMethodLabel(sale.paymentMethod)}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-white">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-5 py-3 text-zinc-500 text-xs">{sale.user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
