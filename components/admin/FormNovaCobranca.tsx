'use client'
// ─────────────────────────────────────────────────────────────
// Formulário de emissão de nova mensalidade/fatura — Client Component
// ─────────────────────────────────────────────────────────────
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { criarMensalidade, type FinanceiroState } from '@/app/actions/financeiro'

interface AlunoOpcao {
  id: string
  nome: string
}

interface FormNovaCobrancaProps {
  alunos: AlunoOpcao[]
}

export default function FormNovaCobranca({ alunos }: FormNovaCobrancaProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<FinanceiroState, FormData>(
    criarMensalidade,
    undefined
  )

  const referenciaAtual = new Date().toISOString().slice(0, 7)

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && (
        <div
          role="alert"
          className="p-3 bg-red-50/50 border border-red-200/60 rounded-lg text-red-800 text-xs font-medium"
        >
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="alunoId" className="label">
          Aluno
        </label>
        <select
          id="alunoId"
          name="alunoId"
          required
          className={`input ${state?.errors?.alunoId ? 'input-error' : ''}`}
          disabled={pending}
        >
          <option value="">Selecione…</option>
          {alunos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>
        {state?.errors?.alunoId && (
          <p className="text-xs text-red-600 font-medium mt-1">{state.errors.alunoId[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="referencia" className="label">
            Referência (AAAA-MM)
          </label>
          <input
            id="referencia"
            name="referencia"
            type="month"
            defaultValue={referenciaAtual}
            required
            className={`input ${state?.errors?.referencia ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.referencia && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.referencia[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="dataVencimento" className="label">
            Data de vencimento
          </label>
          <input
            id="dataVencimento"
            name="dataVencimento"
            type="date"
            required
            className={`input ${state?.errors?.dataVencimento ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.dataVencimento && (
            <p className="text-xs text-red-600 font-medium mt-1">
              {state.errors.dataVencimento[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="valorBase" className="label">
            Valor base (R$)
          </label>
          <input
            id="valorBase"
            name="valorBase"
            type="number"
            min={0}
            step={0.01}
            required
            className={`input ${state?.errors?.valorBase ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.valorBase && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.valorBase[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="valorDesconto" className="label">
            Desconto (R$)
          </label>
          <input
            id="valorDesconto"
            name="valorDesconto"
            type="number"
            min={0}
            step={0.01}
            defaultValue={0}
            className={`input ${state?.errors?.valorDesconto ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.valorDesconto && (
            <p className="text-xs text-red-600 font-medium mt-1">
              {state.errors.valorDesconto[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="tipoDesconto" className="label">
          Tipo de desconto (opcional)
        </label>
        <input
          id="tipoDesconto"
          name="tipoDesconto"
          type="text"
          placeholder="Ex.: Bolsa irmãos, pontualidade..."
          className="input"
          disabled={pending}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? 'Emitindo…' : 'Emitir fatura'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/financeiro')}
          disabled={pending}
          className="btn btn-secondary btn-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
