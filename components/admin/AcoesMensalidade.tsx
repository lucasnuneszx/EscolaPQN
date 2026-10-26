'use client'
// Ações da tela de detalhe da mensalidade
// "Marcar como pago" e "Gerar cobrança (simulada)"
import { useActionState } from 'react'
import {
  marcarComoPago,
  gerarLinkCobranca,
  type FinanceiroState,
} from '@/app/actions/financeiro'

interface AcoesMensalidadeProps {
  mensalidadeId: string
  status: string
}

export default function AcoesMensalidade({ mensalidadeId, status }: AcoesMensalidadeProps) {
  const [statePago, actionPago, pendingPago] = useActionState<FinanceiroState, FormData>(
    marcarComoPago.bind(null, mensalidadeId),
    undefined
  )
  const [stateCobranca, actionCobranca, pendingCobranca] = useActionState<
    FinanceiroState,
    FormData
  >(gerarLinkCobranca.bind(null, mensalidadeId), undefined)

  const jaPaga = status === 'PAGO'

  return (
    <div className="space-y-3">
      {statePago?.message && (
        <div
          role="alert"
          className={`p-3 rounded-lg text-xs font-medium border ${
            statePago.success
              ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-800'
              : 'bg-red-50/50 border-red-200/60 text-red-800'
          }`}
        >
          {statePago.message}
        </div>
      )}
      {stateCobranca?.message && (
        <div
          role="alert"
          className={`p-3 rounded-lg text-xs font-medium border ${
            stateCobranca.success
              ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-800'
              : 'bg-red-50/50 border-red-200/60 text-red-800'
          }`}
        >
          {stateCobranca.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {!jaPaga && (
          <form action={actionPago}>
            <button type="submit" disabled={pendingPago} className="btn btn-primary btn-sm">
              {pendingPago ? 'Confirmando…' : 'Marcar como pago'}
            </button>
          </form>
        )}

        <form action={actionCobranca}>
          <button type="submit" disabled={pendingCobranca} className="btn btn-secondary btn-sm">
            {pendingCobranca ? 'Gerando…' : 'Gerar cobrança (simulada)'}
          </button>
        </form>
      </div>
    </div>
  )
}
