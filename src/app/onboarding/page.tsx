"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  name: z.string().min(2, "Nome da empresa é obrigatório"),
  businessType: z.string().min(1, "Selecione o tipo de negócio"),
  description: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const BUSINESS_TYPES = [
  { value: "varejo", label: "Varejo", desc: "Lojas, comércio ao consumidor final" },
  { value: "atacado", label: "Atacado", desc: "Distribuição em grandes quantidades" },
  { value: "industria", label: "Indústria", desc: "Fabricação e produção" },
  { value: "servicos", label: "Serviços", desc: "Prestação de serviços" },
  { value: "outro", label: "Outro", desc: "Outro tipo de negócio" },
];

const STEPS = [
  { id: 1, label: "Empresa", icon: Building2 },
  { id: 2, label: "Contato", icon: Phone },
  { id: 3, label: "Endereço", icon: MapPin },
  { id: 4, label: "Pronto!", icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessType: "",
    },
  });

  const selectedBusinessType = watch("businessType");

  async function nextStep() {
    let fields: (keyof FormData)[] = [];
    if (step === 1) fields = ["name", "businessType"];
    if (step === 2) fields = ["email", "phone"];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 4));
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/organization/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Erro ao salvar configurações");
        return;
      }

      setStep(4);
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  }

  function goToDashboard() {
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-700 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <span className="text-zinc-900 font-black text-xl leading-none">D</span>
          </div>
          <div>
            <span className="font-black text-white text-2xl tracking-tight">Deppio</span>
            <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase">Gestão de Estoque</p>
          </div>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-8 px-2">
            {STEPS.slice(0, 3).map((s, i) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isDone = s.id < step;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 ${isDone ? "text-primary-400" : isActive ? "text-white" : "text-zinc-600"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      isDone ? "bg-primary-500/20 border-primary-500 text-primary-400" :
                      isActive ? "bg-white/10 border-white text-white" :
                      "border-zinc-700 text-zinc-600"
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                  </div>
                  {i < 2 && (
                    <div className={`flex-1 h-px mx-2 w-8 sm:w-16 ${s.id < step ? "bg-primary-500/50" : "bg-zinc-700"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Card */}
        <div className="bg-surface-400 rounded-2xl border border-surface-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Step 1: Informações da empresa */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-white">Bem-vindo ao Deppio!</h1>
                  <p className="text-sm text-zinc-400 mt-1">Vamos configurar sua empresa em poucos minutos.</p>
                </div>

                <Input
                  label="Nome da empresa *"
                  placeholder="Ex: Loja do João"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Tipo de negócio *
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {BUSINESS_TYPES.map((bt) => (
                      <button
                        key={bt.value}
                        type="button"
                        onClick={() => setValue("businessType", bt.value, { shouldValidate: true })}
                        className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                          selectedBusinessType === bt.value
                            ? "border-primary-500 bg-primary-500/10"
                            : "border-zinc-700 hover:border-zinc-500 bg-surface-500"
                        }`}
                      >
                        <span className={`text-sm font-medium ${selectedBusinessType === bt.value ? "text-primary-400" : "text-white"}`}>
                          {bt.label}
                        </span>
                        <span className="text-xs text-zinc-500 ml-2">{bt.desc}</span>
                      </button>
                    ))}
                  </div>
                  {errors.businessType && (
                    <p className="mt-1 text-xs text-red-500">{errors.businessType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Descrição breve <span className="text-zinc-600">(opcional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Loja de calçados e acessórios no centro da cidade"
                    className="w-full border border-zinc-700 bg-surface-500 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    {...register("description")}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contato */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-white">Informações de contato</h1>
                  <p className="text-sm text-zinc-400 mt-1">Como seus clientes e fornecedores podem te encontrar?</p>
                </div>

                <Input
                  label="CNPJ"
                  placeholder="00.000.000/0001-00"
                  hint="Opcional"
                  {...register("cnpj")}
                />

                <Input
                  label="E-mail"
                  type="email"
                  placeholder="contato@suaempresa.com.br"
                  hint="Opcional"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  hint="Opcional"
                  {...register("phone")}
                />

                <Input
                  label="Site"
                  placeholder="https://suaempresa.com.br"
                  hint="Opcional"
                  {...register("website")}
                />
              </div>
            )}

            {/* Step 3: Endereço */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-white">Endereço</h1>
                  <p className="text-sm text-zinc-400 mt-1">Onde sua empresa está localizada?</p>
                </div>

                <Input
                  label="Endereço"
                  placeholder="Rua, número, complemento"
                  hint="Opcional"
                  {...register("address")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Cidade"
                    placeholder="São Paulo"
                    hint="Opcional"
                    {...register("city")}
                  />
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Estado <span className="text-zinc-600 text-xs">(opcional)</span>
                    </label>
                    <select
                      className="w-full border border-zinc-700 bg-surface-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      {...register("state")}
                    >
                      <option value="">UF</option>
                      {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="CEP"
                  placeholder="00000-000"
                  hint="Opcional"
                  {...register("zipCode")}
                />
              </div>
            )}

            {/* Step 4: Conclusão */}
            {step === 4 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-primary-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Tudo pronto!</h1>
                  <p className="text-sm text-zinc-400 mt-2">
                    Sua empresa foi configurada com sucesso. Agora você pode começar a gerenciar seu estoque.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-left bg-surface-500 rounded-xl p-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    Cadastro de produtos
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    Controle de estoque
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    PDV integrado
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    Relatórios e faturamento
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    Matérias-primas e BOM
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    Gestão de fornecedores
                  </div>
                </div>
                <Button className="w-full" onClick={goToDashboard}>
                  Ir para o Dashboard
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Navigation buttons */}
            {step < 4 && (
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={nextStep}
                  >
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Salvando...</>
                    ) : (
                      <>Concluir configuração<CheckCircle2 className="w-4 h-4 ml-1" /></>
                    )}
                  </Button>
                )}
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          Você pode alterar essas informações depois em <strong className="text-zinc-500">Configurações</strong>
        </p>
      </div>
    </div>
  );
}
