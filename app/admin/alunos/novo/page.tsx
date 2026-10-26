import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import FormAluno from '@/components/admin/FormAluno'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Novo Aluno' }

async function obterDados() {
  const [turmas, responsaveis] = await Promise.all([
    prisma.turma.findMany({
      include: { serie: true },
      orderBy: { nome: 'asc' },
    }),
    prisma.responsavel.findMany({
      select: { id: true, nome: true, parentesco: true },
      orderBy: { nome: 'asc' },
    }),
  ])
  return { turmas, responsaveis }
}

export default async function NovoAlunoPage() {
  const { turmas, responsaveis } = await obterDados()

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Cadastrar Aluno"
        description="Preencha a ficha cadastral completa do estudante."
        backHref="/admin/alunos"
        backLabel="Voltar aos alunos"
      />

      <FormAluno turmas={turmas} responsaveis={responsaveis} />
    </div>
  )
}
