'use client'

import { useState } from 'react'
import Link from 'next/link'
import EmptyState from '@/components/admin/EmptyState'

interface Professor {
  id: string
  cpf: string | null
  formacao: string | null
  registro: string | null
  observacoes: string | null
  usuario: {
    nome: string
    email: string
    telefone: string | null
    ativo: boolean
    avatarUrl: string | null
  }
  disciplinas: Array<{
    id: string
    turma: {
      nome: string
      turno: string
    }
    disciplina: {
      nome: string
    }
  }>
}

interface Props {
  professoresIniciais: Professor[]
}

export default function ProfessoresClientList({ professoresIniciais }: Props) {
  const [busca, setBusca] = useState('')
  const [filtroMateria, setFiltroMateria] = useState('')
  
  // Estado do Modal
  const [profSelecionado, setProfSelecionado] = useState<Professor | null>(null)
  const [abaAtiva, setAbaAtiva] = useState<'cadastro' | 'materias'>('cadastro')

  const professoresFiltrados = professoresIniciais.filter((prof) => {
    const bateBusca =
      prof.usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
      prof.usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
      (prof.cpf && prof.cpf.includes(busca))

    const bateMateria = filtroMateria
      ? prof.disciplinas.some((d) => d.disciplina.nome.toLowerCase().includes(filtroMateria.toLowerCase()))
      : true

    return bateBusca && bateMateria
  })

  // Extrair disciplinas únicas lecionadas para o filtro
  const materiasUnicas = Array.from(
    new Set(professoresIniciais.flatMap((p) => p.disciplinas.map((d) => d.disciplina.nome)))
  )

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white border border-slate-200/85 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            placeholder="Buscar docente por nome, e-mail, CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#b91c1c] outline-none transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="w-full md:w-auto shrink-0">
          <select
            value={filtroMateria}
            onChange={(e) => setFiltroMateria(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:bg-white focus:border-[#b91c1c] transition-all"
          >
            <option value="">Todas as disciplinas</option>
            {materiasUnicas.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Professores */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        {professoresFiltrados.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="Nenhum professor encontrado"
            description="Nenhum docente corresponde aos critérios de busca ou filtros aplicados."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Docente</th>
                  <th>Contato</th>
                  <th>Formação</th>
                  <th>Leciona Em</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {professoresFiltrados.map((prof) => (
                  <tr key={prof.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-900">{prof.usuario.nome}</div>
                      <div className="text-xs text-slate-400 mt-0.5">CPF: {prof.cpf ?? 'Não informado'}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-600 font-medium">{prof.usuario.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Tel: {prof.usuario.telefone ?? 'Não informado'}</div>
                    </td>
                    <td className="text-slate-600 font-medium text-xs max-w-xs truncate">
                      {prof.formacao ?? 'Não cadastrada'}
                    </td>
                    <td>
                      {prof.disciplinas.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Nenhuma matéria</span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Array.from(new Set(prof.disciplinas.map((d) => d.disciplina.nome))).map((nome) => (
                            <span key={nome} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                              {nome}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      {prof.usuario.ativo ? (
                        <span className="badge badge-success">Ativo</span>
                      ) : (
                        <span className="badge badge-danger">Inativo</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Visualizar Detalhes */}
                        <button
                          onClick={() => {
                            setProfSelecionado(prof)
                            setAbaAtiva('cadastro')
                          }}
                          title="Ver ficha do professor"
                          className="p-1.5 text-slate-500 hover:text-[#b91c1c] hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        {/* Editar */}
                        <Link
                          href={`/admin/professores/editar/${prof.id}`}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL DETALHES PROFESSOR ───────────────────────────── */}
      {profSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[80vh]">
            
            {/* Cabeçalho */}
            <div className="bg-slate-950 text-white p-6 relative">
              <button
                onClick={() => setProfSelecionado(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-slate-200">
                  {profSelecionado.usuario.nome.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold font-display">{profSelecionado.usuario.nome}</h2>
                    {profSelecionado.usuario.ativo ? (
                      <span className="badge badge-success">Ativo</span>
                    ) : (
                      <span className="badge badge-danger">Inativo</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Corpo Docente &middot; Registro: {profSelecionado.registro ?? 'Não informado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Abas */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4">
              {[
                { id: 'cadastro', label: 'Cadastro Docente' },
                { id: 'materias', label: 'Turmas e Disciplinas' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAbaAtiva(tab.id as 'cadastro' | 'materias')}
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

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-600">
              
              {/* ABA CADASTRO */}
              {abaAtiva === 'cadastro' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CPF do Docente</p>
                      <p className="text-slate-800 font-medium mt-0.5">{profSelecionado.cpf ?? 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Registro do Conselho (CRB)</p>
                      <p className="text-slate-800 font-medium mt-0.5">{profSelecionado.registro ?? 'Não cadastrado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">E-mail Corporativo</p>
                      <p className="text-slate-800 font-medium mt-0.5">{profSelecionado.usuario.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Telefone de Contato</p>
                      <p className="text-slate-800 font-medium mt-0.5">{profSelecionado.usuario.telefone ?? 'Não informado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Formação Acadêmica</p>
                      <p className="text-slate-800 font-semibold mt-0.5">{profSelecionado.formacao ?? 'Não cadastrada'}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-5">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Observações Internas</p>
                    <p className="text-slate-600 mt-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                      {profSelecionado.observacoes ?? 'Nenhuma observação interna cadastrada pela coordenação.'}
                    </p>
                  </div>
                </div>
              )}

              {/* ABA MATÉRIAS E TURMAS */}
              {abaAtiva === 'materias' && (
                <div className="space-y-4">
                  {profSelecionado.disciplinas.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Este professor ainda não foi associado a nenhuma turma ou disciplina neste ano letivo.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profSelecionado.disciplinas.map((d) => (
                        <div key={d.id} className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/50 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-800 text-xs uppercase tracking-wide">{d.disciplina.nome}</p>
                            <p className="text-[11px] text-slate-500 font-medium mt-1">Turma: {d.turma.nome}</p>
                          </div>
                          <span className="text-[10px] font-bold text-[#b91c1c] bg-red-50/70 border border-red-100 rounded px-2 py-0.5 uppercase tracking-wider">
                            {d.turma.turno}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Rodapé */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setProfSelecionado(null)}
                className="btn btn-secondary btn-sm rounded-lg text-xs"
              >
                Fechar
              </button>
              <Link
                href={`/admin/professores/editar/${profSelecionado.id}`}
                className="btn btn-primary btn-sm bg-[#b91c1c] text-white hover:bg-[#dc2626] font-medium rounded-lg text-xs py-2 px-3.5 transition-colors"
              >
                Editar Professor
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
