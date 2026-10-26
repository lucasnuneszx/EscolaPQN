import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import EmptyState from '@/components/portal/EmptyState'
import { MiniStat, StatusBadgeFrequencia, formatarData } from '@/components/portal/ui'

export const metadata: Metadata = { title: 'Frequência' }

export default async function FrequenciaPage() {
  const sessao = await getSession()
  if (!sessao) redirect('/login')

  if (sessao.perfil === 'PROFESSOR') {
    redirect('/portal/turmas')
  }

  const cabecalho = (
    <div className="pb-5 border-b border-slate-200/60">
      <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">Frequência</h1>
      <p className="text-slate-500 text-xs mt-1 font-medium">
        Acompanhamento de presenças e faltas por disciplina e período.
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
              frequencias: {
                include: {
                  chamada: { include: { periodo: true } },
                  turmaDisciplina: { include: { disciplina: true } },
                },
                orderBy: { chamada: { data: 'desc' } },
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
        filhos.map((aluno) => {
          const total = aluno.frequencias.length
          const presencas = aluno.frequencias.filter((f) => f.status === 'PRESENTE').length
          const faltas = aluno.frequencias.filter((f) => f.status === 'FALTA').length
          const justificadas = aluno.frequencias.filter((f) => f.status === 'FALTA_JUSTIFICADA').length
          const percentual = total > 0 ? Math.round((presencas / total) * 100) : null
          const recentes = aluno.frequencias.slice(0, 20)

          return (
            <div key={aluno.id} className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900">{aluno.nome}</h2>

              {total === 0 ? (
                <EmptyState mensagem="Nenhum registro de frequência lançado ainda para este aluno." />
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MiniStat label="Frequência" valor={percentual != null ? `${percentual}%` : '—'} />
                    <MiniStat label="Presenças" valor={String(presencas)} />
                    <MiniStat label="Faltas" valor={String(faltas)} />
                    <MiniStat label="Faltas justificadas" valor={String(justificadas)} />
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden overflow-x-auto">
                    <table className="table-admin">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Disciplina</th>
                          <th>Período</th>
                          <th>Situação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentes.map((f) => (
                          <tr key={f.id}>
                            <td>{formatarData(f.chamada.data)}</td>
                            <td>{f.turmaDisciplina?.disciplina.nome ?? '—'}</td>
                            <td>{f.chamada.periodo.nome}</td>
                            <td><StatusBadgeFrequencia status={f.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
