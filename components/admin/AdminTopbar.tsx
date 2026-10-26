'use client'
// ─────────────────────────────────────────────────────────────
// Topbar do painel administrativo
// ─────────────────────────────────────────────────────────────
import { useActionState } from 'react'
import { logout } from '@/app/actions/auth'
import type { SessionPayload } from '@/lib/session'
import { useState } from 'react'

interface AdminTopbarProps {
  sessao: SessionPayload
}

const PERFIL_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  SECRETARIA: 'Secretaria',
}

import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { AdminLeadsNotifier } from '@/components/admin/AdminLeadsNotifier'

export default function AdminTopbar({ sessao }: AdminTopbarProps) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [, logoutAction, pending] = useActionState(logout, undefined)

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
      {/* Espaço para breadcrumb */}
      <div className="flex-1" />

      {/* Ações direita */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Claro/Escuro */}
        <ThemeToggle />

        {/* Notificador em Tempo Real de Leads */}
        <AdminLeadsNotifier />

        {/* Menu do usuário */}
        <div className="relative">
          <button
            id="user-menu-btn"
            onClick={() => setMenuAberto(!menuAberto)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-expanded={menuAberto}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 flex items-center justify-center">
              <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
                {sessao.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">
                {sessao.nome.split(' ')[0]}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {PERFIL_LABELS[sessao.perfil] ?? sessao.perfil}
              </p>
            </div>
            <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuAberto && (
            <>
              {/* Overlay para fechar */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuAberto(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-modal z-20 py-1 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{sessao.nome}</p>
                  <p className="text-xs text-slate-400 truncate">{sessao.email}</p>
                </div>

                <a
                  href="/admin/configuracoes/perfil"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Meu perfil
                </a>

                <div className="border-t border-slate-100 dark:border-slate-700/60 mt-1">
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      id="btn-logout"
                      disabled={pending}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                      </svg>
                      {pending ? 'Saindo…' : 'Sair'}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
