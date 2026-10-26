import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AcoesMensalidade from '@/components/admin/AcoesMensalidade'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Detalhe da Mensalidade' }

function formatarReais(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

async function obterMensalidade(id: string) {
  return prisma.mensalidade.findUnique({
    where: { id },
    include: {
      aluno: { select: { nome: true, id: true } },
      responsavel: { select: { nome: true, telefone: true, email: true } },
      cobranças: { orderBy: { criadoEm: 'desc' } },
    },
  })
}

export default async function DetalheMensalidadePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mensalidade = await obterMensalidade(id)

  if (!mensalidade) {
    notFound()
  }

  const statusColors: Record<string, string> = {
    PAGO: 'badge-success',
    PENDENTE: 'badge-warning',
    VENCIDO: 'badge-danger',
    CANCELADO: 'badge-neutral',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Mensalidade — ${mensalidade.aluno.nome}`}
        description={`Referência ${mensalidade.referencia} · Vencimento em ${mensalidade.dataVencimento.toLocaleDateString('pt-BR')}`}
        backHref="/admin/financeiro"
        backLabel="Voltar ao financeiro"
        action={
          <span className={`badge ${statusColors[mensalidade.status] ?? 'badge-neutral'}`}>
            {mensalidade.status}
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-xl p-6">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Dados da Mensalidade
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs text-slate-400 font-medium">Valor base</dt>
                <dd className="font-semibold text-slate-900">{formatarReais(mensalidade.valorBase)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-medium">Desconto</dt>
                <dd className="font-semibold text-slate-900">
                  {formatarReais(mensalidade.valorDesconto)}
                  {mensalidade.tipoDesconto ? ` (${mensalidade.tipoDesconto})` : ''}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-medium">Valor final</dt>
                <dd className="font-bold text-slate-900 text-base">
                  {formatarReais(mensalidade.valorFinal)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-medium">Data de pagamento</dt>
                <dd className="font-semibold text-slate-900">
                  {mensalidade.dataPagamento
                    ? mensalidade.dataPagamento.toLocaleDateString('pt-BR')
                    : 'Não pago'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-medium">Valor pago</dt>
                <dd className="font-semibold text-slate-900">
                  {mensalidade.valorPago ? formatarReais(mensalidade.valorPago) : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-medium">Responsável financeiro</dt>
                <dd className="font-semibold text-slate-900">
                  {mensalidade.responsavel?.nome ?? 'Não vinculado'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-6">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Cobranças Asaas (ambiente simulado)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Como a integração real com o Asaas ainda não foi configurada (credenciais sandbox
              pendentes), as cobranças abaixo são registros simulados localmente.
            </p>
            {mensalidade.cobranças.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhuma cobrança gerada até o momento.</p>
            ) : (
              <ul className="space-y-3">
                {mensalidade.cobranças.map((c) => (
                  <li
                    key={c.id}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{c.tipo}</span>
                      <span className="badge badge-neutral">{c.status}</span>
                    </div>
                    <p className="text-slate-500">ID simulado: {c.asaasId}</p>
                    {c.urlBoleto && (
                      <p className="text-slate-500 truncate">Boleto: {c.urlBoleto}</p>
                    )}
                    {c.urlPixQrCode && (
                      <p className="text-slate-500 truncate">Pix: {c.urlPixQrCode}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-6 h-fit">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
            Ações
          </h3>
          <AcoesMensalidade mensalidadeId={mensalidade.id} status={mensalidade.status} />
        </div>
      </div>
    </div>
  )
}
