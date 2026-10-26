'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import {
  criarAluno,
  atualizarAluno,
  vincularResponsavelAoAluno,
  type AlunoState,
} from '@/app/actions/alunos'
import { SERIES_ESCOLA, TURNOS_ESCOLA } from '@/lib/series-escola'

interface Turma {
  id: string
  nome: string
  turno: string
  serie: { nome: string; codigo: string }
}

interface ResponsavelOpcao {
  id: string
  nome: string
  parentesco: string
}

interface AlunoInicial {
  id: string
  nome: string
  nomeSocial: string | null
  cpf: string | null
  rg: string | null
  certidaoNascimento: string | null
  dataNascimento: Date
  sexo: string | null
  status: string
  endereco: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  escolaAnterior: string | null
  alergias: string | null
  necessidadesEspeciais: string | null
  planoDeSaude: string | null
  observacoes: string | null
  consentimentoImagem: boolean
  matriculaAtivaTurmaId?: string
  matriculaAtivaSerieCodigo?: string
  matriculaAtivaTurno?: string
  matriculaAtivaDescricao?: string
  responsaveis: Array<{
    id: string
    principal: boolean
    responsavel: { id: string; nome: string; parentesco: string }
  }>
}

interface Props {
  turmas: Turma[]
  responsaveis: ResponsavelOpcao[]
  alunoInicial?: AlunoInicial
}

const STATUS_OPCOES = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'INATIVO', label: 'Inativo' },
  { value: 'TRANSFERIDO', label: 'Transferido' },
  { value: 'TRANCADO', label: 'Trancado' },
]

function formatarDataInput(data: Date): string {
  const d = new Date(data)
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export default function FormAluno({ turmas, responsaveis, alunoInicial }: Props) {
  const modoEdicao = !!alunoInicial
  const action = modoEdicao ? atualizarAluno : criarAluno
  const [state, formAction, pending] = useActionState<AlunoState, FormData>(action, undefined)

  const [responsavelModo, setResponsavelModo] = useState<'nenhum' | 'existente' | 'novo'>('nenhum')

  const serieInicial = SERIES_ESCOLA.some((s) => s.codigo === alunoInicial?.matriculaAtivaSerieCodigo)
    ? (alunoInicial?.matriculaAtivaSerieCodigo as string)
    : ''
  const [serieSel, setSerieSel] = useState<string>(serieInicial)
  const [turnoSel, setTurnoSel] = useState<string>(alunoInicial?.matriculaAtivaTurno === 'TARDE' ? 'TARDE' : 'MANHA')
  const turmasCompativeis = turmas.filter((t) => t.serie.codigo === serieSel && t.turno === turnoSel)

  const [vincularState, vincularAction, vincularPending] = useActionState<AlunoState, FormData>(
    vincularResponsavelAoAluno,
    undefined
  )

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        {modoEdicao && <input type="hidden" name="id" value={alunoInicial.id} />}

        {state?.message && (
          <div role="alert" className="p-3 bg-red-50/60 border border-red-200/60 rounded-lg text-red-800 text-xs">
            {state.message}
          </div>
        )}

        {/* Dados do aluno */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display">Dados do Aluno</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label" htmlFor="nome">Nome completo *</label>
              <input
                id="nome"
                name="nome"
                type="text"
                defaultValue={alunoInicial?.nome}
                required
                className={`input ${state?.errors?.nome ? 'input-error' : ''}`}
                disabled={pending}
              />
              {state?.errors?.nome && <p className="text-xs text-red-600 mt-1">{state.errors.nome[0]}</p>}
            </div>

            <div>
              <label className="label" htmlFor="nomeSocial">Nome social</label>
              <input
                id="nomeSocial"
                name="nomeSocial"
                type="text"
                defaultValue={alunoInicial?.nomeSocial ?? ''}
                className="input"
                disabled={pending}
              />
            </div>

            <div>
              <label className="label" htmlFor="dataNascimento">Data de nascimento *</label>
              <input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                defaultValue={alunoInicial ? formatarDataInput(alunoInicial.dataNascimento) : ''}
                required
                className={`input ${state?.errors?.dataNascimento ? 'input-error' : ''}`}
                disabled={pending}
              />
              {state?.errors?.dataNascimento && <p className="text-xs text-red-600 mt-1">{state.errors.dataNascimento[0]}</p>}
            </div>

            <div>
              <label className="label" htmlFor="sexo">Sexo</label>
              <select id="sexo" name="sexo" defaultValue={alunoInicial?.sexo ?? ''} className="input" disabled={pending}>
                <option value="">Não informado</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={alunoInicial?.status ?? 'PENDENTE'} className="input" disabled={pending}>
                {STATUS_OPCOES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="cpf">CPF</label>
              <input id="cpf" name="cpf" type="text" defaultValue={alunoInicial?.cpf ?? ''} className="input" disabled={pending} />
            </div>

            <div>
              <label className="label" htmlFor="rg">RG</label>
              <input id="rg" name="rg" type="text" defaultValue={alunoInicial?.rg ?? ''} className="input" disabled={pending} />
            </div>

            <div>
              <label className="label" htmlFor="certidaoNascimento">Certidão de nascimento</label>
              <input
                id="certidaoNascimento"
                name="certidaoNascimento"
                type="text"
                defaultValue={alunoInicial?.certidaoNascimento ?? ''}
                className="input"
                disabled={pending}
              />
            </div>

            <div>
              <label className="label" htmlFor="escolaAnterior">Escola anterior</label>
              <input
                id="escolaAnterior"
                name="escolaAnterior"
                type="text"
                defaultValue={alunoInicial?.escolaAnterior ?? ''}
                className="input"
                disabled={pending}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 pt-2 border-t border-slate-100">
            <input
              type="checkbox"
              name="consentimentoImagem"
              defaultChecked={alunoInicial?.consentimentoImagem}
              disabled={pending}
              className="rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]"
            />
            Consentimento de uso de imagem do aluno
          </label>
        </div>

        {/* Endereço */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display">Endereço</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="label" htmlFor="endereco">Endereço</label>
              <input id="endereco" name="endereco" type="text" defaultValue={alunoInicial?.endereco ?? ''} className="input" disabled={pending} />
            </div>
            <div>
              <label className="label" htmlFor="cidade">Cidade</label>
              <input id="cidade" name="cidade" type="text" defaultValue={alunoInicial?.cidade ?? "Dias d'Ávila"} className="input" disabled={pending} />
            </div>
            <div>
              <label className="label" htmlFor="estado">Estado</label>
              <input id="estado" name="estado" type="text" defaultValue={alunoInicial?.estado ?? 'BA'} maxLength={2} className="input" disabled={pending} />
            </div>
            <div>
              <label className="label" htmlFor="cep">CEP</label>
              <input id="cep" name="cep" type="text" defaultValue={alunoInicial?.cep ?? ''} className="input" disabled={pending} />
            </div>
          </div>
        </div>

        {/* Saúde */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display">Saúde</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="alergias">Alergias / Restrições</label>
              <textarea id="alergias" name="alergias" rows={2} defaultValue={alunoInicial?.alergias ?? ''} className="input" disabled={pending} />
            </div>
            <div>
              <label className="label" htmlFor="necessidadesEspeciais">Necessidades especiais</label>
              <textarea
                id="necessidadesEspeciais"
                name="necessidadesEspeciais"
                rows={2}
                defaultValue={alunoInicial?.necessidadesEspeciais ?? ''}
                className="input"
                disabled={pending}
              />
            </div>
            <div>
              <label className="label" htmlFor="planoDeSaude">Plano de saúde</label>
              <input id="planoDeSaude" name="planoDeSaude" type="text" defaultValue={alunoInicial?.planoDeSaude ?? ''} className="input" disabled={pending} />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="observacoes">Observações gerais</label>
              <textarea id="observacoes" name="observacoes" rows={2} defaultValue={alunoInicial?.observacoes ?? ''} className="input" disabled={pending} />
            </div>
          </div>
        </div>

        {/* Matrícula */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display">Matrícula</h2>

          {modoEdicao && alunoInicial?.matriculaAtivaDescricao && (
            <p className="text-xs text-slate-500">
              Matrícula atual: <span className="font-semibold text-slate-700">{alunoInicial.matriculaAtivaDescricao}</span>
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="serieCodigo">Série</label>
              <select
                id="serieCodigo"
                name="serieCodigo"
                value={serieSel}
                onChange={(e) => setSerieSel(e.target.value)}
                className="input"
                disabled={pending}
              >
                <option value="">{modoEdicao ? 'Manter matrícula atual' : 'Sem matrícula no momento'}</option>
                <optgroup label="Educação Infantil">
                  {SERIES_ESCOLA.filter((s) => s.nivel === 'educacao_infantil').map((s) => (
                    <option key={s.codigo} value={s.codigo}>{s.nome}</option>
                  ))}
                </optgroup>
                <optgroup label="Ensino Fundamental">
                  {SERIES_ESCOLA.filter((s) => s.nivel === 'ensino_fundamental').map((s) => (
                    <option key={s.codigo} value={s.codigo}>{s.nome}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <span className="label">Turno</span>
              <div className="flex gap-2">
                {TURNOS_ESCOLA.map((t) => (
                  <label
                    key={t.value}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                      turnoSel === t.value
                        ? 'border-[#b91c1c] bg-red-50 text-[#b91c1c]'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    } ${!serieSel ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input
                      type="radio"
                      name="turno"
                      value={t.value}
                      checked={turnoSel === t.value}
                      onChange={() => setTurnoSel(t.value)}
                      disabled={pending || !serieSel}
                      className="sr-only"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {serieSel && turmasCompativeis.length > 1 && (
            <div>
              <label className="label" htmlFor="turmaId">Turma</label>
              <select
                id="turmaId"
                name="turmaId"
                defaultValue={
                  turmasCompativeis.some((t) => t.id === alunoInicial?.matriculaAtivaTurmaId)
                    ? alunoInicial?.matriculaAtivaTurmaId
                    : turmasCompativeis[0].id
                }
                className="input"
                disabled={pending}
              >
                {turmasCompativeis.map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
          )}
          {serieSel && turmasCompativeis.length === 1 && (
            <input type="hidden" name="turmaId" value={turmasCompativeis[0].id} />
          )}

          <p className="text-xs text-slate-400">
            {serieSel
              ? turmasCompativeis.length > 0
                ? 'A matrícula será feita na turma desta série e turno.'
                : 'Ainda não há turma para esta série e turno — ela será criada automaticamente no ano letivo ativo.'
              : modoEdicao
                ? 'Escolha uma série para transferir o aluno de turma.'
                : 'Escolha a série e o turno para efetivar a matrícula.'}
          </p>
        </div>

        {/* Responsável (apenas no cadastro) */}
        {!modoEdicao && (
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-display">Responsável Principal</h2>

            <div className="flex flex-wrap gap-4">
              {(['nenhum', 'existente', 'novo'] as const).map((modo) => (
                <label key={modo} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="responsavelModo"
                    value={modo}
                    checked={responsavelModo === modo}
                    onChange={() => setResponsavelModo(modo)}
                    disabled={pending}
                  />
                  {modo === 'nenhum' ? 'Definir depois' : modo === 'existente' ? 'Usar responsável já cadastrado' : 'Cadastrar novo responsável'}
                </label>
              ))}
            </div>

            {responsavelModo === 'existente' && (
              <div>
                <label className="label" htmlFor="responsavelId">Responsável cadastrado</label>
                <select id="responsavelId" name="responsavelId" className="input" disabled={pending}>
                  <option value="">Selecione um responsável</option>
                  {responsaveis.map((r) => (
                    <option key={r.id} value={r.id}>{r.nome} — {r.parentesco}</option>
                  ))}
                </select>
              </div>
            )}

            {responsavelModo === 'novo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="respNome">Nome completo *</label>
                  <input id="respNome" name="respNome" type="text" className="input" disabled={pending} />
                </div>
                <div>
                  <label className="label" htmlFor="respParentesco">Parentesco *</label>
                  <input id="respParentesco" name="respParentesco" type="text" placeholder="Ex.: Mãe, Pai, Tutor" className="input" disabled={pending} />
                </div>
                <div>
                  <label className="label" htmlFor="respTelefone">Telefone *</label>
                  <input id="respTelefone" name="respTelefone" type="text" placeholder="(00) 00000-0000" className="input" disabled={pending} />
                </div>
                <div>
                  <label className="label" htmlFor="respWhatsapp">WhatsApp</label>
                  <input id="respWhatsapp" name="respWhatsapp" type="text" className="input" disabled={pending} />
                </div>
                <div>
                  <label className="label" htmlFor="respEmail">E-mail</label>
                  <input id="respEmail" name="respEmail" type="email" className="input" disabled={pending} />
                </div>
                <div>
                  <label className="label" htmlFor="respCpf">CPF</label>
                  <input id="respCpf" name="respCpf" type="text" className="input" disabled={pending} />
                </div>
                <div className="md:col-span-2">
                  <label className="label" htmlFor="respEndereco">Endereço</label>
                  <input id="respEndereco" name="respEndereco" type="text" className="input" disabled={pending} />
                </div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <input type="checkbox" name="respFinanceiro" disabled={pending} className="rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]" />
                  Responsável financeiro
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <input type="checkbox" name="respPedagogico" defaultChecked disabled={pending} className="rounded border-slate-300 text-[#b91c1c] focus:ring-[#b91c1c]" />
                  Responsável pedagógico
                </label>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/alunos" className="btn btn-secondary btn-sm rounded-lg text-xs">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary btn-sm bg-[#b91c1c] text-white hover:bg-[#dc2626] font-medium rounded-lg text-xs py-2 px-3.5 transition-colors"
          >
            {pending ? 'Salvando…' : modoEdicao ? 'Salvar alterações' : 'Cadastrar Aluno'}
          </button>
        </div>
      </form>

      {/* Responsáveis vinculados + vincular novo (apenas em edição) */}
      {modoEdicao && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-display">Responsáveis Vinculados</h2>

          {alunoInicial.responsaveis.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Nenhum responsável vinculado a este aluno.</p>
          ) : (
            <div className="space-y-2">
              {alunoInicial.responsaveis.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 border border-slate-200/80 rounded-lg bg-slate-50/50">
                  <div>
                    <Link href={`/admin/responsaveis/${v.responsavel.id}`} className="text-xs font-bold text-slate-800 hover:text-[#b91c1c] hover:underline">
                      {v.responsavel.nome}
                    </Link>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {v.responsavel.parentesco} {v.principal && '· Principal'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form action={vincularAction} className="flex flex-col md:flex-row items-end gap-3 border-t border-slate-100 pt-4">
            <input type="hidden" name="alunoId" value={alunoInicial.id} />
            <div className="flex-1 w-full">
              <label className="label" htmlFor="vincularResponsavelId">Vincular responsável já cadastrado</label>
              <select id="vincularResponsavelId" name="responsavelId" className="input" disabled={vincularPending} defaultValue="">
                <option value="" disabled>Selecione um responsável</option>
                {responsaveis
                  .filter((r) => !alunoInicial.responsaveis.some((v) => v.responsavel.id === r.id))
                  .map((r) => (
                    <option key={r.id} value={r.id}>{r.nome} — {r.parentesco}</option>
                  ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={vincularPending}
              className="btn btn-primary btn-sm bg-[#b91c1c] text-white hover:bg-[#dc2626] font-medium rounded-lg text-xs py-2.5 px-3.5 transition-colors w-full md:w-auto shrink-0"
            >
              {vincularPending ? 'Vinculando…' : 'Vincular'}
            </button>
          </form>
          {vincularState?.message && (
            <p className={`text-xs ${vincularState.success ? 'text-emerald-700' : 'text-red-600'}`}>{vincularState.message}</p>
          )}
        </div>
      )}
    </div>
  )
}
