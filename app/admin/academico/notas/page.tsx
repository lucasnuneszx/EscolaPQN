import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import GradeLancamentoNotas from '@/components/admin/GradeLancamentoNotas'

export const metadata: Metadata = { title: 'Lançamento de Notas' }

async function obterOpcoesContexto() {
  const [turmaDisciplinas, periodos] = await Promise.all([
    prisma.turmaDisciplina.findMany({
      include: {
        turma: { include: { serie: true } },
        disciplina: true,
      },
      orderBy: [{ turma: { serie: { ordem: 'asc' } } }, { disciplina: { nome: 'asc' } }],
    }),
    prisma.periodoAvaliativo.findMany({
      orderBy: [{ anoLetivo: { ano: 'desc' } }, { numero: 'asc' }],
      include: { anoLetivo: true },
    }),
  ])

  return { turmaDisciplinas, periodos }
}

async function obterContextoLancamento(turmaDisciplinaId: string, periodoId: string) {
  const [turmaDisciplina, periodo, notasExistentes] = await Promise.all([
    prisma.turmaDisciplina.findUnique({
      where: { id: turmaDisciplinaId },
      include: { turma: { include: { serie: true } }, disciplina: true },
    }),
    prisma.periodoAvaliativo.findUnique({ where: { id: periodoId } }),
    prisma.nota.findMany({
      where: { turmaDisciplinaId, periodoId },
    }),
  ])

  if (!turmaDisciplina || !periodo) {
    return null
  }

  const matriculas = await prisma.matricula.findMany({
    where: { turmaId: turmaDisciplina.turmaId, status: 'ATIVA' },
    include: { aluno: true },
    orderBy: { aluno: { nome: 'asc' } },
  })

  const mapaNotas = new Map(notasExistentes.map((n) => [n.alunoId, n.valor]))

  const alunos = matriculas.map((m) => ({
    id: m.aluno.id,
    nome: m.aluno.nome,
    valorAtual: mapaNotas.get(m.aluno.id) ?? null,
  }))

  return { turmaDisciplina, periodo, alunos }
}

export default async function LancamentoNotasPage({
  searchParams,
}: {
  searchParams: Promise<{ turmaDisciplinaId?: string; periodoId?: string }>
}) {
  const { turmaDisciplinaId, periodoId } = await searchParams

  if (!turmaDisciplinaId || !periodoId) {
    const { turmaDisciplinas, periodos } = await obterOpcoesContexto()

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="pb-5 border-b border-slate-200/60">
          <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">
            Lançamento de Notas
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Selecione a turma/disciplina e o período avaliativo para lançar as notas em lote.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-6 max-w-xl">
          <form method="GET" className="space-y-5">
            <div>
              <label htmlFor="turmaDisciplinaId" className="label">
                Turma e disciplina
              </label>
              <select id="turmaDisciplinaId" name="turmaDisciplinaId" required className="input">
                <option value="">Selecione…</option>
                {turmaDisciplinas.map((td) => (
                  <option key={td.id} value={td.id}>
                    {td.turma.serie.nome} — {td.turma.nome} · {td.disciplina.nome}
                  </option>
                ))}
              </select>
              {turmaDisciplinas.length === 0 && (
                <p className="text-xs text-slate-400 mt-1">
                  Nenhuma disciplina vinculada a uma turma foi encontrada.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="periodoId" className="label">
                Período avaliativo
              </label>
              <select id="periodoId" name="periodoId" required className="input">
                <option value="">Selecione…</option>
                {periodos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.anoLetivo.ano} — {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Continuar
            </button>
          </form>
        </div>
      </div>
    )
  }

  const contexto = await obterContextoLancamento(turmaDisciplinaId, periodoId)

  if (!contexto) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="pb-5 border-b border-slate-200/60">
          <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">
            Lançamento de Notas
          </h1>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-6">
          <p className="text-sm text-red-600 font-medium">
            Turma/disciplina ou período avaliativo não encontrado.
          </p>
          <Link href="/admin/academico/notas" className="text-xs font-semibold text-[#b91c1c] hover:underline mt-3 inline-block">
            Voltar à seleção
          </Link>
        </div>
      </div>
    )
  }

  const { turmaDisciplina, periodo, alunos } = contexto

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">
            Lançamento de Notas
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            {turmaDisciplina.turma.serie.nome} — {turmaDisciplina.turma.nome} ·{' '}
            {turmaDisciplina.disciplina.nome} · {periodo.nome}
          </p>
        </div>
        <Link href="/admin/academico/notas" className="text-xs font-semibold text-[#b91c1c] hover:underline">
          Trocar turma/período
        </Link>
      </div>

      <GradeLancamentoNotas
        turmaDisciplinaId={turmaDisciplina.id}
        periodoId={periodo.id}
        valorMaximo={10}
        alunos={alunos}
      />
    </div>
  )
}
