'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Baby,
  BookOpen,
  Clock,
  GraduationCap,
  Hand,
  MapPin,
  MessageCircle,
  NotebookPen,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const WHATSAPP_PHONE = '557187226877'

interface QuickQuestion {
  id: string
  icon: LucideIcon
  titulo: string
  descricao: string
  mensagem: string
}

const DUVIDAS_COMUNS: QuickQuestion[] = [
  {
    id: 'matricula_2027',
    icon: GraduationCap,
    titulo: 'Matrículas 2027 e Valores',
    descricao: 'Consultar vagas, valores de mensalidade e processo de matrícula',
    mensagem: 'Olá! Gostaria de receber informações sobre o processo de matrículas para 2027, valores de mensalidades e documentação necessária.',
  },
  {
    id: 'agendar_visita',
    icon: MapPin,
    titulo: 'Agendar Visita à Escola',
    descricao: 'Conhecer as instalações, salas e proposta pedagógica',
    mensagem: 'Olá! Gostaria de agendar uma visita presencial para conhecer o espaço e a equipe do Pequeno Príncipe.',
  },
  {
    id: 'educacao_infantil',
    icon: Baby,
    titulo: 'Educação Infantil (Maternal ao Jardim II)',
    descricao: 'Informações sobre turmas a partir de 2 anos e rotina',
    mensagem: 'Olá! Tenho interesse na Educação Infantil (Maternal/Jardim) e gostaria de saber mais sobre a rotina, turmas e horários.',
  },
  {
    id: 'ensino_fundamental',
    icon: BookOpen,
    titulo: 'Ensino Fundamental I (1º ao 5º ano)',
    descricao: 'Metodologia ativa, alfabetização e matérias',
    mensagem: 'Olá! Gostaria de conhecer a proposta pedagógica e disponibilidade de vagas para o Ensino Fundamental I (1º ao 5º ano).',
  },
  {
    id: 'turnos_horarios',
    icon: Clock,
    titulo: 'Horários e Turnos',
    descricao: 'Manhã, Tarde ou Integral',
    mensagem: 'Olá! Gostaria de consultar os horários de entrada/saída e opções de turnos (matutino, vespertino ou integral).',
  },
  {
    id: 'falar_secretaria',
    icon: MessageCircle,
    titulo: 'Falar com a Secretaria',
    descricao: 'Tirar outras dúvidas diretamente com a equipe',
    mensagem: 'Olá! Gostaria de falar com uma atendente da secretaria do Centro Educacional Pequeno Príncipe.',
  },
]

import { salvarLeadRapido } from '@/app/actions/leads'

export function WhatsAppFloatingWidget() {
  const [aberto, setAberto] = useState(false)
  const [mostrarBalão, setMostrarBalão] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState<'atalhos' | 'express'>('atalhos')

  const [nomeResp, setNomeResp] = useState('')
  const [telResp, setTelResp] = useState('')
  const [nomeAluno, setNomeAluno] = useState('')
  const [serie, setSerie] = useState('')
  const [turno, setTurno] = useState('')
  const [textoLivre, setTextoLivre] = useState('')

  useEffect(() => {
    // Exibe o balãozinho de saudação após 3 segundos
    const timer = setTimeout(() => {
      setMostrarBalão(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const abrirWhatsAppComMensagem = (msg: string) => {
    const url = `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0&utm_source=site_pqn`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const enviarMatriculaExpress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeResp.trim() || !nomeAluno.trim()) return

    salvarLeadRapido({
      tipo: 'WHATSAPP_EXPRESS',
      nomeResponsavel: nomeResp.trim(),
      telefone: telResp.trim() || '(Via WhatsApp)',
      nomeAluno: nomeAluno.trim(),
      serieInteresse: serie || undefined,
      turnoPreferido: turno || undefined,
      mensagem: 'Lead iniciado através do formulário Express do Widget WhatsApp.',
    }).catch(console.error)

    const msg = `*SOLICITAÇÃO DE MATRÍCULA 2027 — VIA SITE*\n\n` +
      `👤 *Responsável:* ${nomeResp.trim()}\n` +
      (telResp ? `📱 *Telefone:* ${telResp.trim()}\n` : '') +
      `👶 *Aluno(a):* ${nomeAluno.trim()}\n` +
      (serie ? `📚 *Série de Interesse:* ${serie}\n` : '') +
      (turno ? `⏰ *Turno Preferido:* ${turno}\n` : '') +
      `\nOlá! Preenchi o interesse pelo site e gostaria de dar continuidade à matrícula.`

    abrirWhatsAppComMensagem(msg)
  }

  const enviarTextoLivre = (e: React.FormEvent) => {
    e.preventDefault()
    if (!textoLivre.trim()) return
    abrirWhatsAppComMensagem(textoLivre.trim())
    setTextoLivre('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end print:hidden">
      {/* Balão flutuante de boas-vindas */}
      {!aberto && mostrarBalão && (
        <div className="mb-3 max-w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl relative animate-fade-in text-slate-800 dark:text-slate-100">
          <button
            type="button"
            onClick={() => setMostrarBalão(false)}
            aria-label="Fechar balão"
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" strokeWidth={2.5} />
          </button>
          <div className="flex items-start gap-2.5">
            <Hand className="w-5 h-5 text-amber-500 shrink-0" strokeWidth={2} />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-white">Olá! Precisa de ajuda?</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Clique aqui para tirar dúvidas sobre <strong>Matrículas 2027</strong> ou falar no WhatsApp!
              </p>
            </div>
          </div>
          <div className="w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 transform rotate-45 absolute -bottom-1.5 right-6" />
        </div>
      )}

      {/* Janela de Atendimento do WhatsApp */}
      {aberto && (
        <div className="mb-3 w-[92vw] sm:w-[380px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in transition-all">
          <div className="bg-[#128C7E] dark:bg-[#075E54] text-white p-4 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/brand/logo-pequeno-principe.png"
                  alt="Centro Educacional Pequeno Príncipe"
                  width={42}
                  height={42}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-900 rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight">Pequeno Príncipe</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                  <p className="text-[11px] text-emerald-100">Atendimento Secretaria Online</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar janela de atendimento"
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Abas Superiores */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shrink-0 text-xs font-medium">
            <button
              type="button"
              onClick={() => setAbaAtiva('atalhos')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                abaAtiva === 'atalhos'
                  ? 'border-[#128C7E] text-[#128C7E] dark:text-emerald-400 font-semibold bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" strokeWidth={2} />
                Dúvidas & Atalhos
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('express')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                abaAtiva === 'express'
                  ? 'border-[#128C7E] text-[#128C7E] dark:text-emerald-400 font-semibold bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <NotebookPen className="w-3.5 h-3.5" strokeWidth={2} />
                Matrícula Direta
              </span>
            </button>
          </div>

          {/* Conteúdo scrollável */}
          <div className="p-4 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/50 dark:bg-slate-950/30">
            {/* Mensagem de Boas-Vindas */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70 rounded-xl rounded-tl-none p-3 shadow-xs max-w-[92%]">
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                Olá! Seja bem-vindo(a) ao <strong>Centro Educacional Pequeno Príncipe</strong>.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Escolha uma dúvida abaixo ou envie uma mensagem direta:
              </p>
            </div>

            {abaAtiva === 'atalhos' ? (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                  Selecione para abrir no WhatsApp:
                </p>
                {DUVIDAS_COMUNS.map((duvida) => (
                  <button
                    key={duvida.id}
                    type="button"
                    onClick={() => abrirWhatsAppComMensagem(duvida.mensagem)}
                    className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all flex items-start gap-2.5 group cursor-pointer shadow-xs"
                  >
                    <duvida.icon
                      className="w-5 h-5 shrink-0 text-[#128C7E] dark:text-emerald-400 group-hover:scale-110 transition-transform"
                      strokeWidth={2}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-[#128C7E] dark:group-hover:text-emerald-400 transition-colors">
                        {duvida.titulo}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {duvida.descricao}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#128C7E] dark:group-hover:text-emerald-400 shrink-0 self-center transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              /* Formulário Matrícula Express */
              <form onSubmit={enviarMatriculaExpress} className="space-y-2.5 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">
                  Preencha para enviar interesse pronto:
                </p>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Seu nome (Responsável) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Maria Souza"
                    value={nomeResp}
                    onChange={(e) => setNomeResp(e.target.value)}
                    className="input text-xs py-1.5 px-2.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Seu Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(71) 90000-0000"
                    value={telResp}
                    onChange={(e) => setTelResp(e.target.value)}
                    className="input text-xs py-1.5 px-2.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Nome da criança *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Arthur Souza"
                    value={nomeAluno}
                    onChange={(e) => setNomeAluno(e.target.value)}
                    className="input text-xs py-1.5 px-2.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block mb-1">
                      Série de Interesse
                    </label>
                    <select
                      value={serie}
                      onChange={(e) => setSerie(e.target.value)}
                      className="input text-xs py-1.5 px-2"
                    >
                      <option value="">A definir</option>
                      <option value="Maternal I">Maternal I (1 ano)</option>
                      <option value="Maternal II">Maternal II (2 anos)</option>
                      <option value="Jardim I">Jardim I (3 anos)</option>
                      <option value="Jardim II">Jardim II (4-5 anos)</option>
                      <option value="1º Ano Fundamental">1º Ano Fundamental</option>
                      <option value="2º Ano Fundamental">2º Ano Fundamental</option>
                      <option value="3º Ano Fundamental">3º Ano Fundamental</option>
                      <option value="4º Ano Fundamental">4º Ano Fundamental</option>
                      <option value="5º Ano Fundamental">5º Ano Fundamental</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block mb-1">
                      Turno
                    </label>
                    <select
                      value={turno}
                      onChange={(e) => setTurno(e.target.value)}
                      className="input text-xs py-1.5 px-2"
                    >
                      <option value="Sem preferência">Sem preferência</option>
                      <option value="Matutino (Manhã)">Matutino</option>
                      <option value="Vespertino (Tarde)">Vespertino</option>
                      <option value="Integral">Integral</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar Interesse no WhatsApp
                </button>
              </form>
            )}
          </div>

          {/* Input inferior de mensagem livre */}
          <form onSubmit={enviarTextoLivre} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Digite sua dúvida aqui…"
              value={textoLivre}
              onChange={(e) => setTextoLivre(e.target.value)}
              className="flex-1 input text-xs py-2 px-3"
            />
            <button
              type="submit"
              aria-label="Enviar mensagem no WhatsApp"
              className="w-8 h-8 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-sm disabled:opacity-50"
              disabled={!textoLivre.trim()}
            >
              <svg className="w-4 h-4 transform rotate-45 -mt-0.5 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Botão Flutuante Principal */}
      <button
        type="button"
        onClick={() => {
          setAberto(!aberto)
          setMostrarBalão(false)
        }}
        aria-label={aberto ? 'Fechar atendimento WhatsApp' : 'Abrir atendimento WhatsApp'}
        className="group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />

        {aberto ? (
          <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}

        {!aberto && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
            1
          </span>
        )}
      </button>
    </div>
  )
}
