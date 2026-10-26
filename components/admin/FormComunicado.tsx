'use client'
import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  criarComunicado,
  atualizarComunicado,
  type ComunicadoState,
} from '@/app/actions/comunicados'

interface TurmaOpcao {
  id: string
  nome: string
  turno: string
  serie: { nome: string }
}

interface ComunicadoInicial {
  id: string
  titulo: string
  conteudo: string
  tipo: string
  fixado: boolean
  publicadoEm: Date | null
  expiracaoEm: Date | null
  turmaIds: string[]
}

interface FormComunicadoProps {
  turmas: TurmaOpcao[]
  comunicado?: ComunicadoInicial
}

function paraInputDate(data: Date | null | undefined): string {
  if (!data) return ''
  return new Date(data).toISOString().slice(0, 10)
}

export default function FormComunicado({ turmas, comunicado }: FormComunicadoProps) {
  const router = useRouter()
  const emEdicao = Boolean(comunicado)

  const action = emEdicao
    ? atualizarComunicado.bind(null, comunicado!.id)
    : criarComunicado

  const [state, formAction, pending] = useActionState<ComunicadoState, FormData>(
    action,
    undefined
  )

  const [tipo, setTipo] = useState(comunicado?.tipo ?? 'GERAL')
  const [turmaIdsSelecionadas, setTurmaIdsSelecionadas] = useState<string[]>(
    comunicado?.turmaIds ?? []
  )

  function alternarTurma(id: string) {
    setTurmaIdsSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((t) => t !== id) : [...atual, id]
    )
  }

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
        <label htmlFor="titulo" className="label">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          defaultValue={comunicado?.titulo}
          required
          className={`input ${state?.errors?.titulo ? 'input-error' : ''}`}
          disabled={pending}
        />
        {state?.errors?.titulo && (
          <p className="text-xs text-red-600 font-medium mt-1">{state.errors.titulo[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="conteudo" className="label">
          Conteúdo
        </label>
        <textarea
          id="conteudo"
          name="conteudo"
          rows={6}
          defaultValue={comunicado?.conteudo}
          required
          className={`input ${state?.errors?.conteudo ? 'input-error' : ''}`}
          disabled={pending}
        />
        {state?.errors?.conteudo && (
          <p className="text-xs text-red-600 font-medium mt-1">{state.errors.conteudo[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tipo" className="label">
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className={`input ${state?.errors?.tipo ? 'input-error' : ''}`}
            disabled={pending}
          >
            <option value="GERAL">Geral (todos)</option>
            <option value="TURMA">Turma(s) específica(s)</option>
            <option value="INDIVIDUAL">Individual / Privativo</option>
          </select>
          {state?.errors?.tipo && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.tipo[0]}</p>
          )}
        </div>

        <div className="flex items-end pb-2.5">
          <label htmlFor="fixado" className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="fixado"
              name="fixado"
              type="checkbox"
              defaultChecked={comunicado?.fixado}
              className="w-4 h-4 rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
              disabled={pending}
            />
            <span className="text-sm font-medium text-slate-700">Fixar no topo do mural</span>
          </label>
        </div>
      </div>

      {tipo === 'TURMA' && (
        <div>
          <span className="label">Turmas destinatárias</span>
          {turmas.length === 0 ? (
            <p className="text-xs text-slate-400">Nenhuma turma cadastrada.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-lg">
              {turmas.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    name="turmaIds"
                    value={t.id}
                    checked={turmaIdsSelecionadas.includes(t.id)}
                    onChange={() => alternarTurma(t.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
                    disabled={pending}
                  />
                  {t.serie.nome} — {t.nome} ({t.turno})
                </label>
              ))}
            </div>
          )}
          {state?.errors?.turmaIds && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.turmaIds[0]}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="publicadoEm" className="label">
            Data de publicação
          </label>
          <input
            id="publicadoEm"
            name="publicadoEm"
            type="date"
            defaultValue={paraInputDate(comunicado?.publicadoEm) || new Date().toISOString().slice(0, 10)}
            required
            className={`input ${state?.errors?.publicadoEm ? 'input-error' : ''}`}
            disabled={pending}
          />
          {state?.errors?.publicadoEm && (
            <p className="text-xs text-red-600 font-medium mt-1">{state.errors.publicadoEm[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="expiracaoEm" className="label">
            Data de expiração (opcional)
          </label>
          <input
            id="expiracaoEm"
            name="expiracaoEm"
            type="date"
            defaultValue={paraInputDate(comunicado?.expiracaoEm)}
            className="input"
            disabled={pending}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? 'Salvando…' : emEdicao ? 'Salvar alterações' : 'Publicar comunicado'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/comunicados')}
          disabled={pending}
          className="btn btn-secondary btn-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
