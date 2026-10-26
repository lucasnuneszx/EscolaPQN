import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/admin/PageHeader'

export const metadata: Metadata = { title: 'Configurações Institucionais' }

async function obterConfiguracoesEscola() {
  return prisma.escola.findFirst({
    orderBy: { criadoEm: 'desc' },
  })
}

export default async function ConfiguracoesPage() {
  const escola = await obterConfiguracoesEscola()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Configurações da Escola"
        description="Atualize os dados institucionais, políticas de privacidade, parâmetros financeiros padrão e integrações."
      />

      {/* Formulário de Configuração */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-5">Dados Cadastrais</h3>

        {!escola ? (
          <p className="text-xs text-slate-400 font-medium">Nenhum dado cadastrado para a instituição no banco.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Razão Social / Nome Fantasia</label>
              <input
                type="text"
                readOnly
                value={escola.nome}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">CNPJ</label>
              <input
                type="text"
                readOnly
                value={escola.cnpj ?? 'Não informado'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">E-mail de Contato</label>
              <input
                type="email"
                readOnly
                value={escola.emailContato ?? 'Não informado'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Telefone Institucional</label>
              <input
                type="text"
                readOnly
                value={escola.telefone ?? 'Não informado'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Endereço Completo</label>
              <input
                type="text"
                readOnly
                value={escola.endereco ?? 'Não informado'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Multa por Atraso (%)</label>
              <input
                type="text"
                readOnly
                value={`${escola.multaPercentual}%`}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Juros de Mora (%)</label>
              <input
                type="text"
                readOnly
                value={`${escola.jurosPercentual}% ao mês`}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
