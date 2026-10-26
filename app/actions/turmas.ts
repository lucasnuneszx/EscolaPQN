'use server'
// Server Actions de Turmas
// Criar, atualizar e vincular disciplina/professor
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
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
    return 'Já existe um cadastro com estes dados (verifique nome/turno/vínculo duplicado).'
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

const TurnoEnum = z.enum(['MANHA', 'TARDE', 'INTEGRAL', 'NOTURNO'])

const TurmaBaseSchema = z.object({
  nome: z.string().trim().min(1, { message: 'Informe o nome da turma.' }),
  turno: TurnoEnum,
  capacidade: z
    .string()
    .trim()
    .min(1, { message: 'Informe a capacidade da turma.' })
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v > 0, { message: 'Capacidade deve ser um número inteiro positivo.' }),
  sala: z.string().trim().optional(),
  serieId: z.string().trim().min(1, { message: 'Selecione a série.' }),
})

const AtualizarTurmaSchema = TurmaBaseSchema.extend({
  id: z.string().trim().min(1),
})

export type TurmaState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

/**
 * Cria uma nova turma vinculada ao ano letivo ativo.
 */
export async function criarTurma(
  prevState: TurmaState,
  formData: FormData
): Promise<TurmaState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'turmas:criar')) {
    return { message: 'Você não tem permissão para criar turmas.' }
  }

  const validated = TurmaBaseSchema.safeParse({
    nome: formData.get('nome'),
    turno: formData.get('turno'),
    capacidade: formData.get('capacidade'),
    sala: textoOpcional(formData.get('sala')),
    serieId: formData.get('serieId'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const anoLetivo = await prisma.anoLetivo.findFirst({ where: { ativo: true } })
  if (!anoLetivo) {
    return { message: 'Nenhum ano letivo ativo foi encontrado. Configure um ano letivo antes de criar turmas.' }
  }

  const data = validated.data

  try {
    const turma = await prisma.turma.create({
      data: {
        nome: data.nome,
        turno: data.turno,
        capacidade: data.capacidade,
        sala: data.sala,
        serieId: data.serieId,
        anoLetivoId: anoLetivo.id,
      },
    })

    await registrarAuditoria({
      tipo: 'TURMA_CRIADA',
      descricao: `Turma "${turma.nome}" criada.`,
      entidade: 'Turma',
      entidadeId: turma.id,
      usuarioId: sessao.userId,
      dadosDepois: turma,
    })
  } catch (error) {
    return { message: mensagemErroPrisma(error) }
  }

  revalidatePath('/admin/turmas')
  redirect('/admin/turmas')
}

/**
 * Atualiza os dados de uma turma existente.
 */
export async function atualizarTurma(
  prevState: TurmaState,
  formData: FormData
): Promise<TurmaState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'turmas:editar')) {
    return { message: 'Você não tem permissão para editar turmas.' }
  }

  const validated = AtualizarTurmaSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    turno: formData.get('turno'),
    capacidade: formData.get('capacidade'),
    sala: textoOpcional(formData.get('sala')),
    serieId: formData.get('serieId'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const { id, ...resto } = validated.data

  try {
    const antes = await prisma.turma.findUnique({ where: { id } })
    if (!antes) {
      return { message: 'Turma não encontrada.' }
    }

    const depois = await prisma.turma.update({
      where: { id },
      data: resto,
    })

    await registrarAuditoria({
      tipo: 'TURMA_ATUALIZADA',
      descricao: `Turma "${depois.nome}" atualizada.`,
      entidade: 'Turma',
      entidadeId: id,
      usuarioId: sessao.userId,
      dadosAntes: antes,
      dadosDepois: depois,
    })
  } catch (error) {
    return { message: mensagemErroPrisma(error) }
  }

  revalidatePath('/admin/turmas')
  revalidatePath(`/admin/turmas/configurar/${id}`)
  redirect(`/admin/turmas/configurar/${id}`)
}

/**
 * Cria ou atualiza o vínculo de uma disciplina (e opcionalmente um professor)
 * a uma turma.
 */
export async function vincularDisciplinaProfessor(
  prevState: TurmaState,
  formData: FormData
): Promise<TurmaState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'turmas:editar')) {
    return { message: 'Você não tem permissão para configurar disciplinas da turma.' }
  }

  const turmaId = textoOpcional(formData.get('turmaId'))
  const disciplinaId = textoOpcional(formData.get('disciplinaId'))
  const professorId = textoOpcional(formData.get('professorId'))

  if (!turmaId || !disciplinaId) {
    return { message: 'Selecione a turma e a disciplina para vincular.' }
  }

  try {
    const vinculo = await prisma.turmaDisciplina.upsert({
      where: { turmaId_disciplinaId: { turmaId, disciplinaId } },
      create: { turmaId, disciplinaId, professorId },
      update: { professorId },
    })

    await registrarAuditoria({
      tipo: 'TURMA_DISCIPLINA_VINCULADA',
      descricao: `Disciplina vinculada à turma${professorId ? ' com professor responsável' : ''}.`,
      entidade: 'TurmaDisciplina',
      entidadeId: vinculo.id,
      usuarioId: sessao.userId,
      dadosDepois: vinculo,
    })
  } catch {
    return { message: 'Ocorreu um erro ao vincular a disciplina.' }
  }

  revalidatePath(`/admin/turmas/configurar/${turmaId}`)
  return { success: true, message: 'Disciplina vinculada com sucesso.' }
}

/**
 * Remove o vínculo de uma disciplina/professor de uma turma.
 */
export async function removerVinculoDisciplina(
  turmaDisciplinaId: string
): Promise<{ success: boolean; message: string }> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'turmas:editar')) {
    return { success: false, message: 'Você não tem permissão para remover vínculos de disciplina.' }
  }

  const vinculo = await prisma.turmaDisciplina.findUnique({ where: { id: turmaDisciplinaId } })
  if (!vinculo) {
    return { success: false, message: 'Vínculo não encontrado.' }
  }

  await prisma.turmaDisciplina.delete({ where: { id: turmaDisciplinaId } })

  await registrarAuditoria({
    tipo: 'TURMA_DISCIPLINA_REMOVIDA',
    descricao: 'Vínculo de disciplina removido da turma.',
    entidade: 'TurmaDisciplina',
    entidadeId: turmaDisciplinaId,
    usuarioId: sessao.userId,
    dadosAntes: vinculo,
  })

  revalidatePath(`/admin/turmas/configurar/${vinculo.turmaId}`)
  return { success: true, message: 'Vínculo removido com sucesso.' }
}
