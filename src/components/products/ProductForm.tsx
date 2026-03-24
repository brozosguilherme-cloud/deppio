"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { generateSku } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  sku: z.string().min(2, "SKU obrigatório"),
  ean: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  unit: z.string().default("un"),
  costPrice: z.coerce.number().min(0, "Preço de custo inválido"),
  salePrice: z.coerce.number().min(0, "Preço de venda inválido"),
  minStock: z.coerce.number().int().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  product?: Partial<FormData> & { id?: string };
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const isEditing = !!product?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product ?? { unit: "un", minStock: 0 },
  });

  const name = watch("name");

  // Carrega categorias e fornecedores
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {});

    fetch("/api/suppliers")
      .then((r) => r.json())
      .then((data) => setSuppliers(data.suppliers ?? data))
      .catch(() => {});
  }, []);

  // Auto-gera SKU ao digitar nome (apenas criação)
  useEffect(() => {
    if (!isEditing && name) {
      setValue("sku", generateSku(name));
    }
  }, [name, isEditing, setValue]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const url = isEditing ? `/api/products/${product!.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Erro ao salvar produto");
        return;
      }

      toast.success(isEditing ? "Produto atualizado!" : "Produto criado!");
      onSuccess();
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nome e SKU */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Input
            label="Nome do produto *"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>
        <div>
          <Input
            label="SKU *"
            error={errors.sku?.message}
            hint="Código interno único"
            {...register("sku")}
          />
        </div>
      </div>

      {/* EAN e Unidade */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="EAN / Código de barras"
          {...register("ean")}
        />
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Unidade de medida
          </label>
          <select
            className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register("unit")}
          >
            {["un", "kg", "lt", "cx", "pc", "m", "m²", "par"].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Categoria e Fornecedor */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Categoria
          </label>
          <select
            className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register("categoryId")}
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Fornecedor
          </label>
          <select
            className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register("supplierId")}
          >
            <option value="">Sem fornecedor</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preços */}
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Preço de custo (R$) *"
          type="number"
          step="0.01"
          min="0"
          error={errors.costPrice?.message}
          {...register("costPrice")}
        />
        <Input
          label="Preço de venda (R$) *"
          type="number"
          step="0.01"
          min="0"
          error={errors.salePrice?.message}
          {...register("salePrice")}
        />
        <Input
          label="Estoque mínimo"
          type="number"
          min="0"
          error={errors.minStock?.message}
          hint="Dispara alerta"
          {...register("minStock")}
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Descrição (opcional)
        </label>
        <textarea
          rows={2}
          className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          {...register("description")}
        />
      </div>

      {/* Botões */}
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading}>
          {isEditing ? "Salvar alterações" : "Criar produto"}
        </Button>
      </div>
    </form>
  );
}
