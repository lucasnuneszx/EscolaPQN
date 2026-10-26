import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FormResponsavel from '@/components/admin/FormResponsavel'
import ListaAlunosVinculados from '@/components/admin/ListaAlunosVinculados'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Editar Responsável' }

async function obterResponsavel(id: string) {
  return prisma.responsavel.findUnique({
    where: { id },
    include: {
      vinculos: {
        include: { aluno: { select: { id: true, nome: true, status: true } } },
      },
    },
  })
}

export default async function EditarResponsavelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const responsavel = await obterResponsavel(id)

  if (!responsavel) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Editar Responsável"
        description={`Atualize os dados cadastrais de ${responsavel.nome}.`}
        backHref="/admin/responsaveis"
        backLabel="Voltar aos responsáveis"
      />

      <FormResponsavel responsavelInicial={responsavel} />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 font-display">Alunos Vinculados</h2>
        <ListaAlunosVinculados vinculos={responsavel.vinculos} />
      </div>
    </div>
  )
}
