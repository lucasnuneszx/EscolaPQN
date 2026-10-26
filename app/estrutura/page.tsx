import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Estrutura',
  description:
    'Conheça a infraestrutura do Centro Educacional Pequeno Príncipe: salas arejadas, parque infantil, cozinha própria, segurança e ambiente plano.',
}

const ESPACOS = [
  {
    titulo: 'Salas de aula arejadas',
    texto: 'Salas amplas, com excelente ventilação, iluminação natural e mobiliário adequado a cada faixa etária, do Maternal ao 5.º Ano.',
  },
  {
    titulo: 'Parque e área de recreação',
    texto: 'Parque infantil com brinquedos adequados por idade e área coberta para recreação e brincadeiras livres.',
  },
  {
    titulo: 'Cozinha própria e fornecimento de refeições',
    texto: 'Cozinha própria estruturada onde servimos refeições e lanches preparados com rigoroso cuidado, higiene e afeto.',
  },
  {
    titulo: 'Biblioteca infantil & cantinho da leitura',
    texto: 'Acervo por faixa etária com livros infantis e contação de histórias para estimular o gosto pelos livros desde cedo.',
  },
  {
    titulo: 'Banheiros infantis adaptados',
    texto: 'Instalações sanitárias adequadas à altura e autonomia de cada faixa etária, incluindo apoio cuidadoso na Educação Infantil.',
  },
  {
    titulo: 'Pátio coberto multiuso',
    texto: 'Espaço para eventos escolares, apresentações comemorativas e atividades recreativas protegidas do sol e da chuva.',
  },
]

const SEGURANCA = [
  'Câmeras de monitoramento em áreas comuns e de circulação',
  'Protocolo rigoroso de entrada e saída, com entrega dos alunos exclusivamente a responsáveis autorizados',
  'Supervisão atenta da equipe escolar durante todo o período de aula e recreio',
  'Equipe capacitada e orientada para primeiros socorros',
  'Extintores e equipamentos de segurança vistoriados',
]

const ACESSIBILIDADE = [
  'Estrutura totalmente plana, sem degraus ou escadas, proporcionando circulação segura para todas as crianças',
  'Espaços amplos que facilitam a mobilidade no dia a dia',
  'Equipe pedagógica acolhedora e orientada para inclusão de alunos com necessidades específicas',
  'Atendimento com olhar individualizado e diálogo constante com as famílias',
]

export default function EstruturaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <SiteHeader paginaAtiva="/estrutura" />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-4">
            Infraestrutura
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-5 font-display">
            Um espaço pensado<br />para crianças
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-300 leading-relaxed max-w-md">
            Cada ambiente da escola foi preparado com um propósito: acolher, estimular o aprendizado e manter a
            segurança e o bem-estar de cada criança.
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

      {/* ── Espaços ───────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Espaços da escola
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-10 font-display">
            Conheça nossos ambientes
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ESPACOS.map(({ titulo, texto }) => (
              <div key={titulo} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{titulo}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Segurança e Acessibilidade ────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Segurança
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">
            Ambiente seguro e protegido
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Levamos a segurança das crianças a sério, com rotinas claras e supervisão constante da nossa equipe para tranquilidade de toda a família.
          </p>
          <ul className="space-y-3">
            {SEGURANCA.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-[#b91c1c] dark:text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Acessibilidade e Conforto
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">
            Estrutura plana e acolhedora
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Por ser uma edificação térrea e plana, a escola oferece fácil locomoção, sem obstáculos de degraus para as crianças pequenas.
          </p>
          <ul className="space-y-3">
            {ACESSIBILIDADE.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-[#b91c1c] dark:text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-[#b91c1c] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display">
              A melhor forma de conhecer é visitando
            </h2>
            <p className="text-red-100 text-sm leading-relaxed">
              Agende uma visita e conheça nosso espaço de perto.
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
