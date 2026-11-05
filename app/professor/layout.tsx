import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession, type PerfilUsuario } from '@/lib/session'
import { getRedirectUrlPorPerfil } from '@/lib/rbac'
import PortalShell from '@/components/portal/PortalShell'

export const metadata: Metadata = {
  title: {
    default: 'Área do Professor',
    template: '%s | Área do Professor — Centro Educacional Pequeno Príncipe',
  },
}

const PERFIS_PERMITIDOS: PerfilUsuario[] = ['PROFESSOR']

export default async function AreaProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sessao = await getSession()

  if (!sessao) redirect('/login')
  if (!PERFIS_PERMITIDOS.includes(sessao.perfil)) redirect(getRedirectUrlPorPerfil(sessao.perfil))

  return <PortalShell sessao={sessao}>{children}</PortalShell>
}
