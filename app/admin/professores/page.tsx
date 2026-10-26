import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProfessoresClientList from '@/components/admin/ProfessoresClientList'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Professores' }

async function obterProfessores() {
  return prisma.professor.findMany({
    include: {
      usuario: {
        select: {
          nome: true,
          email: true,
          telefone: true,
          ativo: true,
          avatarUrl: true,
        },
      },
      disciplinas: {
        include: {
          turma: {
            select: {
              nome: true,
              turno: true,
            },
          },
          disciplina: {
            select: {
              nome: true,
            },
          },
        },
      },
    },
    orderBy: { usuario: { nome: 'asc' } },
  })
}

export default async function ProfessoresPage() {
  const professores = await obterProfessores()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corpo Docente"
        description="Gerencie o cadastro, qualificações e dados de contato dos professores da instituição."
        action={
          <Link
            href="/admin/professores/novo"
            className="btn btn-primary btn-sm flex items-center gap-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Professor
          </Link>
        }
      />

      <ProfessoresClientList professoresIniciais={professores} />
    </div>
  )
}
