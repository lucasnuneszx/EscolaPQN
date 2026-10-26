import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FormComunicado from '@/components/admin/FormComunicado'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Editar Comunicado' }

async function obterDados(id: string) {
  const [comunicado, turmas] = await Promise.all([
    prisma.comunicado.findUnique({
      where: { id },
      include: { turmas: { select: { turmaId: true } } },
    }),
    prisma.turma.findMany({
      include: { serie: { select: { nome: true } } },
      orderBy: [{ serie: { ordem: 'asc' } }, { nome: 'asc' }],
    }),
  ])

  return { comunicado, turmas }
}

export default async function EditarComunicadoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { comunicado, turmas } = await obterDados(id)

  if (!comunicado) {
    notFound()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Editar Comunicado"
        description="Atualize as informações do comunicado publicado no mural."
        backHref="/admin/comunicados"
        backLabel="Voltar aos comunicados"
      />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-2xl">
        <FormComunicado
          turmas={turmas}
          comunicado={{
            id: comunicado.id,
            titulo: comunicado.titulo,
            conteudo: comunicado.conteudo,
            tipo: comunicado.tipo,
            fixado: comunicado.fixado,
            publicadoEm: comunicado.publicadoEm,
            expiracaoEm: comunicado.expiracaoEm,
            turmaIds: comunicado.turmas.map((t) => t.turmaId),
          }}
        />
      </div>
    </div>
  )
}
