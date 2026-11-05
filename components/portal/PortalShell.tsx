import PortalSidebar from '@/components/portal/PortalSidebar'
import PortalTopbar from '@/components/portal/PortalTopbar'
import type { SessionPayload } from '@/lib/session'

export default function PortalShell({
  sessao,
  children,
}: {
  sessao: SessionPayload
  children: React.ReactNode
}) {
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
