"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Package, Edit2, PowerOff, FlaskConical, X, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductForm } from "@/components/products/ProductForm";
import { formatCurrency, stockStatusColor } from "@/lib/utils";
import type { Product } from "@/types";

// ─── BOM Modal ───────────────────────────────────────────────────────────────

interface BOMItem {
  rawMaterialId: string;
  rawMaterial: { id: string; name: string; unit: string };
  quantity: number;
}
interface RawMaterial { id: string; name: string; unit: string; currentStock: number; }

function BOMModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [bom, setBom] = useState<BOMItem[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${product.id}/bom`).then(r => r.json()),
      fetch("/api/raw-materials").then(r => r.json()),
    ]).then(([bomData, rmData]) => {
      setBom(bomData.bom ?? []);
      setRawMaterials(rmData.rawMaterials ?? []);
      setLoading(false);
    });
  }, [product.id]);

  function addItem() {
    if (!selectedId || !qty || Number(qty) <= 0) { toast.error("Selecione a matéria-prima e informe a quantidade"); return; }
    if (bom.find(i => i.rawMaterialId === selectedId)) { toast.error("Matéria-prima já adicionada"); return; }
    const rm = rawMaterials.find(r => r.id === selectedId);
    if (!rm) return;
    setBom(prev => [...prev, { rawMaterialId: selectedId, rawMaterial: { id: rm.id, name: rm.name, unit: rm.unit }, quantity: Number(qty) }]);
    setSelectedId(""); setQty("");
  }

  function removeItem(rawMaterialId: string) {
    setBom(prev => prev.filter(i => i.rawMaterialId !== rawMaterialId));
  }

  function updateQty(rawMaterialId: string, value: string) {
    setBom(prev => prev.map(i => i.rawMaterialId === rawMaterialId ? { ...i, quantity: Number(value) } : i));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${product.id}/bom`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: bom.map(i => ({ rawMaterialId: i.rawMaterialId, quantity: i.quantity })) }),
      });
      if (!res.ok) throw new Error();
      toast.success("Ficha técnica salva! Custo do produto recalculado.");
      onClose();
    } catch {
      toast.error("Erro ao salvar ficha técnica");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "bg-surface-500 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 placeholder:text-zinc-600 focus:outline-none focus:border-primary-500/60 transition-colors";
  const available = rawMaterials.filter(r => !bom.find(i => i.rawMaterialId === r.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-surface-400 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary-400" /> Ficha Técnica (BOM)
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">{product.name}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
            </div>
          ) : (
            <>
              {/* Itens do BOM */}
              {bom.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-600">
                  Nenhuma matéria-prima vinculada. Adicione abaixo.
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    Composição — por unidade de {product.unit}
                  </p>
                  {bom.map(item => (
                    <div key={item.rawMaterialId} className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">{item.rawMaterial.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number" min={0.001} step={0.001}
                          value={item.quantity}
                          onChange={e => updateQty(item.rawMaterialId, e.target.value)}
                          className="w-20 bg-surface-500 border border-zinc-700 text-white text-xs rounded px-2 py-1 text-right focus:outline-none focus:border-primary-500/60"
                        />
                        <span className="text-xs text-zinc-500 w-8">{item.rawMaterial.unit}</span>
                        <button onClick={() => removeItem(item.rawMaterialId)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-red-500/15 text-zinc-600 hover:text-red-400 rounded transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Adicionar item */}
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Adicionar matéria-prima</p>
                <div className="flex gap-2">
                  <select
                    value={selectedId}
                    onChange={e => setSelectedId(e.target.value)}
                    className={`flex-1 ${inputCls}`}
                  >
                    <option value="">Selecionar...</option>
                    {available.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.unit})</option>
                    ))}
                  </select>
                  <input
                    type="number" min={0.001} step={0.001}
                    value={qty} onChange={e => setQty(e.target.value)}
                    placeholder="Qtd"
                    className={`w-24 ${inputCls}`}
                  />
                  <button onClick={addItem}
                    className="px-3 py-2 bg-primary-500 hover:bg-primary-400 text-zinc-900 rounded-lg text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {available.length === 0 && (
                  <p className="text-xs text-zinc-600">Todas as matérias-primas já foram adicionadas.</p>
                )}
              </div>

              {/* Custo calculado */}
              {bom.length > 0 && rawMaterials.length > 0 && (
                <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-zinc-400">Custo calculado pelo BOM</p>
                  <p className="text-lg font-bold text-primary-400 mt-0.5">
                    {bom.reduce((sum, item) => {
                      const rm = rawMaterials.find(r => r.id === item.rawMaterialId) as { costPerUnit?: number } | undefined;
                      return sum + (Number(rm?.costPerUnit ?? 0) * item.quantity);
                    }, 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">Será aplicado como custo do produto ao salvar</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-800 flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar ficha técnica"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(true);

  // Modal de criação/edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modal de desativação
  const [deactivateModal, setDeactivateModal] = useState<Product | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Modal de BOM
  const [bomProduct, setBomProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search,
        status,
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products ?? []);
      setTotal(data.pagination?.total ?? 0);
      setPages(data.pagination?.pages ?? 1);
    } catch {
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce na busca
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
    if (searchTimeout) clearTimeout(searchTimeout);
    const t = setTimeout(() => fetchProducts(), 400);
    setSearchTimeout(t);
  }

  async function handleDeactivate() {
    if (!deactivateModal) return;
    setIsDeactivating(true);
    try {
      const res = await fetch(`/api/products/${deactivateModal.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Produto desativado.");
        setDeactivateModal(null);
        fetchProducts();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Erro ao desativar produto");
      }
    } finally {
      setIsDeactivating(false);
    }
  }

  function openCreate() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Produtos</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{total} produto(s) cadastrado(s)</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Novo produto
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-surface-400 rounded-xl border border-zinc-800 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar por nome, SKU ou código..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-surface-500 text-white border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-zinc-700 bg-surface-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="all">Todos</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-surface-400 rounded-xl border border-zinc-800 overflow-hidden">
        {isLoading ? (
          <PageLoader />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nenhum produto encontrado"
            description={
              search
                ? "Tente outros termos de busca."
                : "Comece cadastrando seu primeiro produto."
            }
            action={
              !search ? (
                <Button onClick={openCreate}>
                  <Plus className="w-4 h-4" />
                  Cadastrar produto
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-surface-500">
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Produto</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">SKU</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400">Categoria</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-400">Custo</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-400">Venda</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-400">Estoque</th>
                    <th className="text-center px-4 py-3 font-medium text-zinc-400">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map((product) => {
                    const stockColor = stockStatusColor(
                      product.currentStock,
                      product.minStock
                    );
                    return (
                      <tr key={product.id} className="hover:bg-surface-500 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{product.name}</div>
                          {product.ean && (
                            <div className="text-xs text-zinc-600">{product.ean}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 font-mono text-xs">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3">
                          {product.category ? (
                            <Badge color="blue">{product.category.name}</Badge>
                          ) : (
                            <span className="text-zinc-600 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-400">
                          {formatCurrency(product.costPrice)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-white">
                          {formatCurrency(product.salePrice)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge
                            color={
                              stockColor === "red"
                                ? "red"
                                : stockColor === "yellow"
                                ? "yellow"
                                : "green"
                            }
                          >
                            {product.currentStock} {product.unit}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge color={product.isActive ? "green" : "gray"}>
                            {product.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => setBomProduct(product)}
                              className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-primary-400"
                              title="Ficha técnica (BOM)"
                            >
                              <FlaskConical className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEdit(product)}
                              className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {product.isActive && (
                              <button
                                onClick={() => setDeactivateModal(product)}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-500 hover:text-red-400"
                                title="Desativar"
                              >
                                <PowerOff className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
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
                <span>
                  Página {page} de {pages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-zinc-700 rounded-lg hover:bg-surface-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="px-3 py-1 border border-zinc-700 rounded-lg hover:bg-surface-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de criar/editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Editar produto" : "Novo produto"}
        size="lg"
      >
        <ProductForm
          product={
            editingProduct
              ? {
                  id: editingProduct.id,
                  name: editingProduct.name,
                  sku: editingProduct.sku,
                  ean: editingProduct.ean ?? undefined,
                  description: editingProduct.description ?? undefined,
                  categoryId: editingProduct.categoryId ?? undefined,
                  supplierId: editingProduct.supplierId ?? undefined,
                  unit: editingProduct.unit,
                  costPrice: editingProduct.costPrice,
                  salePrice: editingProduct.salePrice,
                  minStock: editingProduct.minStock,
                }
              : undefined
          }
          onSuccess={() => {
            setModalOpen(false);
            fetchProducts();
          }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Modal de BOM */}
      {bomProduct && (
        <BOMModal product={bomProduct} onClose={() => { setBomProduct(null); fetchProducts(); }} />
      )}

      {/* Modal de confirmação de desativação */}
      <ConfirmModal
        open={!!deactivateModal}
        onClose={() => setDeactivateModal(null)}
        onConfirm={handleDeactivate}
        title="Desativar produto"
        description={`Tem certeza que deseja desativar "${deactivateModal?.name}"? O produto não aparecerá mais para novas vendas.`}
        confirmLabel="Desativar"
        isLoading={isDeactivating}
      />
    </div>
  );
}
