"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatWidget } from "@/components/chat/ChatWidget";
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

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [org, setOrg] = useState<OrgInfo | null>(null);

  useEffect(() => {
    fetch("/api/organization")
      .then((r) => r.json())
      .then((data: OrgInfo) => {
        setOrg(data);
        if (!data.onboardingCompleted) {
          router.replace("/onboarding");
        }
      })
      .catch(() => {});
  }, [router]);

  const plan: Plan = org?.plan ?? "ESSENCIAL";
  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").includes("placeholder") ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").includes("your-project");

  return (
    <PlanProvider value={{ plan, isDemo }}>
      {isDemo && (
        <div className="fixed top-0 inset-x-0 z-[60] flex items-center justify-between gap-3 px-4 py-2 bg-primary-500 text-zinc-900 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Você está no modo demonstração do Deppio</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 bg-zinc-900/15 hover:bg-zinc-900/25 transition-colors px-3 py-1 rounded-full whitespace-nowrap"
          >
            <ArrowLeft className="w-3 h-3" />
            Voltar ao site
          </Link>
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

        <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />

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

        <ChatWidget />
      </div>
    </PlanProvider>
  );
}
