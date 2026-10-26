import type { Metadata } from 'next'
import FormDisciplina from '@/components/admin/FormDisciplina'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Nova Disciplina' }

export default function NovaDisciplinaPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Nova Disciplina"
        description="Adicione uma disciplina à grade curricular."
        backHref="/admin/academico"
        backLabel="Voltar ao acadêmico"
      />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-xl">
        <FormDisciplina />
      </div>
    </div>
  )
}
