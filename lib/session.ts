// Gerenciamento de Sessão (stateless JWT com Jose)
// Não usa NextAuth — implementação própria conforme guia Next.js
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
export type PerfilUsuario = 'ADMIN' | 'SECRETARIA' | 'PROFESSOR' | 'RESPONSAVEL' | 'ALUNO'


const SESSION_COOKIE = 'pqn_session'
const SECRET_KEY = process.env.SESSION_SECRET!
const encodedKey = new TextEncoder().encode(SECRET_KEY)

export type SessionPayload = {
  userId: string
  perfil: PerfilUsuario
  nome: string
  email: string
  expiresAt: Date
}

/**
 * Cria um JWT assinado com HS256 — expira em 8 horas.
 * Usar expiração curta para áreas sensíveis (financeiro, notas).
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(encodedKey)
}

/**
 * Verifica e decodifica o JWT.
 * Retorna null se inválido ou expirado.
 */
export async function decrypt(
  session: string | undefined = ''
): Promise<SessionPayload | null> {
  if (!session) return null
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/**
 * Cria uma sessão e define o cookie httpOnly.
 */
export async function createSession(payload: Omit<SessionPayload, 'expiresAt'>): Promise<void> {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const token = await encrypt({ ...payload, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Renova a expiração do cookie sem recriar o token.
 */
export async function updateSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const payload = await decrypt(token)

  if (!payload) return

  const newExpires = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const newToken = await encrypt({ ...payload, expiresAt: newExpires })

  cookieStore.set(SESSION_COOKIE, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: newExpires,
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Encerra a sessão deletando o cookie.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

/**
 * Retorna o payload da sessão atual, ou null se não autenticado.
 * Uso em Server Components e Route Handlers.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return decrypt(token)
}
