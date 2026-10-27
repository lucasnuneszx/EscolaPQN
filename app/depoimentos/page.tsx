import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'
import { listarDepoimentosAprovados } from '@/lib/depoimentos'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Depoimentos',
  description:
    'Veja o que dizem os pais e responsáveis de alunos do Centro Educacional Pequeno Príncipe sobre a experiência de estudar conosco.',
}

export default async function DepoimentosPage() {
  const depoimentos = await listarDepoimentosAprovados()

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <SiteHeader paginaAtiva="/depoimentos" />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-4">
          Depoimentos
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5 font-display max-w-2xl mx-auto">
          O que as famílias dizem sobre nós
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
          Nada fala mais alto do que a experiência de quem confia seus filhos à Escola Pequeno
          Príncipe todos os dias.
        </p>
      </section>

      {/* Grid de depoimentos */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {depoimentos.length === 0 ? (
          <div className="max-w-xl mx-auto text-center border border-dashed border-slate-200 rounded-xl px-6 py-12">
            <p className="text-sm text-slate-600 leading-relaxed">
              Em breve, os relatos das famílias que fazem parte da nossa escola estarão aqui.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              É responsável de um aluno? Deixe o seu depoimento pelo Portal, no menu Depoimento.
            </p>
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {depoimentos.map(({ id, nome, relacao, texto }) => (
            <div key={id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
              <svg className="w-6 h-6 text-[#b91c1c]/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H4.5c0-1.473 1.197-2.67 2.67-2.67V6zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H14.5c0-1.473 1.197-2.67 2.67-2.67V6z" />
              </svg>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                &ldquo;{texto}&rdquo;
              </p>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{nome}</p>
                <p className="text-xs text-slate-400">{relacao}</p>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#b91c1c]">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
              Sua família também pode viver essa experiência
            </h2>
            <p className="text-red-200 text-sm leading-relaxed">
              Agende uma visita e converse com quem já faz parte da nossa comunidade escolar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/matriculas"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#b91c1c] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors"
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
