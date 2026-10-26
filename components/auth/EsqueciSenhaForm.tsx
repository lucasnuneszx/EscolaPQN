'use client'
import { useActionState } from 'react'
import { solicitarRecuperacaoSenha, type AuthState } from '@/app/actions/auth'

export default function EsqueciSenhaForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    solicitarRecuperacaoSenha,
    undefined
  )

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
        <h3 className="text-base font-semibold text-slate-900 mb-1">Verifique seu e-mail</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
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
        <label htmlFor="esqueci-email" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
          E-mail institucional
        </label>
        <input
          id="esqueci-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="exemplo@escolapqn.com.br"
          className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] outline-none transition-all ${
            state?.errors?.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          disabled={pending}
        />
        {state?.errors?.email && (
          <p className="text-xs text-red-600 font-medium">{state.errors.email[0]}</p>
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
            Enviando…
          </>
        ) : (
          'Enviar instruções'
        )}
      </button>
    </form>
  )
}
