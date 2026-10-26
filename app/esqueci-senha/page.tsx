import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getRedirectUrlPorPerfil } from '@/lib/rbac'
import EsqueciSenhaForm from '@/components/auth/EsqueciSenhaForm'

export const metadata: Metadata = {
  title: 'Esqueci minha senha',
  description: 'Solicite a redefinição da sua senha de acesso ao portal do Centro Educacional Pequeno Príncipe.',
}

export default async function EsqueciSenhaPage() {
  const sessao = await getSession()
  if (sessao) {
    redirect(getRedirectUrlPorPerfil(sessao.perfil))
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Coluna da Esquerda: Mural Institucional (visível apenas em telas médias ou maiores) */}
      <div className="hidden md:flex md:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/sala-aula.png"
            alt="Interior do Centro Educacional Pequeno Príncipe"
            fill
            className="object-cover opacity-30 select-none pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/brand/logo-pequeno-principe.jpg"
            alt="Pequeno Príncipe"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
          />
          <span className="text-sm font-semibold tracking-wide font-display text-slate-200">
            Pequeno Príncipe
          </span>
        </div>

        <div className="relative z-10 max-w-md mt-auto">
          <blockquote className="space-y-4">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-slate-100 font-display">
              &ldquo;A segurança dos dados da nossa comunidade escolar é parte do nosso compromisso com cada família.&rdquo;
            </p>
            <footer className="text-sm text-slate-400 font-medium">
              &mdash; Secretaria Pequeno Príncipe
            </footer>
          </blockquote>
        </div>

        <div className="relative z-10 pt-10 text-xs text-slate-500">
          Dias d&#39;Ávila, Bahia, Brasil.
        </div>
      </div>

      {/* Coluna da Direita: Formulário Limpo */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-white relative z-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <Image
              src="/brand/logo-pequeno-principe.jpg"
              alt="Pequeno Príncipe"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-slate-950 leading-tight">Pequeno Príncipe</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Dias d&#39;Ávila — BA</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
              Esqueci minha senha
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Informe o e-mail cadastrado pela secretaria. Enviaremos um link para você redefinir sua senha.
            </p>
          </div>

          <EsqueciSenhaForm />

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/login"
              className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Voltar ao login
            </Link>
            <Link
              href="/"
              className="text-[#b91c1c] hover:text-[#dc2626] transition-colors font-medium flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
