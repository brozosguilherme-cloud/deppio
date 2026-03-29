"use client";

import { Truck, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DEMO_SUPPLIERS } from "@/lib/demo-data";

export default function DemoFornecedoresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Fornecedores</h1>
        <p className="text-sm text-zinc-500">{DEMO_SUPPLIERS.length} fornecedores cadastrados</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {DEMO_SUPPLIERS.map((s) => (
          <div key={s.id} className="bg-surface-400 rounded-xl border border-surface-200 p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{s.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 font-mono">{s.cnpj}</p>
                </div>
              </div>
              <Badge color="green">Ativo</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-zinc-500">Contato</p>
                <p className="text-white mt-0.5">{s.contactName}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Telefone</p>
                <p className="text-white mt-0.5">{s.phone}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">E-mail</p>
                <p className="text-zinc-300 mt-0.5 truncate">{s.email}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Prazo entrega</p>
                <p className="text-white mt-0.5">{s.deliveryDays} dias</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-surface-200">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Package className="w-3.5 h-3.5" />
                {s._count.products} produtos
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <ShoppingBag className="w-3.5 h-3.5" />
                {s._count.purchaseOrders} pedidos
              </div>
              {s.notes && (
                <p className="text-xs text-zinc-600 truncate flex-1">{s.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 p-4 bg-surface-400 rounded-xl border border-dashed border-zinc-700">
        <Truck className="w-5 h-5 text-primary-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Gerencie seus fornecedores e ordens de compra</p>
          <p className="text-xs text-zinc-500 mt-0.5">Crie sua conta para cadastrar fornecedores reais e emitir pedidos de compra.</p>
        </div>
      </div>
    </div>
  );
}
