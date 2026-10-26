'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { excluirResponsavel } from '@/app/actions/responsaveis'

interface Props {
  responsavelId: string
  nomeResponsavel: string
}

export default function BotaoExcluirResponsavel({ responsavelId, nomeResponsavel }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    if (!confirm(`Tem certeza que deseja excluir o responsável "${nomeResponsavel}"? Esta ação não pode ser desfeita.`)) {
      return
    }
    startTransition(async () => {
      const resultado = await excluirResponsavel(responsavelId)
      if (!resultado.success) {
        alert(resultado.message)
        return
      }
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? 'Excluindo…' : 'Excluir'}
    </button>
  )
}
