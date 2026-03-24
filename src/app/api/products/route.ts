import { isDemoMode } from "@/lib/auth";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const lowStock = searchParams.get("lowStock") === "true";

  const where = {
    organizationId: user.organizationId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { sku: { contains: search, mode: "insensitive" as const } },
        { ean: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(status === "active" && { isActive: true }),
    ...(status === "inactive" && { isActive: false }),
    ...(lowStock && {
      AND: [
        { currentStock: { lte: prisma.product.fields.minStock } },
        { isActive: true },
      ],
    }),
  };

  if (isDemoMode()) return NextResponse.json({ products: DEMO_PRODUCTS, pagination: { page: 1, limit: 20, total: DEMO_PRODUCTS.length, pages: 1 } });
  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, color: true } },
          supplier: { select: { id: true, name: true } },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    return NextResponse.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ products: [], pagination: { page, limit, total: 0, pages: 0 } });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (user.role === "VIEWER") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  if (isDemoMode()) return NextResponse.json({ products: DEMO_PRODUCTS, pagination: { page: 1, limit: 20, total: DEMO_PRODUCTS.length, pages: 1 } });
  try {
    const body = await request.json();
    const { name, sku, ean, description, categoryId, supplierId, unit, costPrice, salePrice, minStock, imageUrl } = body;
    if (!name || !sku || costPrice === undefined || salePrice === undefined)
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });

    const existing = await prisma.product.findFirst({ where: { organizationId: user.organizationId, sku } });
    if (existing) return NextResponse.json({ error: "SKU já existe" }, { status: 409 });

    const product = await prisma.product.create({
      data: {
        organizationId: user.organizationId, name, sku,
        ean: ean || null, description: description || null,
        categoryId: categoryId || null, supplierId: supplierId || null,
        unit: unit || "un", costPrice, salePrice, minStock: minStock ?? 0, imageUrl: imageUrl || null,
      },
      include: { category: { select: { id: true, name: true, color: true } }, supplier: { select: { id: true, name: true } } },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[API] POST /products error:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
