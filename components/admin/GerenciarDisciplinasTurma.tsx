'use client'

import { useActionState, useTransition } from 'react'
import {
  vincularDisciplinaProfessor,
  removerVinculoDisciplina,
  type TurmaState,
} from '@/app/actions/turmas'

interface Disciplina {
  id: string
  nome: string
}

interface Professor {
  id: string
  usuario: { nome: string }
}

interface Vinculo {
  id: string
  disciplina: { nome: string }
  professor: { id: string; usuario: { nome: string } } | null
}

interface Props {
  turmaId: string
  disciplinas: Disciplina[]
  professores: Professor[]
  vinculos: Vinculo[]
}

export default function GerenciarDisciplinasTurma({ turmaId, disciplinas, professores, vinculos }: Props) {
  const [state, formAction, pending] = useActionState<TurmaState, FormData>(vincularDisciplinaProfessor, undefined)
  const [removendoId, startTransition] = useTransition()

  function handleRemover(vinculoId: string) {
    if (!confirm('Remover este vínculo de disciplina/professor da turma?')) return
    startTransition(async () => {
      await removerVinculoDisciplina(vinculoId)
    })
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-5">
      <h2 className="text-sm font-bold text-slate-900 font-display">Disciplinas e Professores</h2>

      {state?.message && (
        <div role="alert" className={`p-3 rounded-lg text-xs border ${state.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50/60 border-red-200/60 text-red-800'}`}>
          {state.message}
        </div>
      )}

      <form action={formAction} className="flex flex-col md:flex-row items-end gap-3">
        <input type="hidden" name="turmaId" value={turmaId} />

        <div className="flex-1 w-full">
          <label className="label" htmlFor="disciplinaId">Disciplina</label>
          <select id="disciplinaId" name="disciplinaId" required defaultValue="" className="input" disabled={pending}>
            <option value="" disabled>Selecione</option>
            {disciplinas.map((d) => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="label" htmlFor="professorId">Professor responsável</label>
          <select id="professorId" name="professorId" className="input" disabled={pending}>
            <option value="">Sem professor definido</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>{p.usuario.nome}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary btn-sm bg-[#b91c1c] text-white hover:bg-[#dc2626] font-medium rounded-lg text-xs py-2.5 px-3.5 transition-colors w-full md:w-auto shrink-0"
        >
          {pending ? 'Vinculando…' : 'Vincular'}
        </button>
      </form>

      <div className="border-t border-slate-100 pt-4">
        {vinculos.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nenhuma disciplina vinculada a esta turma ainda.</p>
        ) : (
          <div className="space-y-2">
            {vinculos.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 border border-slate-200/80 rounded-lg bg-slate-50/50">
                <div>
                  <p className="text-xs font-bold text-slate-800">{v.disciplina.nome}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Professor: {v.professor?.usuario.nome ?? 'Não definido'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemover(v.id)}
                  disabled={removendoId}
                  className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
