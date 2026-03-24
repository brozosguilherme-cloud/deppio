"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Search,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Product, CartItem } from "@/types";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Dinheiro" },
  { value: "PIX", label: "PIX" },
  { value: "CREDIT_CARD", label: "Crédito" },
  { value: "DEBIT_CARD", label: "Débito" },
  { value: "INSTALLMENT", label: "Crediário" },
];

export default function PDVPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saleCompleted, setSaleCompleted] = useState<{ id: string; total: number } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Foco automático na busca
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Busca produtos
  const fetchProducts = useCallback(async () => {
    if (!searchTerm || searchTerm.length < 2) {
      setProducts([]);
      return;
    }
    const res = await fetch(
      `/api/products?search=${encodeURIComponent(searchTerm)}&status=active&limit=10`
    );
    const data = await res.json();
    setProducts(data.products ?? []);
  }, [searchTerm]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 250);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  function addToCart(product: Product) {
    if (product.currentStock <= 0) {
      toast.error(`${product.name} está sem estoque.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          toast.error(`Máximo disponível: ${product.currentStock}`);
          return prev;
        }
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          unitPrice: Number(product.salePrice),
        },
      ];
    });

    // Limpa busca para próximo produto
    setSearchTerm("");
    setProducts([]);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.product.id !== productId) return i;
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > i.product.currentStock) {
            toast.error(`Máximo disponível: ${i.product.currentStock}`);
            return i;
          }
          return { ...i, quantity: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  const subtotal = cart.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );
  const total = Math.max(0, subtotal - discount);

  async function handleFinalizeSale() {
    if (cart.length === 0) {
      toast.error("Adicione produtos ao carrinho.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          paymentMethod,
          discount,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Erro ao finalizar venda");
        return;
      }

      const sale = await res.json();
      setSaleCompleted({ id: sale.id, total: Number(sale.total) });
      setCart([]);
      setDiscount(0);
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Tela de venda concluída
  if (saleCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-96 space-y-6">
        <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-green-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Venda finalizada!</h2>
          <p className="text-zinc-500 mt-1">
            Total: <span className="font-semibold text-zinc-200">{formatCurrency(saleCompleted.total)}</span>
          </p>
          <p className="text-xs text-zinc-600 mt-0.5">
            #{saleCompleted.id.slice(-6).toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setSaleCompleted(null)}
          >
            Nova venda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Painel esquerdo: busca de produtos */}
      <div className="flex-1 min-w-0 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white">PDV</h1>
          <p className="text-sm text-zinc-500">Ponto de Venda — busque produtos para adicionar</p>
        </div>

        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
          <input
            ref={searchRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produto por nome, SKU ou código de barras..."
            className="w-full bg-surface-500 border-2 border-zinc-700 focus:border-primary-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Resultados da busca */}
        {products.length > 0 && (
          <div className="bg-surface-400 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.currentStock <= 0}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary-500/10 transition-colors text-left disabled:opacity-50"
              >
                <div>
                  <p className="text-sm font-medium text-white">{product.name}</p>
                  <p className="text-xs text-zinc-600">
                    SKU: {product.sku} · Estoque: {product.currentStock} {product.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(product.salePrice)}
                  </span>
                  {product.currentStock <= 0 ? (
                    <Badge color="red">Sem estoque</Badge>
                  ) : (
                    <Plus className="w-4 h-4 text-primary-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {searchTerm.length >= 2 && products.length === 0 && (
          <div className="text-center py-8 text-sm text-zinc-600">
            Nenhum produto encontrado para &ldquo;{searchTerm}&rdquo;
          </div>
        )}
      </div>

      {/* Painel direito: carrinho */}
      <div className="w-full md:w-80 shrink-0 flex flex-col">
        <div className="bg-surface-400 rounded-xl border border-zinc-800 flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-white">Carrinho</h2>
            {cart.length > 0 && <Badge color="blue">{cart.length}</Badge>}
          </div>

          {/* Itens */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <ShoppingBag className="w-8 h-8 text-zinc-700 mb-2" />
                <p className="text-sm text-zinc-600">
                  Carrinho vazio. Busque produtos ao lado.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {formatCurrency(item.unitPrice)} / un
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.product.id, -1)}
                        className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.product.id, 1)}
                        className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totais e pagamento */}
          {cart.length > 0 && (
            <div className="border-t border-zinc-800/50 p-4 space-y-3">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-zinc-400">Desconto</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-zinc-600">R$</span>
                  <input
                    type="number"
                    min="0"
                    max={subtotal}
                    step="0.01"
                    value={discount || ""}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 bg-surface-500 border border-zinc-700 text-white rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-zinc-800/50">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              {/* Forma de pagamento */}
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-1.5">Pagamento</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.value}
                      onClick={() => setPaymentMethod(pm.value)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        paymentMethod === pm.value
                          ? "bg-primary-600 text-white border-primary-600"
                          : "border-zinc-700 text-zinc-400 hover:bg-surface-500"
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleFinalizeSale}
                loading={isProcessing}
              >
                Finalizar venda
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
