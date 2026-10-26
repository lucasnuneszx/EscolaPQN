'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { criarResponsavel, atualizarResponsavel, type ResponsavelState } from '@/app/actions/responsaveis'

interface ResponsavelInicial {
  id: string
  nome: string
  cpf: string | null
  rg: string | null
  email: string | null
  telefone: string
  whatsapp: string | null
  parentesco: string
  endereco: string | null
  responsavelFinanceiro: boolean
  responsavelPedagogico: boolean
  consentimentoImagem: boolean
  consentimentoLGPD: boolean
  usuarioId: string | null
}

interface Props {
  responsavelInicial?: ResponsavelInicial
}

export default function FormResponsavel({ responsavelInicial }: Props) {
  const modoEdicao = !!responsavelInicial
  const action = modoEdicao ? atualizarResponsavel : criarResponsavel
  const [state, formAction, pending] = useActionState<ResponsavelState, FormData>(action, undefined)

  return (
    <form action={formAction} className="space-y-6">
      {modoEdicao && <input type="hidden" name="id" value={responsavelInicial.id} />}

      {state?.message && (
        <div role="alert" className="p-3 bg-red-50/60 border border-red-200/60 rounded-lg text-red-800 text-xs">
          {state.message}
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 font-display">Dados do Responsável</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label" htmlFor="nome">Nome completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              defaultValue={responsavelInicial?.nome}
              required
              className={`input ${state?.errors?.nome ? 'input-error' : ''}`}
              disabled={pending}
            />
            {state?.errors?.nome && <p className="text-xs text-red-600 mt-1">{state.errors.nome[0]}</p>}
          </div>

          <div>
            <label className="label" htmlFor="parentesco">Parentesco *</label>
            <input
              id="parentesco"
              name="parentesco"
              type="text"
              defaultValue={responsavelInicial?.parentesco}
              placeholder="Ex.: Mãe, Pai, Avó, Tutor"
              required
              className={`input ${state?.errors?.parentesco ? 'input-error' : ''}`}
              disabled={pending}
            />
            {state?.errors?.parentesco && <p className="text-xs text-red-600 mt-1">{state.errors.parentesco[0]}</p>}
          </div>

          <div>
            <label className="label" htmlFor="telefone">Telefone *</label>
            <input
              id="telefone"
              name="telefone"
              type="text"
              defaultValue={responsavelInicial?.telefone}
              placeholder="(00) 00000-0000"
              required
              className={`input ${state?.errors?.telefone ? 'input-error' : ''}`}
              disabled={pending}
            />
            {state?.errors?.telefone && <p className="text-xs text-red-600 mt-1">{state.errors.telefone[0]}</p>}
          </div>

          <div>
            <label className="label" htmlFor="whatsapp">WhatsApp</label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              defaultValue={responsavelInicial?.whatsapp ?? ''}
              className="input"
              disabled={pending}
            />
          </div>

          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={responsavelInicial?.email ?? ''}
              className="input"
              disabled={pending}
            />
          </div>

          <div>
            <label className="label" htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              defaultValue={responsavelInicial?.cpf ?? ''}
              className="input"
              disabled={pending}
            />
          </div>

          <div>
            <label className="label" htmlFor="rg">RG</label>
            <input
              id="rg"
              name="rg"
              type="text"
              defaultValue={responsavelInicial?.rg ?? ''}
              className="input"
              disabled={pending}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label" htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              defaultValue={responsavelInicial?.endereco ?? ''}
              className="input"
              disabled={pending}
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              name="responsavelFinanceiro"
              defaultChecked={responsavelInicial?.responsavelFinanceiro}
              disabled={pending}
              className="rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
            />
            Responsável financeiro
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              name="responsavelPedagogico"
              defaultChecked={responsavelInicial?.responsavelPedagogico ?? true}
              disabled={pending}
              className="rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
            />
            Responsável pedagógico
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              name="consentimentoImagem"
              defaultChecked={responsavelInicial?.consentimentoImagem}
              disabled={pending}
              className="rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
            />
            Consentimento de uso de imagem
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              name="consentimentoLGPD"
              defaultChecked={responsavelInicial?.consentimentoLGPD}
              disabled={pending}
              className="rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
            />
            Consentimento LGPD
          </label>
        </div>

        {!modoEdicao && (
          <div className="border-t border-slate-100 pt-4">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                name="criarAcessoPortal"
                disabled={pending}
                className="rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
              />
              Criar acesso ao Portal do Responsável (requer e-mail — uma senha temporária será gerada)
            </label>
          </div>
        )}

        {modoEdicao && !responsavelInicial.usuarioId && (
          <p className="text-xs text-slate-400 italic">
            Este responsável ainda não possui acesso ao portal.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/responsaveis" className="btn btn-secondary btn-sm rounded-lg text-xs">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary btn-sm bg-[#b91c1c] text-white hover:bg-[#dc2626] font-medium rounded-lg text-xs py-2 px-3.5 transition-colors"
        >
          {pending ? 'Salvando…' : modoEdicao ? 'Salvar alterações' : 'Cadastrar Responsável'}
        </button>
      </div>
    </form>
  )
}
