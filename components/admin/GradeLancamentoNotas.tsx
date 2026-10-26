'use client'
// ─────────────────────────────────────────────────────────────
// Grade de lançamento de notas em lote — Client Component
// ─────────────────────────────────────────────────────────────
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { lancarNotasEmLote } from '@/app/actions/academico'

interface AlunoNota {
  id: string
  nome: string
  valorAtual: number | null
}

interface GradeLancamentoNotasProps {
  turmaDisciplinaId: string
  periodoId: string
  valorMaximo: number
  alunos: AlunoNota[]
}

export default function GradeLancamentoNotas({
  turmaDisciplinaId,
  periodoId,
  valorMaximo,
  alunos,
}: GradeLancamentoNotasProps) {
  const router = useRouter()
  const [valores, setValores] = useState<Record<string, string>>(() =>
    Object.fromEntries(alunos.map((a) => [a.id, a.valorAtual !== null ? String(a.valorAtual) : '']))
  )
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  )

  function atualizarValor(alunoId: string, valor: string) {
    setValores((atual) => ({ ...atual, [alunoId]: valor }))
  }

  function salvar() {
    setFeedback(null)
    const notas = alunos.map((a) => {
      const bruto = valores[a.id]
      const valor = bruto === '' || bruto === undefined ? null : Number(bruto)
      return { alunoId: a.id, valor: valor !== null && Number.isNaN(valor) ? null : valor }
    })

    startTransition(async () => {
      const resultado = await lancarNotasEmLote(turmaDisciplinaId, periodoId, notas)
      if (resultado.success) {
        setFeedback({ tipo: 'sucesso', texto: resultado.message ?? 'Notas salvas com sucesso.' })
        router.refresh()
      } else {
        setFeedback({ tipo: 'erro', texto: resultado.message ?? 'Erro ao salvar as notas.' })
      }
    })
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          role="alert"
          className={`p-3 rounded-lg text-xs font-medium border ${
            feedback.tipo === 'sucesso'
              ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-800'
              : 'bg-red-50/50 border-red-200/60 text-red-800'
          }`}
        >
          {feedback.texto}
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-admin">
            <thead>
              <tr>
                <th>Aluno</th>
                <th className="w-40">Nota (0 a {valorMaximo})</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td className="font-semibold text-slate-900">{aluno.nome}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={valorMaximo}
                      step={0.1}
                      value={valores[aluno.id] ?? ''}
                      onChange={(e) => atualizarValor(aluno.id, e.target.value)}
                      className="input w-28"
                      disabled={isPending}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {alunos.length === 0 ? (
        <p className="text-xs text-slate-400">Nenhum aluno matriculado nesta turma.</p>
      ) : (
        <div className="flex items-center gap-3">
          <button type="button" onClick={salvar} disabled={isPending} className="btn btn-primary btn-sm">
            {isPending ? 'Salvando…' : 'Salvar notas'}
          </button>
          <Link href="/admin/academico/notas" className="btn btn-secondary btn-sm">
            Cancelar
          </Link>
        </div>
      )}
    </div>
  )
}
