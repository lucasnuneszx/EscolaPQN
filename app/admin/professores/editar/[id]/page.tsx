import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FormProfessor from '@/components/admin/FormProfessor'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Editar Professor' }

async function obterProfessor(id: string) {
  return prisma.professor.findUnique({
    where: { id },
    include: {
      usuario: {
        select: { nome: true, email: true, telefone: true },
      },
    },
  })
}

export default async function EditarProfessorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const professor = await obterProfessor(id)

  if (!professor) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Editar Professor"
        description={`Atualize os dados cadastrais de ${professor.usuario.nome}.`}
        backHref="/admin/professores"
        backLabel="Voltar aos professores"
      />

      <FormProfessor professorInicial={professor} />
    </div>
  )
}
