'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { desvincularResponsavel } from '@/app/actions/responsaveis'

interface Vinculo {
  id: string
  principal: boolean
  aluno: {
    id: string
    nome: string
    status: string
  }
}

interface Props {
  vinculos: Vinculo[]
}

export default function ListaAlunosVinculados({ vinculos }: Props) {
  const [pending, startTransition] = useTransition()

  function handleDesvincular(vinculoId: string, nomeAluno: string) {
    if (!confirm(`Desvincular ${nomeAluno} deste responsável?`)) return
    startTransition(async () => {
      await desvincularResponsavel(vinculoId)
    })
  }

  if (vinculos.length === 0) {
    return <p className="text-xs text-slate-400 italic">Nenhum aluno vinculado a este responsável.</p>
  }

  return (
    <div className="space-y-2">
      {vinculos.map((v) => (
        <div key={v.id} className="flex items-center justify-between p-3 border border-slate-200/80 rounded-lg bg-slate-50/50">
          <div>
            <Link href={`/admin/alunos/editar/${v.aluno.id}`} className="text-xs font-bold text-slate-800 hover:text-[#b91c1c] hover:underline">
              {v.aluno.nome}
            </Link>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {v.principal ? 'Responsável principal' : 'Responsável adicional'} &middot; Status do aluno: {v.aluno.status}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleDesvincular(v.id, v.aluno.nome)}
            disabled={pending}
            className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
          >
            Desvincular
          </button>
        </div>
      ))}
    </div>
  )
}
