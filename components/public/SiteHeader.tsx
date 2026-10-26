'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { KeyRound } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

const NAV_LINKS: [string, string][] = [
  ['Sobre', '/sobre'],
  ['Educação Infantil', '/educacao-infantil'],
  ['Ensino Fundamental', '/ensino-fundamental'],
  ['Estrutura', '/estrutura'],
  ['Depoimentos', '/depoimentos'],
  ['Contato', '/contato'],
]

interface SiteHeaderProps {
  paginaAtiva?: string
}

export default function SiteHeader({ paginaAtiva }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/brand/logo-pequeno-principe.png"
            alt="Centro Educacional Pequeno Príncipe"
            width={40}
            height={40}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 shadow-xs"
            priority
          />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Pequeno Príncipe</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-tight">Dias d&#39;Ávila — BA</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-7">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                paginaAtiva === href
                  ? 'text-[#b91c1c] dark:text-red-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link
            href="/login"
            className="hidden sm:inline-flex text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-2 py-1 font-medium"
          >
            Portal
          </Link>

          <Link
            href="/matriculas"
            className="text-xs sm:text-sm bg-[#b91c1c] hover:bg-[#991b1b] text-white px-3.5 sm:px-4 py-2 rounded-lg transition-colors font-semibold shadow-xs"
          >
            Matrículas 2027
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Menu Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-3 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-sm font-medium transition-colors ${
                  paginaAtiva === href
                    ? 'text-[#b91c1c] dark:text-red-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:underline"
            >
              <KeyRound className="w-4 h-4" strokeWidth={2} />
              Acessar Portal do Aluno
            </Link>
            <Link
              href="/agendar-visita"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-slate-700 dark:text-slate-200"
            >
              Agendar Visita
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
