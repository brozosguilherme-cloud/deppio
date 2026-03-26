/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Motor de chat do Deppio — MVP sem custo de API.
 * Detecta intenções em português e gera respostas estruturadas.
 */
import { getKPIs, getLowStockProducts, getProducts, getRecentSales, getSuppliers, getProfitability, createProduct, createStockEntry, ProductInput } from "./chat-tools";

export interface ChatCard {
  type: "kpi" | "product-list" | "sale-list" | "supplier-list" | "profit-list" | "success" | "error" | "alert-list";
  data: unknown;
}

export interface ChatResponse {
  message: string;
  cards?: ChatCard[];
  followUps?: string[];
}

// ─── Utilitários de parsing ─────────────────────────────────────────────────

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function extractMoney(text: string): number | null {
  const match = text.match(/r\$\s*([\d.,]+)|(\d+[,.]?\d*)\s*(?:reais|real)/i);
  if (!match) return null;
  const raw = (match[1] || match[2]).replace(",", ".");
  return parseFloat(raw);
}

function extractNumber(text: string): number | null {
  const match = text.match(/\b(\d+)\s*(?:un|unid|peça|pcs|item|itens)?/i);
  return match ? parseInt(match[1]) : null;
}

function extractProductName(text: string): string | undefined {
  const patterns = [
    /(?:produto|item|chamado|chamo|nome)\s+([A-Za-zÀ-ú\s\d\-]+?)(?:\s*,|\s+custo|\s+venda|\s+sku|\s+r\$|$)/i,
    /entrada\s+(?:de\s+\d+\s+(?:unidades?\s+)?de\s+)?([A-Za-zÀ-ú\s\d\-]+?)(?:\s*,|$)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1] && m[1].trim().length > 2) return m[1].trim();
  }
  return undefined;
}

function extractSKU(text: string): string {
  const m = text.match(/sku[:\s]+([A-Z0-9\-]+)/i);
  if (m) return m[1].toUpperCase();
  // Gera SKU do nome
  return "";
}

function generateSKU(name: string): string {
  const parts = name.toUpperCase().split(" ").filter(Boolean);
  const prefix = parts.slice(0, 2).map(w => w.slice(0, 3)).join("-");
  return `${prefix}-${String(Math.floor(Math.random() * 900) + 100)}`;
}

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── Detecção de intenção ────────────────────────────────────────────────────

type IntentType =
  | "dashboard" | "low_stock" | "products" | "sales"
  | "suppliers" | "profitability" | "create_product"
  | "stock_entry" | "greeting" | "unknown";

interface Intent {
  type: IntentType;
  search?: string;
  productData?: Partial<ProductInput>;
  productName?: string;
  quantity?: number;
}

function detectIntent(message: string): Intent {
  const msg = normalize(message);

  // Saudações
  if (/^(oi|ola|hello|bom dia|boa tarde|boa noite|hey|e ai|e aí)[\s!?]*$/.test(msg.trim())) {
    return { type: "greeting" };
  }

  // Criar produto
  if (/cadastr|criar?\s+produto|novo\s+produto|adicionar\s+produto|add\s+produto/.test(msg)) {
    const name = extractProductName(message) || "";
    const costPrice = extractMoney(
      message.replace(/venda[r]?\s+(?:por\s+)?r\$[\s\d,\.]+/i, "")
    );
    const salePriceMatch = message.match(/vend[ae][r]?\s+(?:por\s+)?r?\$?\s*([\d,\.]+)/i);
    const salePrice = salePriceMatch ? parseFloat(salePriceMatch[1].replace(",", ".")) : null;
    const sku = extractSKU(message) || (name ? generateSKU(name) : "");
    return {
      type: "create_product",
      productData: {
        name: name || undefined,
        costPrice: costPrice ?? undefined,
        salePrice: salePrice ?? undefined,
        sku: sku || undefined,
        unit: /kg|litro|caixa|cx|par/.test(msg) ? msg.match(/kg|litro|caixa|cx|par/)?.[0] : "un",
      },
    };
  }

  // Entrada de estoque
  if (/entrada|chegou|deu\s+entrada|recebeu|reposicao|add.*estoque|adicionar.*estoque/.test(msg)) {
    const qty = extractNumber(message);
    const productName = extractProductName(message);
    return { type: "stock_entry", productName, quantity: qty ?? undefined };
  }

  // Estoque baixo / alertas
  if (/repor|falt|ruptura|critic|minimo|abaixo|alerta|urgente|acabando|zerou/.test(msg)) {
    return { type: "low_stock" };
  }

  // Lucratividade
  if (/margem|lucro|lucrativid|rentab|prejuizo/.test(msg)) {
    return { type: "profitability" };
  }

  // Vendas / receita
  if (/vend|receita|faturamento|ticket|pedido/.test(msg)) {
    return { type: "sales" };
  }

  // Fornecedores
  if (/fornecedor|supplier|distribu/.test(msg)) {
    return { type: "suppliers" };
  }

  // Busca de produto específico
  if (/produto|catalogo|item|iten|sku|busca/.test(msg)) {
    const search = message.replace(/produto|catalogo|item|itens|busca|por|de|o|a/gi, "").trim();
    return { type: "products", search: search.length > 2 ? search : undefined };
  }

  // Dashboard / resumo geral
  if (/dashboard|resumo|visao|geral|hoje|semana|como\s+(ta|esta|foi)|overview/.test(msg)) {
    return { type: "dashboard" };
  }

  return { type: "unknown" };
}

// ─── Geração de resposta ─────────────────────────────────────────────────────

const FOLLOWUPS: Record<IntentType, string[]> = {
  dashboard:       ["O que precisa repor?", "Como foram as vendas?", "Qual a margem dos produtos?"],
  low_stock:       ["Ver todos os produtos", "Como foi o faturamento?", "Ver fornecedores"],
  products:        ["O que precisa repor?", "Ver lucratividade", "Ver vendas recentes"],
  sales:           ["Qual a margem dos produtos?", "O que precisa repor?", "Ver fornecedores"],
  suppliers:       ["Ver produtos", "O que precisa repor?", "Como foi o faturamento?"],
  profitability:   ["Ver vendas recentes", "O que precisa repor?", "Ver fornecedores"],
  create_product:  ["Ver todos os produtos", "Dar entrada no estoque", "Como foi o faturamento?"],
  stock_entry:     ["Ver estoque baixo", "Ver todos os produtos", "Como foi hoje?"],
  greeting:        ["Como foi hoje?", "O que precisa repor?", "Ver lucratividade"],
  unknown:         ["Como foi hoje?", "O que precisa repor?", "Ver vendas recentes"],
};

export async function generateResponse(
  message: string,
  orgId: string,
  userId: string
): Promise<ChatResponse> {
  const intent = detectIntent(message);

  switch (intent.type) {

    case "greeting": {
      return {
        message: "Olá! Sou o assistente do **Deppio** 👋\nPosso consultar dados do seu negócio, cadastrar produtos e registrar movimentações de estoque. O que precisa?",
        followUps: FOLLOWUPS.greeting,
      };
    }

    case "dashboard": {
      const kpis = await getKPIs(orgId);
      const low = await getLowStockProducts(orgId);
      return {
        message: `Aqui está o resumo do seu negócio:`,
        cards: [
          { type: "kpi", data: kpis },
          ...(low.length > 0 ? [{ type: "alert-list" as const, data: { items: low.slice(0, 3), count: low.length } }] : []),
        ],
        followUps: FOLLOWUPS.dashboard,
      };
    }

    case "low_stock": {
      const products = await getLowStockProducts(orgId);
      if (products.length === 0) {
        return {
          message: "✅ Tudo certo! Nenhum produto está abaixo do estoque mínimo.",
          followUps: ["Ver todos os produtos", "Como foi o faturamento?"],
        };
      }
      return {
        message: `Encontrei **${products.length} produto(s)** abaixo do estoque mínimo:`,
        cards: [{ type: "alert-list", data: { items: products, count: products.length } }],
        followUps: FOLLOWUPS.low_stock,
      };
    }

    case "products": {
      const products = await getProducts(orgId, intent.search);
      const msg = intent.search
        ? `Resultados para "${intent.search}":`
        : `Você tem ${products.length} produto(s) no catálogo:`;
      return {
        message: products.length === 0 ? `Nenhum produto encontrado para "${intent.search}".` : msg,
        cards: products.length > 0 ? [{ type: "product-list", data: products }] : undefined,
        followUps: FOLLOWUPS.products,
      };
    }

    case "sales": {
      const sales = await getRecentSales(orgId);
      const total = sales.filter((s: any) => s.status !== "CANCELLED")
        .reduce((sum: number, s: any) => sum + Number(s.total), 0);
      return {
        message: `Aqui estão as últimas **${sales.length} vendas**. Total: **${formatCurrency(total)}**`,
        cards: [{ type: "sale-list", data: sales }],
        followUps: FOLLOWUPS.sales,
      };
    }

    case "suppliers": {
      const suppliers = await getSuppliers(orgId);
      return {
        message: `Você tem **${suppliers.length} fornecedor(es)** cadastrado(s):`,
        cards: [{ type: "supplier-list", data: suppliers }],
        followUps: FOLLOWUPS.suppliers,
      };
    }

    case "profitability": {
      const data: any = await getProfitability();
      if (!data) return { message: "Dados de lucratividade não disponíveis.", followUps: FOLLOWUPS.profitability };
      const top5 = data.products?.slice(0, 5) ?? [];
      return {
        message: `Análise de lucratividade — margem média: **${data.summary?.avgMargin?.toFixed(1) ?? "—"}%**`,
        cards: [{ type: "profit-list", data: { items: top5, summary: data.summary } }],
        followUps: FOLLOWUPS.profitability,
      };
    }

    case "create_product": {
      const d = intent.productData ?? {};
      const missing: string[] = [];
      if (!d.name) missing.push("nome do produto");
      if (d.costPrice == null) missing.push("preço de custo (ex: custo R$ 35)");
      if (d.salePrice == null) missing.push("preço de venda (ex: venda R$ 99)");

      if (missing.length > 0) {
        return {
          message: `Para cadastrar o produto, preciso de mais informações:\n\n• ${missing.join("\n• ")}\n\nExemplo: _"Cadastra produto Camiseta Preta, custo R$ 35, venda R$ 89"_`,
          followUps: ["Ver produtos existentes", "O que precisa repor?"],
        };
      }

      try {
        const result: any = await createProduct(orgId, userId, {
          name: d.name!,
          sku: d.sku || generateSKU(d.name!),
          costPrice: d.costPrice!,
          salePrice: d.salePrice!,
          unit: d.unit || "un",
          minStock: 5,
        });
        const margin = ((d.salePrice! - d.costPrice!) / d.salePrice! * 100).toFixed(1);
        return {
          message: result.demo
            ? `✅ Produto criado! *(modo demonstração)*`
            : `✅ Produto cadastrado com sucesso!`,
          cards: [{
            type: "success",
            data: {
              title: d.name,
              lines: [
                `SKU: ${result.sku || d.sku}`,
                `Custo: ${formatCurrency(d.costPrice!)} · Venda: ${formatCurrency(d.salePrice!)}`,
                `Margem bruta: ${margin}%`,
                ...(result.demo ? ["⚠️ Em produção, o produto seria salvo no banco."] : []),
              ],
            },
          }],
          followUps: FOLLOWUPS.create_product,
        };
      } catch (e: any) {
        return { message: `❌ Não foi possível criar o produto: ${e.message}`, followUps: [] };
      }
    }

    case "stock_entry": {
      if (!intent.productName && !intent.quantity) {
        return {
          message: `Para registrar uma entrada de estoque, diga o produto e a quantidade.\n\nExemplo: _"Deu entrada de 50 unidades de Camiseta Básica Branca"_`,
          followUps: ["Ver estoque baixo", "Ver produtos"],
        };
      }
      try {
        const result: any = await createStockEntry(orgId, userId, {
          productName: intent.productName,
          quantity: intent.quantity ?? 1,
        });
        return {
          message: result.demo ? `✅ Entrada registrada! *(modo demonstração)*` : `✅ Entrada registrada com sucesso!`,
          cards: [{
            type: "success",
            data: {
              title: result.product,
              lines: [
                `Quantidade: +${intent.quantity} ${intent.productName ? "" : "un"}`,
                `Novo estoque: ${result.newStock} unidades`,
                ...(result.demo ? ["⚠️ Em produção, o estoque seria atualizado no banco."] : []),
              ],
            },
          }],
          followUps: FOLLOWUPS.stock_entry,
        };
      } catch (e: any) {
        return {
          message: `❌ ${e.message}. Tente especificar melhor o nome do produto.\n\nExemplo: _"Entrada de 20 unidades de Óculos Wayfarer"_`,
          followUps: ["Ver estoque baixo", "Ver produtos"],
        };
      }
    }

    default: {
      return {
        message: "Não entendi bem o que você quis dizer 🤔\n\nPosso ajudar com informações sobre produtos, estoque, vendas, fornecedores e lucratividade. Também posso cadastrar produtos e registrar entradas de estoque.",
        followUps: FOLLOWUPS.unknown,
      };
    }
  }
}
