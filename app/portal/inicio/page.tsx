import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import EmptyState from '@/components/portal/EmptyState'
import { MiniStat, StatusBadgeAluno, formatarReais, formatarData, saudacaoHorario } from '@/components/portal/ui'

export const metadata: Metadata = { title: 'Início' }

async function obterDadosResponsavel(usuarioId: string) {
  return prisma.responsavel.findUnique({
    where: { usuarioId },
    include: {
      vinculos: {
        include: {
          aluno: {
            include: {
              matriculas: {
                where: { status: 'ATIVA' },
                include: { turma: { include: { serie: true } } },
              },
              mensalidades: {
                where: { status: { in: ['PENDENTE', 'VENCIDO'] } },
                orderBy: { dataVencimento: 'asc' },
                take: 1,
              },
              notas: {
                orderBy: { atualizadoEm: 'desc' },
                take: 3,
                include: { turmaDisciplina: { include: { disciplina: true } } },
              },
              frequencias: {
                orderBy: { criadoEm: 'desc' },
                take: 20,
              },
            },
          },
        },
      },
    },
  })
}

export default async function PortalInicioPage() {
  const sessao = await getSession()
  if (!sessao) redirect('/login')

  if (sessao.perfil === 'PROFESSOR') {
    redirect('/portal/turmas')
  }

  const cabecalho = (
    <div className="pb-5 border-b border-slate-200/60">
      <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">
        {saudacaoHorario()}, {sessao.nome.split(' ')[0]}
      </h1>
      <p className="text-slate-500 text-xs mt-1 font-medium">
        {new Date().toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>
  )

  if (sessao.perfil === 'ALUNO') {
    return (
      <div className="space-y-6 animate-fade-in">
        {cabecalho}
        <EmptyState
          titulo="Acesso de aluno ainda não vinculado"
          mensagem="Nenhum registro de aluno está vinculado a este acesso no momento. Procure a secretaria para associar seu cadastro e liberar seus dados acadêmicos."
        />
      </div>
    )
  }

  // RESPONSAVEL
  const responsavel = await obterDadosResponsavel(sessao.userId)
  const filhos = responsavel?.vinculos.map((v) => v.aluno) ?? []

  return (
    <div className="space-y-8 animate-fade-in">
      {cabecalho}

      {!responsavel ? (
        <EmptyState
          titulo="Cadastro de responsável não encontrado"
          mensagem="Não localizamos um cadastro de responsável vinculado a este acesso. Fale com a secretaria da escola."
        />
      ) : filhos.length === 0 ? (
        <EmptyState
          titulo="Nenhum aluno vinculado"
          mensagem="Ainda não há alunos vinculados ao seu cadastro. Fale com a secretaria para verificar o vínculo familiar."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filhos.map((aluno) => {
            const matricula = aluno.matriculas[0]
            const faltas = aluno.frequencias.filter((f) => f.status !== 'PRESENTE').length
            const proximaMensalidade = aluno.mensalidades[0]

            return (
              <div key={aluno.id} className="bg-white border border-slate-200/80 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{aluno.nome}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {matricula ? `${matricula.turma.serie.nome} · ${matricula.turma.nome}` : 'Sem matrícula ativa'}
                    </p>
                  </div>
                  <StatusBadgeAluno status={aluno.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <MiniStat label="Faltas recentes" valor={String(faltas)} sub="Últimos 20 registros" />
                  <MiniStat
                    label="Próxima mensalidade"
                    valor={proximaMensalidade ? formatarReais(proximaMensalidade.valorFinal) : 'Em dia'}
                    sub={proximaMensalidade ? `Vence em ${formatarData(proximaMensalidade.dataVencimento)}` : undefined}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Últimas notas lançadas
                  </p>
                  {aluno.notas.length === 0 ? (
                    <p className="text-xs text-slate-400">Nenhuma nota lançada ainda.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {aluno.notas.map((n) => (
                        <li key={n.id} className="flex items-center justify-between py-2 text-xs first:pt-0 last:pb-0">
                          <span className="text-slate-600">{n.turmaDisciplina.disciplina.nome}</span>
                          <span className="font-semibold text-slate-900">
                            {n.valor != null ? n.valor.toFixed(1) : '—'} / {n.valorMaximo.toFixed(0)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
