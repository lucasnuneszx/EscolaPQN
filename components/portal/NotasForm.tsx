'use client'
// Formulário de lançamento de notas
// Envia a Server Action `lancarNotas` com a nota de cada aluno.
import { useActionState } from 'react'
import { lancarNotas, type PortalActionState } from '@/app/actions/portal'

interface AlunoItem {
  id: string
  nome: string
  valorAtual: number | null
}

interface NotasFormProps {
  turmaDisciplinaId: string
  periodoId: string
  alunos: AlunoItem[]
}

export default function NotasForm({ turmaDisciplinaId, periodoId, alunos }: NotasFormProps) {
  const [state, formAction, pending] = useActionState<PortalActionState, FormData>(lancarNotas, undefined)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="turmaDisciplinaId" value={turmaDisciplinaId} />
      <input type="hidden" name="periodoId" value={periodoId} />

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
              <th className="w-32">Nota (0–10)</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td className="font-medium text-slate-700">{aluno.nome}</td>
                <td>
                  <input
                    type="number"
                    name={`nota_${aluno.id}`}
                    min={0}
                    max={10}
                    step={0.1}
                    defaultValue={aluno.valorAtual ?? ''}
                    className="input"
                    placeholder="—"
                    aria-label={`Nota de ${aluno.nome}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Salvando…' : 'Salvar notas'}
        </button>
      </div>
    </form>
  )
}
