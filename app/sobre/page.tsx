import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Sobre a escola',
  description:
    'Conheça a história, a missão e a proposta pedagógica do Centro Educacional Pequeno Príncipe, em Dias d\'Ávila, Bahia.',
}

const VALORES = [
  {
    titulo: 'Acolhimento',
    texto: 'Cada criança é recebida como é, no seu tempo, com suas particularidades respeitadas.',
  },
  {
    titulo: 'Transparência',
    texto: 'Comunicação clara e constante com as famílias, sem surpresas — nem no pedagógico, nem no financeiro.',
  },
  {
    titulo: 'Excelência pedagógica',
    texto: 'Currículo alinhado à BNCC, formação continuada da equipe e avaliação a serviço da aprendizagem.',
  },
  {
    titulo: 'Responsabilidade',
    texto: 'Compromisso com a segurança, o bem-estar e o desenvolvimento integral de cada aluno.',
  },
]

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <SiteHeader paginaAtiva="/sobre" />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-4">
            A escola
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-5 font-display">
            Formando crianças<br />com raízes e asas
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-300 leading-relaxed max-w-md">
            Há mais de 35 anos em Dias d&#39;Ávila, o Centro Educacional Pequeno Príncipe une afeto e
            excelência acadêmica na formação de crianças a partir de 2 anos.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg border border-slate-100 dark:border-slate-800">
          <Image
            src="/fachada-pequeno-principe.png"
            alt="Fachada do Centro Educacional Pequeno Príncipe em Dias d'Ávila"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* História */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Nossa história
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">
            De uma sala de aula a uma comunidade escolar
          </h2>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Nasceu do sonho de uma educadora que acreditava que a educação poderia mudar o mundo e transformar histórias.
            </p>
            <p>
              Iniciamos em casa adaptada porém já iniciamos com educação infantil e fundamental.
            </p>
            <p>
              Ao longo desses mais de 35 anos de história, mantivemos o que nunca mudou: o compromisso com uma educação que
              enxerga a criança inteira — não apenas suas notas, mas também seus sentimentos, seu
              ritmo e sua curiosidade natural.
            </p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md border border-slate-100 dark:border-slate-800">
          <Image
            src="/sala-aula.png"
            alt="Sala de aula do Centro Educacional Pequeno Príncipe"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
              Nossos princípios
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight font-display">
              Missão, visão e valores
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-7">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Missão</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Oferecer uma educação infantil e fundamental de excelência, alicerçada no afeto,
                na ética e no rigor pedagógico, formando crianças autônomas, curiosas e preparadas
                para os desafios do mundo — sem perder a leveza da infância.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-7">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Visão</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Ser reconhecida em Dias d&#39;Ávila e região como a escola que combina qualidade
                pedagógica, proximidade com as famílias e cuidado genuíno com cada criança, sendo
                referência em educação infantil e ensino fundamental na Bahia.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALORES.map(({ titulo, texto }) => (
              <div key={titulo} className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{titulo}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposta pedagógica */}
      <section id="pedagogia" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20">
        <div className="max-w-xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3">
            Proposta pedagógica
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight font-display">
            Como ensinamos
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
            Seguindo o método sócio interacionista, nossa proposta pedagógica é construída sobre três pilares: base curricular sólida,
            metodologias ativas e acompanhamento individual de cada aluno.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/60 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#b91c1c] dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Currículo alinhado à BNCC</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Todo o planejamento pedagógico segue a Base Nacional Comum Curricular, garantindo que
              cada aluno desenvolva as competências esperadas em cada etapa, com qualidade e
              consistência.
            </p>
          </div>

          <div>
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/60 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#b91c1c] dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Metodologias ativas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              O aluno é protagonista do próprio aprendizado. Trabalhamos com projetos
              interdisciplinares, jogos pedagógicos e situações-problema que estimulam a
              curiosidade e o pensamento crítico desde cedo.
            </p>
          </div>

          <div>
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/60 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#b91c1c] dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Acompanhamento individual</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Turmas com atenção acolhedora e avaliação formativa contínua permitem que professores identifiquem
              rapidamente as necessidades de cada criança e ajustem o ensino ao seu ritmo.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <Link
            href="/educacao-infantil"
            className="inline-flex items-center justify-center gap-2 bg-[#b91c1c] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#991b1b] transition-colors text-sm"
          >
            Ver Educação Infantil
          </Link>
          <Link
            href="/ensino-fundamental"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            Ver Ensino Fundamental I
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#b91c1c] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display">
              Quer conhecer nossa proposta de perto?
            </h2>
            <p className="text-red-100 text-sm leading-relaxed">
              Agende uma visita e converse com nossa equipe pedagógica.
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
