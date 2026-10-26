import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Perguntas frequentes',
  description:
    'Tire suas dúvidas sobre matrícula, documentos, uniforme, calendário, transporte e pagamento no Centro Educacional Pequeno Príncipe.',
}

const FAQS = [
  {
    q: 'Qual a faixa etária atendida?',
    r: 'Atendemos crianças a partir de 2 anos (Maternal) até o 5.º Ano do Ensino Fundamental, com turmas nos turnos matutino e vespertino.',
  },
  {
    q: 'Como funciona o processo de matrícula?',
    r: 'O interessado preenche o formulário de interesse no site ou entra em contato pelo WhatsApp. A secretaria entra em contato para agendar uma visita e apresentar os documentos necessários. A matrícula é efetivada após a assinatura do contrato.',
  },
  {
    q: 'A escola oferece transporte escolar?',
    r: 'Não operamos frota própria, mas trabalhamos com monitores de transporte escolar credenciados que atendem diferentes regiões de Dias d\'Ávila. A secretaria pode indicar opções ativas na sua região.',
  },
  {
    q: 'Como os pais acompanham as notas e comunicados?',
    r: 'Por meio do Portal Pequeno Príncipe — acessível pelo celular ou computador, com notas trimestrais, frequência, mensalidades e comunicados da escola em tempo real.',
  },
  {
    q: 'Quais documentos são necessários para a matrícula?',
    r: 'Certidão de nascimento ou RG da criança, CPF do aluno (se houver), comprovante de residência atualizado, RG e CPF do(s) responsável(is), cartão de vacinação atualizado, histórico escolar (para transferências) e uma foto 3x4 recente. A lista completa é confirmada pela secretaria no momento da matrícula.',
  },
  {
    q: 'A escola exige uniforme?',
    r: 'Sim. O uso do uniforme é obrigatório em todas as atividades escolares, incluindo educação física. O uniforme é adquirido em loja parceira indicada pela secretaria, que informa tamanhos e preços no momento da matrícula.',
  },
  {
    q: 'Onde encontro o calendário escolar?',
    r: 'O calendário letivo anual — com início e fim do ano letivo, feriados, recessos, reuniões de pais e eventos — é disponibilizado no Portal Pequeno Príncipe e entregue impresso no início do ano letivo.',
  },
  {
    q: 'Qual é a política de faltas e justificativas?',
    r: 'Faltas podem ser justificadas mediante atestado médico ou declaração, anexados pelo responsável diretamente no Portal ou entregues à secretaria em até 5 dias úteis. O acompanhamento de frequência é feito trimestralmente e informado às famílias.',
  },
  {
    q: 'Quais são as formas de pagamento da mensalidade?',
    r: 'As mensalidades podem ser pagas via boleto bancário ou Pix, gerados automaticamente e disponíveis no Portal do responsável, com vencimento mensal fixo. Também é possível consultar o histórico de pagamentos e a segunda via de boletos a qualquer momento.',
  },
  {
    q: 'Há desconto para irmãos matriculados?',
    r: 'Sim, a escola oferece condições especiais para famílias com mais de um filho matriculado. Consulte a secretaria para conhecer os percentuais vigentes.',
  },
  {
    q: 'Como funciona a alimentação escolar?',
    r: 'Refeições e lanches são preparados e servidos pela cozinha própria da escola com rigoroso controle de higiene e carinho. Comunique à secretaria qualquer restrição alimentar, alergia ou intolerância.',
  },
  {
    q: 'A escola atende alunos com necessidades específicas?',
    r: 'Sim. Nossa equipe pedagógica trabalha com acolhimento, respeito e estratégias de inclusão para garantir o melhor acompanhamento possível de cada criança.',
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <SiteHeader paginaAtiva="/faq" />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-4">
          Dúvidas frequentes
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5 font-display">
          Perguntas mais comuns
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Reunimos aqui as dúvidas mais frequentes de famílias que buscam conhecer a escola.
          Não encontrou o que procurava? Fale conosco.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="space-y-6">
          {FAQS.map(({ q, r }) => (
            <div key={q} className="border-b border-slate-200 pb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{q}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3 font-display">
            Ainda tem dúvidas?
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-md mx-auto">
            Nossa secretaria está pronta para conversar com você sobre qualquer aspecto da vida
            escolar do seu filho.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 bg-[#b91c1c] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#991b1b] transition-colors text-sm"
            >
              Falar com a secretaria
            </Link>
            <Link
              href="/agendar-visita"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors text-sm"
            >
              Agendar visita
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
