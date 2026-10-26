import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Turmas' }

async function obterTurmas() {
  return prisma.turma.findMany({
    include: {
      serie: true,
      _count: {
        select: {
          matriculas: true,
        },
      },
    },
    orderBy: { nome: 'asc' },
  })
}

export default async function TurmasPage() {
  const turmas = await obterTurmas()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Turmas e Séries"
        description="Gerencie as turmas, horários, capacidade física das salas e lotações de alunos."
        action={
          <Link
            href="/admin/turmas/novo"
            className="btn btn-primary btn-sm flex items-center gap-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criar Turma
          </Link>
        }
      />

      {/* Grid de Turmas */}
      {turmas.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-16 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Nenhuma turma criada</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
            Adicione turmas definindo o turno, sala física e o limite de matrículas para organizar a escola.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map((turma) => {
            const ocupacao = turma._count.matriculas
            const capacidade = turma.capacidade
            const percentual = Math.min(Math.round((ocupacao / capacidade) * 100), 100)

            return (
              <div key={turma.id} className="bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-display">{turma.nome}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{turma.serie.nome}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {turma.turno}
                    </span>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Vagas Ocupadas</span>
                      <span>{ocupacao} / {capacidade} ({percentual}%)</span>
                    </div>
                    {/* Barra de Progresso Corporal */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percentual >= 90 ? 'bg-red-500' : percentual >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentual}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-700">Sala:</span> {turma.sala ?? 'Não def.'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link href={`/admin/turmas/${turma.id}`} className="font-semibold text-[#b91c1c] hover:underline">
                    Ver alunos &rarr;
                  </Link>
                  <Link href={`/admin/turmas/configurar/${turma.id}`} className="font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                    Configurar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
