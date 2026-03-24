"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, AlertTriangle, TrendingUp, Package, ShoppingCart, Users, CheckCircle, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatCard, ChatResponse } from "@/lib/chat-engine";
import { usePlan } from "@/contexts/PlanContext";
import { canAccess } from "@/lib/plans";
import { useRouter } from "next/navigation";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: ChatCard[];
  followUps?: string[];
  timestamp: Date;
}

// ─── Renderizadores de card ───────────────────────────────────────────────────

function KpiCard({ data }: { data: any }) {
  const fmt = (v: number) => v?.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) ?? "—";
  return (
    <div className="grid grid-cols-2 gap-1.5 mt-2">
      {[
        { label: "Produtos", value: data.totalProducts, color: "text-blue-400" },
        { label: "Em estoque", value: data.totalStock?.toLocaleString("pt-BR"), color: "text-green-400" },
        { label: "Vendas hoje", value: data.salesToday, color: "text-yellow-400" },
        { label: "Receita mês", value: fmt(data.revenueMonth), color: "text-primary-400" },
      ].map((k) => (
        <div key={k.label} className="bg-zinc-800/60 rounded-lg p-2.5 border border-zinc-700/50">
          <p className="text-xs text-zinc-500 mb-0.5">{k.label}</p>
          <p className={cn("text-sm font-bold", k.color)}>{k.value ?? "—"}</p>
        </div>
      ))}
    </div>
  );
}

function AlertListCard({ data }: { data: any }) {
  return (
    <div className="mt-2 space-y-1.5">
      {data.count > 3 && (
        <p className="text-xs text-zinc-500">{data.count} produtos com alerta — mostrando os 3 mais críticos:</p>
      )}
      {data.items?.map((p: any) => (
        <div key={p.id} className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-xs text-zinc-200 truncate">{p.name}</span>
          </div>
          <span className="text-xs font-mono text-red-400 shrink-0 ml-2">
            {p.currentStock}/{p.minStock} {p.unit}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProductListCard({ data }: { data: any[] }) {
  return (
    <div className="mt-2 space-y-1">
      {data?.slice(0, 5).map((p: any) => (
        <div key={p.id} className="flex items-center justify-between bg-zinc-800/60 rounded-lg px-3 py-2 border border-zinc-700/40">
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">{p.name}</p>
            <p className="text-[11px] text-zinc-500">{p.sku}</p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <p className="text-xs font-mono text-primary-400">
              {Number(p.salePrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            <p className="text-[11px] text-zinc-500">{p.currentStock} {p.unit}</p>
          </div>
        </div>
      ))}
      {data?.length > 5 && (
        <p className="text-xs text-zinc-500 text-center pt-1">+ {data.length - 5} mais</p>
      )}
    </div>
  );
}

function SaleListCard({ data }: { data: any[] }) {
  const fmt = (v: number) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return (
    <div className="mt-2 space-y-1">
      {data?.slice(0, 5).map((s: any) => (
        <div key={s.id} className="flex items-center justify-between bg-zinc-800/60 rounded-lg px-3 py-2 border border-zinc-700/40">
          <div>
            <p className="text-xs text-zinc-300">{s.customer ?? "Cliente"}</p>
            <p className="text-[11px] text-zinc-500 capitalize">{s.paymentMethod?.toLowerCase().replace("_", " ")}</p>
          </div>
          <span className="text-xs font-mono text-green-400">{fmt(s.total)}</span>
        </div>
      ))}
    </div>
  );
}

function SupplierListCard({ data }: { data: any[] }) {
  return (
    <div className="mt-2 space-y-1">
      {data?.slice(0, 5).map((s: any) => (
        <div key={s.id} className="flex items-center gap-2 bg-zinc-800/60 rounded-lg px-3 py-2 border border-zinc-700/40">
          <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">{s.name}</p>
            {s.email && <p className="text-[11px] text-zinc-500 truncate">{s.email}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfitListCard({ data }: { data: any }) {
  return (
    <div className="mt-2 space-y-1">
      {data?.items?.map((p: any) => (
        <div key={p.id} className="flex items-center justify-between bg-zinc-800/60 rounded-lg px-3 py-2 border border-zinc-700/40">
          <p className="text-xs text-zinc-200 truncate min-w-0 mr-3">{p.name}</p>
          <span className={cn(
            "text-xs font-mono shrink-0",
            (p.margin ?? 0) >= 30 ? "text-green-400" : (p.margin ?? 0) >= 10 ? "text-yellow-400" : "text-red-400"
          )}>
            {p.margin?.toFixed(1) ?? "—"}%
          </span>
        </div>
      ))}
    </div>
  );
}

function SuccessCard({ data }: { data: any }) {
  return (
    <div className="mt-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
        <p className="text-xs font-semibold text-green-400">{data.title}</p>
      </div>
      {data.lines?.map((l: string, i: number) => (
        <p key={i} className="text-xs text-zinc-400 leading-relaxed">{l}</p>
      ))}
    </div>
  );
}

function CardRenderer({ card }: { card: ChatCard }) {
  switch (card.type) {
    case "kpi":           return <KpiCard data={card.data} />;
    case "alert-list":    return <AlertListCard data={card.data} />;
    case "product-list":  return <ProductListCard data={card.data as any[]} />;
    case "sale-list":     return <SaleListCard data={card.data as any[]} />;
    case "supplier-list": return <SupplierListCard data={card.data as any[]} />;
    case "profit-list":   return <ProfitListCard data={card.data} />;
    case "success":       return <SuccessCard data={card.data} />;
    default:              return null;
  }
}

// ─── Markdown mínimo ─────────────────────────────────────────────────────────

function renderMarkdown(text: string) {
  return text
    .split("\n")
    .map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("_") && part.endsWith("_")) {
          return <em key={j} className="text-zinc-400 not-italic">{part.slice(1, -1)}</em>;
        }
        return part;
      });
      return <span key={i}>{parts}{i < text.split("\n").length - 1 && <br />}</span>;
    });
}

// ─── Bolha de mensagem ────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-primary-500 text-zinc-900 rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[80%]">
          <p className="text-xs font-medium leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5 text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
          <p className="text-xs text-zinc-300 leading-relaxed">{renderMarkdown(message.content)}</p>
          {message.cards?.map((card, i) => (
            <CardRenderer key={i} card={card} />
          ))}
        </div>
        {message.followUps && message.followUps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.followUps.map((fu) => (
              <button
                key={fu}
                data-followup={fu}
                className="text-[11px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 rounded-full px-2.5 py-1 transition-colors"
              >
                {fu}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Indicador de digitação ───────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-primary-400" />
      </div>
      <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ChatWidget principal ─────────────────────────────────────────────────────

export function ChatWidget() {
  const plan = usePlan();
  const router = useRouter();
  const hasAiChat = canAccess(plan, "aiChat");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o assistente do **Deppio** 👋\nPosso consultar dados, cadastrar produtos e registrar movimentações. O que precisa?",
      followUps: ["Como foi hoje?", "O que precisa repor?", "Ver lucratividade"],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data: ChatResponse = await res.json();
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        cards: data.cards,
        followUps: data.followUps,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Erro ao conectar com o assistente. Tente novamente.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleFollowUpClick(e: React.MouseEvent) {
    const btn = (e.target as HTMLElement).closest("[data-followup]") as HTMLElement | null;
    if (btn) sendMessage(btn.dataset.followup!);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Painel do chat */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[420px] flex flex-col bg-surface-500 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          style={{ maxHeight: "calc(100vh - 100px)", height: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-surface-400 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-zinc-900 font-black text-sm leading-none">D</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-none">Assistente Deppio</p>
                <p className="text-[11px] text-green-400 mt-0.5">● online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mensagens */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin"
            onClick={handleFollowUpClick}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-zinc-800 bg-surface-400 shrink-0">
            <div className="flex items-center gap-2 bg-surface-500 border border-zinc-700 rounded-xl px-3 py-2.5 focus-within:border-primary-500/60 transition-colors">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte algo sobre o negócio..."
                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none min-w-0"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-500 disabled:opacity-40 hover:bg-primary-400 transition-colors shrink-0"
              >
                {loading
                  ? <Loader2 className="w-3.5 h-3.5 text-zinc-900 animate-spin" />
                  : <Send className="w-3.5 h-3.5 text-zinc-900" />
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      {hasAiChat ? (
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "fixed bottom-4 right-4 sm:right-6 z-50 flex items-center justify-center rounded-full shadow-lg shadow-black/40 transition-all duration-200",
            open
              ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-300 scale-95"
              : "bg-primary-500 hover:bg-primary-400 text-zinc-900 hover:scale-105"
          )}
          style={{ width: 52, height: 52 }}
          title="Assistente Deppio"
        >
          {open
            ? <X className="w-5 h-5" />
            : <MessageCircle style={{ width: 22, height: 22 }} />
          }
        </button>
      ) : (
        <button
          onClick={() => router.push("/planos")}
          className="fixed bottom-4 right-4 sm:right-6 z-50 flex items-center justify-center rounded-full shadow-lg shadow-black/40 transition-all duration-200 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 hover:scale-105 group"
          style={{ width: 52, height: 52 }}
          title="Assistente IA — Plano Pro"
        >
          <div className="relative">
            <MessageCircle style={{ width: 22, height: 22 }} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
              <Lock className="w-2 h-2 text-zinc-900" />
            </div>
          </div>
        </button>
      )}
    </>
  );
}
