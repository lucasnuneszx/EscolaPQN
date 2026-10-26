import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AlunosClientList from '@/components/admin/AlunosClientList'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Alunos' }

async function obterAlunos() {
  return prisma.aluno.findMany({
    include: {
      responsaveis: {
        include: {
          responsavel: true,
        },
      },
      matriculas: {
        include: {
          turma: true,
        },
      },
      mensalidades: {
        orderBy: { dataVencimento: 'desc' },
      },
    },
    orderBy: { nome: 'asc' },
  })
}

export default async function AlunosPage() {
  const alunos = await obterAlunos()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Alunos"
        description="Visualize, filtre e gerencie as matrículas e fichas cadastrais dos estudantes."
        action={
          <Link
            href="/admin/alunos/novo"
            className="btn btn-primary btn-sm flex items-center gap-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Aluno
          </Link>
        }
      />

      {/* Renderiza o componente cliente interativo com o modal de detalhes */}
      <AlunosClientList alunosIniciais={alunos} />
    </div>
  )
}
