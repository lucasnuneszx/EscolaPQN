'use client'

import { useState } from 'react'

interface Props {
  name: string
  label: string
  obrigatorio?: boolean
  ajuda?: string
  erro?: string
  disabled?: boolean
}

function gerarSenha(): string {
  const letras = 'abcdefghjkmnpqrstuvwxyz'
  const sorteio = (n: number) => Math.floor(Math.random() * n)
  const parte = Array.from({ length: 4 }, () => letras[sorteio(letras.length)]).join('')
  return `Pqn@${parte}${1000 + sorteio(9000)}`
}

export default function CampoSenhaAcesso({ name, label, obrigatorio, ajuda, erro, disabled }: Props) {
  const [senha, setSenha] = useState('')
  const [copiada, setCopiada] = useState(false)

  const copiar = async () => {
    if (!senha) return
    try {
      await navigator.clipboard.writeText(senha)
      setCopiada(true)
      setTimeout(() => setCopiada(false), 2000)
    } catch {
      setCopiada(false)
    }
  }

  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {obrigatorio ? ' *' : ''}
      </label>
      <div className="flex gap-2">
        <input
          id={name}
          name={name}
          type="text"
          autoComplete="new-password"
          minLength={6}
          required={obrigatorio}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Mínimo de 6 caracteres"
          className={`input font-mono ${erro ? 'input-error' : ''}`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setSenha(gerarSenha())}
          className="btn btn-secondary btn-sm rounded-lg text-xs shrink-0"
          disabled={disabled}
        >
          Gerar
        </button>
        <button
          type="button"
          onClick={copiar}
          className="btn btn-secondary btn-sm rounded-lg text-xs shrink-0"
          disabled={disabled || !senha}
        >
          {copiada ? 'Copiada' : 'Copiar'}
        </button>
      </div>
      {erro && <p className="text-xs text-red-600 mt-1">{erro}</p>}
      {ajuda && <p className="text-xs text-slate-500 mt-1">{ajuda}</p>}
    </div>
  )
}
