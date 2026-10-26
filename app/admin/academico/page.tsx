import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Acadêmico' }

async function obterEstruturaAcademica() {
  const [series, disciplinas] = await Promise.all([
    prisma.serie.findMany({ orderBy: { ordem: 'asc' } }),
    prisma.disciplina.findMany({ orderBy: { nome: 'asc' } }),
  ])
  return { series, disciplinas }
}

export default async function AcademicoPage() {
  const { series, disciplinas } = await obterEstruturaAcademica()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Gestão Acadêmica"
        description="Configure as séries vigentes, a grade de disciplinas e acompanhe o lançamento de notas por trimestre."
        action={
          <Link href="/admin/academico/notas" className="btn btn-primary btn-sm rounded-lg">
            Lançar Notas
          </Link>
        }
      />

      {/* Grid de Seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Séries Cadastradas */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Séries e Níveis</h3>
              <p className="text-xs text-slate-400 mt-0.5">Séries configuradas no ano letivo ativo</p>
            </div>
            <Link href="/admin/academico/series/novo" className="text-xs font-semibold text-[#b91c1c] hover:underline">
              + Adicionar
            </Link>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {series.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div>
                  <p className="text-xs font-bold text-slate-900">{s.nome}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Código: {s.codigo}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200/60 rounded px-2 py-0.5">
                  {s.nivel === 'educacao_infantil' ? 'Infantil' : 'Fundamental'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disciplinas */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Grade Curricular</h3>
              <p className="text-xs text-slate-400 mt-0.5">Disciplinas letivas e carga horária</p>
            </div>
            <Link href="/admin/academico/disciplinas/novo" className="text-xs font-semibold text-[#b91c1c] hover:underline">
              + Adicionar
            </Link>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {disciplinas.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div>
                  <p className="text-xs font-bold text-slate-900">{d.nome}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Código: {d.codigo}</p>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {d.cargaHoraria ? `${d.cargaHoraria}h / ano` : 'C.H. não def.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
