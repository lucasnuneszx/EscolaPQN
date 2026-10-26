'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ClipboardList,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Smartphone,
  X,
  type LucideIcon,
} from 'lucide-react'

interface LeadInfo {
  id: string
  tipo: string
  nomeResponsavel: string
  telefone: string
  nomeAluno?: string | null
  serieInteresse?: string | null
  mensagem?: string | null
  criadoEm: string
}

export function AdminLeadsNotifier() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [latestToast, setLatestToast] = useState<LeadInfo | null>(null)
  const lastKnownLeadId = useRef<string | null>(null)
  const isFirstCheck = useRef(true)

  const checkNewLeads = async () => {
    try {
      const res = await fetch('/api/leads/novos')
      if (!res.ok) return
      const data = await res.json()

      setUnreadCount(data.unreadCount || 0)

      if (data.latestLead) {
        if (!isFirstCheck.current && lastKnownLeadId.current && lastKnownLeadId.current !== data.latestLead.id) {
          // Novo lead detectado enquanto o gestor estava com a tela aberta!
          setLatestToast(data.latestLead)

          // Auto-hide toast após 10 segundos
          setTimeout(() => {
            setLatestToast(null)
          }, 10000)
        }
        lastKnownLeadId.current = data.latestLead.id
      }
      isFirstCheck.current = false
    } catch (e) {
      // Falha silenciosa de polling
    }
  }

  useEffect(() => {
    checkNewLeads()
    const interval = setInterval(checkNewLeads, 10000) // Verifica a cada 10s
    return () => clearInterval(interval)
  }, [])

  const getTipoInfo = (tipo: string): { Icon: LucideIcon; label: string } => {
    switch (tipo) {
      case 'MATRICULA': return { Icon: GraduationCap, label: 'Interesse de Matrícula' }
      case 'VISITA': return { Icon: MapPin, label: 'Agendamento de Visita' }
      case 'WHATSAPP_EXPRESS': return { Icon: MessageCircle, label: 'Lead WhatsApp Express' }
      case 'CONTATO': return { Icon: Mail, label: 'Formulário de Contato' }
      default: return { Icon: ClipboardList, label: 'Novo Lead' }
    }
  }

  return (
    <>
      {/* Botão de Sino no Topbar */}
      <Link
        href="/admin/leads"
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Leads e Interesses de Matrícula"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>

      {/* Toast Popup Imediato na Tela */}
      {latestToast && (
        <div className="fixed top-18 right-6 z-50 max-w-sm bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl animate-fade-in flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Novo Lead Recebido!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLatestToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="text-xs space-y-1 text-slate-700 dark:text-slate-200">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {latestToast.nomeResponsavel}
            </p>
            <p className="text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5">
              {(() => {
                const { Icon, label } = getTipoInfo(latestToast.tipo)
                return (
                  <>
                    <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                    {label}
                  </>
                )
              })()}
              {latestToast.nomeAluno ? ` • Aluno(a): ${latestToast.nomeAluno}` : ''}
            </p>
            {latestToast.telefone && (
              <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] inline-flex items-center gap-1.5">
                <Smartphone className="w-3 h-3 shrink-0" strokeWidth={2} />
                {latestToast.telefone}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/admin/leads"
              onClick={() => setLatestToast(null)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              Ver e fazer follow-up
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
