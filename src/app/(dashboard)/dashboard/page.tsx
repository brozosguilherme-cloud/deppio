"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Layers,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Clock,
  FlaskConical,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { MovementsChart } from "@/components/dashboard/MovementsChart";
import { PageLoader } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime, paymentMethodLabel } from "@/lib/utils";
import type { DashboardKPIs } from "@/types";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs & { lowRawMaterials?: { id: string; name: string; unit: string; currentStock: number; minStock: number }[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/kpis")
      .then((r) => r.json())
      .then(setKpis)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageLoader />;
  if (!kpis) return null;

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Visão geral do seu negócio</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Produtos ativos"
          value={kpis.totalProducts ?? 0}
          icon={Package}
          color="blue"
          subtitle="Cadastrados e ativos"
        />
        <KPICard
          title="Total em estoque"
          value={(kpis.totalStock ?? 0).toLocaleString("pt-BR")}
          icon={Layers}
          color="purple"
          subtitle="Unidades disponíveis"
        />
        <KPICard
          title="Vendas hoje"
          value={kpis.salesToday ?? 0}
          icon={ShoppingCart}
          color="green"
          subtitle="Transações finalizadas"
        />
        <KPICard
          title="Receita do mês"
          value={formatCurrency(kpis.revenueMonth ?? 0)}
          icon={DollarSign}
          color="yellow"
          subtitle="Mês atual"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gráfico de movimentações */}
        <div className="xl:col-span-3 bg-surface-400 rounded-xl border border-surface-200 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">
            Movimentações — últimos 30 dias
          </h2>
          {(kpis.movementsChart ?? []).length > 0 ? (
            <MovementsChart data={kpis.movementsChart} />
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-zinc-600">
              Nenhuma movimentação registrada ainda.
            </div>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Alertas de matéria-prima */}
        <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Matérias-primas críticas</h2>
            {(kpis.lowRawMaterials?.length ?? 0) > 0 && (
              <Badge color="red">{kpis.lowRawMaterials!.length}</Badge>
            )}
          </div>
          {!kpis.lowRawMaterials || kpis.lowRawMaterials.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-zinc-600">
              Todas as matérias-primas estão com estoque adequado.
            </div>
          ) : (
            <ul className="divide-y divide-surface-200">
              {kpis.lowRawMaterials.map(rm => (
                <li key={rm.id} className="px-5 py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{rm.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Atual: {rm.currentStock} {rm.unit} / Mínimo: {rm.minStock} {rm.unit}
                    </p>
                  </div>
                  {rm.currentStock <= 0
                    ? <Badge color="red">Zerado</Badge>
                    : <Badge color="yellow">Crítico</Badge>
                  }
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Alertas de estoque de produtos */}
        <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">
              Alertas de estoque
            </h2>
            {(kpis.lowStockProducts ?? []).length > 0 && (
              <Badge color="yellow">{kpis.lowStockProducts.length}</Badge>
            )}
          </div>

          {(kpis.lowStockProducts ?? []).length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-zinc-600">
              Todos os produtos estão com estoque adequado.
            </div>
          ) : (
            <ul className="divide-y divide-surface-200">
              {kpis.lowStockProducts.map((alert) => (
                <li key={alert.productId} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {alert.productName}
                      </p>
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
      </div>

      {/* Últimas vendas */}
      <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-200">
          <h2 className="text-sm font-semibold text-white">Últimas vendas</h2>
        </div>

        {(kpis.recentSales ?? []).length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-600">
            Nenhuma venda registrada ainda.
          </div>
        ) : (
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
                      <Badge color="blue">
                        {paymentMethodLabel(sale.paymentMethod)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-white">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">
                      {sale.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
