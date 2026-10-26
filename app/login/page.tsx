import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getRedirectUrlPorPerfil } from '@/lib/rbac'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Acesse o portal do Centro Educacional Pequeno Príncipe.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const sessao = await getSession()
  if (sessao) {
    redirect(getRedirectUrlPorPerfil(sessao.perfil))
  }

  const { callbackUrl } = await searchParams

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Coluna da Esquerda: Mural Institucional (visível apenas em telas médias ou maiores) */}
      <div className="hidden md:flex md:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        {/* Imagem de Fundo com Overlay Profissional */}
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

        {/* Logo / Nome no Topo */}
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

        {/* Filosofia / Citação no Centro/Base */}
        <div className="relative z-10 max-w-md mt-auto">
          <blockquote className="space-y-4">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-slate-100 font-display">
              &ldquo;Só se vê bem com o coração. O essencial é invisível aos olhos.&rdquo;
            </p>
            <footer className="text-sm text-slate-400 font-medium">
              &mdash; O Pequeno Príncipe, Antoine de Saint-Exupéry
            </footer>
          </blockquote>
        </div>

        {/* Rodapé da Coluna */}
        <div className="relative z-10 pt-10 text-xs text-slate-500">
          Dias d&#39;Ávila, Bahia, Brasil.
        </div>
      </div>

      {/* Coluna da Direita: Formulário Limpo */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-white relative z-10">
        <div className="mx-auto w-full max-w-sm">
          {/* Header Mobile-Only / Brand */}
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

          {/* Cabeçalho do Formulário */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
              Acessar o portal
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Insira suas credenciais cadastradas pela secretaria para acessar o painel.
            </p>
          </div>

          {/* Form */}
          <LoginForm callbackUrl={callbackUrl} />

          {/* Links e Ações Adicionais */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/esqueci-senha"
              className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Problemas para entrar?
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
