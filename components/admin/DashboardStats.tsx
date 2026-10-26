// Cards de métricas do dashboard

interface DashboardData {
  totalAlunosAtivos: number
  totalTurmas: number
  mensalidadesPagas: { total: number; count: number }
  mensalidadesPendentes: { total: number; count: number }
  mensalidadesVencidas: { total: number; count: number }
}

interface Props {
  dados: DashboardData
}

function formatarReais(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

interface StatCardProps {
  titulo: string
  valor: string
  subtitulo: string
  tipo?: 'neutral' | 'success' | 'warning' | 'danger'
}

function StatCard({ titulo, valor, subtitulo, tipo = 'neutral' }: StatCardProps) {
  const borderColors = {
    neutral: 'border-slate-200/80',
    success: 'border-slate-200/80 border-t-emerald-600 border-t-[3px]',
    warning: 'border-slate-200/80 border-t-amber-500 border-t-[3px]',
    danger: 'border-slate-200/80 border-t-red-600 border-t-[3px]',
  }

  const textColors = {
    neutral: 'text-slate-900',
    success: 'text-slate-900',
    warning: 'text-slate-900',
    danger: 'text-slate-900',
  }

  return (
    <div className={`bg-white border rounded-xl p-6 transition-all duration-200 hover:shadow-sm ${borderColors[tipo]}`}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {titulo}
      </p>
      <p className={`text-2xl font-bold mt-2 font-display tracking-tight ${textColors[tipo]}`}>
        {valor}
      </p>
      <p className="text-xs text-slate-500 mt-1 font-medium">
        {subtitulo}
      </p>
    </div>
  )
}

export default function DashboardStats({ dados }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      <StatCard
        titulo="Alunos Ativos"
        valor={dados.totalAlunosAtivos.toString()}
        subtitulo="Matrículas ativas"
        tipo="neutral"
      />
      <StatCard
        titulo="Turmas Ativas"
        valor={dados.totalTurmas.toString()}
        subtitulo="Ano letivo vigente"
        tipo="neutral"
      />
      <StatCard
        titulo="Recebido (Mês)"
        valor={formatarReais(dados.mensalidadesPagas.total)}
        subtitulo={`${dados.mensalidadesPagas.count} mensalidades pagas`}
        tipo="success"
      />
      <StatCard
        titulo="Previsão Pendente"
        valor={formatarReais(dados.mensalidadesPendentes.total)}
        subtitulo={`${dados.mensalidadesPendentes.count} a vencer/em aberto`}
        tipo="warning"
      />
      <StatCard
        titulo="Total em Atraso"
        valor={formatarReais(dados.mensalidadesVencidas.total)}
        subtitulo={`${dados.mensalidadesVencidas.count} inadimplentes`}
        tipo="danger"
      />
    </div>
  )
}
