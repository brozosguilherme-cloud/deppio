"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PlanProvider } from "@/contexts/PlanContext";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <PlanProvider value={{ plan: "ESSENCIAL", isDemo: true }}>
      {/* Barra de demo */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-primary-500 text-zinc-900 text-xs font-semibold">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline truncate">Você está visualizando uma demonstração do Deppio</span>
            <span className="sm:hidden font-semibold">Demonstração</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/cadastro"
              className="bg-zinc-900 text-white hover:bg-zinc-800 transition-colors px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold"
            >
              <span className="hidden sm:inline">Criar conta</span>
              <span className="sm:hidden">Criar conta</span>
            </Link>
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 bg-zinc-900/15 hover:bg-zinc-900/25 transition-colors px-3 py-1 rounded-full whitespace-nowrap"
            >
              <ArrowLeft className="w-3 h-3" />
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>

      <div className="flex h-screen overflow-hidden bg-surface-700 pt-8">
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          hrefPrefix="/demo"
        />

        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <Topbar
            orgName="Demo Empresa"
            plan="ESSENCIAL"
            onMenuClick={() => setMobileSidebarOpen(true)}
            settingsHref="/demo/configuracoes"
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </PlanProvider>
  );
}
