import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-zinc-900 font-black text-base leading-none">D</span>
            </div>
            <span className="font-black text-white text-lg tracking-tight">Deppio</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-black mb-2">Política de Privacidade</h1>
        <p className="text-sm text-zinc-500 mb-10">Última atualização: 29 de março de 2026</p>

        <div className="prose prose-invert prose-zinc prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Informações que Coletamos</h2>
            <p className="text-zinc-400 leading-relaxed">
              Coletamos as seguintes informações quando você utiliza o Deppio:
            </p>
            <ul className="text-zinc-400 space-y-1.5 mt-2 list-disc pl-5">
              <li>Dados de cadastro: nome, e-mail, nome da empresa, CNPJ</li>
              <li>Dados de uso: produtos, estoque, vendas e demais informações inseridas por você</li>
              <li>Dados técnicos: endereço IP, tipo de navegador, páginas acessadas</li>
              <li>Dados de pagamento: processados diretamente pelo Stripe (não armazenamos dados de cartão)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Como Utilizamos suas Informações</h2>
            <p className="text-zinc-400 leading-relaxed">
              Utilizamos suas informações para:
            </p>
            <ul className="text-zinc-400 space-y-1.5 mt-2 list-disc pl-5">
              <li>Fornecer e manter o serviço</li>
              <li>Processar pagamentos e gerenciar sua assinatura</li>
              <li>Enviar comunicações relacionadas ao serviço (atualizações, suporte)</li>
              <li>Melhorar a plataforma com base em padrões de uso agregados</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Compartilhamento de Dados</h2>
            <p className="text-zinc-400 leading-relaxed">
              Não vendemos seus dados pessoais. Compartilhamos informações apenas com:
            </p>
            <ul className="text-zinc-400 space-y-1.5 mt-2 list-disc pl-5">
              <li><strong className="text-zinc-300">Stripe</strong> — processamento de pagamentos</li>
              <li><strong className="text-zinc-300">Supabase</strong> — armazenamento seguro de dados e autenticação</li>
              <li><strong className="text-zinc-300">Vercel</strong> — hospedagem da aplicação</li>
              <li>Autoridades legais, quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Armazenamento e Segurança</h2>
            <p className="text-zinc-400 leading-relaxed">
              Seus dados são armazenados em servidores seguros com criptografia em trânsito (TLS)
              e em repouso. Utilizamos práticas de segurança como autenticação robusta, controle
              de acesso por organização e isolamento de dados entre contas (multi-tenant).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Seus Direitos (LGPD)</h2>
            <p className="text-zinc-400 leading-relaxed">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="text-zinc-400 space-y-1.5 mt-2 list-disc pl-5">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Solicitar a portabilidade dos seus dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Obter informações sobre compartilhamento de dados</li>
            </ul>
            <p className="text-zinc-400 leading-relaxed mt-3">
              Para exercer seus direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@deppio.com.br" className="text-yellow-400 hover:underline">
                contato@deppio.com.br
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Cookies</h2>
            <p className="text-zinc-400 leading-relaxed">
              Utilizamos cookies essenciais para manter sua sessão ativa e garantir o funcionamento
              da plataforma. Não utilizamos cookies de rastreamento publicitário.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Retenção de Dados</h2>
            <p className="text-zinc-400 leading-relaxed">
              Mantemos seus dados enquanto sua conta estiver ativa. Após o cancelamento, seus
              dados são mantidos por 30 dias e depois permanentemente excluídos. Dados necessários
              para cumprimento de obrigações legais podem ser retidos por período superior.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Alterações nesta Política</h2>
            <p className="text-zinc-400 leading-relaxed">
              Podemos atualizar esta política periodicamente. Alterações significativas serão
              comunicadas por e-mail ou pela plataforma. O uso continuado do serviço após
              alterações constitui aceitação da política atualizada.
            </p>
          </section>

          <section className="border-t border-white/5 pt-8">
            <p className="text-zinc-500 text-sm">
              Em caso de dúvidas sobre esta política, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@deppio.com.br" className="text-yellow-400 hover:underline">
                contato@deppio.com.br
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
