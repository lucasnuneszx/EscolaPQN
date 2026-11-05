import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import EmptyState from '@/components/portal/EmptyState'
import { formatarData } from '@/components/portal/ui'

export const metadata: Metadata = { title: 'Documentos' }

export default async function DocumentosPage() {
  const sessao = await getSession()
  if (!sessao) redirect('/login')

  const documentos = await prisma.documentoEscolar.findMany({
    orderBy: { criadoEm: 'desc' },
  })

  const visiveis = documentos.filter((d) => {
    const tags = d.visivelPara.toUpperCase()
    return tags.includes('TODOS') || tags.includes(sessao.perfil)
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-slate-200/60">
        <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">Documentos</h1>
        <p className="text-slate-500 text-xs mt-1 font-medium">
          Arquivos e formulários disponibilizados pela escola.
        </p>
      </div>

      {visiveis.length === 0 ? (
        <EmptyState mensagem="Nenhum documento disponível para o seu perfil no momento." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visiveis.map((d) => (
            <a
              key={d.id}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition-all flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2H10a2 2 0 01-2-2v-2M4 9h8m-8 4h5m-5 4h5" />
                  </svg>
                </div>
                <span className="badge badge-neutral">{d.categoria}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{d.titulo}</p>
                {d.descricao && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.descricao}</p>}
              </div>
              <p className="text-[11px] text-slate-400 mt-auto">
                Publicado em {formatarData(d.publicadoEm ?? d.criadoEm)}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
