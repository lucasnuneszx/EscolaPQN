import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import EmptyState from '@/components/portal/EmptyState'
import { StatusBadgeMensalidade, formatarReais, formatarData } from '@/components/portal/ui'

export const metadata: Metadata = { title: 'Financeiro' }

export default async function FinanceiroPage() {
  const sessao = await getSession()
  if (!sessao) redirect('/login')

  if (sessao.perfil === 'PROFESSOR') {
    redirect('/portal/turmas')
  }

  const cabecalho = (
    <div className="pb-5 border-b border-slate-200/60">
      <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">Financeiro</h1>
      <p className="text-slate-500 text-xs mt-1 font-medium">
        Mensalidades e cobranças dos seus filhos matriculados.
      </p>
    </div>
  )

  if (sessao.perfil === 'ALUNO') {
    return (
      <div className="space-y-6 animate-fade-in">
        {cabecalho}
        <EmptyState
          titulo="Nenhum registro de aluno vinculado"
          mensagem="Este acesso de aluno ainda não está vinculado a um cadastro de matrícula. Fale com a secretaria."
        />
      </div>
    )
  }

  const responsavel = await prisma.responsavel.findUnique({
    where: { usuarioId: sessao.userId },
    include: {
      vinculos: {
        include: {
          aluno: {
            include: {
              mensalidades: {
                include: { cobranças: true },
                orderBy: { dataVencimento: 'desc' },
              },
            },
          },
        },
      },
    },
  })

  const filhos = responsavel?.vinculos.map((v) => v.aluno) ?? []

  return (
    <div className="space-y-8 animate-fade-in">
      {cabecalho}

      {!responsavel ? (
        <EmptyState mensagem="Cadastro de responsável não encontrado. Fale com a secretaria da escola." />
      ) : filhos.length === 0 ? (
        <EmptyState mensagem="Nenhum aluno vinculado ao seu cadastro no momento." />
      ) : (
        filhos.map((aluno) => (
          <div key={aluno.id} className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">{aluno.nome}</h2>

            {aluno.mensalidades.length === 0 ? (
              <EmptyState mensagem="Nenhuma mensalidade registrada ainda para este aluno." />
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden overflow-x-auto">
                <table className="table-admin">
                  <thead>
                    <tr>
                      <th>Referência</th>
                      <th>Vencimento</th>
                      <th>Valor</th>
                      <th>Situação</th>
                      <th>Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aluno.mensalidades.map((m) => {
                      const cobranca = m.cobranças[0]
                      return (
                        <tr key={m.id}>
                          <td>{m.referencia}</td>
                          <td>{formatarData(m.dataVencimento)}</td>
                          <td className="font-semibold text-slate-900">{formatarReais(m.valorFinal)}</td>
                          <td><StatusBadgeMensalidade status={m.status} /></td>
                          <td>
                            {m.status === 'PAGO' ? (
                              <span className="text-xs text-slate-400">
                                Pago {m.dataPagamento ? `em ${formatarData(m.dataPagamento)}` : ''}
                              </span>
                            ) : cobranca ? (
                              <div className="flex flex-wrap gap-3">
                                {cobranca.urlBoleto && (
                                  <a
                                    href={cobranca.urlBoleto}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-brand-700 hover:underline"
                                  >
                                    Ver boleto
                                  </a>
                                )}
                                {cobranca.urlPixQrCode && (
                                  <a
                                    href={cobranca.urlPixQrCode}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-brand-700 hover:underline"
                                  >
                                    Ver Pix
                                  </a>
                                )}
                                {!cobranca.urlBoleto && !cobranca.urlPixQrCode && (
                                  <span className="text-xs text-slate-400">Aguardando cobrança</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Aguardando cobrança</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
