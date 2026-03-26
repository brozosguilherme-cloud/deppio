"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package, Monitor, Truck, FlaskConical, Bot,
  ArrowRight, Check, Zap, ChevronRight, Star, BarChart3,
  ShieldCheck, Smartphone, Crown
} from "lucide-react";

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const router = useRouter();
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-zinc-900 font-black text-base leading-none">D</span>
          </div>
          <span className="font-black text-white text-lg tracking-tight">Deppio</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#planos" className="hover:text-white transition-colors">Planos</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
            Entrar
          </Link>
          <button
            onClick={() => router.push("/cadastro")}
            className="bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Começar grátis
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const router = useRouter();
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
      {/* Glow de fundo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap className="w-3 h-3" />
          14 dias grátis · Sem cartão de crédito
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
          Gerencie seu estoque{" "}
          <span className="text-yellow-400">com inteligência</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Controle produtos, vendas, PDV, matérias-primas e muito mais.
          Uma plataforma completa feita para <strong className="text-zinc-200">pequenas e médias empresas brasileiras</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => router.push("/cadastro")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold text-base px-7 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-yellow-400/20"
          >
            Começar 14 dias grátis
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-base px-7 py-3.5 rounded-xl border border-white/10 transition-colors"
          >
            Ver demonstração
          </button>
        </div>

        {/* Dashboard preview */}
        <div className="relative mx-auto max-w-5xl">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
            {/* Barra de navegador mockada */}
            <div className="bg-zinc-800 px-4 py-2.5 flex items-center gap-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4 bg-zinc-700 rounded-md px-3 py-1 text-xs text-zinc-500">
                app.deppio.com.br
              </div>
            </div>
            {/* Simulação do dashboard */}
            <div className="bg-zinc-900 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Receita do mês", value: "R$ 48.320", color: "text-green-400" },
                { label: "Produtos ativos", value: "142", color: "text-blue-400" },
                { label: "Vendas hoje", value: "23", color: "text-yellow-400" },
                { label: "Estoque baixo", value: "5 itens", color: "text-red-400" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-zinc-800 rounded-xl p-3 sm:p-4 border border-white/5">
                  <p className="text-xs text-zinc-500 mb-1">{kpi.label}</p>
                  <p className={`text-lg sm:text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 px-4 sm:px-6 pb-6 grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-zinc-800/60 rounded-lg h-16 sm:h-24 border border-white/5 animate-pulse" />
              ))}
            </div>
          </div>
          {/* Glow abaixo do preview */}
          <div className="absolute -bottom-8 inset-x-12 h-24 bg-yellow-400/10 blur-2xl rounded-full" />
        </div>
      </div>
    </section>
  );
}

// ─── Clientes / Social proof ───────────────────────────────────────────────────

function SocialProof() {
  return (
    <section className="py-10 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm text-zinc-500 mb-6">Empresas que já confiam no Deppio</p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-40">
          {["Moda & Cia", "Tech Parts", "Casa Bella", "Sport Zone", "Artes & Cor"].map((name) => (
            <span key={name} className="text-zinc-300 font-bold text-sm sm:text-base tracking-wide">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Funcionalidades ───────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Package,
    title: "Estoque inteligente",
    desc: "Controle entradas, saídas e alertas de estoque mínimo em tempo real.",
    pro: false,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Monitor,
    title: "PDV integrado",
    desc: "Ponto de venda rápido e intuitivo, direto no navegador. Sem hardware extra.",
    pro: false,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: BarChart3,
    title: "Relatórios detalhados",
    desc: "Visualize lucratividade, giro de produtos e desempenho de vendas.",
    pro: false,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Truck,
    title: "Gestão de fornecedores",
    desc: "Cadastre fornecedores, vincule produtos e centralize seus contatos.",
    pro: false,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: FlaskConical,
    title: "Matérias-primas e BOM",
    desc: "Monte fichas técnicas dos seus produtos e automatize o abate de insumos na produção.",
    pro: true,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Bot,
    title: "Assistente IA integrado",
    desc: "Consulte dados, crie produtos e registre movimentações em linguagem natural.",
    pro: true,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
];

function Features() {
  return (
    <section id="funcionalidades" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Do controle de estoque ao assistente de IA — sem precisar de múltiplas ferramentas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group relative overflow-hidden"
            >
              {f.pro && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Crown className="w-2.5 h-2.5" />
                  Pro
                </div>
              )}
              <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            ✦ Acesso via browser · Sem instalação · Dados 100% seguros no Brasil
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Como funciona ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    step: "01",
    title: "Escolha seu plano",
    desc: "Selecione o plano ideal para o porte do seu negócio. Comece com 14 dias grátis.",
  },
  {
    step: "02",
    title: "Configure sua empresa",
    desc: "Cadastre suas informações, produtos e fornecedores em minutos com nosso assistente.",
  },
  {
    step: "03",
    title: "Gerencie com controle total",
    desc: "Acesse de qualquer lugar, acompanhe vendas, estoque e relatórios em tempo real.",
  },
];

function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-4 sm:px-6 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Comece em 3 passos simples
          </h2>
          <p className="text-zinc-400 text-lg">
            Sem complicação. Sem necessidade de suporte técnico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Linha conectora (desktop) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-yellow-400/20 via-yellow-400/40 to-yellow-400/20" />

          {STEPS.map((s) => (
            <div key={s.step} className="text-center relative">
              <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10">
                <span className="text-yellow-400 font-black text-lg">{s.step}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Planos ────────────────────────────────────────────────────────────────────

const PLAN_HIGHLIGHTS = {
  ESSENCIAL: [
    "Produtos, estoque e PDV",
    "Controle de vendas",
    "Gestão de fornecedores",
    "Faturamento básico",
    "Relatórios essenciais",
    "Até 2 usuários",
  ],
  PRO: [
    "Tudo do plano Essencial",
    "Matérias-primas e BOM",
    "Assistente IA integrado",
    "Relatórios avançados",
    "Usuários ilimitados",
    "Suporte prioritário",
  ],
};

function Pricing() {
  const router = useRouter();
  return (
    <section id="planos" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Planos simples e transparentes
          </h2>
          <p className="text-zinc-400 text-lg">
            14 dias grátis em qualquer plano. Cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Essencial */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-semibold text-zinc-400 mb-1">Essencial</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-black text-white">R$ 49</span>
                <span className="text-zinc-500 mb-1">/mês</span>
              </div>
              <p className="text-sm text-zinc-500">Para pequenos negócios que precisam do essencial</p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PLAN_HIGHLIGHTS.ESSENCIAL.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-zinc-500 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/cadastro?plano=essencial")}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors"
            >
              Começar grátis
            </button>
          </div>

          {/* Pro */}
          <div className="bg-yellow-400/5 border border-yellow-400/30 rounded-2xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400 text-zinc-900 text-xs font-bold px-2.5 py-1 rounded-full">
              <Crown className="w-3 h-3" />
              Recomendado
            </div>
            <div className="mb-6">
              <p className="text-sm font-semibold text-yellow-400 mb-1">Pro</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-black text-white">R$ 99</span>
                <span className="text-zinc-500 mb-1">/mês</span>
              </div>
              <p className="text-sm text-zinc-500">Para negócios que precisam de controle total</p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PLAN_HIGHLIGHTS.PRO.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/cadastro?plano=pro")}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-400/20"
            >
              Começar grátis
            </button>
          </div>
        </div>

        {/* Garantia */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-600" />
            Sem cartão de crédito
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-zinc-600" />
            Funciona em qualquer dispositivo
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-zinc-600" />
            Cancele quando quiser
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Depoimentos ───────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Carla Mendes",
    role: "Proprietária · Moda & Cia",
    text: "Antes eu usava planilha e sempre perdia o controle. Com o Deppio, sei exatamente o que tenho em estoque a qualquer momento.",
    stars: 5,
  },
  {
    name: "Roberto Andrade",
    role: "Gerente · Tech Parts",
    text: "O PDV é incrível — rapidinho e já integra com o estoque. Economizamos horas toda semana.",
    stars: 5,
  },
  {
    name: "Fernanda Lima",
    role: "Fundadora · Artes & Cor",
    text: "O sistema de matérias-primas do plano Pro mudou meu negócio. Agora sei exatamente o custo de cada produto que fabrico.",
    stars: 5,
  },
];

function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">O que nossos clientes dizem</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
              <div>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-zinc-500 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA final ─────────────────────────────────────────────────────────────────

function FinalCTA() {
  const router = useRouter();
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-3xl p-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Pronto para ter controle real do seu negócio?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Junte-se a centenas de empresas que já organizam seu estoque com o Deppio.
          </p>
          <button
            onClick={() => router.push("/cadastro")}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-yellow-400/20"
          >
            Começar 14 dias grátis
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-zinc-600 text-sm mt-4">Sem cartão de crédito · Cancele quando quiser</p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-md flex items-center justify-center">
            <span className="text-zinc-900 font-black text-xs">D</span>
          </div>
          <span className="text-zinc-400 text-sm font-semibold">Deppio</span>
        </div>
        <p className="text-zinc-600 text-xs">
          © {new Date().getFullYear()} Deppio. Todos os direitos reservados.
        </p>
        <div className="flex gap-5 text-xs text-zinc-600">
          <a href="#" className="hover:text-zinc-400 transition-colors">Termos de uso</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
