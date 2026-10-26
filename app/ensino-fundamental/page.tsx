import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Ensino Fundamental I',
  description:
    'Conheça o Ensino Fundamental I do Centro Educacional Pequeno Príncipe — do 1.º ao 5.º ano, com grade curricular, avaliação processual trimestral e projetos interdisciplinares.',
}

const SERIES = [
  { nome: '1.º Ano', foco: 'Alfabetização e letramento' },
  { nome: '2.º Ano', foco: 'Consolidação da leitura e escrita' },
  { nome: '3.º Ano', foco: 'Autonomia leitora e raciocínio lógico' },
  { nome: '4.º Ano', foco: 'Produção textual e resolução de problemas' },
  { nome: '5.º Ano', foco: 'Preparação para os Anos Finais' },
]

const GRADE = [
  'Língua Portuguesa',
  'Matemática',
  'Ciências',
  'História',
  'Geografia',
  'Inglês',
  'Artes',
  'Educação Física',
  'Ética',
]

const AVALIACAO = [
  {
    titulo: 'Avaliação processual',
    texto: 'Combinamos provas, trabalhos, participação e produções ao longo do trimestre — a nota final reflete a trajetória, não apenas um dia.',
  },
  {
    titulo: 'Boletim como diálogo',
    texto: 'Entregamos o boletim trimestral acompanhado de uma conversa com os pais sempre que necessário, nunca apenas um número isolado.',
  },
  {
    titulo: 'Portal de acompanhamento',
    texto: 'Notas trimestrais, frequência e comunicados ficam disponíveis em tempo real no Portal Pequeno Príncipe.',
  },
]

const PROJETOS = [
  {
    titulo: 'Projetos interdisciplinares',
    texto: 'A cada trimestre, uma pergunta-guia conecta conteúdos de diferentes disciplinas em um projeto prático, culminando em uma mostra para as famílias.',
  },
  {
    titulo: 'Leitura compartilhada',
    texto: 'Projeto de incentivo à leitura com rodas de livros, biblioteca de sala e metas de leitura por série.',
  },
  {
    titulo: 'Reforço integrado',
    texto: 'Alunos com dificuldades pontuais recebem apoio incorporado à rotina escolar, sem custo extra e sem estigma.',
  },
]

export default function EnsinoFundamentalPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <SiteHeader paginaAtiva="/ensino-fundamental" />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-4">
            1.º ao 5.º Ano · Ensino Fundamental I
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-5 font-display">
            Ensino Fundamental I
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-300 leading-relaxed max-w-md">
            Alfabetização sólida, letramento pleno e desenvolvimento de competências, com
            acompanhamento individual e avaliação trimestral a favor da aprendizagem.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg border border-slate-100 dark:border-slate-800">
          <Image
            src="/fachada-pequeno-principe.png"
            alt="Fachada do Centro Educacional Pequeno Príncipe"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Séries */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Séries
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-10 font-display">
            Do 1.º ao 5.º Ano
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {SERIES.map(({ nome, foco }) => (
              <div key={nome} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <p className="text-base font-bold text-slate-900 dark:text-white mb-2">{nome}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{foco}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Curricular */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Componentes curriculares
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight font-display">
            Grade curricular
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
            Currículo alinhado à Base Nacional Comum Curricular (BNCC), integrando áreas do conhecimento com valores humanos e formação cidadã.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {GRADE.map((disciplina) => (
            <div
              key={disciplina}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#b91c1c]" />
              {disciplina}
            </div>
          ))}
        </div>
      </section>

      {/* Avaliação */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
              Sistema de avaliação
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight font-display">
              Como avaliamos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {AVALIACAO.map(({ titulo, texto }) => (
              <div key={titulo} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{titulo}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Diferenciais
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight font-display">
            Projetos pedagógicos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PROJETOS.map(({ titulo, texto }) => (
            <div key={titulo} className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{titulo}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#b91c1c] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display">
              Garanta a vaga do seu filho no Ensino Fundamental
            </h2>
            <p className="text-red-100 text-sm leading-relaxed">
              Agende uma visita e conheça nossos professores, salas e metodologia de perto.
            </p>
          </div>
          <Link
            href="/agendar-visita"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#b91c1c] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors shrink-0 shadow-sm"
          >
            Agendar visita
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
