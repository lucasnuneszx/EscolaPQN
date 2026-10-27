'use client'
// Sidebar do painel administrativo
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PerfilUsuario } from '@/lib/session'

interface AdminSidebarProps {
  perfil: PerfilUsuario
}

interface NavItem {
  href: string
  label: string
  categoria: 'PRINCIPAL' | 'ACADÊMICO' | 'ADMINISTRAÇÃO' | 'FINANCEIRO' | 'SISTEMA'
  perfis: PerfilUsuario[]
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', categoria: 'PRINCIPAL', perfis: ['ADMIN', 'SECRETARIA'] },
  { href: '/admin/leads', label: 'Leads & Matrículas', categoria: 'PRINCIPAL', perfis: ['ADMIN', 'SECRETARIA'] },
  
  { href: '/admin/alunos', label: 'Alunos', categoria: 'ACADÊMICO', perfis: ['ADMIN', 'SECRETARIA'] },
  { href: '/admin/professores', label: 'Professores', categoria: 'ACADÊMICO', perfis: ['ADMIN', 'SECRETARIA'] },
  { href: '/admin/turmas', label: 'Turmas', categoria: 'ACADÊMICO', perfis: ['ADMIN', 'SECRETARIA'] },
  { href: '/admin/academico', label: 'Matérias & Notas', categoria: 'ACADÊMICO', perfis: ['ADMIN', 'SECRETARIA'] },
  
  { href: '/admin/responsaveis', label: 'Responsáveis', categoria: 'ADMINISTRAÇÃO', perfis: ['ADMIN', 'SECRETARIA'] },
  { href: '/admin/depoimentos', label: 'Depoimentos', categoria: 'ADMINISTRAÇÃO', perfis: ['ADMIN', 'SECRETARIA'] },
  { href: '/admin/comunicados', label: 'Mural de Avisos', categoria: 'ADMINISTRAÇÃO', perfis: ['ADMIN', 'SECRETARIA'] },
  { href: '/admin/documentos', label: 'Documentos', categoria: 'ADMINISTRAÇÃO', perfis: ['ADMIN', 'SECRETARIA'] },
  { href: '/admin/calendario', label: 'Calendário Letivo', categoria: 'ADMINISTRAÇÃO', perfis: ['ADMIN', 'SECRETARIA'] },
  
  { href: '/admin/financeiro', label: 'Mensalidades', categoria: 'FINANCEIRO', perfis: ['ADMIN', 'SECRETARIA'] },
  
  { href: '/admin/auditoria', label: 'Auditoria de Logs', categoria: 'SISTEMA', perfis: ['ADMIN'] },
  { href: '/admin/configuracoes', label: 'Ajustes Escolares', categoria: 'SISTEMA', perfis: ['ADMIN'] },
]

const ICONS: Record<string, React.ReactNode> = {
  '/admin/depoimentos': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  '/admin/dashboard': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  '/admin/leads': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  '/admin/alunos': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  '/admin/responsaveis': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  '/admin/professores': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  '/admin/turmas': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  '/admin/financeiro': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  '/admin/academico': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  '/admin/comunicados': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  '/admin/documentos': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  ),
  '/admin/calendario': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  '/admin/auditoria': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  '/admin/configuracoes': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
    </svg>
  ),
}

export default function AdminSidebar({ perfil }: AdminSidebarProps) {
  const pathname = usePathname()

  const itemsFiltrados = NAV_ITEMS.filter((item) =>
    item.perfis.includes(perfil)
  )

  const categorias: Array<NavItem['categoria']> = [
    'PRINCIPAL',
    'ACADÊMICO',
    'ADMINISTRAÇÃO',
    'FINANCEIRO',
    'SISTEMA',
  ]

  return (
    <aside className="w-64 bg-[#090d16] border-r border-[#1e293b]/20 flex flex-col h-full shrink-0 text-slate-400 select-none">
      
      {/* Logo e Brand */}
      <div className="p-5 border-b border-[#1e293b]/30 bg-[#070a11]/40">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/logo-pequeno-principe.jpg"
            alt="Pequeno Príncipe"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10 shadow-md"
          />
          
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight font-display tracking-tight">
              Pequeno Príncipe
            </p>
            <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest leading-none mt-1">
              Portal do Gestor
            </p>
          </div>
        </div>
      </div>

      {/* Menu / Navegação Categorizada */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-sidebar" aria-label="Navegação administrativa">
        {categorias.map((cat) => {
          const itensDaCategoria = itemsFiltrados.filter((item) => item.categoria === cat)
          if (itensDaCategoria.length === 0) return null

          return (
            <div key={cat} className="space-y-1">
              <span className="text-[9px] font-extrabold tracking-widest text-[#475569] uppercase px-3 block mb-1.5">
                {cat}
              </span>
              
              <ul className="space-y-0.5">
                {itensDaCategoria.map((item) => {
                  const ativo =
                    pathname === item.href ||
                    (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                          ativo
                            ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 border-l-[3px] border-amber-500 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                        }`}
                        aria-current={ativo ? 'page' : undefined}
                      >
                        <span className={`shrink-0 transition-colors ${ativo ? 'text-amber-400' : 'text-slate-500'}`}>
                          {ICONS[item.href]}
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Operador Ativo */}
      <div className="p-4 border-t border-[#1e293b]/30 bg-[#070a11]/40 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
          <span className="text-xs font-extrabold text-slate-300">
            {perfil === 'ADMIN' ? 'AD' : 'SC'}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-slate-200 leading-tight">
            {perfil === 'ADMIN' ? 'Diretor Geral' : 'Secretaria Acadêmica'}
          </p>
          <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 tracking-wider">
            Sessão Ativa
          </p>
        </div>
      </div>
    </aside>
  )
}
