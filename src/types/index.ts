// Tipos centrais da aplicação

export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";

export type MovementType =
  | "PURCHASE"
  | "RETURN"
  | "ADJUSTMENT"
  | "INVENTORY"
  | "SALE"
  | "LOSS"
  | "TRANSFER"
  | "REVERSAL";

export type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PIX"
  | "INSTALLMENT"
  | "OTHER";

export type SaleStatus = "COMPLETED" | "CANCELLED";

export type PurchaseOrderStatus =
  | "DRAFT"
  | "SENT"
  | "RECEIVED"
  | "CANCELLED";

// ─── Entidades principais (subset dos campos Prisma para uso no frontend) ────

export interface Organization {
  id: string;
  name: string;
  cnpj?: string | null;
  logoUrl?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  organization: Organization;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  color?: string | null;
  parent?: Category | null;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj?: string | null;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  deliveryDays?: number | null;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  ean?: string | null;
  description?: string | null;
  categoryId?: string | null;
  supplierId?: string | null;
  unit: string;
  costPrice: number;
  salePrice: number;
  minStock: number;
  currentStock: number;
  imageUrl?: string | null;
  isActive: boolean;
  category?: Category | null;
  supplier?: Supplier | null;
}

export interface StockMovement {
  id: string;
  productId: string;
  userId: string;
  locationId?: string | null;
  type: MovementType;
  quantity: number;
  unitCost?: number | null;
  reason?: string | null;
  reference?: string | null;
  createdAt: string;
  product: Product;
  user: { name: string };
  location?: { name: string } | null;
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  subtotal: number;
  product: Product;
}

export interface Sale {
  id: string;
  status: SaleStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string | null;
  createdAt: string;
  user: { name: string };
  customer?: { name: string } | null;
  items: SaleItem[];
}

export interface Customer {
  id: string;
  name: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  product: Product;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: PurchaseOrderStatus;
  expectedDate?: string | null;
  notes?: string | null;
  total: number;
  createdAt: string;
  supplier: Supplier;
  items: PurchaseOrderItem[];
}

// ─── Tipos para o Dashboard ───────────────────────────────────────────────────

export interface DashboardKPIs {
  totalProducts: number;
  totalStock: number;
  salesToday: number;
  revenueMonth: number;
  lowStockProducts: LowStockAlert[];
  movementsChart: ChartDataPoint[];
  recentSales: Sale[];
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  daysRemaining: number | null; // estimativa de dias restantes
  avgDailyConsumption: number;
}

export interface ChartDataPoint {
  date: string;
  entradas: number;
  saidas: number;
}

// ─── Tipos para formulários ───────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}
