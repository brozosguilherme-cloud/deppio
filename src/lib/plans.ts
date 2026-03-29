export type Plan = "ESSENCIAL" | "PRO";

export const PLANS = {
  ESSENCIAL: {
    label: "Essencial",
    price: 49,
    color: "blue" as const,
    description: "Para pequenos negócios que precisam do essencial",
    features: {
      products: true,
      stock: true,
      pdv: true,
      sales: true,
      suppliers: true,
      billing: true,
      rawMaterials: false,
      advancedReports: false,
    },
    highlights: [
      "Produtos, estoque e PDV",
      "Controle de vendas",
      "Fornecedores",
      "Faturamento básico",
      "Relatórios essenciais",
    ],
  },
  PRO: {
    label: "Pro",
    price: 99,
    color: "yellow" as const,
    description: "Para negócios que precisam de controle total",
    features: {
      products: true,
      stock: true,
      pdv: true,
      sales: true,
      suppliers: true,
      billing: true,
      rawMaterials: true,
      advancedReports: true,
    },
    highlights: [
      "Tudo do plano Essencial",
      "Matérias-primas e BOM",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
} as const;

export type PlanFeature = keyof typeof PLANS.PRO.features;

export function canAccess(plan: Plan, feature: PlanFeature): boolean {
  return !!PLANS[plan]?.features[feature];
}

export function getPlanLabel(plan: Plan): string {
  return PLANS[plan]?.label ?? plan;
}

export const PRO_FEATURES: { feature: PlanFeature; label: string }[] = [
  { feature: "rawMaterials", label: "Matérias-primas e BOM" },
  { feature: "advancedReports", label: "Relatórios avançados" },
];
