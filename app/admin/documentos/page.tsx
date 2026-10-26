import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import BotaoExcluir from '@/components/admin/BotaoExcluir'
import { excluirDocumento } from '@/app/actions/documentos'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'

export const metadata: Metadata = { title: 'Documentos Escolares' }

async function obterDocumentos() {
  return prisma.documentoEscolar.findMany({
    orderBy: { criadoEm: 'desc' },
  })
}

export default async function DocumentosPage() {
  const documentos = await obterDocumentos()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Repositório de Documentos"
        description="Gerencie circulares, regimentos, cronogramas de exames e materiais para download de alunos e professores."
        action={
          <Link href="/admin/documentos/novo" className="btn btn-primary btn-sm rounded-lg">
            Adicionar Documento
          </Link>
        }
      />

      {/* Tabela de Arquivos */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        {documentos.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Nenhum documento disponível"
            description="Suba arquivos em formato PDF ou imagens para que os responsáveis e docentes acessem pelo portal."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Visibilidade</th>
                  <th>Mime-Type / Tamanho</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="font-semibold text-slate-900">{doc.titulo}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{doc.descricao ?? 'Sem descrição'}</div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 font-semibold uppercase">{doc.categoria}</span>
                    </td>
                    <td className="text-xs text-slate-500 font-medium">
                      {doc.visivelPara}
                    </td>
                    <td className="text-xs text-slate-400">
                      {doc.mimeType ?? 'Desconhecido'} &middot; {doc.tamanhoBytes ? `${Math.round(doc.tamanhoBytes / 1024)} KB` : '-'}
                    </td>
                    <td className="text-right">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#b91c1c] hover:underline mr-3">
                        Download
                      </a>
                      <BotaoExcluir
                        action={excluirDocumento.bind(null, doc.id)}
                        confirmMessage="Tem certeza que deseja excluir este documento?"
                      />
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
