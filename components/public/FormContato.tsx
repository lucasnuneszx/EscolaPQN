'use client'
import { useActionState, useState } from 'react'
import { enviarMensagemContato, type ContatoState } from '@/app/actions/contato'
import { salvarLeadRapido } from '@/app/actions/leads'

const WHATSAPP_PHONE = '557187226877'

export default function FormContato() {
  const [state, action, pending] = useActionState<ContatoState, FormData>(
    enviarMensagemContato,
    undefined
  )

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')

  const abrirWhatsAppContato = () => {
    if (nome.trim() || tel.trim() || email.trim()) {
      salvarLeadRapido({
        tipo: 'CONTATO',
        nomeResponsavel: nome.trim() || 'Contato via WhatsApp',
        emailResponsavel: email.trim() || undefined,
        telefone: tel.trim() || '(Via WhatsApp)',
        mensagem: `Assunto: ${assunto || 'Contato Geral'}. Mensagem: ${mensagem || 'Nenhuma'}`,
      }).catch(console.error)
    }

    const texto = `*MENSAGEM DE CONTATO — SITE PEQUENO PRÍNCIPE*\n\n` +
      `👤 *Nome:* ${nome || 'Não informado'}\n` +
      `📱 *Telefone:* ${tel || 'Não informado'}\n` +
      (email ? `✉️ *E-mail:* ${email}\n` : '') +
      (assunto ? `📌 *Assunto:* ${assunto}\n` : '') +
      (mensagem ? `💬 *Mensagem:* ${mensagem}\n` : '') +
      `\nOlá! Gostaria de falar com a equipe sobre o assunto acima.`

    const url = `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(texto)}&type=phone_number&app_absent=0&utm_source=site_contato`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (state?.success) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 p-8 text-center space-y-5 animate-fade-in"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Mensagem enviada com sucesso!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
            {state.message || 'Recebemos seu contato e responderemos em breve. Se preferir resposta imediata, fale conosco pelo WhatsApp:'}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={abrirWhatsAppContato}
            className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-xl transition-all cursor-pointer w-full sm:w-auto"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp agora
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      {state?.message && !state?.success && (
        <div
          role="alert"
          className="flex items-start gap-3 p-3 bg-red-50/50 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/60 rounded-lg text-red-800 dark:text-red-300 text-xs leading-relaxed"
        >
          <svg className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div>{state.message}</div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="contato-nome" className="label">Nome completo *</label>
          <input
            id="contato-nome"
            name="nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className={`input ${state?.errors?.nome ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.nome && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.nome[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contato-email" className="label">E-mail *</label>
          <input
            id="contato-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className={`input ${state?.errors?.email ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.email && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="contato-telefone" className="label">Telefone / WhatsApp</label>
          <input
            id="contato-telefone"
            name="telefone"
            type="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="(71) 90000-0000"
            className={`input ${state?.errors?.telefone ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.telefone && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.telefone[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contato-assunto" className="label">Assunto *</label>
          <select
            id="contato-assunto"
            name="assunto"
            required
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            className={`input ${state?.errors?.assunto ? 'input-error' : ''}`}
            disabled={pending}
          >
            <option value="" disabled>Selecione um assunto</option>
            <option value="Matrícula">Matrícula</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Pedagógico">Pedagógico</option>
            <option value="Documentação">Documentação</option>
            <option value="Outro">Outro assunto</option>
          </select>
          {state?.errors?.assunto && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.assunto[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contato-mensagem" className="label">Mensagem *</label>
        <textarea
          id="contato-mensagem"
          name="mensagem"
          rows={4}
          required
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Escreva sua mensagem"
          className={`input resize-none ${state?.errors?.mensagem ? 'input-error' : ''}`}
          disabled={pending}
        />
        {state?.errors?.mensagem && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.mensagem[0]}</p>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary btn-lg w-full shadow-sm"
        >
          {pending ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando mensagem…
            </>
          ) : (
            'Enviar mensagem'
          )}
        </button>

        <button
          type="button"
          onClick={abrirWhatsAppContato}
          className="w-full py-3 px-4 rounded-lg border border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Ou enviar dúvida direto pelo WhatsApp
        </button>
      </div>
    </form>
  )
}
