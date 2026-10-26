'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { criarProfessor, atualizarProfessor, type ProfessorState } from '@/app/actions/professores'

interface ProfessorInicial {
  id: string
  cpf: string | null
  formacao: string | null
  registro: string | null
  observacoes: string | null
  usuario: {
    nome: string
    email: string
    telefone: string | null
  }
}

interface Props {
  professorInicial?: ProfessorInicial
}

export default function FormProfessor({ professorInicial }: Props) {
  const modoEdicao = !!professorInicial
  const action = modoEdicao ? atualizarProfessor : criarProfessor
  const [state, formAction, pending] = useActionState<ProfessorState, FormData>(action, undefined)

  return (
    <form action={formAction} className="space-y-6">
      {modoEdicao && <input type="hidden" name="id" value={professorInicial.id} />}

      {state?.message && (
        <div role="alert" className="p-3 bg-red-50/60 border border-red-200/60 rounded-lg text-red-800 text-xs">
          {state.message}
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 font-display">Dados do Professor</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label" htmlFor="nome">Nome completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              defaultValue={professorInicial?.usuario.nome}
              required
              className={`input ${state?.errors?.nome ? 'input-error' : ''}`}
              disabled={pending}
            />
            {state?.errors?.nome && <p className="text-xs text-red-600 mt-1">{state.errors.nome[0]}</p>}
          </div>

          <div>
            <label className="label" htmlFor="email">E-mail *</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={professorInicial?.usuario.email}
              required
              className={`input ${state?.errors?.email ? 'input-error' : ''}`}
              disabled={pending}
            />
            {state?.errors?.email && <p className="text-xs text-red-600 mt-1">{state.errors.email[0]}</p>}
          </div>

          <div>
            <label className="label" htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              name="telefone"
              type="text"
              defaultValue={professorInicial?.usuario.telefone ?? ''}
              placeholder="(00) 00000-0000"
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
              defaultValue={professorInicial?.cpf ?? ''}
              className="input"
              disabled={pending}
            />
          </div>

          <div>
            <label className="label" htmlFor="registro">Registro (ex.: CRB)</label>
            <input
              id="registro"
              name="registro"
              type="text"
              defaultValue={professorInicial?.registro ?? ''}
              className="input"
              disabled={pending}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label" htmlFor="formacao">Formação acadêmica</label>
            <input
              id="formacao"
              name="formacao"
              type="text"
              defaultValue={professorInicial?.formacao ?? ''}
              placeholder="Ex.: Licenciatura em Pedagogia — UFBA"
              className="input"
              disabled={pending}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label" htmlFor="observacoes">Observações internas</label>
            <textarea
              id="observacoes"
              name="observacoes"
              rows={3}
              defaultValue={professorInicial?.observacoes ?? ''}
              className="input"
              disabled={pending}
            />
          </div>
        </div>

        {!modoEdicao && (
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-3">
            Uma senha temporária de acesso ao portal será gerada automaticamente para este professor.
            Comunique-a com segurança e oriente a troca no primeiro acesso.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/professores" className="btn btn-secondary btn-sm rounded-lg text-xs">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary btn-sm bg-[#b91c1c] text-white hover:bg-[#dc2626] font-medium rounded-lg text-xs py-2 px-3.5 transition-colors"
        >
          {pending ? 'Salvando…' : modoEdicao ? 'Salvar alterações' : 'Cadastrar Professor'}
        </button>
      </div>
    </form>
  )
}
