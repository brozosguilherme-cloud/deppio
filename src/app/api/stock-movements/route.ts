import { isDemoMode } from "@/lib/auth";
import { DEMO_MOVEMENTS, DEMO_BOM, DEMO_RAW_MATERIALS } from "@/lib/demo-data";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const type = searchParams.get("type");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "30");

  if (isDemoMode()) return NextResponse.json({ movements: DEMO_MOVEMENTS, pagination: { page: 1, limit: 30, total: DEMO_MOVEMENTS.length, pages: 1 } });
  try {
    const where = {
      organizationId: user.organizationId,
      ...(productId && { productId }),
      ...(type && { type: type as never }),
    };
    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, sku: true, unit: true } },
          user: { select: { name: true } },
          location: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.stockMovement.count({ where }),
    ]);
    return NextResponse.json({ movements, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ movements: [], pagination: { page, limit, total: 0, pages: 0 } });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const body = await request.json();
  const { productId, type, quantity, unitCost, reason, reference, locationId } = body;

  if (!productId || !type || quantity === undefined || quantity === 0)
    return NextResponse.json({ error: "productId, type e quantity são obrigatórios" }, { status: 400 });

  // ─── Demo mode ───────────────────────────────────────────────────────────
  if (isDemoMode()) {
    // Simula dedução de matérias-primas na produção
    if (type === "PRODUCTION") {
      const bom = DEMO_BOM[productId] ?? [];
      const deductions = bom.map(item => {
        const rm = DEMO_RAW_MATERIALS.find(r => r.id === item.rawMaterialId);
        const needed = item.quantity * Math.abs(quantity);
        const remaining = (rm?.currentStock ?? 0) - needed;
        return {
          rawMaterialId: item.rawMaterialId,
          name: rm?.name,
          unit: rm?.unit,
          needed,
          remaining,
          lowStock: remaining < (rm?.minStock ?? 0),
        };
      });
      return NextResponse.json({ success: true, demo: true, type: "PRODUCTION", deductions }, { status: 201 });
    }
    return NextResponse.json({ success: true, demo: true }, { status: 201 });
  }

  // ─── Produção: entrada que consome matérias-primas ────────────────────────
  try {
    const exitTypes = ["SALE", "LOSS", "TRANSFER"];
    const isExit = exitTypes.includes(type);
    const movQty = isExit ? -Math.abs(quantity) : Math.abs(quantity);

    const product = await prisma.product.findFirst({
      where: { id: productId, organizationId: user.organizationId },
    });
    if (!product) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

    if (isExit && product.currentStock + movQty < 0)
      return NextResponse.json({ error: `Estoque insuficiente. Disponível: ${product.currentStock} ${product.unit}` }, { status: 422 });

    // Para PRODUCTION: verificar e deduzir matérias-primas
    if (type === "PRODUCTION") {
      const bom = await prisma.productRawMaterial.findMany({
        where: { productId },
        include: { rawMaterial: true },
      });

      // Verifica se há estoque suficiente de cada matéria-prima
      for (const item of bom) {
        const needed = item.quantity * Math.abs(quantity);
        if (item.rawMaterial.currentStock < needed) {
          return NextResponse.json({
            error: `Estoque insuficiente de "${item.rawMaterial.name}". Necessário: ${needed} ${item.rawMaterial.unit}. Disponível: ${item.rawMaterial.currentStock} ${item.rawMaterial.unit}.`,
          }, { status: 422 });
        }
      }

      const result = await prisma.$transaction(async (tx) => {
        // Cria movimento de estoque do produto
        const movement = await tx.stockMovement.create({
          data: {
            organizationId: user.organizationId, productId, userId: user.id,
            type: "PRODUCTION", quantity: movQty,
            unitCost: unitCost ?? Number(product.costPrice) ?? null,
            reason: reason ?? "Produção interna", reference: reference ?? null,
            locationId: locationId ?? null,
          },
          include: { product: { select: { name: true, sku: true, unit: true } }, user: { select: { name: true } } },
        });

        // Atualiza estoque do produto
        await tx.product.update({ where: { id: productId }, data: { currentStock: { increment: movQty } } });

        // Deduz matérias-primas e registra movimentações
        const deductions = [];
        for (const item of bom) {
          const consumed = item.quantity * Math.abs(quantity);
          await tx.rawMaterial.update({
            where: { id: item.rawMaterialId },
            data: { currentStock: { decrement: consumed } },
          });
          await tx.rawMaterialMovement.create({
            data: {
              organizationId: user.organizationId,
              rawMaterialId: item.rawMaterialId,
              type: "OUT",
              quantity: -consumed,
              note: `Produção de ${Math.abs(quantity)} × ${product.name}`,
              productId,
            },
          });
          deductions.push({ rawMaterialId: item.rawMaterialId, name: item.rawMaterial.name, consumed, unit: item.rawMaterial.unit });
        }

        return { movement, deductions };
      });

      return NextResponse.json(result, { status: 201 });
    }

    // Movimento padrão (PURCHASE, ADJUSTMENT, etc.)
    const [movement] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          organizationId: user.organizationId, productId, userId: user.id, type, quantity: movQty,
          unitCost: unitCost ?? null, reason: reason ?? null, reference: reference ?? null, locationId: locationId ?? null,
        },
        include: { product: { select: { name: true, sku: true, unit: true } }, user: { select: { name: true } } },
      }),
      prisma.product.update({ where: { id: productId }, data: { currentStock: { increment: movQty } } }),
    ]);

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    console.error("[API] POST /stock-movements error:", error);
    return NextResponse.json({ error: "Erro ao registrar movimentação" }, { status: 500 });
  }
}
