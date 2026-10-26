import type { Metadata } from 'next'
import FormResponsavel from '@/components/admin/FormResponsavel'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Novo Responsável' }

export default function NovoResponsavelPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Cadastrar Responsável"
        description="Cadastre os dados do responsável legal ou financeiro de um estudante."
        backHref="/admin/responsaveis"
        backLabel="Voltar aos responsáveis"
      />

      <FormResponsavel />
    </div>
  )
}
