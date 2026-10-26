'use client'
// ─────────────────────────────────────────────────────────────
// Formulário de interesse de matrícula — Client Component
// ─────────────────────────────────────────────────────────────
import { useActionState, useState } from 'react'
import { submeterInteresseMatricula, type MatriculaState } from '@/app/actions/matricula'
import { salvarLeadRapido } from '@/app/actions/leads'

const WHATSAPP_PHONE = '557187226877'

interface SerieOpcao {
  id: string
  nome: string
}

interface FormMatriculaProps {
  series: SerieOpcao[]
}

export default function FormMatricula({ series }: FormMatriculaProps) {
  const [state, action, pending] = useActionState<MatriculaState, FormData>(
    submeterInteresseMatricula,
    undefined
  )

  const [nomeResp, setNomeResp] = useState('')
  const [emailResp, setEmailResp] = useState('')
  const [tel, setTel] = useState('')
  const [nomeAluno, setNomeAluno] = useState('')
  const [idade, setIdade] = useState('')
  const [serie, setSerie] = useState('')
  const [turno, setTurno] = useState('')
  const [mensagem, setMensagem] = useState('')

  const abrirWhatsAppComDados = () => {
    // Salva no banco de dados para evitar perda de lead
    if (nomeResp.trim() || tel.trim() || nomeAluno.trim()) {
      salvarLeadRapido({
        tipo: 'MATRICULA',
        nomeResponsavel: nomeResp.trim() || 'Interessado via WhatsApp',
        emailResponsavel: emailResp.trim() || undefined,
        telefone: tel.trim() || '(Via WhatsApp)',
        nomeAluno: nomeAluno.trim() || undefined,
        idadeAluno: idade ? Number(idade) : undefined,
        serieInteresse: serie || undefined,
        turnoPreferido: turno || undefined,
        mensagem: mensagem || 'Interesse direto via botão de WhatsApp',
      }).catch(console.error)
    }

    const texto = `*INTERESSE DE MATRÍCULA 2027 — CENTRO EDUCACIONAL PEQUENO PRÍNCIPE*\n\n` +
      `👤 *Responsável:* ${nomeResp || 'Não informado'}\n` +
      `📱 *Telefone/WhatsApp:* ${tel || 'Não informado'}\n` +
      (emailResp ? `✉️ *E-mail:* ${emailResp}\n` : '') +
      `👶 *Aluno(a):* ${nomeAluno || 'Não informado'}\n` +
      (idade ? `🎂 *Idade:* ${idade} anos\n` : '') +
      (serie ? `📚 *Série de Interesse:* ${serie}\n` : '') +
      (turno ? `⏰ *Turno:* ${turno}\n` : '') +
      (mensagem ? `💬 *Observação:* ${mensagem}\n` : '') +
      `\nOlá! Gostaria de confirmar a disponibilidade de vaga e dar continuidade à matrícula.`

    const url = `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(texto)}&type=phone_number&app_absent=0&utm_source=site_matriculas`
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
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Interesse de matrícula registrado!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
            {state.message || 'Recebemos suas informações com sucesso. Nossa equipe pedagógica já foi notificada.'}
          </p>
        </div>

        {/* Botão para ir direto ao WhatsApp com os dados */}
        <div className="pt-2">
          <button
            type="button"
            onClick={abrirWhatsAppComDados}
            className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-xl transition-all cursor-pointer w-full sm:w-auto"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Prosseguir no WhatsApp com a Secretaria
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
          <label htmlFor="nomeResponsavel" className="label">Nome do responsável *</label>
          <input
            id="nomeResponsavel"
            name="nomeResponsavel"
            type="text"
            required
            value={nomeResp}
            onChange={(e) => setNomeResp(e.target.value)}
            placeholder="Nome completo"
            className={`input ${state?.errors?.nomeResponsavel ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.nomeResponsavel && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.nomeResponsavel[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="emailResponsavel" className="label">E-mail *</label>
          <input
            id="emailResponsavel"
            name="emailResponsavel"
            type="email"
            required
            value={emailResp}
            onChange={(e) => setEmailResp(e.target.value)}
            placeholder="voce@email.com"
            className={`input ${state?.errors?.emailResponsavel ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.emailResponsavel && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.emailResponsavel[0]}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="telefone" className="label">Telefone / WhatsApp *</label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            required
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
          <label htmlFor="nomeAluno" className="label">Nome da criança *</label>
          <input
            id="nomeAluno"
            name="nomeAluno"
            type="text"
            required
            value={nomeAluno}
            onChange={(e) => setNomeAluno(e.target.value)}
            placeholder="Nome completo da criança"
            className={`input ${state?.errors?.nomeAluno ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.nomeAluno && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.nomeAluno[0]}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="idadeAluno" className="label">Idade</label>
          <input
            id="idadeAluno"
            name="idadeAluno"
            type="number"
            min={2}
            max={18}
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            placeholder="Ex.: 5"
            className={`input ${state?.errors?.idadeAluno ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.idadeAluno && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.errors.idadeAluno[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="serieInteresse" className="label">Série de interesse</label>
          <select
            id="serieInteresse"
            name="serieInteresse"
            className="input"
            disabled={pending}
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
          >
            <option value="">Não sei / a definir</option>
            {series.map((s) => (
              <option key={s.id} value={s.nome}>{s.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="turnoPreferido" className="label">Turno preferido</label>
          <select
            id="turnoPreferido"
            name="turnoPreferido"
            className="input"
            disabled={pending}
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
          >
            <option value="">Sem preferência</option>
            <option value="MANHA">Manhã</option>
            <option value="TARDE">Tarde</option>
            <option value="INTEGRAL">Integral</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="mensagem" className="label">Mensagem (opcional)</label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={3}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Conte um pouco sobre o que procura ou dúvidas que tenha."
          className="input resize-none"
          disabled={pending}
        />
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
              Registrando interesse…
            </>
          ) : (
            'Enviar interesse de matrícula'
          )}
        </button>

        {/* Botão alternativo direto pro WhatsApp */}
        <button
          type="button"
          onClick={abrirWhatsAppComDados}
          className="w-full py-3 px-4 rounded-lg border border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Ou enviar dados e falar direto no WhatsApp
        </button>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 text-center leading-relaxed">
        Ao enviar, você concorda com o tratamento dos seus dados conforme nossa{' '}
        <a href="/privacidade" className="underline hover:text-slate-600 dark:hover:text-slate-300">Política de Privacidade</a>.
      </p>
    </form>
  )
}
