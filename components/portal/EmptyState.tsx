// ─────────────────────────────────────────────────────────────
// Estado vazio elegante — usado em todo o portal quando não há
// dados ou vínculo para o usuário logado.
// ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  titulo?: string
  mensagem: string
}

export default function EmptyState({ titulo, mensagem }: EmptyStateProps) {
  return (
    <div className="bg-white border border-dashed border-slate-200 rounded-xl py-14 px-6 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 13h6m-6 4h6m2 5H7a2 2 0 01-2-2V4a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V20a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      {titulo && <p className="text-sm font-semibold text-slate-700">{titulo}</p>}
      <p className="text-xs text-slate-400 max-w-sm font-medium leading-relaxed">{mensagem}</p>
    </div>
  )
}
