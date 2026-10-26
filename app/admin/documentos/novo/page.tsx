import type { Metadata } from 'next'
import FormDocumento from '@/components/admin/FormDocumento'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Novo Documento' }

export default function NovoDocumentoPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Adicionar Documento"
        description="Publique um novo documento no repositório escolar."
        backHref="/admin/documentos"
        backLabel="Voltar aos documentos"
      />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-2xl">
        <FormDocumento />
      </div>
    </div>
  )
}
