// Verificação de sessão e redirecionamento por perfil
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

// Rotas públicas — sem autenticação necessária
const ROTAS_PUBLICAS = [
  '/',
  '/sobre',
  '/matriculas',
  '/educacao-infantil',
  '/ensino-fundamental',
  '/estrutura',
  '/depoimentos',
  '/contato',
  '/faq',
  '/agendar-visita',
  '/privacidade',
  '/termos',
  '/guiasestudo',
  '/login',
  '/esqueci-senha',
  '/redefinir-senha',
  '/api/webhooks/asaas',
  '/api/public/matricula-interesse',
]

// Prefixos de rotas que exigem perfil admin/secretaria
const ROTAS_ADMIN = ['/admin']

const PERFIS_POR_AREA: Record<string, string[]> = {
  '/professor': ['PROFESSOR'],
  '/pais': ['RESPONSAVEL', 'ALUNO'],
}

function areaDoPerfil(perfil: string): string {
  if (perfil === 'ADMIN' || perfil === 'SECRETARIA') return '/admin/dashboard'
  if (perfil === 'PROFESSOR') return '/professor/turmas'
  if (perfil === 'RESPONSAVEL' || perfil === 'ALUNO') return '/pais'
  return '/login'
}

function rotaLegadaDoPortal(pathname: string, perfil: string): string {
  const resto = pathname.replace(/^\/portal\/?/, '')
  if (perfil === 'PROFESSOR') {
    if (resto.startsWith('turmas') || resto.startsWith('comunicados')) return `/professor/${resto}`
    return '/professor/turmas'
  }
  if (perfil === 'RESPONSAVEL' || perfil === 'ALUNO') {
    if (!resto || resto === 'inicio' || resto.startsWith('turmas')) return '/pais'
    return `/pais/${resto}`
  }
  return areaDoPerfil(perfil)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const ePublica = ROTAS_PUBLICAS.some(
    (r) => pathname === r || pathname.startsWith(r + '/')
  )
  if (ePublica) return NextResponse.next()

  const token = request.cookies.get('pqn_session')?.value
  const sessao = await decrypt(token)

  if (!sessao) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Admin/secretaria
  if (ROTAS_ADMIN.some((r) => pathname.startsWith(r))) {
    if (!['ADMIN', 'SECRETARIA'].includes(sessao.perfil)) {
      return NextResponse.redirect(new URL(areaDoPerfil(sessao.perfil), request.url))
    }
  }

  // Links antigos do portal: leva para a área do perfil logado
  if (pathname === '/portal' || pathname.startsWith('/portal/')) {
    return NextResponse.redirect(new URL(rotaLegadaDoPortal(pathname, sessao.perfil), request.url))
  }

  // Área do professor e área dos pais
  for (const [prefixo, perfis] of Object.entries(PERFIS_POR_AREA)) {
    if ((pathname === prefixo || pathname.startsWith(prefixo + '/')) && !perfis.includes(sessao.perfil)) {
      return NextResponse.redirect(new URL(areaDoPerfil(sessao.perfil), request.url))
    }
  }

  // Repassa o usuário via header para os Server Components
  const response = NextResponse.next()
  response.headers.set('x-user-id', sessao.userId)
  response.headers.set('x-user-perfil', sessao.perfil)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
