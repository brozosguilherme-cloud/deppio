"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmModal } from "@/components/ui/Modal";
import { formatCurrency, formatDateTime, paymentMethodLabel } from "@/lib/utils";
import type { Sale } from "@/types";

export default function VendasPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<Sale | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      const res = await fetch(`/api/sales?${params}`);
      const data = await res.json();
      setSales(data.sales ?? []);
      setTotal(data.pagination?.total ?? 0);
      setPages(data.pagination?.pages ?? 1);
    } catch {
      toast.error("Erro ao carregar vendas");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  async function handleCancel() {
    if (!cancelModal) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/sales/${cancelModal.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Venda cancelada e estoque revertido.");
        setCancelModal(null);
        fetchSales();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Erro ao cancelar venda");
      }
    } finally {
      setIsCancelling(false);
    }
  }

  // Soma da receita total visível na página
  const pageRevenue = sales
    .filter((s) => s.status === "COMPLETED")
    .reduce((sum, s) => sum + Number(s.total), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Vendas</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{total} venda(s) registrada(s)</p>
        </div>
        <div className="bg-primary-500/10 rounded-xl px-4 py-2 text-right">
          <p className="text-xs text-zinc-500">Receita nesta página</p>
          <p className="text-base font-bold text-primary-400">{formatCurrency(pageRevenue)}</p>
        </div>
      </div>

      <div className="bg-surface-400 rounded-xl border border-zinc-800 overflow-hidden">
        {isLoading ? (
          <PageLoader />
        ) : sales.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Nenhuma venda encontrada"
            description="Use o PDV para registrar suas vendas."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-surface-500">
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">ID</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Itens</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Pagamento</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-400">Total</th>
                    <th className="text-center px-4 py-3 font-medium text-zinc-400">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Vendedor</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-surface-500 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                        #{sale.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap text-xs">
                        {formatDateTime(sale.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs max-w-48 truncate">
                        {sale.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color="blue">{paymentMethodLabel(sale.paymentMethod)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-white">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={sale.status === "COMPLETED" ? "green" : "red"}>
                          {sale.status === "COMPLETED" ? "Concluída" : "Cancelada"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{sale.user.name}</td>
                      <td className="px-4 py-3">
                        {sale.status === "COMPLETED" && (
                          <button
                            onClick={() => setCancelModal(sale)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-zinc-600 hover:text-red-600"
                            title="Cancelar venda"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pages > 1 && (
              <div className="px-4 py-3 border-t border-zinc-800/50 flex items-center justify-between text-sm text-zinc-500">
                <span>Página {page} de {pages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-zinc-700 rounded-lg hover:bg-surface-500 disabled:opacity-40">Anterior</button>
                  <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1 border border-zinc-700 rounded-lg hover:bg-surface-500 disabled:opacity-40">Próxima</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        open={!!cancelModal}
        onClose={() => setCancelModal(null)}
        onConfirm={handleCancel}
        title="Cancelar venda"
        description={`Tem certeza que deseja cancelar a venda #${cancelModal?.id.slice(-6).toUpperCase()}? Os itens serão devolvidos ao estoque.`}
        confirmLabel="Cancelar venda"
        isLoading={isCancelling}
      />
    </div>
  );
}
