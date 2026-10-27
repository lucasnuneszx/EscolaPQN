import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import FormDepoimento from '@/components/portal/FormDepoimento'
import { formatarData } from '@/components/portal/ui'

export const metadata: Metadata = { title: 'Deixe seu Depoimento' }

const ROTULO_STATUS: Record<string, { texto: string; classe: string }> = {
  PENDENTE: { texto: 'Aguardando aprovação', classe: 'badge badge-warning' },
  APROVADO: { texto: 'Publicado no site', classe: 'badge badge-success' },
  REJEITADO: { texto: 'Não publicado', classe: 'badge badge-neutral' },
}

export default async function DepoimentoPage() {
  const sessao = await getSession()
  if (!sessao) redirect('/login')
  if (sessao.perfil !== 'RESPONSAVEL') redirect('/portal/inicio')

  const [responsavel, enviados] = await Promise.all([
    prisma.responsavel.findUnique({
      where: { usuarioId: sessao.userId },
      select: {
        parentesco: true,
        vinculos: {
          select: {
            aluno: {
              select: {
                matriculas: {
                  where: { status: 'ATIVA' },
                  select: { turma: { select: { serie: { select: { nome: true } } } } },
                  take: 1,
                },
              },
            },
          },
          take: 1,
        },
      },
    }),
    prisma.depoimento.findMany({
      where: { usuarioId: sessao.userId },
      orderBy: { criadoEm: 'desc' },
    }),
  ])

  const serie = responsavel?.vinculos[0]?.aluno.matriculas[0]?.turma.serie.nome
  const relacaoPadrao = responsavel?.parentesco
    ? `${responsavel.parentesco}${serie ? ` de aluno do ${serie}` : ''}`
    : ''

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-slate-200/60">
        <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">Deixe seu Depoimento</h1>
        <p className="text-slate-500 text-xs mt-1 font-medium">
          Sua opinião ajuda outras famílias a conhecer a escola. Ele aparece no site depois da aprovação da coordenação.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-2xl">
        <FormDepoimento nomePadrao={sessao.nome} relacaoPadrao={relacaoPadrao} />
      </div>

      {enviados.length > 0 && (
        <div className="max-w-2xl space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-display">Enviados por você</h2>
          {enviados.map((d) => {
            const status = ROTULO_STATUS[d.status] ?? ROTULO_STATUS.PENDENTE
            return (
              <div key={d.id} className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className={status.classe}>{status.texto}</span>
                  <span className="text-[11px] text-slate-400">{formatarData(d.criadoEm)}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{d.texto}&rdquo;</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
