import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "green" | "blue" | "yellow" | "purple";
  trend?: { value: number; label: string };
}

const colorMap = {
  green:  { icon: "text-emerald-400",  glow: "shadow-emerald-500/5"  },
  blue:   { icon: "text-sky-400",      glow: "shadow-sky-500/5"      },
  yellow: { icon: "text-primary-400",  glow: "shadow-primary-500/5"  },
  purple: { icon: "text-violet-400",   glow: "shadow-violet-500/5"   },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}: KPICardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "relative bg-surface-400 rounded-xl border border-surface-200 p-5 overflow-hidden",
        "hover:border-surface-100 transition-colors"
      )}
    >
      {/* Linha dourada no topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
            {title}
          </p>
          <p className="text-2xl font-bold text-white mt-2 leading-none">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-600 mt-1.5">{subtitle}</p>
          )}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full",
                trend.value >= 0
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              )}
            >
              {trend.value >= 0 ? "▲" : "▼"}
              {Math.abs(trend.value)}% {trend.label}
            </span>
          )}
        </div>

        <div className="w-10 h-10 rounded-xl bg-surface-300 flex items-center justify-center shrink-0">
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
      </div>
    </div>
  );
}
