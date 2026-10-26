import type { Metadata } from 'next'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso do site e do Portal Pequeno Príncipe do Centro Educacional Pequeno Príncipe.',
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-4">
          Termos
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4 font-display">
          Termos de Uso
        </h1>
        <p className="text-sm text-slate-400 mb-10">Última atualização: 17 de agosto de 2026</p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          <div>
            <p>
              Estes Termos de Uso regulam o acesso e a utilização do site institucional e do Portal
              Pequeno Príncipe (&ldquo;Portal&rdquo;), disponibilizados pelo Centro Educacional Pequeno Príncipe
              (&ldquo;Escola&rdquo;) a alunos, responsáveis, professores e demais usuários autorizados.
              Ao acessar o site ou o Portal, você concorda com os termos descritos a seguir.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">1. Objeto</h2>
            <p>
              O site institucional tem caráter informativo, permitindo o conhecimento da proposta
              pedagógica da Escola, o envio de formulários de interesse de matrícula, agendamento de
              visitas e contato geral. O Portal é um ambiente restrito, destinado a responsáveis,
              alunos, professores e equipe administrativa devidamente cadastrados, para acompanhamento
              de notas, frequência, comunicados e informações financeiras.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">2. Cadastro e acesso ao Portal</h2>
            <p>
              O acesso ao Portal é concedido exclusivamente pela secretaria da Escola, mediante
              vínculo formal com a instituição (matrícula ativa, contrato de trabalho ou relação de
              responsabilidade legal por um aluno). Cada usuário é responsável pela guarda e sigilo
              de suas credenciais de acesso (e-mail e senha), não devendo compartilhá-las com
              terceiros. Qualquer atividade realizada com o login de um usuário é de sua
              responsabilidade.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">3. Uso adequado</h2>
            <p className="mb-3">Ao utilizar o site ou o Portal, o usuário compromete-se a:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Fornecer informações verdadeiras, completas e atualizadas nos formulários e cadastros;</li>
              <li>Não utilizar os serviços para fins ilícitos, fraudulentos ou que violem direitos de terceiros;</li>
              <li>Não tentar obter acesso não autorizado a dados de outros alunos, responsáveis ou usuários;</li>
              <li>Não reproduzir, copiar ou redistribuir conteúdos do site sem autorização prévia da Escola;</li>
              <li>Comunicar imediatamente a Escola em caso de suspeita de uso indevido de sua conta.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">4. Formulários públicos</h2>
            <p>
              Os formulários de interesse de matrícula, agendamento de visita e contato disponíveis
              no site não representam, por si só, a efetivação de matrícula ou compromisso de vaga.
              A confirmação da matrícula depende da disponibilidade de vagas, da entrega da
              documentação exigida e da assinatura do contrato de prestação de serviços educacionais.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">5. Disponibilidade dos serviços</h2>
            <p>
              A Escola envida esforços para manter o site e o Portal disponíveis e em pleno
              funcionamento, mas não garante disponibilidade ininterrupta, podendo haver
              interrupções temporárias para manutenção, atualização ou por motivos alheios à sua
              vontade.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">6. Propriedade intelectual</h2>
            <p>
              Todo o conteúdo do site — textos, imagens, identidade visual e marca &ldquo;Escola Pequeno
              Príncipe&rdquo; — é de propriedade da Escola ou usado sob licença, sendo vedada sua
              reprodução sem autorização prévia e expressa.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">7. Privacidade e proteção de dados</h2>
            <p>
              O tratamento de dados pessoais coletados por meio do site e do Portal segue as regras
              descritas em nossa{' '}
              <a href="/privacidade" className="text-[#b91c1c] hover:underline">Política de Privacidade</a>,
              elaborada em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">8. Alterações destes termos</h2>
            <p>
              A Escola pode atualizar estes Termos de Uso periodicamente, para refletir mudanças em
              seus serviços ou exigências legais. A versão vigente estará sempre disponível nesta
              página, com a data da última atualização indicada no topo.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">9. Contato</h2>
            <p>
              Dúvidas sobre estes Termos de Uso podem ser enviadas pelo e-mail{' '}
              <a href="mailto:cepp_pequenoprincipe@hotmail.com" className="text-[#b91c1c] hover:underline">
                cepp_pequenoprincipe@hotmail.com
              </a>{' '}
              ou pela nossa página de{' '}
              <a href="/contato" className="text-[#b91c1c] hover:underline">contato</a>.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
