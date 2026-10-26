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

/**
 * Gera uma senha temporária simples para o primeiro acesso do responsável ao portal.
 * Critério: prefixo fixo "Trocar@" + 4 dígitos aleatórios (ex.: Trocar@4821).
 * O responsável deve trocá-la no primeiro acesso (fluxo de troca de senha já
 * existente em /esqueci-senha, fora do escopo desta tarefa).
 */
function gerarSenhaTemporaria(): string {
  const digitos = Math.floor(1000 + Math.random() * 9000)
  return `Trocar@${digitos}`
}

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
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const data = validated.data

  if (data.criarAcessoPortal && !data.email) {
    return { message: 'Para criar acesso ao portal é necessário informar um e-mail válido.' }
  }

  let senhaGerada: string | undefined

  try {
    const novoResponsavel = await prisma.$transaction(async (tx) => {
      let usuarioId: string | undefined

      if (data.criarAcessoPortal && data.email) {
        senhaGerada = gerarSenhaTemporaria()
        const senhaHash = await bcrypt.hash(senhaGerada, 12)
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
      descricao: `Responsável "${novoResponsavel.nome}" cadastrado${data.criarAcessoPortal ? ' com acesso ao portal' : ''}.`,
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
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const { id, ...resto } = validated.data

  try {
    const antes = await prisma.responsavel.findUnique({ where: { id } })
    if (!antes) {
      return { message: 'Responsável não encontrado.' }
    }

    const depois = await prisma.responsavel.update({
      where: { id },
      data: {
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

    await registrarAuditoria({
      tipo: 'RESPONSAVEL_ATUALIZADO',
      descricao: `Responsável "${depois.nome}" atualizado.`,
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
