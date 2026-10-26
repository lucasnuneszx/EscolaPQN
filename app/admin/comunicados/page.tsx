import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { excluirComunicado } from '@/app/actions/comunicados'
import BotaoExcluir from '@/components/admin/BotaoExcluir'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Comunicados' }

async function obterComunicados() {
  return prisma.comunicado.findMany({
    include: {
      autor: { select: { nome: true } },
    },
    orderBy: { criadoEm: 'desc' },
  })
}

export default async function ComunicadosPage() {
  const comunicados = await obterComunicados()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Mural de Comunicados"
        description="Redija avisos gerais, circulares para turmas específicas ou mensagens individuais de relevância."
        action={
          <Link href="/admin/comunicados/novo" className="btn btn-primary btn-sm rounded-lg">
            Novo Comunicado
          </Link>
        }
      />

      {/* Lista de comunicados */}
      <div className="space-y-4">
        {comunicados.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-16 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Nenhum aviso no mural</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
              Publique comunicados para manter os pais, alunos e professores alinhados com as notícias da escola.
            </p>
          </div>
        ) : (
          comunicados.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200/80 rounded-xl p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {c.tipo === 'GERAL' ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-50 text-[10px] font-bold text-red-700 uppercase tracking-wider">Geral</span>
                    ) : c.tipo === 'TURMA' ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-50 text-[10px] font-bold text-purple-700 uppercase tracking-wider">Turma</span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Privativo</span>
                    )}
                    {c.fixado && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-700 uppercase tracking-wider">Fixado</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2 font-display">{c.titulo}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Por {c.autor.nome} &middot; publicado em {c.criadoEm.toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/comunicados/editar/${c.id}`} className="text-xs font-semibold text-[#b91c1c] hover:underline">
                    Editar
                  </Link>
                  <BotaoExcluir
                    action={excluirComunicado.bind(null, c.id)}
                    confirmMessage="Tem certeza que deseja excluir este comunicado do mural?"
                    className="text-xs font-semibold text-red-600 hover:underline ml-3"
                  />
                </div>
              </div>
              <div className="mt-4 text-slate-600 text-xs leading-relaxed max-w-2xl whitespace-pre-line">
                {c.conteudo}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
