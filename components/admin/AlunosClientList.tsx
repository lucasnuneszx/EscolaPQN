'use client'

import { useState } from 'react'
import Link from 'next/link'
import EmptyState from '@/components/admin/EmptyState'

interface Responsavel {
  id: string
  nome: string
  cpf: string | null
  email: string | null
  telefone: string
  parentesco: string
  responsavelFinanceiro: boolean
}

interface Aluno {
  id: string
  nome: string
  cpf: string | null
  rg: string | null
  dataNascimento: Date
  sexo: string | null
  status: string
  endereco: string | null
  cidade: string | null
  estado: string | null
  alergias: string | null
  necessidadesEspeciais: string | null
  responsaveis: Array<{
    id: string
    principal: boolean
    responsavel: Responsavel
  }>
  matriculas: Array<{
    id: string
    numero: string
    turma: {
      id: string
      nome: string
      turno: string
      sala: string | null
    }
  }>
  mensalidades: Array<{
    id: string
    referencia: string
    valorFinal: number
    status: string
    dataVencimento: Date
    dataPagamento: Date | null
  }>
}

interface Props {
  alunosIniciais: Aluno[]
}

export default function AlunosClientList({ alunosIniciais }: Props) {
  const [busca, setBusca] = useState('')
  const [filtroSerie, setFiltroSerie] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null)
  const [abaAtiva, setAbaAtiva] = useState<'cadastro' | 'familia' | 'financeiro'>('cadastro')

  const alunosFiltrados = alunosIniciais.filter((aluno) => {
    const bateBusca =
      aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (aluno.cpf && aluno.cpf.includes(busca)) ||
      aluno.matriculas.some((m) => m.numero.includes(busca))

    const bateSerie = filtroSerie ? aluno.matriculas.some((m) => m.turma.id === filtroSerie) : true
    const bateStatus = filtroStatus ? aluno.status === filtroStatus : true

    return bateBusca && bateSerie && bateStatus
  })

  const turmasUnicas = Array.from(
    new Map(
      alunosIniciais.flatMap((a) => a.matriculas.map((m) => [m.turma.id, m.turma]))
    ).values()
  )

  const formatarData = (data: Date | string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const calcularIdade = (dataNasc: Date | string) => {
    const hoje = new Date()
    const nasc = new Date(dataNasc)
    let idade = hoje.getFullYear() - nasc.getFullYear()
    const m = hoje.getMonth() - nasc.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--
    }
    return `${idade} anos`
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <div className="bg-white border border-slate-200/85 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            placeholder="Buscar estudante por nome, CPF ou número de matrícula..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#b91c1c] outline-none transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <select
            value={filtroSerie}
            onChange={(e) => setFiltroSerie(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:bg-white focus:border-[#b91c1c] transition-all"
          >
            <option value="">Todas as turmas</option>
            {turmasUnicas.map((t) => (
              <option key={t.id} value={t.id}>{t.nome} ({t.turno})</option>
            ))}
          </select>
          
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:bg-white focus:border-[#b91c1c] transition-all"
          >
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativo</option>
            <option value="PENDENTE">Pendente</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        {alunosFiltrados.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            title="Nenhum aluno encontrado"
            description="A busca não retornou resultados. Verifique os termos digitados ou ajuste os filtros."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Estudante</th>
                  <th>Matrícula</th>
                  <th>Turma</th>
                  <th>Responsáveis</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosFiltrados.map((aluno) => {
                  const numMatricula = aluno.matriculas[0]?.numero ?? 'Sem matrícula'
                  const turma = aluno.matriculas[0]?.turma?.nome ?? 'Sem Turma'
                  const statusColors: Record<string, string> = {
                    ATIVO: 'badge-success',
                    PENDENTE: 'badge-warning',
                    INATIVO: 'badge-danger',
                  }
                  
                  return (
                    <tr key={aluno.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-900">{aluno.nome}</div>
                        <div className="text-xs text-slate-400 mt-0.5">CPF: {aluno.cpf ?? 'Não cadastrado'}</div>
                      </td>
                      <td className="text-slate-600 font-mono text-xs font-semibold">{numMatricula}</td>
                      <td className="text-slate-600 font-medium text-xs">{turma}</td>
                      <td>
                        {aluno.responsaveis.map((v) => (
                          <div key={v.id} className="text-xs text-slate-500 font-medium">
                            {v.responsavel.nome} &middot; <span className="text-slate-400 font-normal">{v.responsavel.parentesco}</span>
                          </div>
                        ))}
                      </td>
                      <td>
                        <span className={`badge ${statusColors[aluno.status] ?? 'badge-neutral'}`}>
                          {aluno.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setAlunoSelecionado(aluno)
                              setAbaAtiva('cadastro')
                            }}
                            title="Visualizar ficha completa"
                            className="p-1.5 text-slate-500 hover:text-[#b91c1c] hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          <Link
                            href={`/admin/alunos/editar/${aluno.id}`}
                            title="Editar cadastro"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalhes do aluno */}
      {alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
            
            <div className="bg-slate-950 text-white p-6 relative">
              <button
                onClick={() => setAlunoSelecionado(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-slate-200">
                  {alunoSelecionado.nome.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold font-display">{alunoSelecionado.nome}</h2>
                    <span className={`badge ${
                      alunoSelecionado.status === 'ATIVO' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {alunoSelecionado.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Matrícula: {alunoSelecionado.matriculas[0]?.numero ?? 'Sem Matrícula'} &middot; Turma: {alunoSelecionado.matriculas[0]?.turma?.nome ?? 'Sem Turma'}
                  </p>
                </div>
              </div>
            </div>

            {/* Abas de Navegação */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4">
              {[
                { id: 'cadastro', label: 'Ficha Cadastral' },
                { id: 'familia', label: 'Responsáveis' },
                { id: 'financeiro', label: 'Mensalidades 2026' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAbaAtiva(tab.id as 'cadastro' | 'familia' | 'financeiro')}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                    abaAtiva === tab.id
                      ? 'border-[#b91c1c] text-[#b91c1c] font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-600">
              
              {/* ABA CADASTRO */}
              {abaAtiva === 'cadastro' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CPF do Estudante</p>
                      <p className="text-slate-800 font-medium mt-0.5">{alunoSelecionado.cpf ?? 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">RG / Certidão</p>
                      <p className="text-slate-800 font-medium mt-0.5">{alunoSelecionado.rg ?? 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Idade / Nasc.</p>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {calcularIdade(alunoSelecionado.dataNascimento)} ({formatarData(alunoSelecionado.dataNascimento)})
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sexo</p>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {alunoSelecionado.sexo === 'M' ? 'Masculino' : 'Feminino'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Endereço Completo</p>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {alunoSelecionado.endereco ?? 'Não cadastrado'}
                        {alunoSelecionado.cidade && `, ${alunoSelecionado.cidade} - ${alunoSelecionado.estado}`}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Alergias / Restrições</p>
                      <p className="text-slate-700 font-semibold mt-1 text-xs">
                        {alunoSelecionado.alergias ?? 'Nenhuma informada.'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Necessidades Especiais</p>
                      <p className="text-slate-700 font-semibold mt-1 text-xs">
                        {alunoSelecionado.necessidadesEspeciais ?? 'Nenhuma informada.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA FAMÍLIA */}
              {abaAtiva === 'familia' && (
                <div className="space-y-4">
                  {alunoSelecionado.responsaveis.map((v) => (
                    <div key={v.id} className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900">{v.responsavel.nome}</p>
                          <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                            {v.responsavel.parentesco}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-xs text-slate-500">
                          <p>Email: {v.responsavel.email ?? 'Não cadastrado'}</p>
                          <p>Tel: {v.responsavel.telefone}</p>
                          <p>CPF: {v.responsavel.cpf ?? 'Não informado'}</p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {v.responsavel.responsavelFinanceiro ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Responsável Financeiro</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Responsável Pedagógico</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ABA FINANCEIRO */}
              {abaAtiva === 'financeiro' && (
                <div className="space-y-4 animate-fade-in">
                  {alunoSelecionado.mensalidades.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-xs">Nenhum lançamento financeiro para este estudante.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden border border-slate-200/70 rounded-xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Referência</th>
                            <th className="p-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vencimento</th>
                            <th className="p-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Valor Líquido</th>
                            <th className="p-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Liquidação</th>
                            <th className="p-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {alunoSelecionado.mensalidades.map((m) => {
                            const statusColors: Record<string, string> = {
                              PAGO: 'text-emerald-700 bg-emerald-50 border-emerald-100',
                              PENDENTE: 'text-amber-700 bg-amber-50 border-amber-100',
                              VENCIDO: 'text-red-700 bg-red-50 border-red-100',
                            }
                            return (
                              <tr key={m.id} className="text-xs">
                                <td className="p-3 font-semibold text-slate-800">{m.referencia}</td>
                                <td className="p-3 text-slate-500">{formatarData(m.dataVencimento)}</td>
                                <td className="p-3 font-bold text-slate-900">
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.valorFinal)}
                                </td>
                                <td className="p-3 text-slate-500">
                                  {m.dataPagamento ? formatarData(m.dataPagamento) : '--'}
                                </td>
                                <td className="p-3">
                                  <span className={`inline-block px-2 py-0.5 border rounded font-semibold text-[10px] uppercase ${statusColors[m.status] ?? 'bg-slate-50 text-slate-500'}`}>
                                    {m.status}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setAlunoSelecionado(null)}
                className="btn btn-secondary btn-sm rounded-lg text-xs"
              >
                Fechar
              </button>
              <Link
                href={`/admin/alunos/editar/${alunoSelecionado.id}`}
                className="btn btn-primary btn-sm bg-[#b91c1c] text-white hover:bg-[#dc2626] font-medium rounded-lg text-xs py-2 px-3.5 transition-colors"
              >
                Editar Ficha
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
