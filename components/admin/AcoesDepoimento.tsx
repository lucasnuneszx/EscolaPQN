'use client'
import { useTransition } from 'react'
import {
  aprovarDepoimento,
  rejeitarDepoimento,
  voltarParaPendente,
  excluirDepoimento,
} from '@/app/actions/depoimentos'

interface Props {
  id: string
  status: string
}

export default function AcoesDepoimento({ id, status }: Props) {
  const [pending, startTransition] = useTransition()

  function executar(acao: (id: string) => Promise<unknown>) {
    startTransition(async () => {
      await acao(id)
    })
  }

  function excluir() {
    if (!confirm('Excluir este depoimento definitivamente?')) return
    executar(excluirDepoimento)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== 'APROVADO' && (
        <button type="button" onClick={() => executar(aprovarDepoimento)} disabled={pending} className="btn btn-primary btn-sm">
          Aprovar
        </button>
      )}
      {status === 'PENDENTE' && (
        <button type="button" onClick={() => executar(rejeitarDepoimento)} disabled={pending} className="btn btn-secondary btn-sm">
          Não publicar
        </button>
      )}
      {status === 'APROVADO' && (
        <button type="button" onClick={() => executar(voltarParaPendente)} disabled={pending} className="btn btn-secondary btn-sm">
          Tirar do site
        </button>
      )}
      <button type="button" onClick={excluir} disabled={pending} className="text-xs font-semibold text-red-600 hover:underline px-2">
        Excluir
      </button>
    </div>
  )
}
