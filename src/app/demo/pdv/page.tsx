"use client";

import { useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, paymentMethodLabel } from "@/lib/utils";
import { DEMO_PRODUCTS } from "@/lib/demo-data";

const PAYMENT_METHODS = ["CASH", "PIX", "CREDIT_CARD", "DEBIT_CARD"];

interface CartItem {
  productId: string;
  name: string;
  salePrice: number;
  quantity: number;
  unit: string;
}

export default function DemoPDVPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState("PIX");
  const [discount, setDiscount] = useState(0);
  const [finished, setFinished] = useState(false);

  const results = search.length > 1
    ? DEMO_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  function addToCart(p: typeof DEMO_PRODUCTS[0]) {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === p.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === p.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { productId: p.id, name: p.name, salePrice: p.salePrice, quantity: 1, unit: p.unit }];
    });
    setSearch("");
  }

  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => (c.productId === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  const subtotal = cart.reduce((s, c) => s + c.salePrice * c.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  function handleFinalize() {
    if (cart.length === 0) {
      toast.error("Adicione pelo menos um produto ao carrinho.");
      return;
    }
    setFinished(true);
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Venda finalizada!</h2>
          <p className="text-zinc-500 mt-1">Total: <span className="text-white font-semibold">{formatCurrency(total)}</span> via {paymentMethodLabel(payment)}</p>
        </div>
        <div className="bg-surface-400 border border-dashed border-zinc-700 rounded-xl p-5 max-w-sm">
          <p className="text-sm text-zinc-400">
            Esta é uma demonstração. Crie sua conta para registrar vendas reais, emitir recibos em PDF e ter baixa automática no estoque.
          </p>
        </div>
        <Button onClick={() => { setCart([]); setFinished(false); setDiscount(0); }}>
          Nova venda
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">PDV</h1>
        <p className="text-sm text-zinc-500">Ponto de Venda</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Busca de produto */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar produto por nome ou SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-400 border border-surface-200 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {results.length > 0 && (
            <div className="bg-surface-400 border border-surface-200 rounded-xl overflow-hidden">
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-300 transition-colors border-b border-surface-200 last:border-0 text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-zinc-500 font-mono">{p.sku} · estoque: {p.currentStock} {p.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary-400">{formatCurrency(p.salePrice)}</span>
                    <Plus className="w-4 h-4 text-zinc-500" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {search.length > 1 && results.length === 0 && (
            <p className="text-sm text-zinc-600 px-1">Nenhum produto encontrado.</p>
          )}

          {/* Carrinho */}
          <div className="bg-surface-400 rounded-xl border border-surface-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-200 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary-400" />
              <h2 className="text-sm font-semibold text-white">Carrinho</h2>
              {cart.length > 0 && <Badge color="blue">{cart.length}</Badge>}
            </div>
            {cart.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-600">
                Busque e adicione produtos acima.
              </div>
            ) : (
              <ul className="divide-y divide-surface-200">
                {cart.map((item) => (
                  <li key={item.productId} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-zinc-500">{formatCurrency(item.salePrice)} / {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => changeQty(item.productId, -1)}
                        className="w-7 h-7 rounded-lg bg-surface-300 flex items-center justify-center hover:bg-surface-200 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-zinc-400" />
                      </button>
                      <span className="text-sm font-semibold text-white w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => changeQty(item.productId, 1)}
                        className="w-7 h-7 rounded-lg bg-surface-300 flex items-center justify-center hover:bg-surface-200 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-zinc-400" />
                      </button>
                      <button
                        onClick={() => setCart((prev) => prev.filter((c) => c.productId !== item.productId))}
                        className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-zinc-600 hover:text-red-400" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-white w-20 text-right shrink-0">
                      {formatCurrency(item.salePrice * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Resumo e pagamento */}
        <div className="space-y-4">
          <div className="bg-surface-400 rounded-xl border border-surface-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Forma de pagamento</h2>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setPayment(m)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    payment === m
                      ? "bg-primary-500/15 text-primary-400 border-primary-500/30"
                      : "bg-surface-300 text-zinc-400 border-surface-200 hover:bg-surface-200"
                  }`}
                >
                  {paymentMethodLabel(m)}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-zinc-500 font-medium">Desconto (R$)</label>
              <input
                type="number"
                min={0}
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0,00"
                className="mt-1 w-full px-3 py-2 bg-surface-300 border border-surface-200 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Totais */}
          <div className="bg-surface-400 rounded-xl border border-surface-200 p-5 space-y-3">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-red-400">
                <span>Desconto</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-white border-t border-surface-200 pt-3">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <Button className="w-full" onClick={handleFinalize} disabled={cart.length === 0}>
              Finalizar venda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
