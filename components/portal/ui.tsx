// Peças de UI compartilhadas do Portal (Server Components — sem estado)

export function formatarReais(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export function formatarData(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data
  return d.toLocaleDateString('pt-BR')
}

interface MiniStatProps {
  label: string
  valor: string
  sub?: string
}

export function MiniStat({ label, valor, sub }: MiniStatProps) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-base font-bold text-slate-900 mt-1 font-display">{valor}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export function StatusBadgeAluno({ status }: { status: string }) {
  const map: Record<string, string> = {
    ATIVO: 'badge-success',
    INATIVO: 'badge-neutral',
    TRANSFERIDO: 'badge-info',
    TRANCADO: 'badge-warning',
    PENDENTE: 'badge-warning',
  }
  const label: Record<string, string> = {
    ATIVO: 'Ativo',
    INATIVO: 'Inativo',
    TRANSFERIDO: 'Transferido',
    TRANCADO: 'Trancado',
    PENDENTE: 'Pendente',
  }
  return <span className={`badge ${map[status] ?? 'badge-neutral'}`}>{label[status] ?? status}</span>
}

export function StatusBadgeFrequencia({ status }: { status: string }) {
  if (status === 'PRESENTE') return <span className="badge badge-success">Presente</span>
  if (status === 'FALTA_JUSTIFICADA') return <span className="badge badge-warning">Falta justificada</span>
  return <span className="badge badge-danger">Falta</span>
}

export function StatusBadgeMensalidade({ status }: { status: string }) {
  if (status === 'PAGO') return <span className="badge badge-success">Pago</span>
  if (status === 'VENCIDO') return <span className="badge badge-danger">Vencido</span>
  if (status === 'CANCELADO') return <span className="badge badge-neutral">Cancelado</span>
  return <span className="badge badge-warning">Pendente</span>
}

export function saudacaoHorario(): string {
  const hora = new Date().getHours()
  return hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'
}
