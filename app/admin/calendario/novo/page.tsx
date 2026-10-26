import type { Metadata } from 'next'
import FormEvento from '@/components/admin/FormEvento'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Novo Evento' }

export default function NovoEventoPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Novo Evento"
        description="Adicione uma data ao calendário letivo (reunião, feriado, prova, férias, etc)."
        backHref="/admin/calendario"
        backLabel="Voltar ao calendário"
      />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-2xl">
        <FormEvento />
      </div>
    </div>
  )
}
