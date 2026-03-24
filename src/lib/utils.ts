import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina classes Tailwind sem conflitos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata valor como moeda BRL */
export function formatCurrency(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

/** Formata data em pt-BR */
export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/** Formata data com hora em pt-BR */
export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Calcula margem bruta em percentual */
export function calcMargin(costPrice: number, salePrice: number): number {
  if (salePrice === 0) return 0;
  return ((salePrice - costPrice) / salePrice) * 100;
}

/** Retorna label de forma de pagamento */
export function paymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    CASH: "Dinheiro",
    CREDIT_CARD: "Cartão de Crédito",
    DEBIT_CARD: "Cartão de Débito",
    PIX: "PIX",
    INSTALLMENT: "Crediário",
    OTHER: "Outro",
  };
  return labels[method] ?? method;
}

/** Retorna label de tipo de movimentação */
export function movementTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PURCHASE: "Compra",
    PRODUCTION: "Produção",
    RETURN: "Devolução",
    ADJUSTMENT: "Ajuste Manual",
    INVENTORY: "Inventário",
    SALE: "Venda",
    LOSS: "Perda/Avaria",
    TRANSFER: "Transferência",
    REVERSAL: "Estorno",
  };
  return labels[type] ?? type;
}

/** Gera SKU automático baseado no nome */
export function generateSku(name: string): string {
  return name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8)
    .padEnd(4, "0")
    .concat("-", Math.random().toString(36).slice(2, 6).toUpperCase());
}

/** Trunca texto */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "…";
}

/** Retorna cor para badge de estoque */
export function stockStatusColor(
  current: number,
  minimum: number
): "red" | "yellow" | "green" {
  if (current <= 0) return "red";
  if (current <= minimum) return "yellow";
  return "green";
}
