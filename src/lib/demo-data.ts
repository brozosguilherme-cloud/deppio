/**
 * Dados mockados para modo demo (sem banco de dados configurado).
 * Exibidos automaticamente quando NEXT_PUBLIC_SUPABASE_URL contém "placeholder".
 */

const d = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString();

// ─── Categorias ────────────────────────────────────────────────────────────
export const DEMO_CATEGORIES = [
  { id: "cat-1", name: "Vestuário",   color: "#3B82F6", children: [] },
  { id: "cat-2", name: "Calçados",    color: "#F97316", children: [] },
  { id: "cat-3", name: "Acessórios",  color: "#8B5CF6", children: [] },
];

// ─── Fornecedores ──────────────────────────────────────────────────────────
export const DEMO_SUPPLIERS = [
  {
    id: "sup-1", name: "Distribuidora Moda Brasil Ltda",
    cnpj: "12.345.678/0001-90", contactName: "Carlos Mendes",
    phone: "(11) 99234-5678", email: "compras@modabrasil.com.br",
    website: "modabrasil.com.br", address: "Rua das Flores, 120 – São Paulo/SP",
    deliveryDays: 7, notes: "Prazo negociado para lotes acima de 50 unidades.",
    isActive: true, createdAt: d(120), updatedAt: d(5),
    _count: { products: 8, purchaseOrders: 4 },
  },
  {
    id: "sup-2", name: "Calçados Supremo SA",
    cnpj: "98.765.432/0001-10", contactName: "Ana Rodrigues",
    phone: "(21) 98765-4321", email: "pedidos@supremo.com.br",
    website: "supremocalcados.com.br", address: "Av. Brasil, 4500 – Rio de Janeiro/RJ",
    deliveryDays: 5, notes: null,
    isActive: true, createdAt: d(90), updatedAt: d(15),
    _count: { products: 2, purchaseOrders: 2 },
  },
];

// ─── Produtos ──────────────────────────────────────────────────────────────
export const DEMO_PRODUCTS = [
  { id: "p1",  sku: "CAM-001", name: "Camiseta Básica Branca",    unit: "un", costPrice: 29.90,  salePrice: 79.90,  currentStock: 45, minStock: 10, isActive: true, category: { id: "cat-1", name: "Vestuário",  color: "#3B82F6" }, supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" }, createdAt: d(60), updatedAt: d(2) },
  { id: "p2",  sku: "CAL-001", name: "Calça Jeans Slim Fit",      unit: "un", costPrice: 89.90,  salePrice: 199.90, currentStock: 32, minStock: 8,  isActive: true, category: { id: "cat-1", name: "Vestuário",  color: "#3B82F6" }, supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" }, createdAt: d(58), updatedAt: d(3) },
  { id: "p3",  sku: "TEN-001", name: "Tênis Urban Runner Preto",   unit: "par", costPrice: 148.00, salePrice: 349.90, currentStock: 18, minStock: 5,  isActive: true, category: { id: "cat-2", name: "Calçados",   color: "#F97316" }, supplier: { id: "sup-2", name: "Calçados Supremo SA" },            createdAt: d(55), updatedAt: d(1) },
  { id: "p4",  sku: "BON-001", name: "Boné Dad Hat Aba Curva",     unit: "un", costPrice: 22.00,  salePrice: 69.90,  currentStock: 67, minStock: 15, isActive: true, category: { id: "cat-3", name: "Acessórios", color: "#8B5CF6" }, supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" }, createdAt: d(50), updatedAt: d(4) },
  { id: "p5",  sku: "MOC-001", name: "Mochila Executiva 30L",      unit: "un", costPrice: 115.00, salePrice: 289.90, currentStock: 14, minStock: 5,  isActive: true, category: { id: "cat-3", name: "Acessórios", color: "#8B5CF6" }, supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" }, createdAt: d(48), updatedAt: d(6) },
  { id: "p6",  sku: "POL-001", name: "Polo Slim Masculina Azul",   unit: "un", costPrice: 42.00,  salePrice: 119.90, currentStock: 89, minStock: 20, isActive: true, category: { id: "cat-1", name: "Vestuário",  color: "#3B82F6" }, supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" }, createdAt: d(45), updatedAt: d(1) },
  { id: "p7",  sku: "OCI-001", name: "Óculos Wayfarer UV400",      unit: "un", costPrice: 44.00,  salePrice: 149.90, currentStock: 3,  minStock: 8,  isActive: true, category: { id: "cat-3", name: "Acessórios", color: "#8B5CF6" }, supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" }, createdAt: d(42), updatedAt: d(0) },
  { id: "p8",  sku: "BER-001", name: "Bermuda Cargo Premium",      unit: "un", costPrice: 55.00,  salePrice: 149.90, currentStock: 41, minStock: 10, isActive: true, category: { id: "cat-1", name: "Vestuário",  color: "#3B82F6" }, supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" }, createdAt: d(40), updatedAt: d(2) },
  { id: "p9",  sku: "JAC-001", name: "Jaqueta Corta-Vento",        unit: "un", costPrice: 138.00, salePrice: 319.90, currentStock: 2,  minStock: 6,  isActive: true, category: { id: "cat-1", name: "Vestuário",  color: "#3B82F6" }, supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" }, createdAt: d(38), updatedAt: d(0) },
  { id: "p10", sku: "SAN-001", name: "Sandália Rasteira Couro",    unit: "par", costPrice: 77.00,  salePrice: 199.90, currentStock: 26, minStock: 6,  isActive: true, category: { id: "cat-2", name: "Calçados",   color: "#F97316" }, supplier: { id: "sup-2", name: "Calçados Supremo SA" },            createdAt: d(35), updatedAt: d(3) },
];

// ─── Clientes ──────────────────────────────────────────────────────────────
const DEMO_CUSTOMERS = [
  { id: "cli-1", name: "João Silva",     cpf: "123.456.789-00", phone: "(11) 98888-1111", email: "joao@email.com" },
  { id: "cli-2", name: "Maria Souza",    cpf: "987.654.321-00", phone: "(11) 97777-2222", email: "maria@email.com" },
  { id: "cli-3", name: "Carlos Pereira", cpf: "456.789.123-00", phone: "(21) 96666-3333", email: "carlos@email.com" },
];

// ─── Últimas vendas ────────────────────────────────────────────────────────
export const DEMO_RECENT_SALES = [
  { id: "sale-1", total: 249.80, paymentMethod: "CREDIT_CARD", status: "COMPLETED", subtotal: 249.80, discount: 0, createdAt: d(0),  user: { name: "Demo" }, customer: DEMO_CUSTOMERS[0], items: [{ product: { name: "Camiseta Básica Branca", unit: "un" }, quantity: 2, unitPrice: 79.90, unitCost: 29.90, subtotal: 159.80 }, { product: { name: "Boné Dad Hat Aba Curva", unit: "un" }, quantity: 1, unitPrice: 69.90, unitCost: 22.00, subtotal: 69.90 }] },
  { id: "sale-2", total: 349.90, paymentMethod: "PIX",         status: "COMPLETED", subtotal: 349.90, discount: 0, createdAt: d(0),  user: { name: "Demo" }, customer: null,              items: [{ product: { name: "Tênis Urban Runner Preto", unit: "par" }, quantity: 1, unitPrice: 349.90, unitCost: 148.00, subtotal: 349.90 }] },
  { id: "sale-3", total: 369.80, paymentMethod: "CREDIT_CARD", status: "COMPLETED", subtotal: 399.80, discount: 30, createdAt: d(1),  user: { name: "Demo" }, customer: DEMO_CUSTOMERS[1], items: [{ product: { name: "Polo Slim Masculina Azul", unit: "un" }, quantity: 2, unitPrice: 119.90, unitCost: 42.00, subtotal: 239.80 }, { product: { name: "Bermuda Cargo Premium", unit: "un" }, quantity: 1, unitPrice: 149.90, unitCost: 55.00, subtotal: 149.90 }] },
  { id: "sale-4", total: 289.90, paymentMethod: "DEBIT_CARD",  status: "COMPLETED", subtotal: 289.90, discount: 0, createdAt: d(1),  user: { name: "Demo" }, customer: DEMO_CUSTOMERS[2], items: [{ product: { name: "Mochila Executiva 30L", unit: "un" }, quantity: 1, unitPrice: 289.90, unitCost: 115.00, subtotal: 289.90 }] },
  { id: "sale-5", total: 199.90, paymentMethod: "CASH",        status: "COMPLETED", subtotal: 199.90, discount: 0, createdAt: d(2),  user: { name: "Demo" }, customer: null,              items: [{ product: { name: "Sandália Rasteira Couro", unit: "par" }, quantity: 1, unitPrice: 199.90, unitCost: 77.00, subtotal: 199.90 }] },
];

// ─── Movimentações de estoque ──────────────────────────────────────────────
export const DEMO_MOVEMENTS = [
  { id: "mov-01", type: "PURCHASE",   quantity:  60, unitCost: 29.90, reason: "Reposição de estoque",    createdAt: d(28), product: { id: "p1",  name: "Camiseta Básica Branca",  sku: "CAM-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-02", type: "PURCHASE",   quantity:  20, unitCost: 148.00, reason: "Pedido de compra #003", createdAt: d(25), product: { id: "p3",  name: "Tênis Urban Runner Preto", sku: "TEN-001", unit: "par" }, user: { name: "Demo" }, location: null },
  { id: "mov-03", type: "SALE",       quantity: -4,  unitCost: null,  reason: null,                      createdAt: d(22), product: { id: "p2",  name: "Calça Jeans Slim Fit",    sku: "CAL-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-04", type: "PURCHASE",   quantity:  80, unitCost: 22.00, reason: "Pedido de compra #004",   createdAt: d(20), product: { id: "p4",  name: "Boné Dad Hat Aba Curva",  sku: "BON-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-05", type: "SALE",       quantity: -3,  unitCost: null,  reason: null,                      createdAt: d(18), product: { id: "p3",  name: "Tênis Urban Runner Preto", sku: "TEN-001", unit: "par" }, user: { name: "Demo" }, location: null },
  { id: "mov-06", type: "SALE",       quantity: -12, unitCost: null,  reason: null,                      createdAt: d(15), product: { id: "p1",  name: "Camiseta Básica Branca",  sku: "CAM-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-07", type: "ADJUSTMENT", quantity:  5,  unitCost: 42.00, reason: "Acerto de inventário",    createdAt: d(14), product: { id: "p6",  name: "Polo Slim Masculina Azul", sku: "POL-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-08", type: "SALE",       quantity: -7,  unitCost: null,  reason: null,                      createdAt: d(12), product: { id: "p6",  name: "Polo Slim Masculina Azul", sku: "POL-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-09", type: "LOSS",       quantity: -2,  unitCost: null,  reason: "Produto danificado",       createdAt: d(10), product: { id: "p7",  name: "Óculos Wayfarer UV400",   sku: "OCI-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-10", type: "SALE",       quantity: -1,  unitCost: null,  reason: null,                      createdAt: d(8),  product: { id: "p9",  name: "Jaqueta Corta-Vento",     sku: "JAC-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-11", type: "SALE",       quantity: -5,  unitCost: null,  reason: null,                      createdAt: d(6),  product: { id: "p8",  name: "Bermuda Cargo Premium",   sku: "BER-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-12", type: "PURCHASE",   quantity:  15, unitCost: 115.00, reason: "Reposição urgente",      createdAt: d(5),  product: { id: "p5",  name: "Mochila Executiva 30L",   sku: "MOC-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-13", type: "SALE",       quantity: -2,  unitCost: null,  reason: null,                      createdAt: d(3),  product: { id: "p5",  name: "Mochila Executiva 30L",   sku: "MOC-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-14", type: "SALE",       quantity: -4,  unitCost: null,  reason: null,                      createdAt: d(2),  product: { id: "p10", name: "Sandália Rasteira Couro", sku: "SAN-001", unit: "par" }, user: { name: "Demo" }, location: null },
  { id: "mov-15", type: "SALE",       quantity: -1,  unitCost: null,  reason: null,                      createdAt: d(1),  product: { id: "p3",  name: "Tênis Urban Runner Preto", sku: "TEN-001", unit: "par" }, user: { name: "Demo" }, location: null },
  { id: "mov-16", type: "SALE",       quantity: -2,  unitCost: null,  reason: null,                      createdAt: d(0),  product: { id: "p1",  name: "Camiseta Básica Branca",  sku: "CAM-001", unit: "un"  }, user: { name: "Demo" }, location: null },
  { id: "mov-17", type: "SALE",       quantity: -1,  unitCost: null,  reason: null,                      createdAt: d(0),  product: { id: "p4",  name: "Boné Dad Hat Aba Curva",  sku: "BON-001", unit: "un"  }, user: { name: "Demo" }, location: null },
];

// ─── Pedidos de compra ─────────────────────────────────────────────────────
export const DEMO_PURCHASE_ORDERS = [
  {
    id: "po-1", status: "RECEIVED", total: 4770.00, notes: "Entrega na portaria principal.",
    createdAt: d(28), updatedAt: d(22), expectedDate: d(21),
    supplier: { name: "Distribuidora Moda Brasil Ltda" },
    items: [
      { id: "poi-1", quantity: 60, unitCost: 29.90, subtotal: 1794.00, receivedQuantity: 60, product: { name: "Camiseta Básica Branca", unit: "un" } },
      { id: "poi-2", quantity: 80, unitCost: 22.00, subtotal: 1760.00, receivedQuantity: 80, product: { name: "Boné Dad Hat Aba Curva",  unit: "un" } },
      { id: "poi-3", quantity: 10, unitCost: 42.00, subtotal: 420.00,  receivedQuantity: 10, product: { name: "Polo Slim Masculina Azul", unit: "un" } },
      { id: "poi-4", quantity: 4,  unitCost: 149.90, subtotal: 599.60, receivedQuantity: 4,  product: { name: "Mochila Executiva 30L",   unit: "un" } },
    ],
  },
  {
    id: "po-2", status: "ORDERED", total: 2960.00, notes: null,
    createdAt: d(5), updatedAt: d(5), expectedDate: d(-7),
    supplier: { name: "Calçados Supremo SA" },
    items: [
      { id: "poi-5", quantity: 10, unitCost: 148.00, subtotal: 1480.00, receivedQuantity: 0, product: { name: "Tênis Urban Runner Preto", unit: "par" } },
      { id: "poi-6", quantity: 20, unitCost: 74.00,  subtotal: 1480.00, receivedQuantity: 0, product: { name: "Sandália Rasteira Couro", unit: "par" } },
    ],
  },
  {
    id: "po-3", status: "DRAFT", total: 1610.00, notes: "Aguardando aprovação gerencial.",
    createdAt: d(1), updatedAt: d(1), expectedDate: d(-14),
    supplier: { name: "Distribuidora Moda Brasil Ltda" },
    items: [
      { id: "poi-7", quantity: 15, unitCost: 44.00,  subtotal: 660.00,  receivedQuantity: 0, product: { name: "Óculos Wayfarer UV400",    unit: "un" } },
      { id: "poi-8", quantity: 7,  unitCost: 138.00, subtotal: 966.00,  receivedQuantity: 0, product: { name: "Jaqueta Corta-Vento",     unit: "un" } },
      { id: "poi-9", quantity: 14, unitCost: -1,     subtotal: 0,       receivedQuantity: 0, product: { name: "Bermuda Cargo Premium",   unit: "un" } },
    ],
  },
];

// ─── Matérias-primas ───────────────────────────────────────────────────────
export const DEMO_RAW_MATERIALS = [
  {
    id: "rm-1", name: "Tecido Algodão 180g", description: "Malha 100% algodão, 180g/m²",
    unit: "m²", currentStock: 120.5, minStock: 30, costPerUnit: 18.50,
    supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" },
    supplierId: "sup-1", isActive: true, notes: "Largura padrão 1,60m",
    createdAt: d(90), updatedAt: d(3),
  },
  {
    id: "rm-2", name: "Linha de Costura (Poliéster)", description: "Linha 120/2 resistente",
    unit: "m", currentStock: 4800, minStock: 500, costPerUnit: 0.02,
    supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" },
    supplierId: "sup-1", isActive: true, notes: null,
    createdAt: d(85), updatedAt: d(5),
  },
  {
    id: "rm-3", name: "Couro Sintético Premium", description: "Couro PU espessura 1.2mm",
    unit: "dm²", currentStock: 340, minStock: 80, costPerUnit: 2.20,
    supplier: { id: "sup-2", name: "Calçados Supremo SA" },
    supplierId: "sup-2", isActive: true, notes: "Largura 1,40m",
    createdAt: d(80), updatedAt: d(8),
  },
  {
    id: "rm-4", name: "Solado de Borracha", description: "Solado injetado antiderrapante",
    unit: "par", currentStock: 24, minStock: 20, costPerUnit: 12.00,
    supplier: { id: "sup-2", name: "Calçados Supremo SA" },
    supplierId: "sup-2", isActive: true, notes: "Disponível nos tamanhos 35-44",
    createdAt: d(75), updatedAt: d(2),
  },
  {
    id: "rm-5", name: "Espuma D23", description: "Espuma de poliuretano D23 para bolsas",
    unit: "kg", currentStock: 8.2, minStock: 5, costPerUnit: 22.00,
    supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" },
    supplierId: "sup-1", isActive: true, notes: null,
    createdAt: d(70), updatedAt: d(10),
  },
  {
    id: "rm-6", name: "Zíper YKK 20cm", description: "Zíper de nylon resistente YKK",
    unit: "un", currentStock: 150, minStock: 50, costPerUnit: 1.80,
    supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" },
    supplierId: "sup-1", isActive: true, notes: null,
    createdAt: d(60), updatedAt: d(7),
  },
  {
    id: "rm-7", name: "Tinta Corante Têxtil", description: "Corante reativo para algodão",
    unit: "g", currentStock: 420, minStock: 200, costPerUnit: 0.08,
    supplier: { id: "sup-1", name: "Distribuidora Moda Brasil Ltda" },
    supplierId: "sup-1", isActive: true, notes: "Disponível em 12 cores",
    createdAt: d(55), updatedAt: d(4),
  },
];

// ─── BOM — Ficha Técnica dos Produtos ──────────────────────────────────────
// Quantidade de matéria-prima por 1 unidade do produto
export const DEMO_BOM: Record<string, Array<{ rawMaterialId: string; rawMaterial: { id: string; name: string; unit: string }; quantity: number }>> = {
  "p1": [ // Camiseta Básica Branca
    { rawMaterialId: "rm-1", rawMaterial: { id: "rm-1", name: "Tecido Algodão 180g", unit: "m²" },   quantity: 0.6  },
    { rawMaterialId: "rm-2", rawMaterial: { id: "rm-2", name: "Linha de Costura (Poliéster)", unit: "m" }, quantity: 80 },
    { rawMaterialId: "rm-7", rawMaterial: { id: "rm-7", name: "Tinta Corante Têxtil", unit: "g" },   quantity: 5   },
  ],
  "p6": [ // Polo Slim Masculina Azul
    { rawMaterialId: "rm-1", rawMaterial: { id: "rm-1", name: "Tecido Algodão 180g", unit: "m²" },   quantity: 0.7  },
    { rawMaterialId: "rm-2", rawMaterial: { id: "rm-2", name: "Linha de Costura (Poliéster)", unit: "m" }, quantity: 90 },
    { rawMaterialId: "rm-7", rawMaterial: { id: "rm-7", name: "Tinta Corante Têxtil", unit: "g" },   quantity: 8   },
  ],
  "p3": [ // Tênis Urban Runner Preto
    { rawMaterialId: "rm-3", rawMaterial: { id: "rm-3", name: "Couro Sintético Premium", unit: "dm²" }, quantity: 18 },
    { rawMaterialId: "rm-4", rawMaterial: { id: "rm-4", name: "Solado de Borracha", unit: "par" },    quantity: 1  },
    { rawMaterialId: "rm-2", rawMaterial: { id: "rm-2", name: "Linha de Costura (Poliéster)", unit: "m" }, quantity: 30 },
  ],
  "p5": [ // Mochila Executiva 30L
    { rawMaterialId: "rm-3", rawMaterial: { id: "rm-3", name: "Couro Sintético Premium", unit: "dm²" }, quantity: 25 },
    { rawMaterialId: "rm-5", rawMaterial: { id: "rm-5", name: "Espuma D23", unit: "kg" },             quantity: 0.2 },
    { rawMaterialId: "rm-6", rawMaterial: { id: "rm-6", name: "Zíper YKK 20cm", unit: "un" },         quantity: 3  },
    { rawMaterialId: "rm-2", rawMaterial: { id: "rm-2", name: "Linha de Costura (Poliéster)", unit: "m" }, quantity: 50 },
  ],
};

// ─── Movimentações de matéria-prima ────────────────────────────────────────
export const DEMO_RAW_MOVEMENTS = [
  { id: "rmov-1", type: "IN",  quantity: 200,    note: "Compra lote inicial",   createdAt: d(90), rawMaterial: { id: "rm-1", name: "Tecido Algodão 180g", unit: "m²" } },
  { id: "rmov-2", type: "IN",  quantity: 8000,   note: "Compra 8 bobinas",       createdAt: d(85), rawMaterial: { id: "rm-2", name: "Linha de Costura (Poliéster)", unit: "m" } },
  { id: "rmov-3", type: "OUT", quantity: -30,    note: "Produção 50 camisetas",  createdAt: d(60), rawMaterial: { id: "rm-1", name: "Tecido Algodão 180g", unit: "m²" } },
  { id: "rmov-4", type: "IN",  quantity: 500,    note: "Compra couro PU",        createdAt: d(55), rawMaterial: { id: "rm-3", name: "Couro Sintético Premium", unit: "dm²" } },
  { id: "rmov-5", type: "OUT", quantity: -450,   note: "Produção 18 tênis + 6 mochilas", createdAt: d(40), rawMaterial: { id: "rm-3", name: "Couro Sintético Premium", unit: "dm²" } },
  { id: "rmov-6", type: "IN",  quantity: 50,     note: "Reposição solados",      createdAt: d(35), rawMaterial: { id: "rm-4", name: "Solado de Borracha", unit: "par" } },
  { id: "rmov-7", type: "OUT", quantity: -26,    note: "Produção 26 pares tênis",createdAt: d(20), rawMaterial: { id: "rm-4", name: "Solado de Borracha", unit: "par" } },
  { id: "rmov-8", type: "OUT", quantity: -49.5,  note: "Produção 55 camisetas e polos", createdAt: d(15), rawMaterial: { id: "rm-1", name: "Tecido Algodão 180g", unit: "m²" } },
  { id: "rmov-9", type: "IN",  quantity: 600,    note: "Reposição corante",      createdAt: d(10), rawMaterial: { id: "rm-7", name: "Tinta Corante Têxtil", unit: "g" } },
  { id: "rmov-10",type: "OUT", quantity: -180,   note: "Produção lote polos",    createdAt: d(5),  rawMaterial: { id: "rm-7", name: "Tinta Corante Têxtil", unit: "g" } },
];

// ─── Gráfico de movimentações (30 dias) ────────────────────────────────────
const chartBase = [
  [0,48],[12,35],[0,42],[28,67],[45,80],[0,55],[0,60],
  [0,38],[0,44],[0,51],[120,72],[0,66],[0,48],[0,39],
  [0,55],[0,43],[85,68],[0,57],[0,62],[0,44],[0,38],
  [0,49],[0,71],[75,82],[0,63],[0,57],[100,74],[0,61],[0,53],[0,45],
];

const buildDate = (i: number) => {
  const dt = new Date(Date.now() - (29 - i) * 86_400_000);
  return `${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")}`;
};

export const DEMO_MOVEMENTS_CHART = chartBase.map(([entradas, saidas], i) => ({
  date: buildDate(i), entradas, saidas,
}));

// ─── KPIs do dashboard ─────────────────────────────────────────────────────
export const DEMO_KPIS = {
  totalProducts: 47,
  totalStock: 1240,
  salesToday: 8,
  revenueMonth: 15840.50,
  lowStockProducts: [
    { productId: "p7",  productName: "Óculos Wayfarer UV400", currentStock: 3,  minStock: 8, avgDailyConsumption: 0.8, daysRemaining: 4 },
    { productId: "p9",  productName: "Jaqueta Corta-Vento",   currentStock: 2,  minStock: 6, avgDailyConsumption: 0.4, daysRemaining: 5 },
    { productId: "p5",  productName: "Mochila Executiva 30L", currentStock: 14, minStock: 5, avgDailyConsumption: 0.5, daysRemaining: 28 },
  ],
  movementsChart: DEMO_MOVEMENTS_CHART,
  recentSales: DEMO_RECENT_SALES,
};

// ─── Faturamento ────────────────────────────────────────────────────────────
export const DEMO_FATURAMENTO = {
  totalRevenue: 15840.50,
  totalCost:    6920.30,
  grossMargin:  8920.20,
  grossMarginPct: 56.3,
  totalSales:   87,
  avgTicket:    182.07,
  revenueByDay: chartBase.map(([, saidas], i) => ({
    date: buildDate(i),
    receita: Math.round(saidas * 4.2 * 100) / 100,
    custo:   Math.round(saidas * 1.8 * 100) / 100,
    margem:  Math.round(saidas * 2.4 * 100) / 100,
  })),
  topProducts: [
    { productId: "p2", name: "Calça Jeans Slim Fit",      totalRevenue: 3598.20, totalQuantity: 18 },
    { productId: "p3", name: "Tênis Urban Runner Preto",  totalRevenue: 3149.10, totalQuantity: 9  },
    { productId: "p9", name: "Jaqueta Corta-Vento",       totalRevenue: 2559.20, totalQuantity: 8  },
    { productId: "p5", name: "Mochila Executiva 30L",     totalRevenue: 2319.20, totalQuantity: 8  },
    { productId: "p6", name: "Polo Slim Masculina Azul",  totalRevenue: 1918.40, totalQuantity: 16 },
    { productId: "p1", name: "Camiseta Básica Branca",    totalRevenue: 1438.20, totalQuantity: 18 },
    { productId: "p8", name: "Bermuda Cargo Premium",     totalRevenue: 1199.20, totalQuantity: 8  },
    { productId: "p10",name: "Sandália Rasteira Couro",   totalRevenue: 1199.40, totalQuantity: 6  },
    { productId: "p7", name: "Óculos Wayfarer UV400",     totalRevenue: 1199.20, totalQuantity: 8  },
    { productId: "p4", name: "Boné Dad Hat Aba Curva",    totalRevenue:  699.00, totalQuantity: 10 },
  ],
  byPayment: [
    { method: "CREDIT_CARD", total: 7128.22, count: 38 },
    { method: "PIX",         total: 5544.17, count: 31 },
    { method: "DEBIT_CARD",  total: 1900.80, count: 11 },
    { method: "CASH",        total: 1267.31, count: 7  },
  ],
};

// ─── Relatório de lucratividade ────────────────────────────────────────────
const DEMO_PRODUCT_REPORT = [
  { productId:"p2",  productName:"Calça Jeans Slim Fit",      sku:"CAL-001", category:"Vestuário",  costPrice:89.90,  salePrice:199.90, currentStock:32, totalQuantitySold:18, totalRevenue:3598.20, totalCost:1618.20, grossProfit:1980.00, margin:55.0 },
  { productId:"p3",  productName:"Tênis Urban Runner Preto",  sku:"TEN-001", category:"Calçados",   costPrice:148.00, salePrice:349.90, currentStock:18, totalQuantitySold:9,  totalRevenue:3149.10, totalCost:1332.00, grossProfit:1817.10, margin:57.7 },
  { productId:"p9",  productName:"Jaqueta Corta-Vento",       sku:"JAC-001", category:"Vestuário",  costPrice:138.00, salePrice:319.90, currentStock:2,  totalQuantitySold:8,  totalRevenue:2559.20, totalCost:1104.00, grossProfit:1455.20, margin:56.9 },
  { productId:"p5",  productName:"Mochila Executiva 30L",     sku:"MOC-001", category:"Acessórios", costPrice:115.00, salePrice:289.90, currentStock:14, totalQuantitySold:8,  totalRevenue:2319.20, totalCost:920.00,  grossProfit:1399.20, margin:60.3 },
  { productId:"p6",  productName:"Polo Slim Masculina Azul",  sku:"POL-001", category:"Vestuário",  costPrice:42.00,  salePrice:119.90, currentStock:89, totalQuantitySold:16, totalRevenue:1918.40, totalCost:672.00,  grossProfit:1246.40, margin:65.0 },
  { productId:"p8",  productName:"Bermuda Cargo Premium",     sku:"BER-001", category:"Vestuário",  costPrice:55.00,  salePrice:149.90, currentStock:41, totalQuantitySold:8,  totalRevenue:1199.20, totalCost:440.00,  grossProfit:759.20,  margin:63.3 },
  { productId:"p10", productName:"Sandália Rasteira Couro",   sku:"SAN-001", category:"Calçados",   costPrice:77.00,  salePrice:199.90, currentStock:26, totalQuantitySold:6,  totalRevenue:1199.40, totalCost:462.00,  grossProfit:737.40,  margin:61.5 },
  { productId:"p7",  productName:"Óculos Wayfarer UV400",     sku:"OCI-001", category:"Acessórios", costPrice:44.00,  salePrice:149.90, currentStock:3,  totalQuantitySold:8,  totalRevenue:1199.20, totalCost:352.00,  grossProfit:847.20,  margin:70.6 },
  { productId:"p1",  productName:"Camiseta Básica Branca",    sku:"CAM-001", category:"Vestuário",  costPrice:29.90,  salePrice:79.90,  currentStock:45, totalQuantitySold:18, totalRevenue:1438.20, totalCost:538.20,  grossProfit:900.00,  margin:62.6 },
  { productId:"p4",  productName:"Boné Dad Hat Aba Curva",    sku:"BON-001", category:"Acessórios", costPrice:22.00,  salePrice:69.90,  currentStock:67, totalQuantitySold:10, totalRevenue:699.00,  totalCost:220.00,  grossProfit:479.00,  margin:68.5 },
];

export const DEMO_RELATORIO = {
  products: DEMO_PRODUCT_REPORT,
  categories: [
    { name:"Vestuário",  totalRevenue:10713.20, totalCost:4372.40, grossProfit:6340.80, margin:59.2, totalQuantity:68 },
    { name:"Calçados",   totalRevenue:4348.50,  totalCost:1794.00, grossProfit:2554.50, margin:58.7, totalQuantity:15 },
    { name:"Acessórios", totalRevenue:4217.40,  totalCost:1492.00, grossProfit:2725.40, margin:64.6, totalQuantity:26 },
  ],
  lowMarginProducts: [],
  summary: {
    totalRevenue: 15840.50,
    totalCost:    6920.30,
    avgMargin:    62.1,
  },
};
