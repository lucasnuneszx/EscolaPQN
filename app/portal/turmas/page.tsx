import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import EmptyState from '@/components/portal/EmptyState'

export const metadata: Metadata = { title: 'Minhas Turmas' }

export default async function TurmasPage() {
  const sessao = await getSession()
  if (!sessao) redirect('/login')

  if (sessao.perfil !== 'PROFESSOR') {
    // RESPONSAVEL/ALUNO não possuem turmas próprias — leva ao início
    redirect('/portal/inicio')
  }

  const professor = await prisma.professor.findUnique({
    where: { usuarioId: sessao.userId },
    include: {
      disciplinas: {
        include: {
          turma: { include: { serie: true } },
          disciplina: true,
        },
      },
    },
  })

  const vinculos = [...(professor?.disciplinas ?? [])].sort((a, b) =>
    a.turma.nome.localeCompare(b.turma.nome, 'pt-BR')
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-slate-200/60">
        <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">Minhas Turmas</h1>
        <p className="text-slate-500 text-xs mt-1 font-medium">
          Turmas e disciplinas sob sua responsabilidade neste ano letivo.
        </p>
      </div>

      {!professor ? (
        <EmptyState
          titulo="Cadastro de professor não encontrado"
          mensagem="Nenhum cadastro de professor está vinculado a este acesso. Fale com a secretaria."
        />
      ) : vinculos.length === 0 ? (
        <EmptyState
          titulo="Nenhuma turma atribuída"
          mensagem="Você ainda não possui turmas ou disciplinas atribuídas. Fale com a coordenação pedagógica."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vinculos.map((v) => (
            <div key={v.id} className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold text-brand-700 uppercase tracking-widest">{v.turma.serie.nome}</p>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{v.turma.nome}</h3>
                <p className="text-xs text-slate-500 mt-1">{v.disciplina.nome}</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link href={`/portal/turmas/${v.id}/chamada`} className="btn btn-secondary btn-sm flex-1 justify-center">
                  Chamada
                </Link>
                <Link href={`/portal/turmas/${v.id}/notas`} className="btn btn-primary btn-sm flex-1 justify-center">
                  Notas
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
