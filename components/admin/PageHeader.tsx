import Link from 'next/link'

interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  action?: React.ReactNode
}

export default function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Voltar',
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/60">
      <div>
        {backHref && (
          <Link href={backHref} className="text-xs font-semibold text-[#b91c1c] hover:underline">
            &larr; {backLabel}
          </Link>
        )}
        <h1 className={`text-xl font-bold text-slate-900 font-display tracking-tight ${backHref ? 'mt-2' : ''}`}>
          {title}
        </h1>
        {description && (
          <p className="text-slate-500 text-xs mt-1 font-medium">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
