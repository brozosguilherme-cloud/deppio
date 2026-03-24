"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Product } from "@/types";

const schema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  type: z.enum([
    "PURCHASE", "PRODUCTION", "RETURN", "ADJUSTMENT", "INVENTORY",
    "SALE", "LOSS", "TRANSFER",
  ]),
  quantity: z.coerce.number().min(1, "Quantidade deve ser maior que zero"),
  unitCost: z.coerce.number().optional(),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const ENTRY_TYPES = [
  { value: "PURCHASE",   label: "Compra / Entrada de fornecedor" },
  { value: "PRODUCTION", label: "Produção interna (consome matérias-primas)" },
  { value: "RETURN",     label: "Devolução de cliente" },
  { value: "ADJUSTMENT", label: "Ajuste manual" },
  { value: "INVENTORY",  label: "Inventário / Contagem" },
];

const EXIT_TYPES = [
  { value: "LOSS", label: "Perda / Avaria" },
  { value: "TRANSFER", label: "Transferência" },
  { value: "ADJUSTMENT", label: "Ajuste manual" },
];

interface MovementModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "entry" | "exit";
  preselectedProductId?: string;
}

export function MovementModal({
  open,
  onClose,
  onSuccess,
  mode,
  preselectedProductId,
}: MovementModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const types = mode === "entry" ? ENTRY_TYPES : EXIT_TYPES;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: preselectedProductId ?? "",
      type: types[0].value as FormData["type"],
    },
  });

  // Busca produtos ao abrir
  useEffect(() => {
    if (open) {
      fetch("/api/products?status=active&limit=100")
        .then((r) => r.json())
        .then((data) => setProducts(data.products ?? []))
        .catch(() => {});
    }
  }, [open]);

  // Filtra produtos pelo termo de busca
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Erro ao registrar movimentação");
        return;
      }

      toast.success(
        mode === "entry" ? "Entrada registrada!" : "Saída registrada!"
      );
      reset();
      onSuccess();
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "entry" ? "Registrar entrada" : "Registrar saída"}
      description={
        mode === "entry"
          ? "Adicione unidades ao estoque"
          : "Remova unidades do estoque"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tipo de movimentação */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Tipo de movimentação *
          </label>
          <select
            className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register("type")}
          >
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Produto */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Produto *
          </label>
          <input
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
          />
          <select
            className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register("productId")}
            size={Math.min(5, filteredProducts.length + 1)}
          >
            <option value="">Selecione um produto</option>
            {filteredProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — Estoque: {p.currentStock} {p.unit}
              </option>
            ))}
          </select>
          {errors.productId && (
            <p className="mt-1 text-xs text-red-600">{errors.productId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Quantidade */}
          <Input
            label="Quantidade *"
            type="number"
            min="1"
            error={errors.quantity?.message}
            {...register("quantity")}
          />

          {/* Custo unitário (apenas entradas) */}
          {mode === "entry" && (
            <Input
              label="Custo unitário (R$)"
              type="number"
              step="0.01"
              min="0"
              hint="Opcional"
              {...register("unitCost")}
            />
          )}
        </div>

        {/* Número de referência (NF, etc.) */}
        <Input
          label={mode === "entry" ? "Nota fiscal / Referência" : "Referência"}
          placeholder="Opcional"
          {...register("reference")}
        />

        {/* Motivo/observação */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Motivo / Observação
          </label>
          <textarea
            rows={2}
            placeholder="Opcional..."
            className="w-full border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            {...register("reason")}
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={mode === "exit" ? "danger" : "primary"}
            loading={isLoading}
          >
            {mode === "entry" ? "Registrar entrada" : "Registrar saída"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
