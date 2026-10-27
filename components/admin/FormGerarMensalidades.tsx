'use client'
import { useActionState } from 'react'
import { gerarMensalidadesDoMes, type FinanceiroState } from '@/app/actions/financeiro'

interface Props {
  referenciaPadrao: string
  vencimentoPadrao: string
  disabled?: boolean
}

export default function FormGerarMensalidades({ referenciaPadrao, vencimentoPadrao, disabled }: Props) {
  const [state, formAction, pending] = useActionState<FinanceiroState, FormData>(
    gerarMensalidadesDoMes,
    undefined
  )

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && (
        <div
          role="alert"
          className={`p-3 rounded-lg text-xs font-medium border ${
            state.success
              ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-800'
              : 'bg-red-50/50 border-red-200/60 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="referencia" className="label">Mês de referência</label>
          <input
            id="referencia"
            name="referencia"
            type="month"
            defaultValue={referenciaPadrao}
            required
            className={`input ${state?.errors?.referencia ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.referencia && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.referencia[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="dataVencimento" className="label">Data de vencimento</label>
          <input
            id="dataVencimento"
            name="dataVencimento"
            type="date"
            defaultValue={vencimentoPadrao}
            required
            className={`input ${state?.errors?.dataVencimento ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.dataVencimento && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.dataVencimento[0]}</p>
          )}
        </div>
      </div>

      <button type="submit" disabled={pending || disabled} className="btn btn-primary btn-sm">
        {pending ? 'Gerando…' : 'Gerar mensalidades'}
      </button>
    </form>
  )
}
