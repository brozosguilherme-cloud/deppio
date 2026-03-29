"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Crown, ChevronLeft, Zap, Eye, EyeOff, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Plan = "ESSENCIAL" | "PRO";

// ─── Passo 1: Seleção de plano ─────────────────────────────────────────────────

function StepPlan({ selected, onSelect }: { selected: Plan; onSelect: (p: Plan) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white mb-2">Escolha seu plano</h2>
        <p className="text-zinc-400 text-sm">Comece agora · Cancele quando quiser</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Essencial */}
        <button
          onClick={() => onSelect("ESSENCIAL")}
          className={`w-full text-left rounded-xl border p-5 transition-all ${
            selected === "ESSENCIAL"
              ? "border-white/40 bg-white/5"
              : "border-white/10 bg-white/[0.02] hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === "ESSENCIAL" ? "border-white bg-white" : "border-zinc-600"}`}>
                {selected === "ESSENCIAL" && <div className="w-2 h-2 rounded-full bg-zinc-900" />}
              </div>
              <span className="font-bold text-white">Essencial</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-white">R$ 49</span>
              <span className="text-zinc-500 text-sm">/mês</span>
            </div>
          </div>
          <ul className="space-y-1 pl-8">
            {["Produtos, estoque e PDV", "Controle de vendas", "Fornecedores", "Faturamento básico"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                <Check className="w-3 h-3 text-zinc-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </button>

        {/* Pro */}
        <button
          onClick={() => onSelect("PRO")}
          className={`w-full text-left rounded-xl border p-5 transition-all relative overflow-hidden ${
            selected === "PRO"
              ? "border-yellow-400/60 bg-yellow-400/5"
              : "border-yellow-400/20 bg-yellow-400/[0.02] hover:border-yellow-400/40"
          }`}
        >
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Crown className="w-2.5 h-2.5" />
            Recomendado
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === "PRO" ? "border-yellow-400 bg-yellow-400" : "border-zinc-600"}`}>
                {selected === "PRO" && <div className="w-2 h-2 rounded-full bg-zinc-900" />}
              </div>
              <span className="font-bold text-white">Pro</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-white">R$ 99</span>
              <span className="text-zinc-500 text-sm">/mês</span>
            </div>
          </div>
          <ul className="space-y-1 pl-8">
            {["Tudo do Essencial", "Matérias-primas e BOM", "Relatórios avançados", "Suporte prioritário"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                <Check className="w-3 h-3 text-yellow-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </button>
      </div>

      <p className="text-center text-xs text-zinc-600 pt-2">
        Cancele quando quiser · Sem fidelidade
      </p>
    </div>
  );
}

// ─── Passo 2: Dados da empresa ─────────────────────────────────────────────────

interface StepCompanyProps {
  data: { companyName: string; businessType: string };
  onChange: (key: string, value: string) => void;
}

function StepCompany({ data, onChange }: StepCompanyProps) {
  const inputCls = "w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/50 transition-colors";

  return (
    <div className="space-y-5">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white mb-2">Sobre sua empresa</h2>
        <p className="text-zinc-400 text-sm">Essas informações serão usadas em toda a plataforma</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nome da empresa *</label>
        <input
          className={inputCls}
          value={data.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          placeholder="Ex: Moda & Cia"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tipo de negócio *</label>
        <select
          className={inputCls}
          value={data.businessType}
          onChange={(e) => onChange("businessType", e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="varejo">Varejo (loja física ou online)</option>
          <option value="industria">Indústria / Fabricação</option>
          <option value="servicos">Serviços</option>
          <option value="distribuicao">Distribuição / Atacado</option>
          <option value="alimentacao">Alimentação</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="text-zinc-400 font-medium">💡 Dica:</span> Você poderá completar o perfil da sua empresa com logo, CNPJ, endereço e contatos após o cadastro.
        </p>
      </div>
    </div>
  );
}

// ─── Passo 3: Dados pessoais ───────────────────────────────────────────────────

interface StepPersonalProps {
  data: { name: string; email: string; password: string };
  onChange: (key: string, value: string) => void;
}

function StepPersonal({ data, onChange }: StepPersonalProps) {
  const [showPass, setShowPass] = useState(false);
  const inputCls = "w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/50 transition-colors";

  const passwordStrength = (p: string) => {
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength(data.password);
  const strengthLabel = ["", "Fraca", "Razoável", "Boa", "Forte"][strength];
  const strengthColor = ["", "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500"][strength];

  return (
    <div className="space-y-5">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white mb-2">Dados de acesso</h2>
        <p className="text-zinc-400 text-sm">Você usará esses dados para entrar na plataforma</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Seu nome *</label>
        <input
          className={inputCls}
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ex: João Silva"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">E-mail *</label>
        <input
          className={inputCls}
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="joao@empresa.com"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Senha *</label>
        <div className="relative">
          <input
            className={`${inputCls} pr-10`}
            type={showPass ? "text" : "password"}
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {data.password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : "bg-zinc-800"}`} />
              ))}
            </div>
            <p className="text-xs text-zinc-500">Senha {strengthLabel}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-600 leading-relaxed">
        Ao criar sua conta você concorda com os{" "}
        <a href="#" className="text-zinc-400 underline">Termos de uso</a> e{" "}
        <a href="#" className="text-zinc-400 underline">Política de privacidade</a>.
      </p>
    </div>
  );
}

// ─── Passo 4: Sucesso ──────────────────────────────────────────────────────────

function StepSuccess({ name, plan }: { name: string; plan: Plan }) {
  const router = useRouter();

  return (
    <div className="text-center space-y-6 py-4">
      <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-400" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-white mb-2">
          Bem-vindo{name ? `, ${name.split(" ")[0]}` : ""}! 🎉
        </h2>
        <p className="text-zinc-400 text-sm">
          Sua conta foi criada com o plano{" "}
          <span className={plan === "PRO" ? "text-yellow-400 font-bold" : "text-white font-bold"}>
            {plan === "PRO" ? "Pro" : "Essencial"}
          </span>.
          Bem-vindo! Sua conta está pronta para uso.
        </p>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-left space-y-3">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Próximos passos</p>
        {[
          "Configure o perfil da sua empresa",
          "Cadastre seus primeiros produtos",
          "Realize sua primeira venda no PDV",
        ].map((s, i) => (
          <div key={s} className="flex items-center gap-3 text-sm text-zinc-300">
            <div className="w-5 h-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center shrink-0">
              <span className="text-yellow-400 text-xs font-bold">{i + 1}</span>
            </div>
            {s}
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02]"
      >
        Acessar a plataforma
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────

const STEPS = ["Plano", "Empresa", "Acesso", "Pronto"];

function CadastroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);

  const [plan, setPlan] = useState<Plan>("ESSENCIAL");
  const [company, setCompany] = useState({ companyName: "", businessType: "" });
  const [personal, setPersonal] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pré-seleciona plano se vier da landing page
  useEffect(() => {
    const p = searchParams.get("plano");
    if (p === "pro") setPlan("PRO");
    else if (p === "essencial") setPlan("ESSENCIAL");
  }, [searchParams]);

  function canAdvance() {
    if (step === 0) return true;
    if (step === 1) return company.companyName.trim() !== "" && company.businessType !== "";
    if (step === 2) return personal.name.trim() !== "" && personal.email.trim() !== "" && personal.password.length >= 6;
    return true;
  }

  async function handleNext() {
    if (!canAdvance()) return;

    // Passo 2 → criar conta real
    if (step === 2) {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();

        // 1. Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: personal.email,
          password: personal.password,
        });
        if (authError) throw new Error(authError.message);
        const supabaseUserId = authData.user?.id;
        if (!supabaseUserId) throw new Error("Erro ao criar usuário");

        // 2. Criar organização + usuário no banco + checkout Stripe
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseUserId,
            email: personal.email,
            name: personal.name,
            companyName: company.companyName,
            plan,
          }),
        });
        if (!regRes.ok) {
          const err = await regRes.json();
          throw new Error(err.error ?? "Erro ao registrar empresa");
        }
        const regData = await regRes.json();
        if (regData.checkoutUrl) {
          window.location.href = regData.checkoutUrl;
        } else {
          // Fallback: redireciona ao dashboard
          window.location.href = "/dashboard";
        }
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado");
        setLoading(false);
        return;
      }
    }

    setStep((s) => s + 1);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 h-16 flex items-center justify-between border-b border-white/5">
        <button onClick={() => router.push("/")} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-zinc-900 font-black text-sm">D</span>
          </div>
          <span className="font-black text-white text-base">Deppio</span>
        </button>
        <p className="text-sm text-zinc-500">
          Já tem conta?{" "}
          <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl flex gap-12 items-start">

          {/* Painel lateral — benefícios (apenas desktop) */}
          <div className="hidden lg:flex flex-col gap-6 w-80 shrink-0 pt-4">
            <div>
              <h2 className="text-xl font-black text-white mb-2">Comece a organizar seu negócio agora</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Gerencie estoque, vendas e faturamento em um só lugar.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: "PDV completo", desc: "Venda de forma rápida com nosso ponto de venda integrado" },
                { title: "Controle de estoque em tempo real", desc: "Saiba exatamente o que tem, onde está e quando repor" },
                { title: "Relatórios inteligentes", desc: "Tome decisões baseadas em dados reais do seu negócio" },
                { title: "Cancele quando quiser", desc: "Sem fidelidade, sem multa. Você está no controle" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mt-2">
              <p className="text-xs text-zinc-500 leading-relaxed">
                <span className="text-yellow-400 font-semibold">+500 empresas</span> já usam o Deppio para gerenciar seus negócios em todo o Brasil.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0">
            {/* Progress steps */}
            {step < STEPS.length - 1 && (
              <div className="flex items-center gap-0 mb-10">
                {STEPS.slice(0, -1).map((s, i) => (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        i < step
                          ? "bg-yellow-400 text-zinc-900"
                          : i === step
                            ? "border-2 border-yellow-400 text-yellow-400"
                            : "border-2 border-zinc-700 text-zinc-600"
                      }`}>
                        {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`text-[10px] font-medium hidden sm:block ${i === step ? "text-yellow-400" : "text-zinc-600"}`}>
                        {s}
                      </span>
                    </div>
                    {i < STEPS.length - 2 && (
                      <div className={`flex-1 h-px mx-2 mt-[-10px] ${i < step ? "bg-yellow-400/40" : "bg-zinc-800"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Card */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8">
            {step === 0 && (
              <StepPlan selected={plan} onSelect={setPlan} />
            )}
            {step === 1 && (
              <StepCompany
                data={company}
                onChange={(k, v) => setCompany((prev) => ({ ...prev, [k]: v }))}
              />
            )}
            {step === 2 && (
              <StepPersonal
                data={personal}
                onChange={(k, v) => setPersonal((prev) => ({ ...prev, [k]: v }))}
              />
            )}
            {step === 3 && (
              <StepSuccess name={personal.name} plan={plan} />
            )}

            {/* Navegação */}
            {step < 3 && (
              <div className="flex flex-col gap-3 mt-8">
                {error && (
                  <p className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}
                <div className="flex gap-3">
                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-sm font-medium rounded-xl transition-colors disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Voltar
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!canAdvance() || loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm rounded-xl transition-all bg-yellow-400 hover:bg-yellow-300 text-zinc-900 disabled:opacity-40 hover:scale-[1.01]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : step === 2 ? (
                      <>
                        <Zap className="w-4 h-4" />
                        Criar conta e assinar
                      </>
                    ) : (
                      "Continuar"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

            {/* Trial info */}
            {step < 3 && (
              <p className="text-center text-xs text-zinc-600 mt-4">
                🔒 Seus dados estão seguros · Cancele quando quiser
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <CadastroContent />
    </Suspense>
  );
}
