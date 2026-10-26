'use client'

import React, { useState, useTransition } from 'react'
import {
  Check,
  GraduationCap,
  Inbox,
  Mail,
  MapPin,
  MessageCircle,
  NotebookPen,
  User,
  Baby,
  X,
  type LucideIcon,
} from 'lucide-react'
import { marcarLeadLido, atualizarStatusLead, salvarAnotacaoLead, excluirLead } from '@/app/actions/leads'

interface LeadItem {
  id: string
  tipo: string
  nomeResponsavel: string
  emailResponsavel: string | null
  telefone: string
  nomeAluno: string | null
  idadeAluno: number | null
  serieInteresse: string | null
  turnoPreferido: string | null
  mensagem: string | null
  status: string
  lido: boolean
  observacoesInternas: string | null
  criadoEm: string
}

interface LeadsClientPageProps {
  initialLeads: LeadItem[]
}

const TIPO_CONFIG: Record<string, { label: string; badgeClass: string; icon: LucideIcon }> = {
  MATRICULA: {
    label: 'Matrícula 2027',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    icon: GraduationCap,
  },
  VISITA: {
    label: 'Agendamento de Visita',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    icon: MapPin,
  },
  WHATSAPP_EXPRESS: {
    label: 'WhatsApp Express',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: MessageCircle,
  },
  CONTATO: {
    label: 'Contato Geral',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    icon: Mail,
  },
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  NOVO: {
    label: 'Novo / Pendente',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border-red-200 dark:border-red-800',
  },
  CONTATADO: {
    label: 'Contatado',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  EM_NEGOCIACAO: {
    label: 'Em Negociação',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  },
  MATRICULADO: {
    label: 'Matriculado',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  ARQUIVADO: {
    label: 'Arquivado',
    badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  },
}

export function LeadsClientPage({ initialLeads }: LeadsClientPageProps) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads)
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS')
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS')
  const [leadEditandoAnotacao, setLeadEditandoAnotacao] = useState<LeadItem | null>(null)
  const [textoAnotacao, setTextoAnotacao] = useState('')
  const [isPending, startTransition] = useTransition()

  const totalLeads = leads.length
  const totalNovos = leads.filter((l) => !l.lido || l.status === 'NOVO').length
  const totalContatados = leads.filter((l) => l.status === 'CONTATADO' || l.status === 'EM_NEGOCIACAO').length
  const totalMatriculados = leads.filter((l) => l.status === 'MATRICULADO').length

  const leadsFiltrados = leads.filter((l) => {
    const matchBusca =
      !busca ||
      l.nomeResponsavel.toLowerCase().includes(busca.toLowerCase()) ||
      (l.nomeAluno && l.nomeAluno.toLowerCase().includes(busca.toLowerCase())) ||
      l.telefone.includes(busca) ||
      (l.emailResponsavel && l.emailResponsavel.toLowerCase().includes(busca.toLowerCase()))

    const matchTipo = filtroTipo === 'TODOS' || l.tipo === filtroTipo
    const matchStatus = filtroStatus === 'TODOS' || l.status === filtroStatus

    return matchBusca && matchTipo && matchStatus
  })

  const handleMarcarLido = (id: string) => {
    startTransition(async () => {
      await marcarLeadLido(id)
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, lido: true } : l)))
    })
  }

  const handleMudarStatus = (id: string, status: 'NOVO' | 'CONTATADO' | 'EM_NEGOCIACAO' | 'MATRICULADO' | 'ARQUIVADO') => {
    startTransition(async () => {
      await atualizarStatusLead(id, status)
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status, lido: true } : l)))
    })
  }

  const handleExcluir = (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o lead de "${nome}"?`)) return

    startTransition(async () => {
      await excluirLead(id)
      setLeads((prev) => prev.filter((l) => l.id !== id))
    })
  }

  const handleSalvarAnotacao = () => {
    if (!leadEditandoAnotacao) return
    const id = leadEditandoAnotacao.id

    startTransition(async () => {
      await salvarAnotacaoLead(id, textoAnotacao)
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, observacoesInternas: textoAnotacao } : l))
      )
      setLeadEditandoAnotacao(null)
    })
  }

  const gerarTextoFollowUp = (lead: LeadItem): string => {
    const tel = lead.telefone.replace(/\D/g, '')
    const dddTel = tel.length === 10 || tel.length === 11 ? `55${tel}` : tel

    let mensagem = ''
    if (lead.tipo === 'VISITA') {
      mensagem = `Olá ${lead.nomeResponsavel}! Aqui é da coordenação do Centro Educacional Pequeno Príncipe. Vimos a sua solicitação para conhecer a escola com o(a) ${lead.nomeAluno || 'seu filho(a)'}. Gostaria de confirmar qual o melhor horário para te recebermos?`
    } else if (lead.tipo === 'MATRICULA' || lead.tipo === 'WHATSAPP_EXPRESS') {
      mensagem = `Olá ${lead.nomeResponsavel}! Aqui é da equipe pedagógica do Centro Educacional Pequeno Príncipe. Vimos o seu interesse de matrícula para 2027 para o(a) ${lead.nomeAluno || 'seu filho(a)'}${lead.serieInteresse ? ` (${lead.serieInteresse})` : ''}. Posso te ajudar com os valores, documentação ou agendamento de uma visita à nossa escola?`
    } else {
      mensagem = `Olá ${lead.nomeResponsavel}! Aqui é do Centro Educacional Pequeno Príncipe. Recebemos sua mensagem enviada pelo site. Como podemos te ajudar?`
    }

    return `https://api.whatsapp.com/send/?phone=${dddTel}&text=${encodeURIComponent(mensagem)}&type=phone_number&app_absent=0`
  }

  const abrirFollowUpWhatsApp = (lead: LeadItem) => {
    const url = gerarTextoFollowUp(lead)
    window.open(url, '_blank', 'noopener,noreferrer')

    // Se ainda for novo, atualiza status para CONTATADO automaticamente
    if (lead.status === 'NOVO') {
      handleMudarStatus(lead.id, 'CONTATADO')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total de Leads</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalLeads}</span>
            <span className="text-xs text-slate-400">Registrados</span>
          </div>
        </div>

        <div className="card p-5 border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Novos / Pendentes
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-red-700 dark:text-red-300">{totalNovos}</span>
            <span className="text-xs text-red-600/80 dark:text-red-400">Aguardando follow-up</span>
          </div>
        </div>

        <div className="card p-5 border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Em Follow-up</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-amber-700 dark:text-amber-300">{totalContatados}</span>
            <span className="text-xs text-amber-600/80 dark:text-amber-400">Contatados</span>
          </div>
        </div>

        <div className="card p-5 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Matriculados</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{totalMatriculados}</span>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-400">Convertidos</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Buscar por responsável, aluno ou telefone…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input pl-9 text-xs py-2 w-full"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Filtro Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="input text-xs py-2 px-3"
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="MATRICULA">Matrícula 2027</option>
            <option value="VISITA">Visitas</option>
            <option value="WHATSAPP_EXPRESS">WhatsApp Express</option>
            <option value="CONTATO">Contato Geral</option>
          </select>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="input text-xs py-2 px-3"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="NOVO">Novo / Pendente</option>
            <option value="CONTATADO">Contatado</option>
            <option value="EM_NEGOCIACAO">Em Negociação</option>
            <option value="MATRICULADO">Matriculado</option>
            <option value="ARQUIVADO">Arquivado</option>
          </select>
        </div>
      </div>

      {/* Lista / Tabela de Leads */}
      {leadsFiltrados.length === 0 ? (
        <div className="card p-12 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <Inbox className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">Nenhum lead encontrado</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Quando os pais preencherem qualquer formulário ou interagirem no WhatsApp, os dados aparecerão aqui em tempo real.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leadsFiltrados.map((lead) => {
            const tipoInfo = TIPO_CONFIG[lead.tipo] || TIPO_CONFIG.MATRICULA
            const statusInfo = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NOVO
            const dataFormatada = new Date(lead.criadoEm).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={lead.id}
                className={`card p-5 border transition-all duration-200 bg-white dark:bg-slate-900 shadow-xs relative ${
                  !lead.lido
                    ? 'border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {!lead.lido && (
                  <span className="absolute -top-2.5 right-6 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                    Novo Lead
                  </span>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 text-slate-600 dark:text-slate-300">
                      <tipoInfo.icon className="w-5 h-5" strokeWidth={2} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {lead.nomeResponsavel}
                        </h3>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${tipoInfo.badgeClass}`}>
                          {tipoInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Recebido em {dataFormatada}
                      </p>
                    </div>
                  </div>

                  {/* Seletor de Status & Ações rápidas */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleMudarStatus(
                          lead.id,
                          e.target.value as 'NOVO' | 'CONTATADO' | 'EM_NEGOCIACAO' | 'MATRICULADO' | 'ARQUIVADO'
                        )
                      }
                      className="input text-xs py-1.5 px-2.5 font-medium cursor-pointer"
                    >
                      <option value="NOVO">Novo / Pendente</option>
                      <option value="CONTATADO">Contatado</option>
                      <option value="EM_NEGOCIACAO">Em Negociação</option>
                      <option value="MATRICULADO">Matriculado</option>
                      <option value="ARQUIVADO">Arquivar</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => abrirFollowUpWhatsApp(lead)}
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Abrir conversa no WhatsApp com mensagem pronta"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Follow-up WhatsApp
                    </button>

                    {!lead.lido && (
                      <button
                        type="button"
                        onClick={() => handleMarcarLido(lead.id)}
                        className="btn-secondary text-xs py-1.5 px-2.5 cursor-pointer inline-flex items-center gap-1"
                        title="Marcar como visto"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Visto
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleExcluir(lead.id, lead.nomeResponsavel)}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Excluir lead"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Detalhes do Lead */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs">
                  {/* Contato do Responsável */}
                  <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" strokeWidth={2} />
                      Dados de Contato:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Telefone:</strong> {lead.telefone}
                    </p>
                    {lead.emailResponsavel && (
                      <p className="text-slate-600 dark:text-slate-400 truncate">
                        <strong>E-mail:</strong> {lead.emailResponsavel}
                      </p>
                    )}
                  </div>

                  {/* Dados do Aluno */}
                  <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5">
                      <Baby className="w-3.5 h-3.5" strokeWidth={2} />
                      Interesse da Criança:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Nome:</strong> {lead.nomeAluno || 'Não informado'}
                      {lead.idadeAluno ? ` (${lead.idadeAluno} anos)` : ''}
                    </p>
                    {(lead.serieInteresse || lead.turnoPreferido) && (
                      <p className="text-slate-600 dark:text-slate-400">
                        {lead.serieInteresse ? `Série: ${lead.serieInteresse}` : ''}
                        {lead.turnoPreferido ? ` • Turno: ${lead.turnoPreferido}` : ''}
                      </p>
                    )}
                  </div>

                  {/* Mensagem & Anotações Internas */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
                        Mensagem / Observações:
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 italic mt-0.5 line-clamp-2">
                        {lead.mensagem || 'Nenhuma observação enviada.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] inline-flex items-center gap-1.5">
                        {lead.observacoesInternas ? (
                          <>
                            <NotebookPen className="w-3 h-3 shrink-0" strokeWidth={2} />
                            {lead.observacoesInternas}
                          </>
                        ) : (
                          'Sem anotações internas'
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setLeadEditandoAnotacao(lead)
                          setTextoAnotacao(lead.observacoesInternas || '')
                        }}
                        className="text-brand-600 dark:text-brand-400 hover:underline font-semibold text-[11px] cursor-pointer"
                      >
                        {lead.observacoesInternas ? 'Editar nota' : '+ Adicionar nota'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Anotações Internas */}
      {leadEditandoAnotacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Anotações Internas — {leadEditandoAnotacao.nomeResponsavel}
              </h3>
              <button
                type="button"
                onClick={() => setLeadEditandoAnotacao(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            <textarea
              rows={4}
              value={textoAnotacao}
              onChange={(e) => setTextoAnotacao(e.target.value)}
              placeholder="Ex.: Liguei no dia 01/09, mãe tem interesse no turno da manhã para o Maternal II. Ficou de vir fazer visita na quinta-feira."
              className="input text-xs resize-none w-full"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLeadEditandoAnotacao(null)}
                className="btn-ghost text-xs py-2 px-3 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarAnotacao}
                disabled={isPending}
                className="btn-primary text-xs py-2 px-4 cursor-pointer"
              >
                {isPending ? 'Salvando…' : 'Salvar Anotação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
