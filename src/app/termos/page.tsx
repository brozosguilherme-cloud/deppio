import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
};

export default function TermosPage() {
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
        <h1 className="text-3xl font-black mb-2">Termos de Uso</h1>
        <p className="text-sm text-zinc-500 mb-10">Última atualização: 29 de março de 2026</p>

        <div className="prose prose-invert prose-zinc prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Aceitação dos Termos</h2>
            <p className="text-zinc-400 leading-relaxed">
              Ao acessar ou utilizar a plataforma Deppio, você concorda com estes Termos de Uso.
              Se você não concordar com algum dos termos, não utilize o serviço. O uso continuado
              da plataforma após alterações constitui aceitação dos termos atualizados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Descrição do Serviço</h2>
            <p className="text-zinc-400 leading-relaxed">
              O Deppio é uma plataforma SaaS de gestão de estoque voltada para pequenas e médias
              empresas. O serviço inclui controle de produtos, ponto de venda (PDV), gestão de
              fornecedores, relatórios e demais funcionalidades descritas nos planos disponíveis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Cadastro e Conta</h2>
            <p className="text-zinc-400 leading-relaxed">
              Para utilizar o Deppio, é necessário criar uma conta com informações verdadeiras e
              atualizadas. Você é responsável por manter a confidencialidade das suas credenciais
              de acesso e por todas as atividades realizadas na sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Planos e Pagamentos</h2>
            <p className="text-zinc-400 leading-relaxed">
              O Deppio oferece planos de assinatura mensal. Os valores e funcionalidades de cada
              plano estão descritos na página de planos. Os pagamentos são processados via Stripe
              de forma segura. Você pode cancelar sua assinatura a qualquer momento, sem multa ou
              fidelidade, e o acesso permanece até o final do período pago.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Uso Aceitável</h2>
            <p className="text-zinc-400 leading-relaxed">
              Você se compromete a utilizar a plataforma de forma lícita e de acordo com estes
              termos. É proibido: (a) utilizar o serviço para fins ilegais; (b) tentar acessar
              contas de outros usuários; (c) interferir no funcionamento da plataforma; (d)
              realizar engenharia reversa do software.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Propriedade Intelectual</h2>
            <p className="text-zinc-400 leading-relaxed">
              Todo o conteúdo da plataforma, incluindo marca, design, código e documentação, é
              propriedade do Deppio. Os dados inseridos por você na plataforma permanecem de sua
              propriedade. Você concede ao Deppio uma licença limitada para processar e armazenar
              seus dados exclusivamente para a prestação do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Disponibilidade e Suporte</h2>
            <p className="text-zinc-400 leading-relaxed">
              O Deppio se esforça para manter a plataforma disponível 24/7, mas não garante
              disponibilidade ininterrupta. Manutenções programadas serão comunicadas com
              antecedência. O suporte é oferecido por e-mail conforme o plano contratado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Limitação de Responsabilidade</h2>
            <p className="text-zinc-400 leading-relaxed">
              O Deppio não se responsabiliza por danos indiretos, incidentais ou consequenciais
              decorrentes do uso ou impossibilidade de uso da plataforma. A responsabilidade total
              do Deppio é limitada ao valor pago nos últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Rescisão</h2>
            <p className="text-zinc-400 leading-relaxed">
              Você pode encerrar sua conta a qualquer momento. O Deppio pode suspender ou
              encerrar contas que violem estes termos, mediante notificação prévia quando possível.
              Após o encerramento, seus dados serão mantidos por 30 dias antes de serem
              permanentemente excluídos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Disposições Gerais</h2>
            <p className="text-zinc-400 leading-relaxed">
              Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer
              disputa será resolvida no foro da comarca de domicílio do Deppio. O Deppio pode
              atualizar estes termos periodicamente, notificando os usuários por e-mail ou pela
              plataforma.
            </p>
          </section>

          <section className="border-t border-white/5 pt-8">
            <p className="text-zinc-500 text-sm">
              Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail{" "}
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
