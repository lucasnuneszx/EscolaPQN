import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import FormNovaCobranca from '@/components/admin/FormNovaCobranca'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Emitir Fatura' }

async function obterAlunosAtivos() {
  return prisma.aluno.findMany({
    where: { status: 'ATIVO' },
    select: { id: true, nome: true },
    orderBy: { nome: 'asc' },
  })
}

export default async function NovaCobrancaPage() {
  const alunos = await obterAlunosAtivos()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Emitir Fatura"
        description="Gere uma nova mensalidade para um aluno ativo. O link de cobrança pode ser gerado depois, na tela de detalhes."
        backHref="/admin/financeiro"
        backLabel="Voltar ao financeiro"
      />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-xl">
        <FormNovaCobranca alunos={alunos} />
      </div>
    </div>
  )
}
