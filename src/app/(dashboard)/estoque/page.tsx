"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { MovementModal } from "@/components/stock/MovementModal";
import { formatDateTime, movementTypeLabel } from "@/lib/utils";
import type { StockMovement } from "@/types";

export default function EstoquePage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");

  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  const fetchMovements = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "30" });
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/stock-movements?${params}`);
      const data = await res.json();
      setMovements(data.movements ?? []);
      setTotal(data.pagination?.total ?? 0);
      setPages(data.pagination?.pages ?? 1);
    } catch {
      toast.error("Erro ao carregar movimentações");
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => { fetchMovements(); }, [fetchMovements]);

  function getMovementBadge(type: string) {
    const exits = ["SALE", "LOSS", "TRANSFER"];
    const isExit = exits.includes(type);
    return (
      <div className={`flex items-center gap-1.5 ${isExit ? "text-red-400" : "text-green-400"}`}>
        {isExit ? (
          <TrendingDown className="w-3.5 h-3.5" />
        ) : (
          <TrendingUp className="w-3.5 h-3.5" />
        )}
        <span className="text-xs font-medium">{movementTypeLabel(type)}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Estoque</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{total} movimentação(ões) registrada(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setExitModalOpen(true)}>
            <ArrowUpCircle className="w-4 h-4 text-red-500" />
            Saída
          </Button>
          <Button onClick={() => setEntryModalOpen(true)}>
            <ArrowDownCircle className="w-4 h-4" />
            Entrada
          </Button>
        </div>
      </div>

      {/* Cards de atalho */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Compra",
            icon: ArrowDownCircle,
            color: "text-green-400",
            bg: "bg-green-500/10",
            action: () => setEntryModalOpen(true),
          },
          {
            label: "Devolução",
            icon: ArrowDownCircle,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            action: () => setEntryModalOpen(true),
          },
          {
            label: "Perda",
            icon: ArrowUpCircle,
            color: "text-red-400",
            bg: "bg-red-500/10",
            action: () => setExitModalOpen(true),
          },
          {
            label: "Inventário",
            icon: History,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            action: () => setEntryModalOpen(true),
          },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`${item.bg} rounded-xl p-4 text-left hover:opacity-80 transition-opacity border border-transparent hover:border-zinc-800`}
          >
            <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
            <span className="text-sm font-medium text-zinc-300">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-surface-400 rounded-xl border border-zinc-800 p-4 flex gap-3 items-center flex-wrap">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="border border-zinc-700 bg-surface-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todos os tipos</option>
          <optgroup label="Entradas">
            <option value="PURCHASE">Compra</option>
            <option value="RETURN">Devolução</option>
            <option value="ADJUSTMENT">Ajuste</option>
            <option value="INVENTORY">Inventário</option>
          </optgroup>
          <optgroup label="Saídas">
            <option value="SALE">Venda</option>
            <option value="LOSS">Perda</option>
            <option value="TRANSFER">Transferência</option>
          </optgroup>
          <option value="REVERSAL">Estorno</option>
        </select>
      </div>

      {/* Histórico de movimentações */}
      <div className="bg-surface-400 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center gap-2">
          <History className="w-4 h-4 text-zinc-600" />
          <h2 className="text-sm font-semibold text-white">
            Histórico de movimentações
          </h2>
          <Badge color="gray">{total}</Badge>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : movements.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="Nenhuma movimentação encontrada"
            description="Registre entradas e saídas para visualizar o histórico."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-surface-500">
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Data/Hora</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Produto</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Tipo</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-400">Qtd</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Responsável</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Motivo / Ref.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {movements.map((mov) => {
                    const isExit = mov.quantity < 0;
                    return (
                      <tr key={mov.id} className="hover:bg-surface-500 transition-colors">
                        <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                          {formatDateTime(mov.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">
                            {mov.product.name}
                          </div>
                          <div className="text-xs text-zinc-600 font-mono">
                            {mov.product.sku}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getMovementBadge(mov.type)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-semibold ${
                              isExit ? "text-red-400" : "text-green-400"
                            }`}
                          >
                            {isExit ? "" : "+"}
                            {mov.quantity} {mov.product.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-xs">
                          {mov.user.name}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 text-xs max-w-48 truncate">
                          {mov.reason ?? mov.reference ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {pages > 1 && (
              <div className="px-4 py-3 border-t border-zinc-800/50 flex items-center justify-between text-sm text-zinc-500">
                <span>Página {page} de {pages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-zinc-700 rounded-lg hover:bg-surface-500 disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="px-3 py-1 border border-zinc-700 rounded-lg hover:bg-surface-500 disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modais */}
      <MovementModal
        open={entryModalOpen}
        onClose={() => setEntryModalOpen(false)}
        onSuccess={() => { setEntryModalOpen(false); fetchMovements(); }}
        mode="entry"
      />
      <MovementModal
        open={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        onSuccess={() => { setExitModalOpen(false); fetchMovements(); }}
        mode="exit"
      />
    </div>
  );
}
