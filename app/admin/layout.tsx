import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { isAdminOuSecretaria } from '@/lib/rbac'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Admin — Centro Educacional Pequeno Príncipe',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sessao = await getSession()

  if (!sessao || !isAdminOuSecretaria(sessao.perfil)) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar perfil={sessao.perfil} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar sessao={sessao} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
