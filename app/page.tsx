import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Lightbulb,
  Mail,
  MapPin,
  Palette,
  School,
  ShieldCheck,
  Smartphone,
  Star,
} from 'lucide-react'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Centro Educacional Pequeno Príncipe — Dias d\'Ávila, Bahia',
  description:
    'Educação infantil e ensino fundamental em Dias d\'Ávila, BA. Há mais de 35 anos formando crianças a partir de 2 anos com responsabilidade, afeto e excelência pedagógica.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 selection:bg-red-500 selection:text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Navegação ─────────────────────────────────────────── */}
      <SiteHeader paginaAtiva="/" />

      {/* ── Hero Principal ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 pt-10 sm:pt-14 pb-14 sm:pb-20 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Coluna Texto (Hero) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200/80 dark:border-red-800/60 text-[#b91c1c] dark:text-red-400 text-xs font-semibold uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#b91c1c] dark:bg-red-400 animate-pulse" />
              Matrículas 2027 Abertas · Dias d&#39;Ávila, BA
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
              Uma escola que ensina com <span className="text-[#b91c1c] dark:text-red-500">excelência</span> e acolhe com <span className="underline decoration-amber-400 decoration-wavy underline-offset-4">amor</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Há mais de 35 anos em Dias d&#39;Ávila. Do Maternal ao 5º Ano do Ensino Fundamental — formação de crianças a partir de 2 anos com método sociointeracionista, segurança e afeto.
            </p>

            <blockquote className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border-l-4 border-amber-400 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic max-w-xl mx-auto lg:mx-0">
              &ldquo;Só se vê bem com o coração. O essencial é invisível aos olhos.&rdquo; — Antoine de Saint-Exupéry
            </blockquote>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/matriculas"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                Garantir vaga para 2027
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/agendar-visita"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <MapPin className="w-4 h-4" strokeWidth={2.5} />
                Agendar visita à escola
              </Link>
            </div>

            {/* Números de Confiança */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#b91c1c] dark:text-red-400">35+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Anos de história</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">300+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Alunos formados</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-500">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Dedicação e afeto</p>
              </div>
            </div>
          </div>

          {/* Coluna Imagem (Fachada com Card Flutuante) */}
          <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[4/3] shadow-2xl border-4 border-white dark:border-slate-800 ring-1 ring-slate-200 dark:ring-slate-700">
              <Image
                src="/fachada-pequeno-principe.png"
                alt="Fachada do Centro Educacional Pequeno Príncipe em Dias d'Ávila"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Card Flutuante de Destaque */}
            <div className="absolute -bottom-5 sm:-bottom-6 -left-3 sm:-left-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-3.5 max-w-[280px]">
              <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" fill="currentColor" strokeWidth={0} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Ambiente Seguro & Familiar</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Salas arejadas, cozinha própria e supervisão atenta.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Barra de Pilares Rápidos ──────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, titulo: 'Método Sociointeracionista', desc: 'Construção ativa do saber e valores' },
            { icon: ShieldCheck, titulo: 'Segurança & Supervisão', desc: 'Ambiente protegido e protocolo de saída' },
            { icon: Smartphone, titulo: 'Portal dos Pais', desc: 'Notas trimestrais e avisos no celular' },
            { icon: MapPin, titulo: 'Localização Central', desc: 'No coração de Dias d\'Ávila' },
          ].map((item) => (
            <div key={item.titulo} className="flex items-start gap-3">
              <item.icon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-[#b91c1c] dark:text-red-400" strokeWidth={2} />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{item.titulo}</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Segmentos de Ensino ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-2">
            Nossos Segmentos
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            Educação pensada para cada fase
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3">
            Turmas estruturadas para acompanhar com carinho a formação de crianças a partir de 2 anos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Educação Infantil */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                  Maternal ao Jardim II (A partir de 2 anos)
                </span>
                <Palette className="w-7 h-7 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#b91c1c] transition-colors">
                Educação Infantil
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Desenvolvimento psicomotor, linguagem e socialização através de brincadeiras lúdicas, musicalização, contação de histórias e afeto.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
                {[
                  'Acolhimento de crianças a partir de 2 anos',
                  'Parque infantil e área de recreação',
                  'Cozinha própria com refeições e lanches servidos diariamente',
                  'Turnos matutino e vespertino',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/educacao-infantil"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 font-semibold text-xs sm:text-sm transition-colors"
            >
              Conhecer a Educação Infantil
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Card Ensino Fundamental I */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                  1º ao 5º Ano (6 a 11 anos)
                </span>
                <BookOpen className="w-7 h-7 text-blue-700 dark:text-blue-400" strokeWidth={2} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#b91c1c] transition-colors">
                Ensino Fundamental I
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Alfabetização sólida, raciocínio lógico, projetos interdisciplinares, ética e desenvolvimento do pensamento crítico.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
                {[
                  'Alfabetização e letramento com método sociointeracionista',
                  'Aulas de Inglês, Artes, Educação Física e Ética',
                  'Acompanhamento e reforço pedagógico contínuo',
                  'Avaliação e boletins trimestrais acompanhados via portal',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/ensino-fundamental"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 hover:bg-blue-100 font-semibold text-xs sm:text-sm transition-colors"
            >
              Conhecer o Ensino Fundamental
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sobre & Proposta Pedagógica ───────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-slate-200 dark:border-slate-800">
            <Image
              src="/sala-aula.png"
              alt="Sala de aula acolhedora do Centro Educacional Pequeno Príncipe"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] dark:text-red-400">
              Sobre a Escola
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
              Formando crianças com raízes sólidas e asas para voar
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                O Centro Educacional Pequeno Príncipe nasceu do sonho de uma educadora que acreditava que a educação poderia mudar o mundo e transformar histórias.
              </p>
              <p>
                Iniciamos em casa adaptada porém já iniciamos com educação infantil e fundamental. Há mais de 35 anos em Dias d&#39;Ávila, construímos uma história de amor, parceria com as famílias e compromisso diário com cada aluno.
              </p>
            </div>
            <div className="pt-3">
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#b91c1c] dark:text-red-400 hover:text-[#991b1b] transition-colors"
              >
                Conheça nossa história completa e proposta pedagógica
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Diferenciais ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-2">
            Por que escolher o Pequeno Príncipe?
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            Nossos Diferenciais
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              Icon: Smartphone,
              titulo: 'Portal Online das Famílias',
              texto: 'Acompanhe notas trimestrais, frequência diária, recados da professora e boletos direto pelo celular.',
            },
            {
              Icon: GraduationCap,
              titulo: 'Professores Qualificados',
              texto: 'Equipe pedagógica experiente e dedicada, criando laços de confiança e afeto com cada estudante.',
            },
            {
              Icon: ShieldCheck,
              titulo: 'Segurança & Supervisão',
              texto: 'Supervisão atenta, ambiente seguro e protocolo de saída das crianças para a tranquilidade dos pais.',
            },
            {
              Icon: Lightbulb,
              titulo: 'Avaliação Trimestral Humanizada',
              texto: 'Acompanhamos a evolução de cada aluno ao longo do trimestre com diálogo contínuo e incentivo ao aprendizado.',
            },
            {
              Icon: School,
              titulo: 'Estrutura Acolhedora',
              texto: 'Salas arejadas, banheiros infantis adaptados, cozinha própria com refeições e pátio coberto.',
            },
            {
              Icon: MapPin,
              titulo: 'Localização Central',
              texto: 'Fácil acesso no Jardim Alvorada em Dias d\'Ávila, com parcerias com transporte escolar credenciado.',
            },
          ].map(({ Icon, titulo, texto }) => (
            <div
              key={titulo}
              className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all space-y-3"
            >
              <Icon className="w-7 h-7 text-[#b91c1c] dark:text-red-400" strokeWidth={2} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{titulo}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Depoimentos de Pais (Prova Social) ─────────────────── */}
      <section className="bg-amber-50/50 dark:bg-amber-950/20 border-y border-amber-100 dark:border-amber-900/40 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-2">
              Famílias Satisfeitas
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
              O que dizem os pais do Pequeno Príncipe
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                nome: 'Mariana Santos',
                aluno: 'Mãe do Pedro (Jardim II)',
                depoimento: 'O carinho e a atenção de toda a equipe me deixam tranquila para trabalhar. Meu filho ama ir para a escola todos os dias!',
              },
              {
                nome: 'Carlos Eduardo Oliveira',
                aluno: 'Pai da Sofia (2º Ano)',
                depoimento: 'A evolução da minha filha na alfabetização foi incrível. O portal dos pais facilita muito o acompanhamento das notas e recados.',
              },
              {
                nome: 'Patrícia Lima',
                aluno: 'Mãe do Lucas (Maternal)',
                depoimento: 'Ambiente seguro, limpo e muito acolhedor. Os professores são extremamente dedicados e carinhosos.',
              },
            ].map(({ nome, aluno, depoimento }) => (
              <div key={nome} className="card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{depoimento}&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{nome}</p>
                  <p className="text-[11px] text-slate-400">{aluno}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner de Conversão (CTA) ─────────────────────────── */}
      <section className="bg-gradient-to-r from-[#b91c1c] to-[#991b1b] text-white py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
              Venha conhecer nossa escola de perto!
            </h2>
            <p className="text-red-100 text-sm sm:text-base leading-relaxed">
              Agende uma visita sem compromisso ou fale direto com a nossa secretaria pelo WhatsApp para tirar dúvidas sobre matrículas 2027.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/agendar-visita"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#b91c1c] px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors shadow-md"
            >
              Agendar Visita
            </Link>
            <a
              href="https://wa.me/557187226877?text=Olá! Gostaria de receber informações sobre matrículas para 2027 no Pequeno Príncipe."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Localização & Contato ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] dark:text-red-400">
            Localização & Atendimento
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            Onde estamos
          </h2>
          <address className="not-italic text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Av. Catarina Paraguassu, 764 — Jardim Alvorada</p>
            <p>Dias d&#39;Ávila — Bahia</p>
          </address>

          <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                <Smartphone className="w-4 h-4" strokeWidth={2} />
              </span>
              <span><strong>Telefone / WhatsApp:</strong> (71) 8722-6877</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4" strokeWidth={2} />
              </span>
              <span>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:cepp_pequenoprincipe@hotmail.com" className="hover:underline text-[#b91c1c] dark:text-red-400">
                  cepp_pequenoprincipe@hotmail.com
                </a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4" strokeWidth={2} />
              </span>
              <span><strong>Secretaria:</strong> Segunda a sexta, das 7:30 às 17h</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31052.55!2d-38.3!3d-12.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x71608b!2sDias+d%27%C3%81vila%2C+BA!5e0!3m2!1spt-BR!2sbr!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização do Centro Educacional Pequeno Príncipe em Dias d'Ávila, BA"
          />
        </div>
      </section>

      {/* ── FAQ Rápido ────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-2 text-center">
            Tire suas Dúvidas
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-10 text-center" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            Perguntas Frequentes
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Qual a faixa etária atendida?',
                r: 'Atendemos crianças a partir de 2 anos (Maternal) até o 5.º Ano do Ensino Fundamental I, com turmas nos turnos matutino e vespertino.',
              },
              {
                q: 'Como funciona o processo de matrícula?',
                r: 'Você pode preencher o interesse pelo site ou WhatsApp. Nossa secretaria agenda uma visita presencial para apresentar a escola e a documentação necessária.',
              },
              {
                q: 'Como os pais acompanham a rotina e notas?',
                r: 'Através do Portal do Aluno/Responsável, acessível pelo celular com notas trimestrais, presença, avisos da professora e controle de mensalidades.',
              },
            ].map(({ q, r }) => (
              <div key={q} className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{q}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{r}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#b91c1c] dark:text-red-400 hover:underline">
              Ver todas as dúvidas frequentes
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <SiteFooter />
    </div>
  )
}
