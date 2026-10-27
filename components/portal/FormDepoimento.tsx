'use client'
import { useActionState } from 'react'
import { enviarDepoimento, type DepoimentoState } from '@/app/actions/depoimentos'

interface Props {
  nomePadrao: string
  relacaoPadrao: string
}

export default function FormDepoimento({ nomePadrao, relacaoPadrao }: Props) {
  const [state, formAction, pending] = useActionState<DepoimentoState, FormData>(enviarDepoimento, undefined)

  if (state?.success) {
    return (
      <div role="status" className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-lg text-emerald-800 text-sm">
        {state.message}
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && (
        <div role="alert" className="p-3 bg-red-50/60 border border-red-200/60 rounded-lg text-red-800 text-xs">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="nome">Nome que aparecerá no site</label>
          <input
            id="nome"
            name="nome"
            type="text"
            defaultValue={nomePadrao}
            required
            className={`input ${state?.errors?.nome ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.nome && <p className="text-xs text-red-600 mt-1">{state.errors.nome[0]}</p>}
        </div>
        <div>
          <label className="label" htmlFor="relacao">Relação com a escola</label>
          <input
            id="relacao"
            name="relacao"
            type="text"
            defaultValue={relacaoPadrao}
            placeholder="Ex.: Mãe de aluno do 2º ano"
            required
            className={`input ${state?.errors?.relacao ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.relacao && <p className="text-xs text-red-600 mt-1">{state.errors.relacao[0]}</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="texto">Seu depoimento</label>
        <textarea
          id="texto"
          name="texto"
          rows={5}
          maxLength={600}
          required
          placeholder="Conte como tem sido a experiência da sua família com a escola."
          className={`input ${state?.errors?.texto ? 'input-error' : ''}`}
          disabled={pending}
        />
        {state?.errors?.texto && <p className="text-xs text-red-600 mt-1">{state.errors.texto[0]}</p>}
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
        {pending ? 'Enviando…' : 'Enviar depoimento'}
      </button>
    </form>
  )
}
