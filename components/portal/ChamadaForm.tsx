'use client'
// ─────────────────────────────────────────────────────────────
// Formulário de chamada — Client Component
// Envia a Server Action `fazerChamada` com o status de cada aluno.
// ─────────────────────────────────────────────────────────────
import { useActionState } from 'react'
import { fazerChamada, type PortalActionState } from '@/app/actions/portal'

interface AlunoItem {
  id: string
  nome: string
  statusAtual: 'PRESENTE' | 'FALTA' | 'FALTA_JUSTIFICADA'
}

interface ChamadaFormProps {
  turmaDisciplinaId: string
  data: string
  alunos: AlunoItem[]
}

const OPCOES: { value: AlunoItem['statusAtual']; label: string }[] = [
  { value: 'PRESENTE', label: 'Presente' },
  { value: 'FALTA', label: 'Falta' },
  { value: 'FALTA_JUSTIFICADA', label: 'Falta justificada' },
]

export default function ChamadaForm({ turmaDisciplinaId, data, alunos }: ChamadaFormProps) {
  const [state, formAction, pending] = useActionState<PortalActionState, FormData>(fazerChamada, undefined)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="turmaDisciplinaId" value={turmaDisciplinaId} />
      <input type="hidden" name="data" value={data} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-lg" role="alert">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-3 rounded-lg" role="status">
          {state.message}
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden overflow-x-auto">
        <table className="table-admin">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td className="font-medium text-slate-700">{aluno.nome}</td>
                <td>
                  <div className="flex flex-wrap gap-4">
                    {OPCOES.map((op) => (
                      <label key={op.value} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name={`freq_${aluno.id}`}
                          value={op.value}
                          defaultChecked={aluno.statusAtual === op.value}
                          className="accent-brand-700"
                        />
                        {op.label}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Salvando…' : 'Salvar chamada'}
        </button>
      </div>
    </form>
  )
}
