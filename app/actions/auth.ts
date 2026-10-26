'use server'
// Server Actions de autenticação
// Login, logout, recuperação de senha
import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import {
  createSession,
  deleteSession,
  getSession,
  type PerfilUsuario,
} from '@/lib/session'
import { getRedirectUrlPorPerfil } from '@/lib/rbac'

// Esquemas de validação

const LoginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }).trim().toLowerCase(),
  password: z.string().min(1, { message: 'Senha obrigatória.' }),
})

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }).trim().toLowerCase(),
})

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não coincidem.',
  path: ['confirmPassword'],
})

// Tipos de estado

export type AuthState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

// Ações

/**
 * Login — valida credenciais, cria sessão e redireciona por perfil.
 */
export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password } = validated.data

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      senhaHash: true,
      ativo: true,
    },
  })

  if (!usuario || !usuario.ativo) {
    return { message: 'E-mail ou senha inválidos.' }
  }

  const senhaValida = await bcrypt.compare(password, usuario.senhaHash)
  if (!senhaValida) {
    return { message: 'E-mail ou senha inválidos.' }
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { ultimoAcesso: new Date() },
  })

  await createSession({
    userId: usuario.id,
    perfil: usuario.perfil as PerfilUsuario,
    nome: usuario.nome,
    email: usuario.email,
  })

  redirect(getRedirectUrlPorPerfil(usuario.perfil as PerfilUsuario))
}

/**
 * Logout — remove a sessão e redireciona ao login.
 */
export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/login')
}

/**
 * Recuperação de senha — envia e-mail com link de redefinição.
 */
export async function solicitarRecuperacaoSenha(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validated = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email } = validated.data

  // Sempre retornar sucesso para não revelar se o e-mail existe (LGPD)
  const usuario = await prisma.usuario.findUnique({ where: { email } })

  if (usuario) {
    const token = crypto.randomUUID()
    const expiracao = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { resetToken: token, resetTokenExp: expiracao },
    })

    // TODO: enviar o link por e-mail (Resend)
    console.log(`Link de redefinição: ${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha?token=${token}`)
  }

  return {
    success: true,
    message: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.',
  }
}

/**
 * Redefinição de senha — valida token e atualiza senha com hash bcrypt.
 */
export async function redefinirSenha(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validated = ResetPasswordSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { token, password } = validated.data

  const usuario = await prisma.usuario.findFirst({
    where: {
      resetToken: token,
      resetTokenExp: { gt: new Date() },
    },
  })

  if (!usuario) {
    return { message: 'Link de redefinição inválido ou expirado.' }
  }

  const senhaHash = await bcrypt.hash(password, 12)

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      senhaHash,
      resetToken: null,
      resetTokenExp: null,
    },
  })

  return {
    success: true,
    message: 'Senha redefinida com sucesso. Você já pode fazer login.',
  }
}

/**
 * Retorna a sessão atual (para uso em Server Components).
 */
export async function obterSessao() {
  return getSession()
}
