/**
 * Ferramentas de dados para o chat do Deppio.
 * Suporta modo demo (sem banco) e modo produção (Prisma).
 */
import { isDemoMode } from "./auth";
import {
  DEMO_PRODUCTS, DEMO_SUPPLIERS, DEMO_RECENT_SALES,
  DEMO_MOVEMENTS, DEMO_KPIS, DEMO_RELATORIO,
} from "./demo-data";

// ─── Leitura ────────────────────────────────────────────────────────────────

export async function getKPIs(orgId: string) {
  if (isDemoMode()) return DEMO_KPIS;
  const { prisma } = await import("./prisma");
  const [totalProducts, totalStock, todaySales] = await Promise.all([
    prisma.product.count({ where: { organizationId: orgId, isActive: true } }),
    prisma.product.aggregate({ where: { organizationId: orgId, isActive: true }, _sum: { currentStock: true } }),
    prisma.sale.count({ where: { organizationId: orgId, status: "COMPLETED", createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
  ]);
  const revenueMonth = await prisma.sale.aggregate({
    where: { organizationId: orgId, status: "COMPLETED", createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    _sum: { total: true },
  });
  return {
    totalProducts,
    totalStock: Number(totalStock._sum.currentStock ?? 0),
    salesToday: todaySales,
    revenueMonth: Number(revenueMonth._sum.total ?? 0),
  };
}

export async function getLowStockProducts(orgId: string) {
  if (isDemoMode()) {
    return DEMO_PRODUCTS.filter(p => p.currentStock < p.minStock).map(p => ({
      id: p.id, name: p.name, currentStock: p.currentStock, minStock: p.minStock,
      unit: p.unit, daysLeft: Math.floor(p.currentStock / Math.max(1, (p.minStock - p.currentStock) * 0.3)),
    }));
  }
  const { prisma } = await import("./prisma");
  return prisma.product.findMany({
    where: { organizationId: orgId, isActive: true, currentStock: { lt: prisma.product.fields.minStock } },
    select: { id: true, name: true, currentStock: true, minStock: true, unit: true },
    take: 10,
  });
}

export async function getProducts(orgId: string, search?: string) {
  if (isDemoMode()) {
    const products = search
      ? DEMO_PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
      : DEMO_PRODUCTS;
    return products.slice(0, 8);
  }
  const { prisma } = await import("./prisma");
  return prisma.product.findMany({
    where: {
      organizationId: orgId, isActive: true,
      ...(search && { OR: [{ name: { contains: search, mode: "insensitive" } }, { sku: { contains: search, mode: "insensitive" } }] }),
    },
    select: { id: true, name: true, sku: true, salePrice: true, currentStock: true, unit: true, category: { select: { name: true } } },
    orderBy: { name: "asc" },
    take: 8,
  });
}

export async function getRecentSales(orgId: string) {
  if (isDemoMode()) return DEMO_RECENT_SALES.slice(0, 5);
  const { prisma } = await import("./prisma");
  return prisma.sale.findMany({
    where: { organizationId: orgId, status: "COMPLETED" },
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export async function getSuppliers(orgId: string) {
  if (isDemoMode()) return DEMO_SUPPLIERS;
  const { prisma } = await import("./prisma");
  return prisma.supplier.findMany({
    where: { organizationId: orgId, isActive: true },
    select: { id: true, name: true, cnpj: true, phone: true, email: true, deliveryDays: true },
    orderBy: { name: "asc" },
  });
}

export async function getProfitability(orgId: string) {
  if (isDemoMode()) return DEMO_RELATORIO;
  return null; // produção: reutilizar lógica do route de relatórios
}

// ─── Escrita ────────────────────────────────────────────────────────────────

export interface ProductInput {
  name: string; sku: string; costPrice: number; salePrice: number;
  categoryName?: string; unit?: string; minStock?: number;
}

export async function createProduct(orgId: string, userId: string, data: ProductInput) {
  if (isDemoMode()) {
    const margin = ((data.salePrice - data.costPrice) / data.salePrice * 100).toFixed(1);
    return { id: "demo-" + Date.now(), ...data, currentStock: 0, isActive: true, margin: Number(margin), demo: true };
  }
  const { prisma } = await import("./prisma");
  const exists = await prisma.product.findFirst({ where: { organizationId: orgId, sku: data.sku } });
  if (exists) throw new Error(`SKU "${data.sku}" já existe`);
  return prisma.product.create({
    data: {
      organizationId: orgId, name: data.name, sku: data.sku,
      costPrice: data.costPrice, salePrice: data.salePrice,
      unit: data.unit || "un", minStock: data.minStock ?? 5, isActive: true,
    },
  });
}

export interface StockEntryInput {
  productId?: string; productName?: string; quantity: number; reason?: string;
}

export async function createStockEntry(orgId: string, userId: string, data: StockEntryInput) {
  if (isDemoMode()) {
    const product = DEMO_PRODUCTS.find(p =>
      p.id === data.productId ||
      p.name.toLowerCase().includes((data.productName || "").toLowerCase())
    );
    if (!product) throw new Error("Produto não encontrado");
    return { product: product.name, quantity: data.quantity, newStock: product.currentStock + data.quantity, demo: true };
  }
  const { prisma } = await import("./prisma");
  const product = await prisma.product.findFirst({
    where: { organizationId: orgId, ...(data.productId ? { id: data.productId } : { name: { contains: data.productName, mode: "insensitive" } }) },
  });
  if (!product) throw new Error("Produto não encontrado");
  const [movement] = await prisma.$transaction([
    prisma.stockMovement.create({
      data: { organizationId: orgId, productId: product.id, userId, type: "PURCHASE", quantity: data.quantity, reason: data.reason || "Entrada via chat" },
    }),
    prisma.product.update({ where: { id: product.id }, data: { currentStock: { increment: data.quantity } } }),
  ]);
  return { product: product.name, quantity: data.quantity, newStock: product.currentStock + data.quantity };
}
