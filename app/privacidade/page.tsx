import type { Metadata } from 'next'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Política de Privacidade do Centro Educacional Pequeno Príncipe, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-4">
          LGPD
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4 font-display">
          Política de Privacidade
        </h1>
        <p className="text-sm text-slate-400 mb-10">Última atualização: 17 de agosto de 2026</p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          <div>
            <p>
              O Centro Educacional Pequeno Príncipe (&ldquo;Escola&rdquo;, &ldquo;nós&rdquo;), inscrita e sediada em Dias
              d&#39;Ávila, Bahia, respeita a privacidade e a proteção de dados pessoais de alunos,
              responsáveis, professores, funcionários e visitantes do site, em conformidade com a
              Lei n.º 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD) e demais normas
              aplicáveis. Esta Política explica quais dados coletamos, para que finalidades, com
              quem podem ser compartilhados e quais direitos você possui sobre eles.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">1. Quais dados coletamos</h2>
            <p className="mb-3">
              Coletamos diferentes categorias de dados pessoais, conforme a relação que você (ou
              seu(sua) filho(a)) mantém com a Escola:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-800">Dados de identificação e cadastro do aluno:</strong>{' '}
                nome, nome social, data de nascimento, sexo, CPF, RG, certidão de nascimento,
                endereço, foto, informações de saúde relevantes (alergias, necessidades especiais,
                plano de saúde) e histórico escolar.
              </li>
              <li>
                <strong className="text-slate-800">Dados do responsável:</strong> nome, CPF, RG,
                data de nascimento, e-mail, telefone, WhatsApp, endereço, grau de parentesco e
                consentimentos registrados (uso de imagem, tratamento de dados — LGPD).
              </li>
              <li>
                <strong className="text-slate-800">Dados acadêmicos:</strong> notas, frequência,
                observações pedagógicas, documentos escolares e comunicados.
              </li>
              <li>
                <strong className="text-slate-800">Dados financeiros:</strong> mensalidades,
                descontos, histórico de pagamentos, dados de cobrança (boleto/Pix) processados por
                meio de nosso parceiro de pagamentos.
              </li>
              <li>
                <strong className="text-slate-800">Dados de navegação:</strong> endereço IP e
                informações técnicas coletadas automaticamente ao utilizar nosso site ou portal,
                para fins de segurança e auditoria.
              </li>
              <li>
                <strong className="text-slate-800">Dados enviados voluntariamente:</strong>{' '}
                informações fornecidas em formulários de interesse de matrícula, agendamento de
                visita ou contato, como nome, e-mail, telefone e mensagem.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">2. Para que usamos seus dados</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Viabilizar o processo de matrícula e a prestação do serviço educacional;</li>
              <li>Gerir a vida acadêmica do aluno (notas, frequência, comunicados);</li>
              <li>Processar cobranças e gerir o financeiro escolar;</li>
              <li>Garantir a segurança dos alunos dentro das dependências da Escola;</li>
              <li>Cumprir obrigações legais e regulatórias aplicáveis à educação básica;</li>
              <li>Responder a solicitações de contato, matrícula e agendamento de visita;</li>
              <li>Melhorar nossos serviços e a experiência no site e no portal.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">3. Base legal para o tratamento</h2>
            <p>
              Tratamos dados pessoais com fundamento na execução de contrato educacional, no
              cumprimento de obrigação legal ou regulatória, no consentimento do titular (ou de seu
              responsável legal, no caso de crianças e adolescentes) e no legítimo interesse da
              Escola, sempre respeitando os limites impostos pela LGPD, em especial quanto ao
              tratamento de dados de crianças, que exige consentimento específico e em destaque dos
              pais ou responsáveis.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">4. Compartilhamento de dados</h2>
            <p>
              Não vendemos dados pessoais. Podemos compartilhar dados estritamente necessários com:
              (i) processadores de pagamento, para emissão de boletos e Pix; (ii) autoridades
              públicas, quando exigido por lei ou ordem judicial; (iii) prestadores de serviços de
              tecnologia que operam nossos sistemas, sob obrigações contratuais de confidencialidade
              e segurança.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">5. Retenção de dados</h2>
            <p>
              Mantemos os dados pessoais pelo tempo necessário ao cumprimento das finalidades para
              as quais foram coletados, incluindo o cumprimento de obrigações legais, fiscais e
              regulatórias aplicáveis a instituições de ensino, sendo posteriormente eliminados ou
              anonimizados.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">6. Seus direitos como titular</h2>
            <p className="mb-3">Nos termos da LGPD, você (ou o responsável legal do aluno) pode solicitar, a qualquer momento:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Confirmação da existência de tratamento de dados;</li>
              <li>Acesso aos dados pessoais tratados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
              <li>Revogação do consentimento, quando aplicável;</li>
              <li>Informação sobre entidades com as quais os dados foram compartilhados.</li>
            </ul>
            <p className="mt-3">
              Solicitações podem ser feitas pelo e-mail{' '}
              <a href="mailto:cepp_pequenoprincipe@hotmail.com" className="text-[#b91c1c] hover:underline">
                cepp_pequenoprincipe@hotmail.com
              </a>{' '}
              ou pela nossa página de{' '}
              <a href="/contato" className="text-[#b91c1c] hover:underline">contato</a>.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">7. Segurança da informação</h2>
            <p>
              Adotamos medidas técnicas e administrativas para proteger os dados pessoais contra
              acessos não autorizados e situações de destruição, perda, alteração, comunicação ou
              qualquer forma de tratamento inadequado ou ilícito, incluindo controle de acesso por
              perfil de usuário, autenticação e registro de auditoria das ações realizadas em
              nossos sistemas.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">8. Alterações desta política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente para refletir
              melhorias em nossas práticas ou mudanças legais. A versão vigente estará sempre
              disponível nesta página, com a data da última atualização indicada no topo.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">9. Contato</h2>
            <p>
              Em caso de dúvidas sobre esta Política ou sobre o tratamento de dados pessoais pela
              Centro Educacional Pequeno Príncipe, entre em contato pelo e-mail{' '}
              <a href="mailto:cepp_pequenoprincipe@hotmail.com" className="text-[#b91c1c] hover:underline">
                cepp_pequenoprincipe@hotmail.com
              </a>{' '}
              ou pelo telefone (71) 8722-6877.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
