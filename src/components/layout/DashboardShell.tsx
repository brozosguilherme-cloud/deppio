"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PlanProvider } from "@/contexts/PlanContext";
import type { Plan } from "@/lib/plans";

interface OrgInfo {
  name: string;
  plan: Plan;
  onboardingCompleted: boolean;
}

interface DashboardShellProps {
  children: React.ReactNode;
}

function getCachedOrg(): OrgInfo | null {
  try {
    const cached = localStorage.getItem("deppio_org");
    if (cached) return JSON.parse(cached);
  } catch {}
  return null;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [org, setOrg] = useState<OrgInfo | null>(null);

  // Hydration-safe: load cache + fetch only on client
  useEffect(() => {
    // Load from localStorage cache immediately (client-only)
    const cached = getCachedOrg();
    if (cached) setOrg(cached);

    // Then fetch fresh data from API
    fetch("/api/organization")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data: OrgInfo) => {
        setOrg(data);
        try {
          localStorage.setItem("deppio_org", JSON.stringify({ name: data.name, plan: data.plan, onboardingCompleted: data.onboardingCompleted }));
        } catch {}
      })
      .catch(() => {});
  }, []);

  const plan: Plan = org?.plan ?? "ESSENCIAL";
  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").includes("placeholder") ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").includes("your-project");

  return (
    <PlanProvider value={{ plan, isDemo }}>
      {isDemo && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-primary-500 text-zinc-900 text-xs font-semibold">
          <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Você está no modo demonstração do Deppio</span>
              <span className="sm:hidden">Modo demonstração</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 bg-zinc-900/15 hover:bg-zinc-900/25 transition-colors px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Voltar ao site</span>
              <span className="sm:hidden">Sair</span>
            </Link>
          </div>
        </div>
      )}
      <div className={`flex h-screen overflow-hidden bg-surface-700 ${isDemo ? "pt-8" : ""}`}>
        {/* Overlay mobile */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} orgName={org?.name} />

        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <Topbar
            orgName={org?.name}
            plan={plan}
            onMenuClick={() => setMobileSidebarOpen(true)}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>

      </div>
    </PlanProvider>
  );
}
