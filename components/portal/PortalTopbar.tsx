'use client'
// Topbar do Portal — saudação, nome do usuário e ação de sair
import { useActionState, useState } from 'react'
import { logout } from '@/app/actions/auth'
import type { SessionPayload } from '@/lib/session'
import { saudacaoHorario } from '@/components/portal/ui'

interface PortalTopbarProps {
  sessao: SessionPayload
}

const PERFIL_LABELS: Record<string, string> = {
  PROFESSOR: 'Professor(a)',
  RESPONSAVEL: 'Responsável',
  ALUNO: 'Aluno(a)',
}

import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function PortalTopbar({ sessao }: PortalTopbarProps) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [, logoutAction, pending] = useActionState(logout, undefined)

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
        {saudacaoHorario()}, {sessao.nome.split(' ')[0]}
      </p>

      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <ThemeToggle />

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

          {menuAberto && (
            <>
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
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
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
