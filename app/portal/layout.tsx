import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { isPortalUser } from '@/lib/rbac'
import PortalSidebar from '@/components/portal/PortalSidebar'
import PortalTopbar from '@/components/portal/PortalTopbar'

export const metadata: Metadata = {
  title: {
    default: 'Portal',
    template: '%s | Portal — Centro Educacional Pequeno Príncipe',
  },
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sessao = await getSession()

  if (!sessao || !isPortalUser(sessao.perfil)) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <PortalSidebar perfil={sessao.perfil} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PortalTopbar sessao={sessao} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
