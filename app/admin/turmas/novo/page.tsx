import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import FormTurma from '@/components/admin/FormTurma'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Nova Turma' }

async function obterSeries() {
  return prisma.serie.findMany({ orderBy: { ordem: 'asc' } })
}

export default async function NovaTurmaPage() {
  const series = await obterSeries()

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Criar Turma"
        description="A turma será vinculada automaticamente ao ano letivo ativo."
        backHref="/admin/turmas"
        backLabel="Voltar às turmas"
      />

      <FormTurma series={series} />
    </div>
  )
}
