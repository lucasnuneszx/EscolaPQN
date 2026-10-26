'use client'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { criarDisciplina, type DisciplinaState } from '@/app/actions/academico'

export default function FormDisciplina() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<DisciplinaState, FormData>(
    criarDisciplina,
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
          Nome da disciplina
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          placeholder="Ex.: Matemática"
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
            placeholder="Ex.: MAT"
            required
            className={`input ${state?.errors?.codigo ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.codigo && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.codigo[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="cargaHoraria" className="label">
            Carga horária anual (opcional)
          </label>
          <input
            id="cargaHoraria"
            name="cargaHoraria"
            type="number"
            min={1}
            placeholder="Ex.: 200"
            className="input"
            disabled={pending}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? 'Salvando…' : 'Cadastrar disciplina'}
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
