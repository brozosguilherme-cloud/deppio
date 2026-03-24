"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  ShoppingCart,
  Monitor,
  TrendingUp,
  Truck,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  X,
  FlaskConical,
  Settings,
  Lock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePlan } from "@/contexts/PlanContext";
import { canAccess } from "@/lib/plans";

const navItems = [
  { href: "/dashboard",       label: "Dashboard",       icon: LayoutDashboard, proFeature: null },
  { href: "/produtos",        label: "Produtos",        icon: Package,          proFeature: null },
  { href: "/materias-primas", label: "Matérias-Primas", icon: FlaskConical,     proFeature: "rawMaterials" as const },
  { href: "/estoque",         label: "Estoque",         icon: ArrowLeftRight,   proFeature: null },
  { href: "/pdv",             label: "PDV",             icon: Monitor,          proFeature: null },
  { href: "/vendas",          label: "Vendas",          icon: ShoppingCart,     proFeature: null },
  { href: "/faturamento",     label: "Faturamento",     icon: TrendingUp,       proFeature: null },
  { href: "/fornecedores",    label: "Fornecedores",    icon: Truck,            proFeature: null },
  { href: "/relatorios",      label: "Relatórios",      icon: FileBarChart,     proFeature: "advancedReports" as const },
  { href: "/configuracoes",   label: "Configurações",   icon: Settings,         proFeature: null },
  { href: "/planos",          label: "Planos",           icon: Zap,              proFeature: null },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const plan = usePlan();
  const [collapsed, setCollapsed] = useState(false);

  const content = (
    <aside
      className={cn(
        "h-full bg-surface-400 border-r border-surface-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-5 border-b border-surface-200",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/25">
          <span className="text-zinc-900 font-black text-lg leading-none tracking-tighter select-none">D</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none flex-1">
            <span className="font-black text-white text-lg tracking-tight leading-none">
              Deppio
            </span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mt-0.5">
              Gestão de Estoque
            </span>
          </div>
        )}
        {!collapsed && onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isLocked = item.proFeature !== null && !canAccess(plan, item.proFeature);
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (isLocked) {
            return (
              <button
                key={item.href}
                title={collapsed ? item.label : undefined}
                onClick={() => router.push("/planos")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group border border-transparent",
                  collapsed && "justify-center px-0 py-3",
                  "text-zinc-600 hover:bg-surface-300 hover:text-zinc-400"
                )}
              >
                <Icon
                  className={cn(
                    "shrink-0 text-zinc-700 group-hover:text-zinc-500 transition-colors",
                    collapsed ? "w-5 h-5" : "w-4 h-4"
                  )}
                />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    <span className="ml-auto flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-primary-500/10 text-primary-500/60 border border-primary-500/20 px-1.5 py-0.5 rounded">
                      <Lock className="w-2.5 h-2.5" />
                      Pro
                    </span>
                  </>
                )}
                {collapsed && <Lock className="w-2.5 h-2.5 text-zinc-700 absolute" />}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                collapsed && "justify-center px-0 py-3",
                isActive
                  ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                  : "text-zinc-400 hover:bg-surface-300 hover:text-white border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0 transition-colors",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                  isActive
                    ? "text-primary-400"
                    : "text-zinc-500 group-hover:text-zinc-200"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Badge de plano + upgrade */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <button
            onClick={() => router.push("/planos")}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-zinc-700 hover:border-primary-500/40 hover:bg-primary-500/5 transition-all group"
          >
            <div className="w-5 h-5 bg-primary-500/10 rounded flex items-center justify-center shrink-0">
              <Zap className="w-3 h-3 text-primary-400" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-300 group-hover:text-primary-400 transition-colors">
                Plano {plan === "PRO" ? "Pro" : "Essencial"}
              </p>
              {plan !== "PRO" && (
                <p className="text-[10px] text-zinc-600 group-hover:text-zinc-500">
                  Fazer upgrade → Pro
                </p>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Botão de colapsar (apenas desktop) */}
      <div className="p-2 border-t border-surface-200 hidden md:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:bg-surface-300 hover:text-zinc-300 transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex h-screen shrink-0">
        {content}
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 md:hidden h-full transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </div>
    </>
  );
}
