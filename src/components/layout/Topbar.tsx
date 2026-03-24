"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, User, Bell, Settings, Menu, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/lib/plans";

interface TopbarProps {
  orgName?: string;
  plan?: Plan;
  onMenuClick?: () => void;
}

export function Topbar({ orgName, plan, onMenuClick }: TopbarProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 bg-surface-400 border-b border-surface-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-300 transition-colors text-zinc-400 hover:text-zinc-200 mr-1"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center shadow-md shadow-primary-500/20 shrink-0">
          <span className="text-zinc-900 font-black text-sm leading-none select-none">D</span>
        </div>
        <h1 className="text-base font-bold text-white tracking-tight truncate max-w-48">
          {orgName ?? "Deppio"}
        </h1>
        {plan && (
          <span
            onClick={() => router.push("/planos")}
            className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded cursor-pointer transition-opacity hover:opacity-80 ${
              plan === "PRO"
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-zinc-700 text-zinc-400 border border-zinc-600"
            }`}
          >
            {plan === "PRO" && <Zap className="w-2.5 h-2.5" />}
            {plan}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-300 transition-colors text-zinc-500 hover:text-zinc-300">
          <Bell className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.push("/configuracoes")}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-300 transition-colors text-zinc-500 hover:text-zinc-300"
          title="Configurações da empresa"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-surface-200 mx-2" />

        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-surface-300 transition-colors cursor-default">
          <div className="w-7 h-7 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-primary-400" />
          </div>
          {orgName && (
            <span className="text-sm font-medium text-zinc-300 hidden sm:block max-w-32 truncate">
              {orgName}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-zinc-500"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
