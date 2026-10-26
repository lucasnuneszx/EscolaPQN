import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import BotaoExcluirResponsavel from '@/components/admin/BotaoExcluirResponsavel'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'

export const metadata: Metadata = { title: 'Responsáveis' }

async function obterResponsaveis() {
  return prisma.responsavel.findMany({
    include: {
      vinculos: {
        include: {
          aluno: true,
        },
      },
    },
    orderBy: { nome: 'asc' },
  })
}

export default async function ResponsaveisPage() {
  const responsaveis = await obterResponsaveis()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Responsáveis Legais e Financeiros"
        description="Gerencie os dados cadastrais, financeiros e vínculos dos pais ou tutores dos alunos."
        action={
          <Link
            href="/admin/responsaveis/novo"
            className="btn btn-primary btn-sm flex items-center gap-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Responsável
          </Link>
        }
      />

      {/* Busca */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            placeholder="Buscar por nome, CPF, e-mail ou telefone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#b91c1c] outline-none transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid de Dados / Tabela */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        {responsaveis.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Nenhum responsável cadastrado"
              description="Utilize o botão acima para cadastrar pais ou guardiões responsáveis pelo faturamento ou acompanhamento pedagógico."
            />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Responsável</th>
                  <th>Contato</th>
                  <th>Alunos Vinculados</th>
                  <th>Financeiro</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {responsaveis.map((resp) => (
                  <tr key={resp.id}>
                    <td>
                      <div className="font-semibold text-slate-900">{resp.nome}</div>
                      <div className="text-xs text-slate-400 mt-0.5">CPF: {resp.cpf ?? 'Não inf.'}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-600 font-medium">{resp.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Tel: {resp.telefone}</div>
                    </td>
                    <td>
                      {resp.vinculos.length === 0 ? (
                        <span className="text-xs text-slate-400 italic font-medium">Nenhum aluno</span>
                      ) : (
                        resp.vinculos.map((v) => (
                          <div key={v.id} className="text-xs text-slate-600 font-semibold">
                            {v.aluno.nome}
                          </div>
                        ))
                      )}
                    </td>
                    <td>
                      {resp.responsavelFinanceiro ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Sim</span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Não</span>
                      )}
                    </td>
                    <td className="text-right">
                      <Link href={`/admin/responsaveis/${resp.id}`} className="text-xs font-semibold text-[#b91c1c] hover:underline mr-3">
                        Editar
                      </Link>
                      <BotaoExcluirResponsavel responsavelId={resp.id} nomeResponsavel={resp.nome} />
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
