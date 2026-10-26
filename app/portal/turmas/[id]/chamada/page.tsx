import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { ArrowLeft } from 'lucide-react'
import EmptyState from '@/components/portal/EmptyState'
import ChamadaForm from '@/components/portal/ChamadaForm'

export const metadata: Metadata = { title: 'Fazer Chamada' }

function hojeISO(): string {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export default async function ChamadaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ data?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const sessao = await getSession()

  if (!sessao) redirect('/login')
  if (!temPermissao(sessao.perfil, 'chamada:fazer')) redirect('/portal/inicio')

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

  const dataSelecionada = sp.data && /^\d{4}-\d{2}-\d{2}$/.test(sp.data) ? sp.data : hojeISO()
  const dataObj = new Date(`${dataSelecionada}T12:00:00`)

  const [matriculas, chamadaExistente] = await Promise.all([
    prisma.matricula.findMany({
      where: { turmaId: vinculo.turmaId, status: 'ATIVA' },
      include: { aluno: true },
    }),
    prisma.chamada.findUnique({
      where: { turmaId_data: { turmaId: vinculo.turmaId, data: dataObj } },
      include: { frequencias: true },
    }),
  ])

  const alunosOrdenados = [...matriculas].sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome, 'pt-BR'))

  const alunos = alunosOrdenados.map((m) => {
    const frequencia = chamadaExistente?.frequencias.find((f) => f.alunoId === m.aluno.id)
    return {
      id: m.aluno.id,
      nome: m.aluno.nome,
      statusAtual: (frequencia?.status as 'PRESENTE' | 'FALTA' | 'FALTA_JUSTIFICADA') ?? 'PRESENTE',
    }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-slate-200/60">
        <Link href="/portal/turmas" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          Minhas turmas
        </Link>
        <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight mt-2">
          Chamada — {vinculo.turma.nome}
        </h1>
        <p className="text-slate-500 text-xs mt-1 font-medium">
          {vinculo.disciplina.nome} · {vinculo.turma.serie.nome}
        </p>
      </div>

      <form method="get" className="flex items-end gap-3">
        <div>
          <label className="label" htmlFor="data">Data da chamada</label>
          <input type="date" id="data" name="data" defaultValue={dataSelecionada} className="input w-auto" />
        </div>
        <button type="submit" className="btn btn-secondary btn-sm">Ver data</button>
      </form>

      {alunos.length === 0 ? (
        <EmptyState
          titulo="Nenhum aluno matriculado"
          mensagem="Esta turma ainda não possui alunos com matrícula ativa."
        />
      ) : (
        <ChamadaForm turmaDisciplinaId={id} data={dataSelecionada} alunos={alunos} />
      )}
    </div>
  )
}
