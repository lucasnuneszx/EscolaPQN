'use client'
// ─────────────────────────────────────────────────────────────
// Formulário de criação de Documento Escolar — Client Component
//
// NOTA: não há upload de arquivo real. O campo "url" é um link de
// texto livre (ex.: link do Google Drive, S3 público, etc.), pois
// a integração com um provedor de storage ainda não foi configurada.
// ─────────────────────────────────────────────────────────────
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { criarDocumento, type DocumentoState } from '@/app/actions/documentos'

const OPCOES_VISIBILIDADE = [
  { valor: 'TODOS', label: 'Todos' },
  { valor: 'RESPONSAVEL', label: 'Responsáveis' },
  { valor: 'PROFESSOR', label: 'Professores' },
  { valor: 'ALUNO', label: 'Alunos' },
]

export default function FormDocumento() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<DocumentoState, FormData>(
    criarDocumento,
    undefined
  )

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

      <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg text-amber-800 text-xs leading-relaxed">
        Cole abaixo o link (URL) do documento já hospedado — ainda não há upload de arquivos
        integrado a um provedor de armazenamento.
      </div>

      <div>
        <label htmlFor="titulo" className="label">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          className={`input ${state?.errors?.titulo ? 'input-error' : ''}`}
          disabled={pending}
        />
        {state?.errors?.titulo && (
          <p className="text-xs text-red-600 font-medium mt-1">{state.errors.titulo[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="descricao" className="label">
          Descrição (opcional)
        </label>
        <textarea id="descricao" name="descricao" rows={3} className="input" disabled={pending} />
      </div>

      <div>
        <label htmlFor="url" className="label">
          URL do documento
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://..."
          required
          className={`input ${state?.errors?.url ? 'input-error' : ''}`}
          disabled={pending}
        />
        {state?.errors?.url && (
          <p className="text-xs text-red-600 font-medium mt-1">{state.errors.url[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoria" className="label">
            Categoria
          </label>
          <select
            id="categoria"
            name="categoria"
            defaultValue="circular"
            className={`input ${state?.errors?.categoria ? 'input-error' : ''}`}
            disabled={pending}
          >
            <option value="regimento">Regimento</option>
            <option value="circular">Circular</option>
            <option value="cronograma">Cronograma</option>
            <option value="cardapio">Cardápio</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label htmlFor="publicadoEm" className="label">
            Data de publicação
          </label>
          <input
            id="publicadoEm"
            name="publicadoEm"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
            className={`input ${state?.errors?.publicadoEm ? 'input-error' : ''}`}
            disabled={pending}
          />
        </div>
      </div>

      <div>
        <span className="label">Visível para</span>
        <div className="flex flex-wrap gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          {OPCOES_VISIBILIDADE.map((opcao) => (
            <label
              key={opcao.valor}
              className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                name="visivelPara"
                value={opcao.valor}
                defaultChecked={opcao.valor === 'TODOS'}
                className="w-4 h-4 rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
                disabled={pending}
              />
              {opcao.label}
            </label>
          ))}
        </div>
        {state?.errors?.visivelPara && (
          <p className="text-xs text-red-600 font-medium mt-1">{state.errors.visivelPara[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mimeType" className="label">
            Tipo do arquivo (opcional)
          </label>
          <input
            id="mimeType"
            name="mimeType"
            type="text"
            placeholder="application/pdf"
            className="input"
            disabled={pending}
          />
        </div>
        <div>
          <label htmlFor="tamanhoBytes" className="label">
            Tamanho em bytes (opcional)
          </label>
          <input
            id="tamanhoBytes"
            name="tamanhoBytes"
            type="number"
            min={0}
            className="input"
            disabled={pending}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? 'Salvando…' : 'Adicionar documento'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/documentos')}
          disabled={pending}
          className="btn btn-secondary btn-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
