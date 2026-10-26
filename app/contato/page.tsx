import type { Metadata } from 'next'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'
import FormContato from '@/components/public/FormContato'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato com o Centro Educacional Pequeno Príncipe em Dias d\'Ávila, Bahia. Endereço, telefone, e-mail e formulário de contato.',
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <SiteHeader paginaAtiva="/contato" />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-4">
          Fale conosco
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-5 font-display max-w-2xl">
          Estamos por perto,<br />prontos para ajudar
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-300 leading-relaxed max-w-2xl">
          Tem dúvidas sobre matrícula, atendimento ou vida pedagógica? Fale com a nossa secretaria
          pelos canais abaixo ou envie uma mensagem.
        </p>
      </section>

      {/* ── Informações + Mapa ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <address className="not-italic text-sm text-slate-500 dark:text-slate-400 leading-relaxed space-y-1 mb-6">
            <p className="font-semibold text-slate-900 dark:text-white">Endereço</p>
            <p>Av. Catarina Paraguassu, 764 — Jardim Alvorada</p>
            <p>Dias d&#39;Ávila — BA</p>
          </address>

          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>(71) 8722-6877 · Secretaria e WhatsApp</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <a href="mailto:cepp_pequenoprincipe@hotmail.com" className="hover:underline text-[#b91c1c] dark:text-red-400 font-medium">
                cepp_pequenoprincipe@hotmail.com
              </a>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p>Segunda a sexta · 7:30 às 17h</p>
                <p className="text-xs text-slate-400">Atendimento presencial e telefônico</p>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/557187226877?text=Olá! Quero saber mais sobre o Centro Educacional Pequeno Príncipe."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm mt-8 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar pelo WhatsApp
          </a>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video shadow-md">
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

      {/* ── Formulário ────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] dark:text-red-400 mb-3 text-center">
            Envie uma mensagem
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center font-display">
            Formulário de contato
          </h2>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm">
            <FormContato />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
