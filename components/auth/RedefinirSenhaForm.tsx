'use client'
import { useActionState, useState } from 'react'
import Link from 'next/link'
import { redefinirSenha, type AuthState } from '@/app/actions/auth'

interface RedefinirSenhaFormProps {
  token?: string
}

export default function RedefinirSenhaForm({ token }: RedefinirSenhaFormProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [state, action, pending] = useActionState<AuthState, FormData>(
    redefinirSenha,
    undefined
  )

  if (!token) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 p-4 bg-red-50/50 border border-red-200/60 rounded-lg text-red-800 text-sm leading-relaxed"
      >
        <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <div>
          <span className="font-semibold">Link inválido.</span> Nenhum token de redefinição foi informado.
          Solicite um novo link na página{' '}
          <Link href="/esqueci-senha" className="underline hover:text-red-900">
            Esqueci minha senha
          </Link>
          .
        </div>
      </div>
    )
  }

  if (state?.success) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center animate-fade-in"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Senha redefinida!</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{state.message}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-[#b91c1c] text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#dc2626] transition-all"
        >
          Ir para o login
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      {state?.message && !state?.success && (
        <div
          role="alert"
          className="flex items-start gap-3 p-3 bg-red-50/50 border border-red-200/60 rounded-lg text-red-800 text-xs leading-relaxed animate-fade-in"
        >
          <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div>{state.message}</div>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="redefinir-password" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
          Nova senha
        </label>
        <div className="relative">
          <input
            id="redefinir-password"
            name="password"
            type={mostrarSenha ? 'text' : 'password'}
            autoComplete="new-password"
            required
            placeholder="••••••••"
            className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] outline-none transition-all pr-10 ${
              state?.errors?.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            disabled={pending}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {mostrarSenha ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>
        {state?.errors?.password && (
          <p className="text-xs text-red-600 font-medium">{state.errors.password[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="redefinir-confirmPassword" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
          Confirmar nova senha
        </label>
        <input
          id="redefinir-confirmPassword"
          name="confirmPassword"
          type={mostrarSenha ? 'text' : 'password'}
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] outline-none transition-all ${
            state?.errors?.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          disabled={pending}
        />
        {state?.errors?.confirmPassword && (
          <p className="text-xs text-red-600 font-medium">{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 bg-[#b91c1c] text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#dc2626] focus:ring-2 focus:ring-[#b91c1c]/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redefinindo…
          </>
        ) : (
          'Redefinir senha'
        )}
      </button>
    </form>
  )
}
