'use client'
// Botão genérico de exclusão — envolve uma Server Action em um
// <form> com confirmação via window.confirm(). Reutilizável em
// qualquer listagem administrativa (comunicados, etc).

interface BotaoExcluirProps {
  /** Server Action já vinculada ao id do registro, ex.: `excluirX.bind(null, id)` */
  action: (formData: FormData) => void | Promise<void>
  confirmMessage?: string
  label?: string
  className?: string
}

export default function BotaoExcluir({
  action,
  confirmMessage = 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.',
  label = 'Excluir',
  className = 'text-xs font-semibold text-red-600 hover:underline',
}: BotaoExcluirProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault()
        }
      }}
      className="inline"
    >
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  )
}
