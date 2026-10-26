'use server'
// ─────────────────────────────────────────────────────────────
// Server Actions de Professores
// Criar (Usuario + Professor) e atualizar
// ─────────────────────────────────────────────────────────────
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

function textoOpcional(v: FormDataEntryValue | null): string | undefined {
  const s = typeof v === 'string' ? v.trim() : ''
  return s.length > 0 ? s : undefined
}

function mensagemErroPrisma(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return 'Já existe um cadastro com este CPF/e-mail.'
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

/**
 * Gera uma senha temporária simples para o primeiro acesso do professor ao portal.
 * Mesmo critério usado para responsáveis: prefixo fixo "Trocar@" + 4 dígitos
 * aleatórios (ex.: Trocar@4821). O professor deve trocá-la no primeiro acesso.
 */
function gerarSenhaTemporaria(): string {
  const digitos = Math.floor(1000 + Math.random() * 9000)
  return `Trocar@${digitos}`
}

const ProfessorBaseSchema = z.object({
  nome: z.string().trim().min(2, { message: 'Informe o nome completo do professor.' }),
  email: z.string().trim().email({ message: 'E-mail inválido.' }).toLowerCase(),
  telefone: z.string().trim().optional(),
  cpf: z.string().trim().optional(),
  formacao: z.string().trim().optional(),
  registro: z.string().trim().optional(),
  observacoes: z.string().trim().optional(),
})

const AtualizarProfessorSchema = ProfessorBaseSchema.extend({
  id: z.string().trim().min(1),
})

export type ProfessorState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

/**
 * Cria um novo professor: um Usuario com perfil PROFESSOR (com senha
 * temporária) e o registro Professor vinculado, na mesma transação.
 */
export async function criarProfessor(
  prevState: ProfessorState,
  formData: FormData
): Promise<ProfessorState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'turmas:criar')) {
    return { message: 'Você não tem permissão para cadastrar professores.' }
  }

  const validated = ProfessorBaseSchema.safeParse({
    nome: formData.get('nome'),
    email: formData.get('email'),
    telefone: textoOpcional(formData.get('telefone')),
    cpf: textoOpcional(formData.get('cpf')),
    formacao: textoOpcional(formData.get('formacao')),
    registro: textoOpcional(formData.get('registro')),
    observacoes: textoOpcional(formData.get('observacoes')),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const data = validated.data
  const senhaTemporaria = gerarSenhaTemporaria()

  try {
    const professor = await prisma.$transaction(async (tx) => {
      const senhaHash = await bcrypt.hash(senhaTemporaria, 12)
      const usuario = await tx.usuario.create({
        data: {
          nome: data.nome,
          email: data.email,
          senhaHash,
          perfil: 'PROFESSOR',
          telefone: data.telefone,
        },
      })

      return tx.professor.create({
        data: {
          usuarioId: usuario.id,
          cpf: data.cpf,
          formacao: data.formacao,
          registro: data.registro,
          observacoes: data.observacoes,
        },
        include: { usuario: true },
      })
    })

    await registrarAuditoria({
      tipo: 'PROFESSOR_CRIADO',
      descricao: `Professor "${professor.usuario.nome}" cadastrado com acesso ao portal (senha temporária gerada).`,
      entidade: 'Professor',
      entidadeId: professor.id,
      usuarioId: sessao.userId,
      dadosDepois: { id: professor.id, nome: professor.usuario.nome, email: professor.usuario.email },
    })
  } catch (error) {
    return { message: mensagemErroPrisma(error) }
  }

  revalidatePath('/admin/professores')
  redirect('/admin/professores')
}

/**
 * Atualiza os dados cadastrais de um professor (e do seu usuário vinculado).
 */
export async function atualizarProfessor(
  prevState: ProfessorState,
  formData: FormData
): Promise<ProfessorState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'turmas:editar')) {
    return { message: 'Você não tem permissão para editar professores.' }
  }

  const validated = AtualizarProfessorSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    email: formData.get('email'),
    telefone: textoOpcional(formData.get('telefone')),
    cpf: textoOpcional(formData.get('cpf')),
    formacao: textoOpcional(formData.get('formacao')),
    registro: textoOpcional(formData.get('registro')),
    observacoes: textoOpcional(formData.get('observacoes')),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const { id, ...resto } = validated.data

  try {
    const antes = await prisma.professor.findUnique({ where: { id }, include: { usuario: true } })
    if (!antes) {
      return { message: 'Professor não encontrado.' }
    }

    const depois = await prisma.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id: antes.usuarioId },
        data: {
          nome: resto.nome,
          email: resto.email,
          telefone: resto.telefone,
        },
      })

      return tx.professor.update({
        where: { id },
        data: {
          cpf: resto.cpf,
          formacao: resto.formacao,
          registro: resto.registro,
          observacoes: resto.observacoes,
        },
        include: { usuario: true },
      })
    })

    await registrarAuditoria({
      tipo: 'PROFESSOR_ATUALIZADO',
      descricao: `Professor "${depois.usuario.nome}" atualizado.`,
      entidade: 'Professor',
      entidadeId: id,
      usuarioId: sessao.userId,
      dadosAntes: { nome: antes.usuario.nome, email: antes.usuario.email, cpf: antes.cpf },
      dadosDepois: { nome: depois.usuario.nome, email: depois.usuario.email, cpf: depois.cpf },
    })
  } catch (error) {
    return { message: mensagemErroPrisma(error) }
  }

  revalidatePath('/admin/professores')
  redirect('/admin/professores')
}
