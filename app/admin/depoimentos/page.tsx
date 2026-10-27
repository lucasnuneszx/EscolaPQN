import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import AcoesDepoimento from '@/components/admin/AcoesDepoimento'

export const metadata: Metadata = { title: 'Depoimentos' }

const ABAS = [
  { status: 'PENDENTE', titulo: 'Aguardando aprovação' },
  { status: 'APROVADO', titulo: 'Publicados no site' },
  { status: 'REJEITADO', titulo: 'Não publicados' },
] as const

function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(data)
}

export default async function DepoimentosAdminPage() {
  const depoimentos = await prisma.depoimento.findMany({
    include: { usuario: { select: { email: true } } },
    orderBy: { criadoEm: 'desc' },
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Depoimentos"
        description="Depoimentos enviados pelos responsáveis no portal. Só os aprovados aparecem na página Depoimentos do site."
      />

      {depoimentos.length === 0 && (
        <EmptyState
          icon={
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H4.5c0-1.473 1.197-2.67 2.67-2.67V6zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H14.5c0-1.473 1.197-2.67 2.67-2.67V6z" /></svg>
          }
          title="Nenhum depoimento recebido"
          description="Os responsáveis enviam pelo portal, no menu Depoimento."
        />
      )}

      {ABAS.map(({ status, titulo }) => {
        const lista = depoimentos.filter((d) => d.status === status)
        if (lista.length === 0) return null
        return (
          <section key={status} className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 font-display">
              {titulo} <span className="text-slate-400 font-medium">({lista.length})</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {lista.map((d) => (
                <div key={d.id} className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4">
                  <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{d.texto}&rdquo;</p>
                  <div className="flex items-end justify-between gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{d.nome}</p>
                      <p className="text-xs text-slate-400">
                        {d.relacao} · {formatarData(d.criadoEm)}
                        {d.usuario?.email ? ` · ${d.usuario.email}` : ''}
                      </p>
                    </div>
                  </div>
                  <AcoesDepoimento id={d.id} status={d.status} />
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
