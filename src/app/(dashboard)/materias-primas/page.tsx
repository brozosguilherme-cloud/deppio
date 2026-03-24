"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, AlertTriangle, Package2, Edit2, Trash2,
  ArrowDownCircle, ChevronDown, X, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePlan } from "@/contexts/PlanContext";
import { canAccess } from "@/lib/plans";
import { UpgradeRequired } from "@/components/ui/UpgradeRequired";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface RawMaterial {
  id: string;
  name: string;
  description?: string;
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  supplier?: { id: string; name: string } | null;
  notes?: string | null;
}

interface Supplier { id: string; name: string; }

// ─── Unidades comuns ─────────────────────────────────────────────────────────

const UNITS = ["un", "kg", "g", "L", "ml", "m", "m²", "dm²", "cm", "par", "cx", "rolo"];

// ─── Form de matéria-prima ───────────────────────────────────────────────────

function RawMaterialForm({
  initial, suppliers, onSave, onClose,
}: {
  initial?: RawMaterial | null;
  suppliers: Supplier[];
  onSave: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    unit: initial?.unit ?? "un",
    currentStock: initial?.currentStock ?? 0,
    minStock: initial?.minStock ?? 0,
    costPerUnit: initial?.costPerUnit ?? 0,
    supplierId: initial?.supplier?.id ?? "",
    notes: initial?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.unit) {
      toast.error("Preencha nome e unidade");
      return;
    }
    setSaving(true);
    try {
      const url = initial ? `/api/raw-materials/${initial.id}` : "/api/raw-materials";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, supplierId: form.supplierId || null }),
      });
      if (!res.ok) throw new Error();
      toast.success(initial ? "Matéria-prima atualizada!" : "Matéria-prima cadastrada!");
      onSave();
    } catch {
      toast.error("Erro ao salvar matéria-prima");
    } finally {
      setSaving(false);
    }
  }

  const labelCls = "block text-xs font-medium text-zinc-400 mb-1";
  const inputCls = "w-full bg-surface-500 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 placeholder:text-zinc-600 focus:outline-none focus:border-primary-500/60 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelCls}>Nome *</label>
          <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ex: Tecido Algodão 180g" required />
        </div>
        <div>
          <label className={labelCls}>Unidade *</label>
          <select className={inputCls} value={form.unit} onChange={e => set("unit", e.target.value)}>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Custo por unidade (R$)</label>
          <input className={inputCls} type="number" min={0} step={0.0001} value={form.costPerUnit}
            onChange={e => set("costPerUnit", e.target.value)} placeholder="0,00" />
        </div>
        {!initial && (
          <div>
            <label className={labelCls}>Estoque atual</label>
            <input className={inputCls} type="number" min={0} step={0.01} value={form.currentStock}
              onChange={e => set("currentStock", e.target.value)} />
          </div>
        )}
        <div className={initial ? "col-span-2" : ""}>
          <label className={labelCls}>Estoque mínimo (alerta)</label>
          <input className={inputCls} type="number" min={0} step={0.01} value={form.minStock}
            onChange={e => set("minStock", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Fornecedor</label>
          <select className={inputCls} value={form.supplierId} onChange={e => set("supplierId", e.target.value)}>
            <option value="">— Nenhum —</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Descrição</label>
          <input className={inputCls} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Opcional" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Observações</label>
          <textarea className={cn(inputCls, "resize-none")} rows={2} value={form.notes}
            onChange={e => set("notes", e.target.value)} placeholder="Opcional" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (initial ? "Salvar" : "Cadastrar")}
        </Button>
      </div>
    </form>
  );
}

// ─── Modal de reposição ───────────────────────────────────────────────────────

function ReplenishModal({ rm, onDone, onClose }: { rm: RawMaterial; onDone: () => void; onClose: () => void }) {
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!qty || Number(qty) <= 0) { toast.error("Quantidade inválida"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/raw-materials/${rm.id}/replenish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Number(qty), note: note || undefined }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${Number(qty)} ${rm.unit} adicionados ao estoque de ${rm.name}`);
      onDone();
    } catch {
      toast.error("Erro ao repor estoque");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full bg-surface-500 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 placeholder:text-zinc-600 focus:outline-none focus:border-primary-500/60 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-3">
        <p className="text-sm font-medium text-white">{rm.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          Estoque atual: <span className="text-zinc-300">{rm.currentStock} {rm.unit}</span>
          {rm.currentStock < rm.minStock && (
            <span className="text-red-400 ml-2">⚠ abaixo do mínimo ({rm.minStock} {rm.unit})</span>
          )}
        </p>
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">Quantidade a adicionar ({rm.unit})</label>
        <input className={inputCls} type="number" min={0.001} step={0.001} value={qty}
          onChange={e => setQty(e.target.value)} placeholder="0" autoFocus required />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">Observação</label>
        <input className={inputCls} value={note} onChange={e => setNote(e.target.value)} placeholder="Ex: Compra NF 12345" />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar ao estoque"}
        </Button>
      </div>
    </form>
  );
}

// ─── Card de matéria-prima ────────────────────────────────────────────────────

function RawMaterialCard({
  rm, onEdit, onReplenish, onDelete,
}: {
  rm: RawMaterial;
  onEdit: () => void;
  onReplenish: () => void;
  onDelete: () => void;
}) {
  const isLow = rm.currentStock < rm.minStock;
  const isCritical = rm.currentStock <= 0;
  const pct = rm.minStock > 0 ? Math.min(100, (rm.currentStock / rm.minStock) * 100) : 100;

  return (
    <div className={cn(
      "bg-surface-400 border rounded-xl p-4 flex flex-col gap-3 transition-colors",
      isCritical ? "border-red-500/40" : isLow ? "border-amber-500/30" : "border-zinc-800"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white truncate">{rm.name}</p>
            {isCritical
              ? <Badge color="red">Zerado</Badge>
              : isLow
                ? <Badge color="yellow">Crítico</Badge>
                : <Badge color="green">OK</Badge>
            }
          </div>
          {rm.description && <p className="text-xs text-zinc-500 mt-0.5 truncate">{rm.description}</p>}
          {rm.supplier && <p className="text-xs text-zinc-600 mt-0.5 truncate">{rm.supplier.name}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onReplenish} title="Repor estoque"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-500/15 text-zinc-500 hover:text-green-400 transition-colors">
            <ArrowDownCircle className="w-4 h-4" />
          </button>
          <button onClick={onEdit} title="Editar"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} title="Remover"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/15 text-zinc-600 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Estoque */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Estoque</span>
          <span className={cn("font-mono font-semibold", isCritical ? "text-red-400" : isLow ? "text-amber-400" : "text-zinc-200")}>
            {rm.currentStock.toLocaleString("pt-BR", { maximumFractionDigits: 3 })} {rm.unit}
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", isCritical ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-green-500")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-zinc-600">
          <span>Mín: {rm.minStock} {rm.unit}</span>
          {rm.costPerUnit > 0 && (
            <span>
              {Number(rm.costPerUnit).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 4 })}/{rm.unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal genérico ───────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-surface-400 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function MateriasPrimasPage() {
  const plan = usePlan();
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLow, setFilterLow] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RawMaterial | null>(null);
  const [replenishing, setReplenishing] = useState<RawMaterial | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterLow) params.set("lowStock", "true");
    const [rmRes, supRes] = await Promise.all([
      fetch(`/api/raw-materials?${params}`),
      fetch("/api/suppliers"),
    ]);
    const rmData = await rmRes.json();
    const supData = await supRes.json();
    setRawMaterials(rmData.rawMaterials ?? []);
    setSuppliers(supData.suppliers ?? []);
    setLoading(false);
  }, [search, filterLow]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load]);

  async function handleDelete(rm: RawMaterial) {
    if (!confirm(`Remover "${rm.name}"?`)) return;
    try {
      await fetch(`/api/raw-materials/${rm.id}`, { method: "DELETE" });
      toast.success("Matéria-prima removida");
      load();
    } catch {
      toast.error("Erro ao remover");
    }
  }

  const lowCount = rawMaterials.filter(r => r.currentStock < r.minStock).length;

  if (!canAccess(plan, "rawMaterials")) {
    return <UpgradeRequired feature="Matérias-primas e BOM" />;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Matérias-Primas</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Gerencie insumos e fichas técnicas dos produtos</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1.5" /> Nova matéria-prima
        </Button>
      </div>

      {/* Alertas de baixo estoque */}
      {lowCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            <span className="font-semibold">{lowCount} matéria{lowCount > 1 ? "s-primas" : "-prima"}</span> com estoque abaixo do mínimo.
          </p>
          <button onClick={() => setFilterLow(true)} className="ml-auto text-xs text-amber-400 hover:text-amber-300 underline shrink-0">
            Ver só essas
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar matéria-prima..."
            className="w-full bg-surface-500 border border-zinc-700 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-primary-500/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setFilterLow(v => !v)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm border transition-colors",
            filterLow
              ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
              : "bg-surface-500 border-zinc-700 text-zinc-500 hover:text-zinc-300"
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          Críticos
          {filterLow && <X className="w-3.5 h-3.5 ml-0.5" onClick={e => { e.stopPropagation(); setFilterLow(false); }} />}
        </button>
      </div>

      {/* Grid de matérias-primas */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-zinc-600 animate-spin" />
        </div>
      ) : rawMaterials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-3">
            <Package2 className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-sm font-medium text-zinc-400">Nenhuma matéria-prima encontrada</p>
          <p className="text-xs text-zinc-600 mt-1">
            {search || filterLow ? "Tente outros filtros" : "Cadastre a primeira matéria-prima"}
          </p>
          {!search && !filterLow && (
            <Button className="mt-4" onClick={() => { setEditing(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-1.5" /> Cadastrar
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rawMaterials.map(rm => (
            <RawMaterialCard
              key={rm.id}
              rm={rm}
              onEdit={() => { setEditing(rm); setShowForm(true); }}
              onReplenish={() => setReplenishing(rm)}
              onDelete={() => handleDelete(rm)}
            />
          ))}
        </div>
      )}

      {/* Modal: form */}
      {showForm && (
        <Modal title={editing ? "Editar matéria-prima" : "Nova matéria-prima"} onClose={() => setShowForm(false)}>
          <RawMaterialForm
            initial={editing}
            suppliers={suppliers}
            onSave={() => { setShowForm(false); load(); }}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}

      {/* Modal: reposição */}
      {replenishing && (
        <Modal title="Repor estoque" onClose={() => setReplenishing(null)}>
          <ReplenishModal
            rm={replenishing}
            onDone={() => { setReplenishing(null); load(); }}
            onClose={() => setReplenishing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
