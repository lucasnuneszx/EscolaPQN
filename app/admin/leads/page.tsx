import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import PageHeader from '@/components/admin/PageHeader'
import { LeadsClientPage } from '@/components/admin/LeadsClientPage'

export const metadata: Metadata = {
  title: 'Leads & Interesses de Matrícula',
}

export default async function AdminLeadsPage() {
  const session = await getSession()
  if (!session || (session.perfil !== 'ADMIN' && session.perfil !== 'SECRETARIA')) {
    redirect('/login')
  }

  const leads = await prisma.formularioMatricula.findMany({
    orderBy: { criadoEm: 'desc' },
  })

  const serializedLeads = leads.map((l) => ({
    id: l.id,
    tipo: l.tipo,
    nomeResponsavel: l.nomeResponsavel,
    emailResponsavel: l.emailResponsavel,
    telefone: l.telefone,
    nomeAluno: l.nomeAluno,
    idadeAluno: l.idadeAluno,
    serieInteresse: l.serieInteresse,
    turnoPreferido: l.turnoPreferido,
    mensagem: l.mensagem,
    status: l.status,
    lido: l.lido,
    observacoesInternas: l.observacoesInternas,
    criadoEm: l.criadoEm.toISOString(),
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Leads & Interesses de Matrícula"
        description="Acompanhe todas as solicitações de matrícula, agendamentos de visita, contatos e mensagens recebidas via site e WhatsApp em tempo real."
      />

      <LeadsClientPage initialLeads={serializedLeads} />
    </div>
  )
}
