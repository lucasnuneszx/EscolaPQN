import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Financeiro' }

function formatarReais(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

async function obterDadosFinanceiros() {
  const [mensalidades, resumo] = await Promise.all([
    prisma.mensalidade.findMany({
      include: {
        aluno: { select: { nome: true } },
        responsavel: { select: { nome: true } },
      },
      orderBy: { dataVencimento: 'desc' },
      take: 10,
    }),
    prisma.mensalidade.groupBy({
      by: ['status'],
      _sum: { valorFinal: true },
      _count: true,
    }),
  ])

  return { mensalidades, resumo }
}

export default async function FinanceiroPage() {
  const { mensalidades, resumo } = await obterDadosFinanceiros()

  const totais = resumo.reduce(
    (acc, item) => {
      acc[item.status] = {
        total: item._sum.valorFinal ?? 0,
        count: item._count,
      }
      return acc
    },
    {} as Record<string, { total: number; count: number }>
  )

  const pago = totais['PAGO'] ?? { total: 0, count: 0 }
  const pendente = totais['PENDENTE'] ?? { total: 0, count: 0 }
  const vencido = totais['VENCIDO'] ?? { total: 0, count: 0 }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Gestão Financeira"
        description="Acompanhe a arrecadação de mensalidades, inadimplência e integração com o gateway Asaas."
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/financeiro/faturamento" className="btn btn-secondary btn-sm rounded-lg">
              Relatórios
            </Link>
            <Link href="/admin/financeiro/nova-cobranca" className="btn btn-primary btn-sm rounded-lg">
              Emitir Fatura
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 border-t-[3px] border-t-emerald-600">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Arrecadado no mês</p>
          <p className="text-xl font-bold text-slate-900 mt-2 font-display">{formatarReais(pago.total)}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{pago.count} mensalidades liquidadas</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 border-t-[3px] border-t-amber-500">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">A vencer / Em aberto</p>
          <p className="text-xl font-bold text-slate-900 mt-2 font-display">{formatarReais(pendente.total)}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{pendente.count} mensalidades provisionadas</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 border-t-[3px] border-t-red-600">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inadimplência acumulada</p>
          <p className="text-xl font-bold text-slate-900 mt-2 font-display">{formatarReais(vencido.total)}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{vencido.count} mensalidades vencidas</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Últimos Lançamentos</h3>
          <select className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none">
            <option value="">Filtro rápido</option>
            <option value="pago">Pagas</option>
            <option value="atraso">Vencidas</option>
          </select>
        </div>

        {mensalidades.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Nenhum registro financeiro</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
              Quando matrículas forem efetivadas, os planos de mensalidades aparecerão listados aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Responsável</th>
                  <th>Ref.</th>
                  <th>Vencimento</th>
                  <th>Valor Final</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mensalidades.map((m) => {
                  const statusColors: Record<string, string> = {
                    PAGO: 'badge-success',
                    PENDENTE: 'badge-warning',
                    VENCIDO: 'badge-danger',
                  }
                  return (
                    <tr key={m.id}>
                      <td className="font-semibold text-slate-950">{m.aluno.nome}</td>
                      <td className="text-slate-600 text-xs">{m.responsavel?.nome ?? 'Sem resp.'}</td>
                      <td className="text-slate-500 font-medium text-xs">{m.referencia}</td>
                      <td className="text-slate-500 text-xs">{m.dataVencimento.toLocaleDateString('pt-BR')}</td>
                      <td className="font-bold text-slate-900">{formatarReais(m.valorFinal)}</td>
                      <td>
                        <span className={`badge ${statusColors[m.status] ?? 'badge-neutral'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link href={`/admin/financeiro/${m.id}`} className="text-xs font-semibold text-[#b91c1c] hover:underline mr-3">
                          Ver Detalhes
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
