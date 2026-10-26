import type { Metadata } from 'next'
import FormProfessor from '@/components/admin/FormProfessor'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Novo Professor' }

export default function NovoProfessorPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Cadastrar Professor"
        description="Preencha os dados do docente. Um acesso ao portal será criado automaticamente."
        backHref="/admin/professores"
        backLabel="Voltar aos professores"
      />

      <FormProfessor />
    </div>
  )
}
