"use client";

import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime, paymentMethodLabel } from "@/lib/utils";
import { DEMO_RECENT_SALES } from "@/lib/demo-data";

export default function DemoVendasPage() {
  const totalRevenue = DEMO_RECENT_SALES.reduce((s, v) => s + v.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Vendas</h1>
          <p className="text-sm text-zinc-500">Histórico de transações</p>
        </div>
        <div className="bg-surface-400 border border-surface-200 rounded-xl px-4 py-3 text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Receita no período</p>
          <p className="text-lg font-bold text-white">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-500">
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Data/Hora</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Itens</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Cliente</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 text-xs">Pagamento</th>
                <th className="text-right px-5 py-3 font-medium text-zinc-500 text-xs">Total</th>
                <th className="text-center px-5 py-3 font-medium text-zinc-500 text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {DEMO_RECENT_SALES.map((sale) => (
                <tr key={sale.id} className="hover:bg-surface-300 transition-colors">
                  <td className="px-5 py-3 text-zinc-500 text-xs whitespace-nowrap">
                    {formatDateTime(sale.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-zinc-400 text-xs max-w-52 truncate">
                    {sale.items.map((i) => i.product.name).join(", ")}
                  </td>
                  <td className="px-5 py-3 text-zinc-400 text-xs">
                    {sale.customer?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <Badge color="blue">{paymentMethodLabel(sale.paymentMethod)}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-white">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Badge color="green">Concluída</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-surface-400 rounded-xl border border-dashed border-zinc-700">
        <ShoppingCart className="w-5 h-5 text-primary-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Registre vendas reais com baixa automática no estoque</p>
          <p className="text-xs text-zinc-500 mt-0.5">Crie sua conta para usar o PDV completo e acompanhar todas as transações.</p>
        </div>
      </div>
    </div>
  );
}
