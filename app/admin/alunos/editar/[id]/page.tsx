import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FormAluno from '@/components/admin/FormAluno'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Editar Aluno' }

async function obterDados(id: string) {
  const [aluno, turmas, responsaveis] = await Promise.all([
    prisma.aluno.findUnique({
      where: { id },
      include: {
        matriculas: { include: { turma: { include: { serie: true } } } },
        responsaveis: {
          include: { responsavel: { select: { id: true, nome: true, parentesco: true } } },
        },
      },
    }),
    prisma.turma.findMany({
      include: { serie: true },
      orderBy: { nome: 'asc' },
    }),
    prisma.responsavel.findMany({
      select: { id: true, nome: true, parentesco: true },
      orderBy: { nome: 'asc' },
    }),
  ])

  return { aluno, turmas, responsaveis }
}

export default async function EditarAlunoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { aluno, turmas, responsaveis } = await obterDados(id)

  if (!aluno) {
    notFound()
  }

  const matriculaAtiva = aluno.matriculas.find((m) => m.status === 'ATIVA')

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Editar Ficha do Aluno"
        description={`Atualize os dados cadastrais de ${aluno.nome}.`}
        backHref="/admin/alunos"
        backLabel="Voltar aos alunos"
      />

      <FormAluno
        turmas={turmas}
        responsaveis={responsaveis}
        alunoInicial={{
          ...aluno,
          matriculaAtivaTurmaId: matriculaAtiva?.turmaId,
          matriculaAtivaSerieCodigo: matriculaAtiva?.turma.serie.codigo,
          matriculaAtivaTurno: matriculaAtiva?.turma.turno,
          matriculaAtivaDescricao: matriculaAtiva
            ? `${matriculaAtiva.turma.serie.nome} · ${matriculaAtiva.turma.nome} (${matriculaAtiva.turma.turno === 'TARDE' ? 'Vespertino' : matriculaAtiva.turma.turno === 'MANHA' ? 'Matutino' : matriculaAtiva.turma.turno})`
            : undefined,
        }}
      />
    </div>
  )
}
