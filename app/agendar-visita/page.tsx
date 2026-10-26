import type { Metadata } from 'next'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'
import FormAgendarVisita from '@/components/public/FormAgendarVisita'

export const metadata: Metadata = {
  title: 'Agendar visita',
  description:
    'Agende uma visita sem compromisso ao Centro Educacional Pequeno Príncipe e conheça pessoalmente nossa estrutura e equipe pedagógica.',
}

export default function AgendarVisitaPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <SiteHeader paginaAtiva="/agendar-visita" />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-4">
            Conheça a escola
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5 font-display">
            Agende uma visita<br />sem compromisso
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
            Nada substitui conhecer a escola pessoalmente. Venha ver as salas arejadas, o parque, a
            cozinha própria e conversar com a nossa equipe pedagógica.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#b91c1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Horário de visitas</p>
                <p className="text-sm text-slate-500">Segunda a sexta, das 7:30 às 17h</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#b91c1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Quem participa</p>
                <p className="text-sm text-slate-500">
                  Recebemos os responsáveis com ou sem a criança — fique à vontade para trazê-la.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#b91c1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Duração</p>
                <p className="text-sm text-slate-500">
                  Cerca de 40 minutos, incluindo tour pela estrutura e conversa com a coordenação.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-3">Prefere combinar por WhatsApp?</p>
            <a
              href="https://wa.me/557187226877?text=Olá! Quero agendar uma visita ao Centro Educacional Pequeno Príncipe."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 font-display">
            Formulário de agendamento
          </h2>
          <FormAgendarVisita />
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
