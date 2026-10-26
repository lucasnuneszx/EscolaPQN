'use client'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { criarEvento, type EventoState } from '@/app/actions/calendario'

export default function FormEvento() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<EventoState, FormData>(
    criarEvento,
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
        <label htmlFor="titulo" className="label">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          className={`input ${state?.errors?.titulo ? 'input-error' : ''}`}
          disabled={pending}
        />
        {state?.errors?.titulo && (
          <p className="text-xs text-red-600 font-medium mt-1">{state.errors.titulo[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="descricao" className="label">
          Descrição (opcional)
        </label>
        <textarea id="descricao" name="descricao" rows={4} className="input" disabled={pending} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dataInicio" className="label">
            Data de início
          </label>
          <input
            id="dataInicio"
            name="dataInicio"
            type="date"
            required
            className={`input ${state?.errors?.dataInicio ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.dataInicio && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.dataInicio[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="dataFim" className="label">
            Data de término (opcional)
          </label>
          <input id="dataFim" name="dataFim" type="date" className="input" disabled={pending} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="local" className="label">
            Local (opcional)
          </label>
          <input id="local" name="local" type="text" className="input" disabled={pending} />
        </div>
        <div>
          <label htmlFor="tipo" className="label">
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            defaultValue="evento"
            className={`input ${state?.errors?.tipo ? 'input-error' : ''}`}
            disabled={pending}
          >
            <option value="evento">Evento</option>
            <option value="reuniao">Reunião</option>
            <option value="feriado">Feriado</option>
            <option value="prova">Prova</option>
            <option value="ferias">Férias</option>
          </select>
          {state?.errors?.tipo && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.tipo[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cor" className="label">
          Cor de destaque (opcional)
        </label>
        <input
          id="cor"
          name="cor"
          type="color"
          defaultValue="#b91c1c"
          className="h-10 w-20 rounded-lg border border-slate-200 cursor-pointer"
          disabled={pending}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? 'Salvando…' : 'Criar evento'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/calendario')}
          disabled={pending}
          className="btn btn-secondary btn-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
