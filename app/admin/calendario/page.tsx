import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import BotaoExcluir from '@/components/admin/BotaoExcluir'
import { excluirEvento } from '@/app/actions/calendario'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Calendário Letivo' }

async function obterEventos() {
  return prisma.eventoCalendario.findMany({
    orderBy: { dataInicio: 'asc' },
  })
}

export default async function CalendarioPage() {
  const eventos = await obterEventos()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Calendário de Atividades"
        description="Gerencie datas comemorativas, reuniões de pais, férias escolares, avaliações e feriados."
        action={
          <Link href="/admin/calendario/novo" className="btn btn-primary btn-sm rounded-lg">
            Novo Evento
          </Link>
        }
      />

      {/* Lista de Eventos */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-5">Próximos Eventos</h3>

        {eventos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-xs font-medium">Nenhum evento registrado no cronograma letivo.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {eventos.map((evt) => (
              <li key={evt.id} className="flex items-start gap-4 p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-md text-center shrink-0">
                  <span className="block text-xs font-bold text-slate-900 font-display">
                    {evt.dataInicio.toLocaleDateString('pt-BR', { day: '2-digit' })}
                  </span>
                  <span className="block text-[10px] uppercase text-slate-400 font-semibold tracking-wider mt-0.5">
                    {evt.dataInicio.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900">{evt.titulo}</h4>
                  <p className="text-xs text-slate-500 mt-1">{evt.descricao ?? 'Sem descrição complementar'}</p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span>Local: {evt.local ?? 'Não inf.'}</span>
                    <span>Tipo: {evt.tipo}</span>
                  </div>
                </div>
                <div>
                  <BotaoExcluir
                    action={excluirEvento.bind(null, evt.id)}
                    confirmMessage="Tem certeza que deseja excluir este evento do calendário?"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
