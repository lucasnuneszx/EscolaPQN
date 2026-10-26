import type { Metadata } from 'next'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'
import FormMatricula from '@/components/public/FormMatricula'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Matrículas 2027',
  description:
    'Faça a matrícula do seu filho no Centro Educacional Pequeno Príncipe. Conheça as etapas, os documentos necessários e envie seu interesse.',
}

const ETAPAS = [
  {
    numero: '01',
    titulo: 'Envie seu interesse',
    texto: 'Preencha o formulário abaixo com os dados do responsável e da criança. Leva menos de dois minutos.',
  },
  {
    numero: '02',
    titulo: 'Contato da secretaria',
    texto: 'Nossa equipe entra em contato em até 2 dias úteis para esclarecer dúvidas e agendar uma visita, se desejar.',
  },
  {
    numero: '03',
    titulo: 'Visita e apresentação',
    texto: 'Conheça a estrutura, a proposta pedagógica e converse com a coordenação sobre a turma ideal para a criança.',
  },
  {
    numero: '04',
    titulo: 'Documentação e contrato',
    texto: 'Com a vaga confirmada, reunimos os documentos necessários e formalizamos a matrícula com a assinatura do contrato.',
  },
]

const DOCUMENTOS = [
  'Certidão de nascimento ou RG da criança (cópia)',
  'CPF do aluno, se houver',
  'Comprovante de residência atualizado',
  'RG e CPF do(s) responsável(is) legal(is)',
  'Cartão de vacinação atualizado',
  'Histórico escolar ou declaração de transferência (para alunos vindos de outra escola)',
  '1 foto 3x4 recente da criança',
  'Carteira de plano de saúde, se houver (para emergências)',
]

export default async function MatriculasPage() {
  const series = await prisma.serie.findMany({
    orderBy: { ordem: 'asc' },
    select: { id: true, nome: true },
  })

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <SiteHeader paginaAtiva="/matriculas" />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-4">
          Matrículas 2027 abertas
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5 font-display max-w-2xl">
          Garanta a vaga do seu filho na Pequeno Príncipe
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
          O processo de matrícula é simples e acolhedor. Comece enviando seu interesse — a nossa
          secretaria cuida do resto, com transparência a cada etapa.
        </p>
      </section>

      {/* Etapas */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-3">
            Como funciona
          </p>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-10 font-display">
            Da inscrição à matrícula, em 4 etapas
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ETAPAS.map(({ numero, titulo, texto }) => (
              <div key={numero} className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-2xl font-bold text-[#b91c1c]/30 mb-3 font-display">{numero}</p>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{titulo}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentos */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-3">
            Documentação
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">
            Documentos necessários
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Você não precisa reunir tudo agora — esta lista serve como referência. Nossa secretaria
            informa com clareza o que é necessário no momento da efetivação da matrícula.
          </p>
          <ul className="space-y-3">
            {DOCUMENTOS.map((doc) => (
              <li key={doc} className="flex items-start gap-3 text-sm text-slate-600">
                <svg className="w-4 h-4 text-[#b91c1c] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {doc}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 h-fit">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">Vagas limitadas</h3>
          <p className="text-sm text-amber-800/90 leading-relaxed mb-4">
            As turmas de 2027 têm vagas limitadas por faixa etária. Quanto antes você enviar seu
            interesse, maior a chance de garantir o turno e a turma desejados.
          </p>
          <p className="text-sm text-amber-800/90 leading-relaxed">
            Dúvidas antes de preencher o formulário? Fale com a secretaria pelo WhatsApp{' '}
            <a
              href="https://wa.me/557187226877?text=Olá! Tenho dúvidas sobre a matrícula 2027."
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-amber-900"
            >
              (71) 8722-6877
            </a>
            .
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section id="formulario" className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-3 text-center">
            Envie seu interesse
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center font-display">
            Formulário de interesse de matrícula
          </h2>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <FormMatricula series={series} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
