import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import EmptyState from '@/components/portal/EmptyState'

export const metadata: Metadata = { title: 'Notas' }

export default async function NotasPage() {
  const sessao = await getSession()
  if (!sessao) redirect('/login')

  if (sessao.perfil === 'PROFESSOR') {
    redirect('/portal/turmas')
  }

  const cabecalho = (
    <div className="pb-5 border-b border-slate-200/60">
      <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">Boletim Escolar</h1>
      <p className="text-slate-500 text-xs mt-1 font-medium">
        Acompanhe as notas por disciplina e período avaliativo.
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
              notas: {
                include: {
                  turmaDisciplina: { include: { disciplina: true } },
                  periodo: true,
                },
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
          const notasOrdenadas = [...aluno.notas].sort((a, b) => {
            if (a.periodo.numero !== b.periodo.numero) return a.periodo.numero - b.periodo.numero
            return a.turmaDisciplina.disciplina.nome.localeCompare(b.turmaDisciplina.disciplina.nome, 'pt-BR')
          })

          return (
            <div key={aluno.id} className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900">{aluno.nome}</h2>
              {notasOrdenadas.length === 0 ? (
                <EmptyState mensagem="Nenhuma nota lançada ainda para este aluno." />
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden overflow-x-auto">
                  <table className="table-admin">
                    <thead>
                      <tr>
                        <th>Disciplina</th>
                        <th>Período</th>
                        <th>Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notasOrdenadas.map((n) => (
                        <tr key={n.id}>
                          <td>{n.turmaDisciplina.disciplina.nome}</td>
                          <td>{n.periodo.nome}</td>
                          <td className="font-semibold text-slate-900">
                            {n.valor != null ? n.valor.toFixed(1) : '—'} / {n.valorMaximo.toFixed(0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
