'use client'
// ─────────────────────────────────────────────────────────────
// Formulário de criação de Série — Client Component
// ─────────────────────────────────────────────────────────────
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { criarSerie, type SerieState } from '@/app/actions/academico'

export default function FormSerie() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<SerieState, FormData>(
    criarSerie,
    undefined
  )

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && (
        <div
          role="alert"
          className="p-3 bg-red-50/50 border border-red-200/60 rounded-lg text-red-800 text-xs font-medium"
        >
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="nome" className="label">
          Nome da série
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          placeholder="Ex.: 3º Ano do Ensino Fundamental"
          required
          className={`input ${state?.errors?.nome ? 'input-error' : ''}`}
          disabled={pending}
        />
        {state?.errors?.nome && (
          <p className="text-xs text-red-600 font-medium mt-1">{state.errors.nome[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="codigo" className="label">
            Código
          </label>
          <input
            id="codigo"
            name="codigo"
            type="text"
            placeholder="Ex.: 3EF"
            required
            className={`input ${state?.errors?.codigo ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.codigo && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.codigo[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="ordem" className="label">
            Ordem de exibição
          </label>
          <input
            id="ordem"
            name="ordem"
            type="number"
            min={0}
            defaultValue={0}
            required
            className={`input ${state?.errors?.ordem ? 'input-error' : ''}`}
            disabled={pending}
          />
        </div>
      </div>

      <div>
        <label htmlFor="nivel" className="label">
          Nível
        </label>
        <select
          id="nivel"
          name="nivel"
          defaultValue="educacao_infantil"
          className={`input ${state?.errors?.nivel ? 'input-error' : ''}`}
          disabled={pending}
        >
          <option value="educacao_infantil">Educação Infantil</option>
          <option value="ensino_fundamental">Ensino Fundamental</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? 'Salvando…' : 'Cadastrar série'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/academico')}
          disabled={pending}
          className="btn btn-secondary btn-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
