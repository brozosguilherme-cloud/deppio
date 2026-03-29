"use client";

import { DollarSign, TrendingUp, ShoppingCart, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { KPICard } from "@/components/dashboard/KPICard";
import { formatCurrency, paymentMethodLabel } from "@/lib/utils";
import { DEMO_FATURAMENTO } from "@/lib/demo-data";

const PIE_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];
const d = DEMO_FATURAMENTO;

export default function DemoFaturamentoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Faturamento</h1>
        <p className="text-sm text-zinc-500">Análise financeira do período</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Receita total" value={formatCurrency(d.totalRevenue)} icon={DollarSign} color="green" />
        <KPICard title="Margem bruta" value={`${d.grossMarginPct.toFixed(1)}%`} icon={TrendingUp} color="blue" subtitle={formatCurrency(d.grossMargin)} />
        <KPICard title="Total de vendas" value={d.totalSales} icon={ShoppingCart} color="purple" />
        <KPICard title="Ticket médio" value={formatCurrency(d.avgTicket)} icon={BarChart3} color="yellow" />
      </div>

      {/* Gráfico receita vs custo */}
      <div className="bg-surface-400 rounded-xl border border-zinc-800 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Receita vs Custo por dia</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={d.revenueByDay.filter((r) => r.receita > 0 || r.custo > 0)} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
            <Tooltip
              contentStyle={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} formatter={(v) => v === "receita" ? "Receita" : "Custo"} />
            <Bar dataKey="receita" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="custo" fill="#3F3F46" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top produtos */}
        <div className="bg-surface-400 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800/50">
            <h2 className="text-sm font-semibold text-white">Top produtos por receita</h2>
          </div>
          <ul className="divide-y divide-zinc-800">
            {d.topProducts.map((p, i) => (
              <li key={p.productId} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-zinc-500 shrink-0">{i + 1}</span>
                  <span className="text-sm text-white truncate">{p.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-white">{formatCurrency(p.totalRevenue)}</p>
                  <p className="text-xs text-zinc-600">{p.totalQuantity} un</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Por forma de pagamento */}
        <div className="bg-surface-400 rounded-xl border border-zinc-800 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Por forma de pagamento</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <PieChart width={160} height={160}>
              <Pie data={d.byPayment} cx={75} cy={75} innerRadius={40} outerRadius={75} dataKey="total" nameKey="method">
                {d.byPayment.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <ul className="space-y-2 flex-1">
              {d.byPayment.map((p, i) => (
                <li key={p.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-zinc-400">{paymentMethodLabel(p.method)}</span>
                  </div>
                  <span className="text-xs font-medium text-white">{formatCurrency(p.total)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
