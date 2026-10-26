import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Educação Infantil',
  description:
    'Conheça a Educação Infantil do Centro Educacional Pequeno Príncipe — formação de crianças a partir de 2 anos (Maternal ao Jardim II), com metodologia lúdica e cuidado individual.',
}

const TURMAS = [
  { nome: 'Maternal', idade: 'A partir de 2 anos' },
  { nome: 'Jardim I', idade: '3 a 4 anos' },
  { nome: 'Jardim II', idade: '4 a 5 anos' },
]

const ROTINA = [
  { hora: '7h30 – 8h', atividade: 'Acolhida calorosa e entrada' },
  { hora: '8h – 9h', atividade: 'Rodinha, cantigas, musicalização e agenda do dia' },
  { hora: '9h – 9h45', atividade: 'Atividades pedagógicas dirigidas e artes' },
  { hora: '9h45 – 10h15', atividade: 'Lanche servido pela nossa cozinha' },
  { hora: '10h15 – 11h', atividade: 'Parque infantil e brincadeiras livres' },
  { hora: '11h – 11h30', atividade: 'Higiene e organização para saída' },
]

const DIFERENCIAIS = [
  {
    titulo: 'Atenção e acolhimento',
    texto: 'Turmas estruturadas com olhar individualizado e acompanhamento dedicado desde o Maternal.',
  },
  {
    titulo: 'Aprender brincando',
    texto: 'O brincar é o principal instrumento pedagógico: jogos simbólicos, contação de histórias e movimento.',
  },
  {
    titulo: 'Desenvolvimento socioemocional',
    texto: 'Trabalho intencional de autonomia, regulação emocional, afeto e convivência em grupo.',
  },
  {
    titulo: 'Cozinha própria',
    texto: 'Refeições e lanches servidos diariamente pela cozinha própria da escola com carinho e rigorosa higiene.',
  },
  {
    titulo: 'Higiene e cuidado',
    texto: 'Banheiros adaptados para crianças e equipe atenta para apoiar no desenvolvimento da autonomia.',
  },
  {
    titulo: 'Transição para o Fundamental',
    texto: 'No Jardim II, desenvolvemos habilidades de pré-alfabetização e letramento que preparam para o 1.º Ano.',
  },
]

export default function EducacaoInfantilPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <SiteHeader paginaAtiva="/educacao-infantil" />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-4">
            A partir de 2 anos · Maternal ao Jardim II
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-5 font-display">
            Educação Infantil
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-300 leading-relaxed max-w-md">
            Os primeiros anos moldam a relação da criança com o aprender. Por isso, acolhemos crianças a partir de 2 anos com afeto, respeito e propostas pedagógicas lúdicas.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg border border-slate-100 dark:border-slate-800">
          <Image
            src="/sala-aula.png"
            alt="Sala de Educação Infantil do Centro Educacional Pequeno Príncipe"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* ── Turmas ────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Turmas por faixa etária
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-10 font-display">
            Do Maternal ao Jardim II
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {TURMAS.map(({ nome, idade }) => (
              <div key={nome} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center shadow-xs">
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{nome}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{idade}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metodologia ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
          Metodologia
        </p>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-6 font-display max-w-xl">
          Aprendizagem por meio do brincar e da interação
        </h2>
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <p>
              Seguindo a abordagem sociointeracionista, na Educação Infantil o brincar é a principal ferramenta de aprendizado. É interagindo com colegas e educadores que a criança desenvolve linguagem, coordenação motora, imaginação e noções de convivência.
            </p>
            <p>
              Nossas propostas pedagógicas combinam momentos dirigidos (rodinha, contação de
              histórias, brincadeiras cantadas e psicomotricidade) com momentos de exploração do ambiente e livre imaginação.
            </p>
            <p>
              Do Jardim I ao Jardim II, introduzimos gradualmente noções de letras, sons, números e
              expressão criativa, sempre com ludicidade e respeitando o tempo de cada criança.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Rotina de referência</h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden bg-white dark:bg-slate-900">
              {ROTINA.map(({ hora, atividade }) => (
                <div key={hora} className="flex items-center gap-4 px-4 py-3">
                  <span className="text-xs font-semibold text-[#b91c1c] dark:text-red-400 w-24 shrink-0">{hora}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{atividade}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Horários de referência do turno matutino (7h30 às 11h30) e vespertino (13h às 17h).
            </p>
          </div>
        </div>
      </section>

      {/* ── Diferenciais ──────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Diferenciais
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-10 font-display">
            Estrutura pensada para a primeira infância
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {DIFERENCIAIS.map(({ titulo, texto }) => (
              <div key={titulo} className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{titulo}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-[#b91c1c] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display">
              Matricule seu filho na Educação Infantil
            </h2>
            <p className="text-red-100 text-sm leading-relaxed">
              Vagas limitadas por turma para 2027 (a partir de 2 anos). Envie seu interesse ou agende uma visita.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/matriculas"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#b91c1c] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors shadow-sm"
            >
              Garantir vaga
            </Link>
            <Link
              href="/agendar-visita"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-white/10 transition-colors"
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
