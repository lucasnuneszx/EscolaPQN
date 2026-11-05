'use server'
// Server Actions de Responsáveis
// Criar, atualizar, excluir e desvincular de alunos
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

// Utilitários

function textoOpcional(v: FormDataEntryValue | null): string | undefined {
  const s = typeof v === 'string' ? v.trim() : ''
  return s.length > 0 ? s : undefined
}

function boolCheckbox(v: FormDataEntryValue | null): boolean {
  return v === 'on' || v === 'true' || v === '1'
}

const SENHA_MINIMA = 6

function mensagemErroPrisma(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return 'Já existe um cadastro com este CPF/e-mail.'
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

// Esquemas de validação

const ResponsavelBaseSchema = z.object({
  nome: z.string().trim().min(2, { message: 'Informe o nome completo do responsável.' }),
  cpf: z.string().trim().optional(),
  rg: z.string().trim().optional(),
  email: z.string().trim().optional(),
  telefone: z.string().trim().min(8, { message: 'Informe um telefone válido com DDD.' }),
  whatsapp: z.string().trim().optional(),
  parentesco: z.string().trim().min(1, { message: 'Informe o parentesco (ex.: Mãe, Pai, Tutor).' }),
  endereco: z.string().trim().optional(),
  responsavelFinanceiro: z.boolean().optional(),
  responsavelPedagogico: z.boolean().optional(),
  consentimentoImagem: z.boolean().optional(),
  consentimentoLGPD: z.boolean().optional(),
  criarAcessoPortal: z.boolean().optional(),
  senha: z.string().optional(),
})

const AtualizarResponsavelSchema = ResponsavelBaseSchema.extend({
  id: z.string().trim().min(1),
})

export type ResponsavelState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

// Ações

/**
 * Cria um novo responsável. Se `criarAcessoPortal` for marcado e um e-mail
 * válido for informado, cria também um Usuario com perfil RESPONSAVEL e
 * uma senha temporária gerada pelo servidor (ver gerarSenhaTemporaria).
 */
export async function criarResponsavel(
  prevState: ResponsavelState,
  formData: FormData
): Promise<ResponsavelState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'alunos:criar')) {
    return { message: 'Você não tem permissão para cadastrar responsáveis.' }
  }

  const validated = ResponsavelBaseSchema.safeParse({
    nome: formData.get('nome'),
    cpf: textoOpcional(formData.get('cpf')),
    rg: textoOpcional(formData.get('rg')),
    email: textoOpcional(formData.get('email')),
    telefone: formData.get('telefone'),
    whatsapp: textoOpcional(formData.get('whatsapp')),
    parentesco: formData.get('parentesco'),
    endereco: textoOpcional(formData.get('endereco')),
    responsavelFinanceiro: boolCheckbox(formData.get('responsavelFinanceiro')),
    responsavelPedagogico: boolCheckbox(formData.get('responsavelPedagogico')) || true,
    consentimentoImagem: boolCheckbox(formData.get('consentimentoImagem')),
    consentimentoLGPD: boolCheckbox(formData.get('consentimentoLGPD')),
    criarAcessoPortal: boolCheckbox(formData.get('criarAcessoPortal')),
    senha: textoOpcional(formData.get('senha')),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const data = validated.data

  if (data.criarAcessoPortal && !data.email) {
    return { message: 'Para criar o login da área dos pais é necessário informar um e-mail válido.' }
  }
  if (data.criarAcessoPortal && (!data.senha || data.senha.length < SENHA_MINIMA)) {
    return { errors: { senha: [`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`] }, message: 'Verifique os campos destacados.' }
  }

  try {
    const novoResponsavel = await prisma.$transaction(async (tx) => {
      let usuarioId: string | undefined

      if (data.criarAcessoPortal && data.email && data.senha) {
        const senhaHash = await bcrypt.hash(data.senha, 12)
        const usuario = await tx.usuario.create({
          data: {
            nome: data.nome,
            email: data.email,
            senhaHash,
            perfil: 'RESPONSAVEL',
            telefone: data.telefone,
          },
        })
        usuarioId = usuario.id
      }

      return tx.responsavel.create({
        data: {
          nome: data.nome,
          cpf: data.cpf,
          rg: data.rg,
          email: data.email,
          telefone: data.telefone,
          whatsapp: data.whatsapp,
          parentesco: data.parentesco,
          endereco: data.endereco,
          responsavelFinanceiro: data.responsavelFinanceiro ?? false,
          responsavelPedagogico: data.responsavelPedagogico ?? true,
          consentimentoImagem: data.consentimentoImagem ?? false,
          consentimentoLGPD: data.consentimentoLGPD ?? false,
          consentimentoDataHora: data.consentimentoLGPD ? new Date() : undefined,
          usuarioId,
        },
      })
    })

    await registrarAuditoria({
      tipo: 'RESPONSAVEL_CRIADO',
      descricao: `Responsável "${novoResponsavel.nome}" cadastrado${data.criarAcessoPortal ? ' com acesso à área dos pais' : ''}.`,
      entidade: 'Responsavel',
      entidadeId: novoResponsavel.id,
      usuarioId: sessao.userId,
      dadosDepois: novoResponsavel,
    })
  } catch (error) {
    return { message: mensagemErroPrisma(error) }
  }

  revalidatePath('/admin/responsaveis')
  redirect('/admin/responsaveis')
}

/**
 * Atualiza os dados cadastrais de um responsável já existente.
 */
export async function atualizarResponsavel(
  prevState: ResponsavelState,
  formData: FormData
): Promise<ResponsavelState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'alunos:editar')) {
    return { message: 'Você não tem permissão para editar responsáveis.' }
  }

  const validated = AtualizarResponsavelSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    cpf: textoOpcional(formData.get('cpf')),
    rg: textoOpcional(formData.get('rg')),
    email: textoOpcional(formData.get('email')),
    telefone: formData.get('telefone'),
    whatsapp: textoOpcional(formData.get('whatsapp')),
    parentesco: formData.get('parentesco'),
    endereco: textoOpcional(formData.get('endereco')),
    responsavelFinanceiro: boolCheckbox(formData.get('responsavelFinanceiro')),
    responsavelPedagogico: boolCheckbox(formData.get('responsavelPedagogico')),
    consentimentoImagem: boolCheckbox(formData.get('consentimentoImagem')),
    consentimentoLGPD: boolCheckbox(formData.get('consentimentoLGPD')),
    criarAcessoPortal: boolCheckbox(formData.get('criarAcessoPortal')),
    senha: textoOpcional(formData.get('senha')),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const { id, senha, criarAcessoPortal, ...resto } = validated.data

  if (senha && senha.length < SENHA_MINIMA) {
    return { errors: { senha: [`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`] }, message: 'Verifique os campos destacados.' }
  }

  try {
    const antes = await prisma.responsavel.findUnique({ where: { id } })
    if (!antes) {
      return { message: 'Responsável não encontrado.' }
    }

    if (!antes.usuarioId && criarAcessoPortal) {
      if (!resto.email) {
        return { message: 'Para criar o login da área dos pais é necessário informar um e-mail válido.' }
      }
      if (!senha) {
        return { errors: { senha: ['Defina a senha de acesso.'] }, message: 'Verifique os campos destacados.' }
      }
    }

    const depois = await prisma.$transaction(async (tx) => {
      let usuarioId = antes.usuarioId

      if (usuarioId) {
        await tx.usuario.update({
          where: { id: usuarioId },
          data: {
            nome: resto.nome,
            telefone: resto.telefone,
            ...(resto.email ? { email: resto.email } : {}),
            ...(senha ? { senhaHash: await bcrypt.hash(senha, 12) } : {}),
          },
        })
      } else if (criarAcessoPortal && resto.email && senha) {
        const usuario = await tx.usuario.create({
          data: {
            nome: resto.nome,
            email: resto.email,
            senhaHash: await bcrypt.hash(senha, 12),
            perfil: 'RESPONSAVEL',
            telefone: resto.telefone,
          },
        })
        usuarioId = usuario.id
      }

      return tx.responsavel.update({
        where: { id },
        data: {
          usuarioId,
          nome: resto.nome,
          cpf: resto.cpf,
          rg: resto.rg,
          email: resto.email,
          telefone: resto.telefone,
          whatsapp: resto.whatsapp,
          parentesco: resto.parentesco,
          endereco: resto.endereco,
          responsavelFinanceiro: resto.responsavelFinanceiro ?? false,
          responsavelPedagogico: resto.responsavelPedagogico ?? false,
          consentimentoImagem: resto.consentimentoImagem ?? false,
          consentimentoLGPD: resto.consentimentoLGPD ?? false,
          consentimentoDataHora: resto.consentimentoLGPD && !antes.consentimentoLGPD ? new Date() : undefined,
        },
      })
    })

    await registrarAuditoria({
      tipo: 'RESPONSAVEL_ATUALIZADO',
      descricao: `Responsável "${depois.nome}" atualizado${!antes.usuarioId && depois.usuarioId ? ' (login da área dos pais criado)' : senha ? ' (senha de acesso redefinida)' : ''}.`,
      entidade: 'Responsavel',
      entidadeId: id,
      usuarioId: sessao.userId,
      dadosAntes: antes,
      dadosDepois: depois,
    })
  } catch (error) {
    return { message: mensagemErroPrisma(error) }
  }

  revalidatePath('/admin/responsaveis')
  redirect('/admin/responsaveis')
}

/**
 * Exclui um responsável — bloqueado se houver vínculos com alunos ou
 * mensalidades associadas (não faz cascade).
 */
export async function excluirResponsavel(
  responsavelId: string
): Promise<{ success: boolean; message: string }> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'alunos:excluir')) {
    return { success: false, message: 'Você não tem permissão para excluir responsáveis.' }
  }

  const responsavel = await prisma.responsavel.findUnique({
    where: { id: responsavelId },
    include: {
      _count: { select: { vinculos: true, mensalidades: true } },
    },
  })

  if (!responsavel) {
    return { success: false, message: 'Responsável não encontrado.' }
  }

  if (responsavel._count.vinculos > 0 || responsavel._count.mensalidades > 0) {
    return {
      success: false,
      message: 'Não é possível excluir: este responsável possui alunos vinculados ou mensalidades associadas. Desvincule os alunos antes de excluir.',
    }
  }

  await prisma.responsavel.delete({ where: { id: responsavelId } })

  await registrarAuditoria({
    tipo: 'RESPONSAVEL_EXCLUIDO',
    descricao: `Responsável "${responsavel.nome}" excluído.`,
    entidade: 'Responsavel',
    entidadeId: responsavelId,
    usuarioId: sessao.userId,
    dadosAntes: responsavel,
  })

  revalidatePath('/admin/responsaveis')
  return { success: true, message: 'Responsável excluído com sucesso.' }
}

/**
 * Remove o vínculo entre um responsável e um aluno (não exclui nenhum dos dois).
 */
export async function desvincularResponsavel(
  vinculoId: string
): Promise<{ success: boolean; message: string }> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'alunos:editar')) {
    return { success: false, message: 'Você não tem permissão para desvincular responsáveis.' }
  }

  const vinculo = await prisma.alunoResponsavel.findUnique({
    where: { id: vinculoId },
    include: { aluno: true, responsavel: true },
  })

  if (!vinculo) {
    return { success: false, message: 'Vínculo não encontrado.' }
  }

  await prisma.alunoResponsavel.delete({ where: { id: vinculoId } })

  await registrarAuditoria({
    tipo: 'ALUNO_RESPONSAVEL_DESVINCULADO',
    descricao: `Vínculo entre "${vinculo.responsavel.nome}" e "${vinculo.aluno.nome}" removido.`,
    entidade: 'AlunoResponsavel',
    entidadeId: vinculoId,
    usuarioId: sessao.userId,
    dadosAntes: vinculo,
  })

  revalidatePath(`/admin/responsaveis/${vinculo.responsavelId}`)
  return { success: true, message: 'Vínculo removido com sucesso.' }
}
