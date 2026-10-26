import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Alunos da Turma' }

async function obterTurmaComAlunos(id: string) {
  return prisma.turma.findUnique({
    where: { id },
    include: {
      serie: true,
      matriculas: {
        include: { aluno: true },
        orderBy: { aluno: { nome: 'asc' } },
      },
    },
  })
}

export default async function TurmaAlunosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const turma = await obterTurmaComAlunos(id)

  if (!turma) {
    notFound()
  }

  const statusColors: Record<string, string> = {
    ATIVO: 'badge-success',
    PENDENTE: 'badge-warning',
    INATIVO: 'badge-danger',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={turma.nome}
        description={`${turma.serie.nome} · ${turma.turno} · ${turma.matriculas.length} de ${turma.capacidade} vagas ocupadas`}
        action={
          <div className="flex gap-2">
            <Link href={`/admin/turmas/configurar/${turma.id}`} className="btn btn-secondary btn-sm rounded-lg">
              Configurar Turma
            </Link>
            <Link href="/admin/turmas" className="btn btn-secondary btn-sm rounded-lg">
              Voltar
            </Link>
          </div>
        }
      />

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        {turma.matriculas.length === 0 ? (
          <div className="text-center py-16 px-4">
            <h3 className="text-sm font-semibold text-slate-900">Nenhum aluno matriculado</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
              Esta turma ainda não possui alunos com matrícula ativa.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Estudante</th>
                  <th>Matrícula</th>
                  <th>Status da Matrícula</th>
                  <th>Status do Aluno</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {turma.matriculas.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-900">{m.aluno.nome}</div>
                      <div className="text-xs text-slate-400 mt-0.5">CPF: {m.aluno.cpf ?? 'Não cadastrado'}</div>
                    </td>
                    <td className="text-slate-600 font-mono text-xs font-semibold">{m.numero}</td>
                    <td>
                      <span className="badge badge-info">{m.status}</span>
                    </td>
                    <td>
                      <span className={`badge ${statusColors[m.aluno.status] ?? 'badge-neutral'}`}>
                        {m.aluno.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/admin/alunos/editar/${m.aluno.id}`}
                        className="text-xs font-semibold text-[#b91c1c] hover:underline"
                      >
                        Ver ficha
                      </Link>
                    </td>
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
