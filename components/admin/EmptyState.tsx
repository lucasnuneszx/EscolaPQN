interface EmptyStateProps {
  icon: React.ReactNode
  title?: string
  description: string
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
        {icon}
      </div>
      {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
      <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">{description}</p>
    </div>
  )
}
