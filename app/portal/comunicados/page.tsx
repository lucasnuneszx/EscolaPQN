import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import EmptyState from '@/components/portal/EmptyState'
import { formatarData } from '@/components/portal/ui'

export const metadata: Metadata = { title: 'Comunicados' }

async function obterTurmaIdsDoUsuario(perfil: string, userId: string): Promise<string[]> {
  if (perfil === 'PROFESSOR') {
    const professor = await prisma.professor.findUnique({
      where: { usuarioId: userId },
      include: { disciplinas: { select: { turmaId: true } } },
    })
    return [...new Set(professor?.disciplinas.map((d) => d.turmaId) ?? [])]
  }

  if (perfil === 'RESPONSAVEL') {
    const responsavel = await prisma.responsavel.findUnique({
      where: { usuarioId: userId },
      include: {
        vinculos: {
          include: {
            aluno: {
              include: {
                matriculas: { where: { status: 'ATIVA' }, select: { turmaId: true } },
              },
            },
          },
        },
      },
    })
    return [
      ...new Set(
        responsavel?.vinculos.flatMap((v) => v.aluno.matriculas.map((m) => m.turmaId)) ?? []
      ),
    ]
  }

  // ALUNO — sem vínculo de matrícula rastreável no schema atual (ver gap conhecido)
  return []
}

export default async function ComunicadosPage() {
  const sessao = await getSession()
  if (!sessao) redirect('/login')

  const turmaIds = await obterTurmaIdsDoUsuario(sessao.perfil, sessao.userId)

  const comunicados = await prisma.comunicado.findMany({
    where: {
      OR: [
        { tipo: 'GERAL' },
        ...(turmaIds.length > 0 ? [{ turmas: { some: { turmaId: { in: turmaIds } } } }] : []),
      ],
    },
    include: {
      autor: true,
      turmas: { include: { turma: true } },
    },
    orderBy: [{ fixado: 'desc' }, { criadoEm: 'desc' }],
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-slate-200/60">
        <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">Mural de Avisos</h1>
        <p className="text-slate-500 text-xs mt-1 font-medium">
          Comunicados gerais da escola e avisos direcionados às suas turmas.
        </p>
      </div>

      {sessao.perfil === 'ALUNO' && (
        <p className="text-xs text-slate-400 -mt-3">
          Como este acesso de aluno ainda não está vinculado a uma matrícula, apenas os comunicados gerais são exibidos.
        </p>
      )}

      {comunicados.length === 0 ? (
        <EmptyState mensagem="Nenhum comunicado publicado no momento." />
      ) : (
        <div className="space-y-4">
          {comunicados.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200/80 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {c.fixado && <span className="badge badge-warning">Fixado</span>}
                  {c.tipo === 'GERAL' ? (
                    <span className="badge badge-info">Geral</span>
                  ) : (
                    <span className="badge badge-neutral">
                      {c.turmas.map((t) => t.turma.nome).join(', ') || 'Turma'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 whitespace-nowrap">
                  {formatarData(c.publicadoEm ?? c.criadoEm)}
                </p>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{c.titulo}</h3>
              <p className="text-xs text-slate-600 mt-1.5 whitespace-pre-line leading-relaxed">{c.conteudo}</p>
              <p className="text-[11px] text-slate-400 mt-3">Por {c.autor.nome}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
