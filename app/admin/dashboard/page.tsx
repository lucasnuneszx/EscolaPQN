import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import DashboardStats from '@/components/admin/DashboardStats'
import DashboardAlertasFin from '@/components/admin/DashboardAlertasFin'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

async function getDashboardData() {
  const hoje = new Date()
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
  const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 15)

  const [
    totalAlunosAtivos,
    totalTurmas,
    mensalidadesPagas,
    mensalidadesPendentes,
    mensalidadesVencidas,
    proximosVencimentos,
    comunicadosRecentes,
  ] = await Promise.all([
    prisma.aluno.count({ where: { status: 'ATIVO' } }),
    prisma.turma.count({
      where: { anoLetivo: { ativo: true } },
    }),
    prisma.mensalidade.aggregate({
      where: {
        status: 'PAGO',
        dataPagamento: { gte: inicioMes, lte: fimMes },
      },
      _sum: { valorFinal: true },
      _count: true,
    }),
    prisma.mensalidade.aggregate({
      where: { status: 'PENDENTE' },
      _sum: { valorFinal: true },
      _count: true,
    }),
    prisma.mensalidade.aggregate({
      where: { status: 'VENCIDO' },
      _sum: { valorFinal: true },
      _count: true,
    }),
    prisma.mensalidade.findMany({
      where: {
        status: 'PENDENTE',
        dataVencimento: { gte: hoje, lte: proximoMes },
      },
      include: {
        aluno: { select: { nome: true } },
      },
      orderBy: { dataVencimento: 'asc' },
      take: 5,
    }),
    prisma.comunicado.findMany({
      orderBy: { criadoEm: 'desc' },
      take: 5,
      include: { autor: { select: { nome: true } } },
    }),
  ])

  return {
    totalAlunosAtivos,
    totalTurmas,
    mensalidadesPagas: {
      total: mensalidadesPagas._sum.valorFinal ?? 0,
      count: mensalidadesPagas._count,
    },
    mensalidadesPendentes: {
      total: mensalidadesPendentes._sum.valorFinal ?? 0,
      count: mensalidadesPendentes._count,
    },
    mensalidadesVencidas: {
      total: mensalidadesVencidas._sum.valorFinal ?? 0,
      count: mensalidadesVencidas._count,
    },
    proximosVencimentos,
    comunicadosRecentes,
  }
}

export default async function DashboardPage() {
  const [sessao, dados] = await Promise.all([getSession(), getDashboardData()])

  const hora = new Date().getHours()
  const saudacao =
    hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">
            {saudacao}, {sessao?.nome.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Resumo administrativo de hoje,{' '}
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <DashboardStats dados={dados} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardAlertasFin
          proximosVencimentos={dados.proximosVencimentos}
          mensalidadesVencidas={dados.mensalidadesVencidas}
        />

        {/* Comunicados recentes */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Mural de Avisos
              </h3>
              <Link href="/admin/comunicados" className="text-xs font-semibold text-[#b91c1c] hover:text-[#dc2626] transition-colors">
                Ver todos
              </Link>
            </div>
            
            {dados.comunicadosRecentes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400 text-xs font-medium">
                  Nenhum comunicado publicado recentemente.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {dados.comunicadosRecentes.map((c) => (
                  <li key={c.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4">
                    <div className="mt-1">
                      {c.tipo === 'GERAL' ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-50 text-[10px] font-bold text-red-700 uppercase tracking-wider">Geral</span>
                      ) : c.tipo === 'TURMA' ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-50 text-[10px] font-bold text-purple-700 uppercase tracking-wider">Turma</span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Privativo</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 hover:text-[#b91c1c] cursor-pointer truncate transition-colors">{c.titulo}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        Por {c.autor.nome} &middot; {c.criadoEm.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Ações rápidas do sistema
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              href: '/admin/alunos/novo',
              label: 'Cadastrar Aluno',
              desc: 'Matricular novo estudante',
              icon: (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              ),
            },
            {
              href: '/admin/financeiro',
              label: 'Gerenciar Cobranças',
              desc: 'Fluxo financeiro e mensalidades',
              icon: (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              href: '/admin/academico/notas',
              label: 'Lançamento de Notas',
              desc: 'Boletins e avaliações letivas',
              icon: (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
            },
            {
              href: '/admin/comunicados/novo',
              label: 'Novo Comunicado',
              desc: 'Publicar aviso no mural público',
              icon: (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ),
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900">{item.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
