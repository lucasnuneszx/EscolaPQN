'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { criarTurma, atualizarTurma, type TurmaState } from '@/app/actions/turmas'

interface Serie {
  id: string
  nome: string
}

interface TurmaInicial {
  id: string
  nome: string
  turno: string
  capacidade: number
  sala: string | null
  serieId: string
}

interface Props {
  series: Serie[]
  turmaInicial?: TurmaInicial
}

const TURNOS = [
  { value: 'MANHA', label: 'Manhã' },
  { value: 'TARDE', label: 'Tarde' },
  { value: 'INTEGRAL', label: 'Integral' },
  { value: 'NOTURNO', label: 'Noturno' },
]

export default function FormTurma({ series, turmaInicial }: Props) {
  const modoEdicao = !!turmaInicial
  const action = modoEdicao ? atualizarTurma : criarTurma
  const [state, formAction, pending] = useActionState<TurmaState, FormData>(action, undefined)

  return (
    <form action={formAction} className="space-y-6">
      {modoEdicao && <input type="hidden" name="id" value={turmaInicial.id} />}

      {state?.message && (
        <div role="alert" className="p-3 bg-red-50/60 border border-red-200/60 rounded-lg text-red-800 text-xs">
          {state.message}
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 font-display">Dados da Turma</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="nome">Nome da turma *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              defaultValue={turmaInicial?.nome}
              placeholder="Ex.: Maternal II A"
              required
              className={`input ${state?.errors?.nome ? 'input-error' : ''}`}
              disabled={pending}
            />
            {state?.errors?.nome && <p className="text-xs text-red-600 mt-1">{state.errors.nome[0]}</p>}
          </div>

          <div>
            <label className="label" htmlFor="serieId">Série *</label>
            <select
              id="serieId"
              name="serieId"
              defaultValue={turmaInicial?.serieId ?? ''}
              required
              className={`input ${state?.errors?.serieId ? 'input-error' : ''}`}
              disabled={pending}
            >
              <option value="" disabled>Selecione a série</option>
              {series.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            {state?.errors?.serieId && <p className="text-xs text-red-600 mt-1">{state.errors.serieId[0]}</p>}
          </div>

          <div>
            <label className="label" htmlFor="turno">Turno *</label>
            <select
              id="turno"
              name="turno"
              defaultValue={turmaInicial?.turno ?? 'MANHA'}
              required
              className="input"
              disabled={pending}
            >
              {TURNOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="capacidade">Capacidade *</label>
            <input
              id="capacidade"
              name="capacidade"
              type="number"
              min={1}
              defaultValue={turmaInicial?.capacidade ?? 30}
              required
              className={`input ${state?.errors?.capacidade ? 'input-error' : ''}`}
              disabled={pending}
            />
            {state?.errors?.capacidade && <p className="text-xs text-red-600 mt-1">{state.errors.capacidade[0]}</p>}
          </div>

          <div>
            <label className="label" htmlFor="sala">Sala</label>
            <input
              id="sala"
              name="sala"
              type="text"
              defaultValue={turmaInicial?.sala ?? ''}
              placeholder="Ex.: Sala 04"
              className="input"
              disabled={pending}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/turmas" className="btn btn-secondary btn-sm rounded-lg text-xs">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary btn-sm bg-[#b91c1c] text-white hover:bg-[#dc2626] font-medium rounded-lg text-xs py-2 px-3.5 transition-colors"
        >
          {pending ? 'Salvando…' : modoEdicao ? 'Salvar alterações' : 'Criar Turma'}
        </button>
      </div>
    </form>
  )
}
