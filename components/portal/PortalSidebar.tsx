'use client'
// Sidebar do Portal (Professor / Responsável / Aluno)
// Visual claro e acolhedor — diferente do dashboard escuro do admin
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PerfilUsuario } from '@/lib/session'

interface PortalSidebarProps {
  perfil: PerfilUsuario
}

interface NavItem {
  href: string
  label: string
  perfis: PerfilUsuario[]
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/portal/inicio',
    label: 'Início',
    perfis: ['RESPONSAVEL', 'ALUNO'],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6" />
      </svg>
    ),
  },
  {
    href: '/portal/turmas',
    label: 'Minhas Turmas',
    perfis: ['PROFESSOR'],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
  },
  {
    href: '/portal/notas',
    label: 'Notas',
    perfis: ['RESPONSAVEL', 'ALUNO'],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V4a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/portal/frequencia',
    label: 'Frequência',
    perfis: ['RESPONSAVEL', 'ALUNO'],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/portal/financeiro',
    label: 'Financeiro',
    perfis: ['RESPONSAVEL', 'ALUNO'],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/portal/comunicados',
    label: 'Comunicados',
    perfis: ['PROFESSOR', 'RESPONSAVEL', 'ALUNO'],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    href: '/portal/documentos',
    label: 'Documentos',
    perfis: ['RESPONSAVEL', 'ALUNO'],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2H10a2 2 0 01-2-2v-2M4 9h8m-8 4h5m-5 4h5" />
      </svg>
    ),
  },
  {
    href: '/portal/depoimento',
    label: 'Depoimento',
    perfis: ['RESPONSAVEL'],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
]

const PERFIL_SUBTITULO: Record<PerfilUsuario, string> = {
  ADMIN: 'Portal',
  SECRETARIA: 'Portal',
  PROFESSOR: 'Portal do Professor',
  RESPONSAVEL: 'Portal da Família',
  ALUNO: 'Portal do Aluno',
}

export default function PortalSidebar({ perfil }: PortalSidebarProps) {
  const pathname = usePathname()
  const itens = NAV_ITEMS.filter((item) => item.perfis.includes(perfil))

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/logo-pequeno-principe.jpg"
            alt="Pequeno Príncipe"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 leading-tight font-display tracking-tight">
              Pequeno Príncipe
            </p>
            <p className="text-[9px] font-bold text-brand-700 uppercase tracking-widest leading-none mt-1">
              {PERFIL_SUBTITULO[perfil]}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Navegação do portal">
        {itens.map((item) => {
          const ativo = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                ativo
                  ? 'bg-brand-50 text-brand-800 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              aria-current={ativo ? 'page' : undefined}
            >
              <span className={ativo ? 'text-brand-700' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Dúvidas? Fale com a secretaria pelo telefone (71) 8722-6877.
        </p>
      </div>
    </aside>
  )
}
