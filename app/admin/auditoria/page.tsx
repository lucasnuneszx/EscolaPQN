import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Auditoria de Logs' }

async function obterLogs() {
  return prisma.auditLog.findMany({
    include: {
      usuario: {
        select: {
          nome: true,
          email: true,
        },
      },
    },
    orderBy: { criadoEm: 'desc' },
    take: 30,
  })
}

export default async function AuditoriaPage() {
  const logs = await obterLogs()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Logs de Auditoria e Segurança"
        description="Monitore todas as ações administrativas, alterações de notas e transações financeiras realizadas no sistema."
      />

      {/* Tabela de logs */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Nenhum log registrado</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
              As ações dos usuários com privilégios administrativos serão exibidas aqui para fins de LGPD e segurança.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Operador</th>
                  <th>Ação</th>
                  <th>Entidade afetada</th>
                  <th>Endereço IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-xs text-slate-500 font-medium">
                      {log.criadoEm.toLocaleString('pt-BR')}
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900">{log.usuario?.nome ?? 'Sistema'}</div>
                      <div className="text-xs text-slate-400">{log.usuario?.email ?? 'Automático'}</div>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        {log.tipo}
                      </span>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{log.descricao}</p>
                    </td>
                    <td className="text-xs text-slate-600 font-semibold uppercase">
                      {log.entidade}
                    </td>
                    <td className="text-xs text-slate-400">
                      {log.ip ?? 'Não inf.'}
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
