import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, children, disabled, ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-surface-700 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:   "bg-primary-500 hover:bg-primary-400 text-zinc-900 font-semibold focus:ring-primary-500",
      secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 focus:ring-zinc-600",
      outline:   "border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white focus:ring-zinc-600",
      ghost:     "hover:bg-zinc-800 text-zinc-400 hover:text-white focus:ring-zinc-600",
      danger:    "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-5 py-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
