import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/admin/PageHeader'
import FormGerarMensalidades from '@/components/admin/FormGerarMensalidades'

export const metadata: Metadata = { title: 'Gerar Mensalidades do Mês' }

function formatarReais(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function datasPadrao(diaVencimento: number) {
  const hoje = new Date()
  const proximo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
  const ano = proximo.getFullYear()
  const mes = String(proximo.getMonth() + 1).padStart(2, '0')
  const ultimoDia = new Date(ano, proximo.getMonth() + 1, 0).getDate()
  const dia = String(Math.min(diaVencimento, ultimoDia)).padStart(2, '0')
  return { referencia: `${ano}-${mes}`, vencimento: `${ano}-${mes}-${dia}` }
}

export default async function GerarMensalidadesPage() {
  const [escola, alunos, semValor] = await Promise.all([
    prisma.escola.findFirst({ select: { diaVencimentoPadrao: true } }),
    prisma.aluno.findMany({
      where: { status: 'ATIVO', valorMensalidade: { gt: 0 } },
      select: { id: true, nome: true, valorMensalidade: true, descontoMensalidade: true },
      orderBy: { nome: 'asc' },
    }),
    prisma.aluno.count({
      where: { status: 'ATIVO', OR: [{ valorMensalidade: null }, { valorMensalidade: 0 }] },
    }),
  ])

  const { referencia, vencimento } = datasPadrao(escola?.diaVencimentoPadrao ?? 10)
  const total = alunos.reduce(
    (soma, a) => soma + (a.valorMensalidade ?? 0) - Math.min(a.descontoMensalidade, a.valorMensalidade ?? 0),
    0
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Gerar Mensalidades do Mês"
        description="Cria a mensalidade de todos os alunos ativos de uma vez, usando o valor cadastrado na ficha de cada um. Alunos que já têm cobrança no mês escolhido são ignorados."
        backHref="/admin/financeiro"
        backLabel="Voltar ao financeiro"
      />

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-xl">
        <FormGerarMensalidades
          referenciaPadrao={referencia}
          vencimentoPadrao={vencimento}
          disabled={alunos.length === 0}
        />
      </div>

      {semValor > 0 && (
        <div className="p-3 max-w-xl bg-amber-50/60 border border-amber-200/60 rounded-lg text-amber-800 text-xs">
          {semValor} aluno{semValor > 1 ? 's ativos estão' : ' ativo está'} sem valor de mensalidade e não{' '}
          {semValor > 1 ? 'serão incluídos' : 'será incluído'}. Cadastre o valor em{' '}
          <Link href="/admin/alunos" className="font-semibold underline">Alunos</Link>, na seção Mensalidade da ficha.
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden max-w-xl">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 font-display">Alunos com mensalidade cadastrada</h2>
          <span className="text-xs font-semibold text-slate-500">
            {alunos.length} · {formatarReais(total)}
          </span>
        </div>
        {alunos.length === 0 ? (
          <p className="px-6 py-8 text-xs text-slate-500 text-center">
            Nenhum aluno ativo com valor de mensalidade cadastrado ainda.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {alunos.map((a) => {
              const valor = a.valorMensalidade ?? 0
              const desconto = Math.min(a.descontoMensalidade, valor)
              return (
                <li key={a.id} className="px-6 py-3 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{a.nome}</span>
                  <span className="text-slate-600">
                    {formatarReais(valor - desconto)}
                    {desconto > 0 && <span className="text-slate-400"> ({formatarReais(desconto)} de desconto)</span>}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
