"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Truck, Edit2, Package, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils";

interface Supplier {
  id: string;
  name: string;
  cnpj?: string | null;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  deliveryDays?: number | null;
  isActive: boolean;
  _count: { products: number; purchaseOrders: number };
}

interface PurchaseOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  supplier: { name: string };
  items: { product: { name: string; unit: string }; quantity: number; unitCost: number }[];
}

export default function FornecedoresPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [supplierModal, setSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [ordersModal, setOrdersModal] = useState<Supplier | null>(null);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    name: string;
    cnpj?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    deliveryDays?: string;
  }>();

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/suppliers${params}`);
      const data = await res.json();
      setSuppliers(data.suppliers ?? []);
    } catch {
      toast.error("Erro ao carregar fornecedores");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  async function onSubmit(data: Record<string, string | undefined>) {
    setIsSaving(true);
    try {
      const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : "/api/suppliers";
      const method = editingSupplier ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Erro ao salvar");
        return;
      }
      toast.success(editingSupplier ? "Fornecedor atualizado!" : "Fornecedor criado!");
      setSupplierModal(false);
      reset();
      fetchSuppliers();
    } finally {
      setIsSaving(false);
    }
  }

  async function viewOrders(supplier: Supplier) {
    setOrdersModal(supplier);
    const res = await fetch(`/api/purchase-orders?supplierId=${supplier.id}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
  }

  async function markReceived(orderId: string) {
    const res = await fetch(`/api/purchase-orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RECEIVED" }),
    });
    if (res.ok) {
      toast.success("Ordem marcada como recebida! Estoque atualizado.");
      if (ordersModal) viewOrders(ordersModal);
    }
  }

  function openCreate() {
    setEditingSupplier(null);
    reset({ name: "", cnpj: "", contactName: "", phone: "", email: "", deliveryDays: "" });
    setSupplierModal(true);
  }

  function openEdit(supplier: Supplier) {
    setEditingSupplier(supplier);
    reset({
      name: supplier.name,
      cnpj: supplier.cnpj ?? "",
      contactName: supplier.contactName ?? "",
      phone: supplier.phone ?? "",
      email: supplier.email ?? "",
      deliveryDays: supplier.deliveryDays?.toString() ?? "",
    });
    setSupplierModal(true);
  }

  const statusColors: Record<string, "gray" | "blue" | "green" | "red"> = {
    DRAFT: "gray", SENT: "blue", RECEIVED: "green", CANCELLED: "red",
  };
  const statusLabels: Record<string, string> = {
    DRAFT: "Rascunho", SENT: "Enviado", RECEIVED: "Recebido", CANCELLED: "Cancelado",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Fornecedores</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{suppliers.length} fornecedor(es)</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Novo fornecedor
        </Button>
      </div>

      {/* Busca */}
      <div className="bg-surface-400 rounded-xl border border-zinc-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-500 text-white border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="bg-surface-400 rounded-xl border border-zinc-800 overflow-hidden">
        {isLoading ? (
          <PageLoader />
        ) : suppliers.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="Nenhum fornecedor cadastrado"
            description="Cadastre seus fornecedores para criar ordens de compra."
            action={<Button onClick={openCreate}><Plus className="w-4 h-4" />Cadastrar fornecedor</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-surface-500">
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Fornecedor</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Contato</th>
                  <th className="text-center px-4 py-3 font-medium text-zinc-400">Prazo entrega</th>
                  <th className="text-center px-4 py-3 font-medium text-zinc-400">Produtos</th>
                  <th className="text-center px-4 py-3 font-medium text-zinc-400">Pedidos</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-surface-500">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{supplier.name}</p>
                      {supplier.cnpj && <p className="text-xs text-zinc-600">{supplier.cnpj}</p>}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">
                      {supplier.contactName && <p>{supplier.contactName}</p>}
                      {supplier.phone && <p>{supplier.phone}</p>}
                      {supplier.email && <p>{supplier.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {supplier.deliveryDays ? (
                        <Badge color="blue">{supplier.deliveryDays}d</Badge>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-400">
                      {supplier._count.products}
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-400">
                      {supplier._count.purchaseOrders}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => viewOrders(supplier)}
                          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
                          title="Ver pedidos"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(supplier)}
                          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de criar/editar fornecedor */}
      <Modal
        open={supplierModal}
        onClose={() => setSupplierModal(false)}
        title={editingSupplier ? "Editar fornecedor" : "Novo fornecedor"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Nome *" error={errors.name?.message} {...register("name", { required: "Nome obrigatório" })} />
            </div>
            <Input label="CNPJ" placeholder="00.000.000/0001-00" {...register("cnpj")} />
            <Input label="Prazo de entrega (dias)" type="number" min="0" {...register("deliveryDays")} />
            <Input label="Contato" {...register("contactName")} />
            <Input label="Telefone" {...register("phone")} />
            <Input label="Email" type="email" {...register("email")} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setSupplierModal(false)}>Cancelar</Button>
            <Button type="submit" loading={isSaving}>{editingSupplier ? "Salvar" : "Criar"}</Button>
          </div>
        </form>
      </Modal>

      {/* Modal de ordens de compra */}
      <Modal
        open={!!ordersModal}
        onClose={() => setOrdersModal(null)}
        title={`Pedidos — ${ordersModal?.name}`}
        size="lg"
      >
        {orders.length === 0 ? (
          <EmptyState icon={Package} title="Nenhum pedido para este fornecedor" />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      OC #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-zinc-600">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={statusColors[order.status] ?? "gray"}>
                      {statusLabels[order.status] ?? order.status}
                    </Badge>
                    {order.status === "SENT" && (
                      <button
                        onClick={() => markReceived(order.id)}
                        className="text-xs text-primary-400 hover:underline"
                      >
                        Marcar recebido
                      </button>
                    )}
                  </div>
                </div>
                <ul className="space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-xs text-zinc-400">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>{formatCurrency(item.unitCost * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-zinc-800/50 mt-2 pt-2 flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
