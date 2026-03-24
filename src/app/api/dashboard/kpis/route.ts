import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, isDemoMode } from "@/lib/auth";
import { DEMO_KPIS, DEMO_RAW_MATERIALS } from "@/lib/demo-data";
import { startOfDay, endOfDay, startOfMonth, subDays, format } from "date-fns";

const EMPTY_KPIS = { totalProducts:0, totalStock:0, salesToday:0, revenueMonth:0, lowStockProducts:[], movementsChart:[] as {date:string;entradas:number;saidas:number}[], recentSales:[] };

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (isDemoMode()) {
    const lowRawMaterials = DEMO_RAW_MATERIALS.filter(r => r.currentStock < r.minStock).map(r => ({
      id: r.id, name: r.name, unit: r.unit, currentStock: r.currentStock, minStock: r.minStock,
    }));
    return NextResponse.json({ ...DEMO_KPIS, lowRawMaterials });
  }

  const orgId = user.organizationId;
  const now = new Date();
  try {
    const todayStart = startOfDay(now); const todayEnd = endOfDay(now); const monthStart = startOfMonth(now);
    const [totalProducts,stockSum,salesTodayData,revenueMonthData,lowStockProducts,last30DaysMovements,recentSales] = await Promise.all([
      prisma.product.count({ where:{ organizationId:orgId, isActive:true } }),
      prisma.product.aggregate({ where:{ organizationId:orgId, isActive:true }, _sum:{ currentStock:true } }),
      prisma.sale.findMany({ where:{ organizationId:orgId, status:"COMPLETED", createdAt:{ gte:todayStart, lte:todayEnd } }, select:{ total:true } }),
      prisma.sale.aggregate({ where:{ organizationId:orgId, status:"COMPLETED", createdAt:{ gte:monthStart } }, _sum:{ total:true } }),
      prisma.product.findMany({ where:{ organizationId:orgId, isActive:true, currentStock:{ lte:prisma.product.fields.minStock } }, select:{ id:true, name:true, currentStock:true, minStock:true }, orderBy:{ currentStock:"asc" }, take:10 }),
      prisma.stockMovement.findMany({ where:{ organizationId:orgId, createdAt:{ gte:subDays(now,29) } }, select:{ quantity:true, createdAt:true } }),
      prisma.sale.findMany({ where:{ organizationId:orgId, status:"COMPLETED" }, include:{ user:{ select:{ name:true } }, customer:{ select:{ name:true } }, items:{ include:{ product:{ select:{ name:true } } }, take:3 } }, orderBy:{ createdAt:"desc" }, take:5 }),
    ]);
    const alertsWithDays = await Promise.all(lowStockProducts.map(async (p) => {
      const s = await prisma.stockMovement.aggregate({ where:{ organizationId:orgId, productId:p.id, quantity:{ lt:0 }, createdAt:{ gte:subDays(now,30) } }, _sum:{ quantity:true } });
      const avg = Math.abs(s._sum.quantity ?? 0) / 30;
      return { productId:p.id, productName:p.name, currentStock:p.currentStock, minStock:p.minStock, avgDailyConsumption:Math.round(avg*10)/10, daysRemaining: avg>0 ? Math.floor(p.currentStock/avg) : null };
    }));
    const chartData: Record<string,{entradas:number;saidas:number}> = {};
    for (let i=29;i>=0;i--) { chartData[format(subDays(now,i),"dd/MM")]={entradas:0,saidas:0}; }
    last30DaysMovements.forEach((m) => { const k=format(new Date(m.createdAt),"dd/MM"); if(chartData[k]) { if(m.quantity>0) chartData[k].entradas+=m.quantity; else chartData[k].saidas+=Math.abs(m.quantity); } });
    const lowRawMaterials = await prisma.rawMaterial.findMany({
      where: { organizationId: orgId, isActive: true },
      select: { id: true, name: true, unit: true, currentStock: true, minStock: true },
    }).then(rms => rms.filter(r => r.currentStock < r.minStock));

    return NextResponse.json({ totalProducts, totalStock:stockSum._sum.currentStock??0, salesToday:salesTodayData.length, revenueMonth:Number(revenueMonthData._sum.total??0), lowStockProducts:alertsWithDays, lowRawMaterials, movementsChart:Object.entries(chartData).map(([date,v])=>({date,...v})), recentSales });
  } catch { return NextResponse.json({ ...EMPTY_KPIS, lowRawMaterials: [] }); }
}
