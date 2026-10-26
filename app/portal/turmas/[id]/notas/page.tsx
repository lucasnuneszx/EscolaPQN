import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { ArrowLeft } from 'lucide-react'
import EmptyState from '@/components/portal/EmptyState'
import NotasForm from '@/components/portal/NotasForm'

export const metadata: Metadata = { title: 'Lançar Notas' }

export default async function NotasTurmaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ periodo?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const sessao = await getSession()

  if (!sessao) redirect('/login')
  if (!temPermissao(sessao.perfil, 'notas:lancar')) redirect('/portal/inicio')

  const vinculo = await prisma.turmaDisciplina.findUnique({
    where: { id },
    include: { turma: { include: { serie: true } }, disciplina: true, professor: true },
  })

  const autorizado = vinculo && vinculo.professor && vinculo.professor.usuarioId === sessao.userId

  if (!autorizado) {
    return (
      <div className="space-y-6 animate-fade-in">
        <EmptyState
          titulo="Turma não encontrada"
          mensagem="Esta turma não existe ou não está vinculada ao seu acesso."
        />
        <Link href="/portal/turmas" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          Voltar para minhas turmas
        </Link>
      </div>
    )
  }

  const periodos = await prisma.periodoAvaliativo.findMany({
    where: { anoLetivo: { ativo: true }, ativo: true },
    orderBy: { numero: 'asc' },
  })

  const cabecalho = (
    <div className="pb-5 border-b border-slate-200/60">
      <Link href="/portal/turmas" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
        Minhas turmas
      </Link>
      <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight mt-2">
        Lançamento de Notas — {vinculo.turma.nome}
      </h1>
      <p className="text-slate-500 text-xs mt-1 font-medium">
        {vinculo.disciplina.nome} · {vinculo.turma.serie.nome}
      </p>
    </div>
  )

  if (periodos.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        {cabecalho}
        <EmptyState
          titulo="Nenhum período avaliativo ativo"
          mensagem="Não há trimestre/período ativo configurado para lançamento de notas. Fale com a coordenação pedagógica."
        />
      </div>
    )
  }

  const periodoSelecionado = periodos.find((p) => p.id === sp.periodo) ?? periodos[periodos.length - 1]

  const [matriculas, notasExistentes] = await Promise.all([
    prisma.matricula.findMany({
      where: { turmaId: vinculo.turmaId, status: 'ATIVA' },
      include: { aluno: true },
    }),
    prisma.nota.findMany({
      where: { turmaDisciplinaId: id, periodoId: periodoSelecionado.id },
    }),
  ])

  const alunosOrdenados = [...matriculas].sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome, 'pt-BR'))

  const alunos = alunosOrdenados.map((m) => {
    const nota = notasExistentes.find((n) => n.alunoId === m.aluno.id)
    return {
      id: m.aluno.id,
      nome: m.aluno.nome,
      valorAtual: nota?.valor ?? null,
    }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {cabecalho}

      <form method="get" className="flex items-end gap-3">
        <div>
          <label className="label" htmlFor="periodo">Período avaliativo</label>
          <select id="periodo" name="periodo" defaultValue={periodoSelecionado.id} className="input w-auto">
            {periodos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-secondary btn-sm">Selecionar</button>
      </form>

      {alunos.length === 0 ? (
        <EmptyState
          titulo="Nenhum aluno matriculado"
          mensagem="Esta turma ainda não possui alunos com matrícula ativa."
        />
      ) : (
        <NotasForm turmaDisciplinaId={id} periodoId={periodoSelecionado.id} alunos={alunos} />
      )}
    </div>
  )
}
