import type { Metadata } from 'next'
import FormSerie from '@/components/admin/FormSerie'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Nova Série' }

export default function NovaSeriePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Nova Série"
        description="Cadastre uma nova série/nível na estrutura acadêmica."
        backHref="/admin/academico"
        backLabel="Voltar ao acadêmico"
      />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-xl">
        <FormSerie />
      </div>
    </div>
  )
}
