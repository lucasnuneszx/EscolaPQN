import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import FormComunicado from '@/components/admin/FormComunicado'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Novo Comunicado' }

async function obterTurmas() {
  return prisma.turma.findMany({
    include: { serie: { select: { nome: true } } },
    orderBy: [{ serie: { ordem: 'asc' } }, { nome: 'asc' }],
  })
}

export default async function NovoComunicadoPage() {
  const turmas = await obterTurmas()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Novo Comunicado"
        description="Redija um novo aviso para o mural institucional."
        backHref="/admin/comunicados"
        backLabel="Voltar aos comunicados"
      />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-2xl">
        <FormComunicado turmas={turmas} />
      </div>
    </div>
  )
}
