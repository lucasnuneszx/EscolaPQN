import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Relatório de Faturamento' }

function formatarReais(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

async function obterDadosRelatorio() {
  const [porReferencia, porStatus, mensalidades] = await Promise.all([
    prisma.mensalidade.groupBy({
      by: ['referencia'],
      _sum: { valorFinal: true },
      _count: true,
      orderBy: { referencia: 'desc' },
    }),
    prisma.mensalidade.groupBy({
      by: ['status'],
      _sum: { valorFinal: true },
      _count: true,
    }),
    prisma.mensalidade.findMany({
      include: {
        aluno: {
          include: {
            matriculas: {
              where: { status: 'ATIVA' },
              include: { turma: { include: { serie: true } } },
              take: 1,
            },
          },
        },
      },
    }),
  ])

  return { porReferencia, porStatus, mensalidades }
}

export default async function FaturamentoPage() {
  const { porReferencia, porStatus, mensalidades } = await obterDadosRelatorio()

  const totaisStatus = porStatus.reduce(
    (acc, item) => {
      acc[item.status] = { total: item._sum.valorFinal ?? 0, count: item._count }
      return acc
    },
    {} as Record<string, { total: number; count: number }>
  )

  const pago = totaisStatus['PAGO'] ?? { total: 0, count: 0 }
  const pendente = totaisStatus['PENDENTE'] ?? { total: 0, count: 0 }
  const vencido = totaisStatus['VENCIDO'] ?? { total: 0, count: 0 }
  const totalGeral = pago.count + pendente.count + vencido.count
  const taxaInadimplencia = totalGeral > 0 ? (vencido.count / totalGeral) * 100 : 0

  // Agrupamento simples por turma/série
  const porTurma = new Map<
    string,
    { nome: string; totalPago: number; totalPendente: number; totalVencido: number; count: number }
  >()

  for (const m of mensalidades) {
    const matricula = m.aluno.matriculas[0]
    const chave = matricula ? matricula.turma.id : 'sem-turma'
    const nome = matricula
      ? `${matricula.turma.serie.nome} — ${matricula.turma.nome}`
      : 'Sem turma ativa'

    if (!porTurma.has(chave)) {
      porTurma.set(chave, { nome, totalPago: 0, totalPendente: 0, totalVencido: 0, count: 0 })
    }
    const registro = porTurma.get(chave)!
    registro.count += 1
    if (m.status === 'PAGO') registro.totalPago += m.valorFinal
    else if (m.status === 'PENDENTE') registro.totalPendente += m.valorFinal
    else if (m.status === 'VENCIDO') registro.totalVencido += m.valorFinal
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Relatório de Faturamento"
        description="Totais por mês de referência, por status e taxa de inadimplência."
        backHref="/admin/financeiro"
        backLabel="Voltar ao financeiro"
      />

      {/* Métricas gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 border-t-[3px] border-t-emerald-600">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pago</p>
          <p className="text-xl font-bold text-slate-900 mt-2 font-display">
            {formatarReais(pago.total)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{pago.count} mensalidades</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 border-t-[3px] border-t-amber-500">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pendente</p>
          <p className="text-xl font-bold text-slate-900 mt-2 font-display">
            {formatarReais(pendente.total)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{pendente.count} mensalidades</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 border-t-[3px] border-t-red-600">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vencido</p>
          <p className="text-xl font-bold text-slate-900 mt-2 font-display">
            {formatarReais(vencido.total)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{vencido.count} mensalidades</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 border-t-[3px] border-t-slate-400">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Taxa de inadimplência
          </p>
          <p className="text-xl font-bold text-slate-900 mt-2 font-display">
            {taxaInadimplencia.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {vencido.count} de {totalGeral} mensalidades
          </p>
        </div>
      </div>

      {/* Totais por mês */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Totais por Mês (Referência)
          </h3>
        </div>
        {porReferencia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-xs font-medium">Nenhum lançamento registrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Referência</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {porReferencia.map((r) => (
                  <tr key={r.referencia}>
                    <td className="font-semibold text-slate-900">{r.referencia}</td>
                    <td className="text-slate-600">{r._count}</td>
                    <td className="font-bold text-slate-900">
                      {formatarReais(r._sum.valorFinal ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Totais por turma/série */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Totais por Turma
          </h3>
        </div>
        {porTurma.size === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-xs font-medium">Nenhum lançamento registrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Mensalidades</th>
                  <th>Pago</th>
                  <th>Pendente</th>
                  <th>Vencido</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(porTurma.values()).map((t) => (
                  <tr key={t.nome}>
                    <td className="font-semibold text-slate-900">{t.nome}</td>
                    <td className="text-slate-600">{t.count}</td>
                    <td className="text-emerald-700 font-medium">{formatarReais(t.totalPago)}</td>
                    <td className="text-amber-700 font-medium">{formatarReais(t.totalPendente)}</td>
                    <td className="text-red-700 font-medium">{formatarReais(t.totalVencido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
