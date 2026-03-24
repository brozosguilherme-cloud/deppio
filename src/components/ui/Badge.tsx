import { cn } from "@/lib/utils";

type BadgeColor = "green" | "yellow" | "red" | "blue" | "gray" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colorMap: Record<BadgeColor, string> = {
  green:  "bg-green-500/15 text-green-400 ring-1 ring-green-500/30",
  yellow: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30",
  red:    "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
  blue:   "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
  gray:   "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700",
  purple: "bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/30",
};

export function Badge({ children, color = "gray", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
