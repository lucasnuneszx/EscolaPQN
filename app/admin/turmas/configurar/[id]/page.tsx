import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FormTurma from '@/components/admin/FormTurma'
import GerenciarDisciplinasTurma from '@/components/admin/GerenciarDisciplinasTurma'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Configurar Turma' }

async function obterDados(id: string) {
  const [turma, series, disciplinas, professores] = await Promise.all([
    prisma.turma.findUnique({
      where: { id },
      include: {
        disciplinas: {
          include: {
            disciplina: true,
            professor: { include: { usuario: { select: { nome: true } } } },
          },
        },
      },
    }),
    prisma.serie.findMany({ orderBy: { ordem: 'asc' } }),
    prisma.disciplina.findMany({ orderBy: { nome: 'asc' } }),
    prisma.professor.findMany({
      include: { usuario: { select: { nome: true } } },
      orderBy: { usuario: { nome: 'asc' } },
    }),
  ])

  return { turma, series, disciplinas, professores }
}

export default async function ConfigurarTurmaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { turma, series, disciplinas, professores } = await obterDados(id)

  if (!turma) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Configurar Turma"
        description={`Atualize os dados de ${turma.nome} e gerencie as disciplinas lecionadas.`}
        backHref="/admin/turmas"
        backLabel="Voltar às turmas"
      />

      <FormTurma series={series} turmaInicial={turma} />

      <GerenciarDisciplinasTurma
        turmaId={turma.id}
        disciplinas={disciplinas}
        professores={professores}
        vinculos={turma.disciplinas}
      />
    </div>
  )
}
