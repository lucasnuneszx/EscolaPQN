'use server'
// ─────────────────────────────────────────────────────────────
// Server Actions — Mural de Comunicados
// ─────────────────────────────────────────────────────────────
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

// ─── Esquema de validação ────────────────────────────────────

const ComunicadoSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(3, { message: 'O título deve ter ao menos 3 caracteres.' })
      .max(200, { message: 'O título deve ter no máximo 200 caracteres.' }),
    conteudo: z
      .string()
      .trim()
      .min(5, { message: 'O conteúdo deve ter ao menos 5 caracteres.' }),
    tipo: z.enum(['GERAL', 'TURMA', 'INDIVIDUAL'], {
      message: 'Selecione um tipo de comunicado válido.',
    }),
    fixado: z.coerce.boolean().default(false),
    publicadoEm: z.string().min(1, { message: 'Informe a data de publicação.' }),
    expiracaoEm: z.string().optional(),
    turmaIds: z.array(z.string()).default([]),
  })
  .refine((d) => d.tipo !== 'TURMA' || d.turmaIds.length > 0, {
    message: 'Selecione ao menos uma turma para comunicados do tipo Turma.',
    path: ['turmaIds'],
  })

export type ComunicadoState =
  | {
      errors?: Record<string, string[]>
      message?: string
      success?: boolean
    }
  | undefined

function extrairDados(formData: FormData) {
  return {
    titulo: formData.get('titulo'),
    conteudo: formData.get('conteudo'),
    tipo: formData.get('tipo'),
    fixado: formData.get('fixado') === 'on' || formData.get('fixado') === 'true',
    publicadoEm: formData.get('publicadoEm'),
    expiracaoEm: formData.get('expiracaoEm') || undefined,
    turmaIds: formData.getAll('turmaIds').map(String),
  }
}

// ─── Criar ────────────────────────────────────────────────────

export async function criarComunicado(
  prevState: ComunicadoState,
  formData: FormData
): Promise<ComunicadoState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'comunicados:criar')) {
    return { message: 'Você não tem permissão para criar comunicados.' }
  }

  const validated = ComunicadoSchema.safeParse(extrairDados(formData))
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { titulo, conteudo, tipo, fixado, publicadoEm, expiracaoEm, turmaIds } =
    validated.data

  const anoLetivoAtivo = await prisma.anoLetivo.findFirst({ where: { ativo: true } })

  let comunicadoId: string
  try {
    const comunicado = await prisma.comunicado.create({
      data: {
        titulo,
        conteudo,
        tipo,
        fixado,
        publicadoEm: new Date(publicadoEm),
        expiracaoEm: expiracaoEm ? new Date(expiracaoEm) : null,
        autorId: sessao.userId,
        anoLetivoId: anoLetivoAtivo?.id,
        ...(tipo === 'TURMA' && turmaIds.length > 0
          ? { turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) } }
          : {}),
      },
    })
    comunicadoId = comunicado.id
  } catch {
    return { message: 'Erro ao criar o comunicado. Tente novamente.' }
  }

  await registrarAuditoria({
    tipo: 'COMUNICADO_CRIADO',
    descricao: `Comunicado "${titulo}" foi publicado no mural.`,
    entidade: 'Comunicado',
    entidadeId: comunicadoId,
    usuarioId: sessao.userId,
    dadosDepois: validated.data,
  })

  revalidatePath('/admin/comunicados')
  redirect('/admin/comunicados')
}

// ─── Atualizar ────────────────────────────────────────────────

export async function atualizarComunicado(
  id: string,
  prevState: ComunicadoState,
  formData: FormData
): Promise<ComunicadoState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'comunicados:criar')) {
    return { message: 'Você não tem permissão para editar comunicados.' }
  }

  const comunicadoAtual = await prisma.comunicado.findUnique({ where: { id } })
  if (!comunicadoAtual) {
    return { message: 'Comunicado não encontrado.' }
  }

  const validated = ComunicadoSchema.safeParse(extrairDados(formData))
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { titulo, conteudo, tipo, fixado, publicadoEm, expiracaoEm, turmaIds } =
    validated.data

  try {
    await prisma.comunicadoTurma.deleteMany({ where: { comunicadoId: id } })
    await prisma.comunicado.update({
      where: { id },
      data: {
        titulo,
        conteudo,
        tipo,
        fixado,
        publicadoEm: new Date(publicadoEm),
        expiracaoEm: expiracaoEm ? new Date(expiracaoEm) : null,
        ...(tipo === 'TURMA' && turmaIds.length > 0
          ? { turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) } }
          : {}),
      },
    })
  } catch {
    return { message: 'Erro ao atualizar o comunicado. Tente novamente.' }
  }

  await registrarAuditoria({
    tipo: 'COMUNICADO_ATUALIZADO',
    descricao: `Comunicado "${titulo}" foi atualizado.`,
    entidade: 'Comunicado',
    entidadeId: id,
    usuarioId: sessao.userId,
    dadosAntes: comunicadoAtual,
    dadosDepois: validated.data,
  })

  revalidatePath('/admin/comunicados')
  redirect('/admin/comunicados')
}

// ─── Excluir ──────────────────────────────────────────────────

export async function excluirComunicado(id: string, _formData: FormData): Promise<void> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'comunicados:criar')) {
    return
  }

  const comunicado = await prisma.comunicado.findUnique({ where: { id } })
  if (!comunicado) return

  await prisma.comunicadoTurma.deleteMany({ where: { comunicadoId: id } })
  await prisma.anexoComunicado.deleteMany({ where: { comunicadoId: id } })
  await prisma.comunicado.delete({ where: { id } })

  await registrarAuditoria({
    tipo: 'COMUNICADO_EXCLUIDO',
    descricao: `Comunicado "${comunicado.titulo}" foi removido do mural.`,
    entidade: 'Comunicado',
    entidadeId: id,
    usuarioId: sessao.userId,
    dadosAntes: comunicado,
  })


  revalidatePath('/admin/comunicados')
}
