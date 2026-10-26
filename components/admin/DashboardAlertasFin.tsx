// ─────────────────────────────────────────────────────────────
// Alertas financeiros do Dashboard — Estética Limpa
// ─────────────────────────────────────────────────────────────
import Link from 'next/link'

interface ProximoVencimento {
  id: string
  referencia: string
  valorFinal: number
  dataVencimento: Date
  aluno: { nome: string }
}

interface Props {
  proximosVencimentos: ProximoVencimento[]
  mensalidadesVencidas: { total: number; count: number }
}

function formatarReais(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

function formatarData(data: Date): string {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

function diasAteVencimento(data: Date): number {
  const diff = data.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function DashboardAlertasFin({ proximosVencimentos, mensalidadesVencidas }: Props) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Compromissos Financeiros
          </h3>
          <Link
            href="/admin/financeiro"
            className="text-xs font-semibold text-[#b91c1c] hover:text-[#dc2626] transition-colors"
          >
            Ver todos
          </Link>
        </div>

        {/* Alerta de inadimplência corporativo */}
        {mensalidadesVencidas.count > 0 && (
          <div className="flex items-start justify-between gap-4 p-4 bg-red-50/40 border border-red-200/60 rounded-lg mb-5 animate-fade-in">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-red-900">
                  Atenção: Há faturas vencidas em aberto
                </p>
                <p className="text-xs text-red-700/80 mt-0.5">
                  Total de {mensalidadesVencidas.count} fatura{mensalidadesVencidas.count > 1 ? 's' : ''} vencida{mensalidadesVencidas.count > 1 ? 's' : ''} acumulando juros.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-red-900">
                {formatarReais(mensalidadesVencidas.total)}
              </p>
              <Link
                href="/admin/financeiro?status=VENCIDO"
                className="text-[11px] font-semibold text-red-700 hover:text-red-900 transition-colors block mt-1 underline"
              >
                Cobrar
              </Link>
            </div>
          </div>
        )}

        {/* Lista de próximos vencimentos */}
        {proximosVencimentos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 text-xs font-medium">
              Nenhuma fatura programada para vencimento nos próximos 15 dias.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Próximos Vencimentos (15 dias)
            </p>
            <ul className="divide-y divide-slate-100">
              {proximosVencimentos.map((m) => {
                const dias = diasAteVencimento(m.dataVencimento)
                const urgente = dias <= 3

                return (
                  <li
                    key={m.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {m.aluno.nome}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Referência: {m.referencia} &middot; Vence em {formatarData(m.dataVencimento)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        {formatarReais(m.valorFinal)}
                      </p>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${
                          urgente
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/55'
                            : 'bg-slate-50 text-slate-600 border border-slate-200/40'
                        }`}
                      >
                        {dias === 0 ? 'Hoje' : dias === 1 ? 'Amanhã' : `Em ${dias} dias`}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
