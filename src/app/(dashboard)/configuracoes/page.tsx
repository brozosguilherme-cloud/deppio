"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, Phone, MapPin, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Spinner";

const schema = z.object({
  name: z.string().min(2, "Nome da empresa é obrigatório"),
  businessType: z.string().optional(),
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
  { value: "varejo", label: "Varejo" },
  { value: "atacado", label: "Atacado" },
  { value: "industria", label: "Indústria" },
  { value: "servicos", label: "Serviços" },
  { value: "outro", label: "Outro" },
];

const SECTIONS = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "contato", label: "Contato", icon: Phone },
  { id: "endereco", label: "Endereço", icon: MapPin },
];

export default function ConfiguracoesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("empresa");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    fetch("/api/organization")
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json?.error || `HTTP ${r.status}`);
        return json;
      })
      .then((data) => {
        if (data && data.name) {
          reset({
            name: data.name ?? "",
            businessType: data.businessType ?? "",
            description: data.description ?? "",
            cnpj: data.cnpj ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            address: data.address ?? "",
            city: data.city ?? "",
            state: data.state ?? "",
            zipCode: data.zipCode ?? "",
            website: data.website ?? "",
          });
        }
      })
      .catch((err) => toast.error(`Erro: ${err.message}`))
      .finally(() => setIsLoading(false));
  }, [reset]);

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    try {
      const res = await fetch("/api/organization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const errMsg = errData?.error || "Erro ao salvar configurações";
        toast.error(errMsg);
        return;
      }

      toast.success("Configurações salvas com sucesso!");
      const updated = await res.json();
      reset({
        name: updated.name ?? "",
        businessType: updated.businessType ?? "",
        description: updated.description ?? "",
        cnpj: updated.cnpj ?? "",
        email: updated.email ?? "",
        phone: updated.phone ?? "",
        address: updated.address ?? "",
        city: updated.city ?? "",
        state: updated.state ?? "",
        zipCode: updated.zipCode ?? "",
        website: updated.website ?? "",
      });
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white">Configurações da Empresa</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Gerencie as informações da sua organização</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar de navegação */}
        <div className="w-48 shrink-0 space-y-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeSection === s.id
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                    : "text-zinc-400 hover:bg-surface-300 hover:text-white border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Formulário */}
        <div className="flex-1 bg-surface-400 rounded-xl border border-surface-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {activeSection === "empresa" && (
              <>
                <h2 className="text-sm font-semibold text-white border-b border-surface-200 pb-3">
                  Informações da Empresa
                </h2>
                <Input
                  label="Nome da empresa *"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Tipo de negócio
                  </label>
                  <select
                    className="w-full border border-zinc-700 bg-surface-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register("businessType")}
                  >
                    <option value="">Selecione...</option>
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt.value} value={bt.value}>{bt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Uma breve descrição do seu negócio..."
                    className="w-full border border-zinc-700 bg-surface-500 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    {...register("description")}
                  />
                </div>
              </>
            )}

            {activeSection === "contato" && (
              <>
                <h2 className="text-sm font-semibold text-white border-b border-surface-200 pb-3">
                  Informações de Contato
                </h2>
                <Input
                  label="CNPJ"
                  placeholder="00.000.000/0001-00"
                  {...register("cnpj")}
                />
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="contato@suaempresa.com.br"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  {...register("phone")}
                />
                <Input
                  label="Site"
                  placeholder="https://suaempresa.com.br"
                  {...register("website")}
                />
              </>
            )}

            {activeSection === "endereco" && (
              <>
                <h2 className="text-sm font-semibold text-white border-b border-surface-200 pb-3">
                  Endereço
                </h2>
                <Input
                  label="Endereço"
                  placeholder="Rua, número, complemento"
                  {...register("address")}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Cidade"
                    placeholder="São Paulo"
                    {...register("city")}
                  />
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Estado
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
                  {...register("zipCode")}
                />
              </>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={isSaving} disabled={!isDirty && !isSaving}>
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Salvando...</>
                ) : (
                  <><Save className="w-4 h-4 mr-1.5" />Salvar alterações</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
