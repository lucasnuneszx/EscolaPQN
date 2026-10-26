'use server'
// Server Actions — Estrutura Acadêmica (séries, disciplinas, notas)
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { isAdminOuSecretaria, temPermissao } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

// Série

const SerieSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, { message: 'O nome deve ter ao menos 2 caracteres.' })
    .max(100),
  codigo: z
    .string()
    .trim()
    .min(1, { message: 'Informe um código.' })
    .max(30),
  nivel: z.enum(['educacao_infantil', 'ensino_fundamental'], {
    message: 'Selecione um nível válido.',
  }),
  ordem: z.coerce.number().int().min(0, { message: 'A ordem deve ser um número positivo.' }),
})

export type SerieState =
  | { errors?: Record<string, string[]>; message?: string; success?: boolean }
  | undefined

export async function criarSerie(
  prevState: SerieState,
  formData: FormData
): Promise<SerieState> {
  const sessao = await getSession()
  if (!sessao || !isAdminOuSecretaria(sessao.perfil)) {
    return { message: 'Você não tem permissão para cadastrar séries.' }
  }

  const validated = SerieSchema.safeParse({
    nome: formData.get('nome'),
    codigo: formData.get('codigo'),
    nivel: formData.get('nivel'),
    ordem: formData.get('ordem'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { nome, codigo, nivel, ordem } = validated.data

  let serieId: string
  try {
    const serie = await prisma.serie.create({ data: { nome, codigo, nivel, ordem } })
    serieId = serie.id
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2002') {
      return { errors: { codigo: ['Já existe uma série cadastrada com este código.'] } }
    }
    return { message: 'Erro ao cadastrar a série. Tente novamente.' }
  }

  await registrarAuditoria({
    tipo: 'SERIE_CRIADA',
    descricao: `Série "${nome}" foi cadastrada.`,
    entidade: 'Serie',
    entidadeId: serieId,
    usuarioId: sessao.userId,
    dadosDepois: validated.data,
  })

  revalidatePath('/admin/academico')
  redirect('/admin/academico')
}

// Disciplina

const DisciplinaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, { message: 'O nome deve ter ao menos 2 caracteres.' })
    .max(100),
  codigo: z
    .string()
    .trim()
    .min(1, { message: 'Informe um código.' })
    .max(30),
  cargaHoraria: z.coerce.number().int().positive().optional(),
})

export type DisciplinaState =
  | { errors?: Record<string, string[]>; message?: string; success?: boolean }
  | undefined

export async function criarDisciplina(
  prevState: DisciplinaState,
  formData: FormData
): Promise<DisciplinaState> {
  const sessao = await getSession()
  if (!sessao || !isAdminOuSecretaria(sessao.perfil)) {
    return { message: 'Você não tem permissão para cadastrar disciplinas.' }
  }

  const cargaHorariaRaw = formData.get('cargaHoraria')
  const validated = DisciplinaSchema.safeParse({
    nome: formData.get('nome'),
    codigo: formData.get('codigo'),
    cargaHoraria: cargaHorariaRaw ? cargaHorariaRaw : undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { nome, codigo, cargaHoraria } = validated.data

  let disciplinaId: string
  try {
    const disciplina = await prisma.disciplina.create({
      data: { nome, codigo, cargaHoraria },
    })
    disciplinaId = disciplina.id
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2002') {
      return { errors: { codigo: ['Já existe uma disciplina cadastrada com este código.'] } }
    }
    return { message: 'Erro ao cadastrar a disciplina. Tente novamente.' }
  }

  await registrarAuditoria({
    tipo: 'DISCIPLINA_CRIADA',
    descricao: `Disciplina "${nome}" foi cadastrada.`,
    entidade: 'Disciplina',
    entidadeId: disciplinaId,
    usuarioId: sessao.userId,
    dadosDepois: validated.data,
  })

  revalidatePath('/admin/academico')
  redirect('/admin/academico')
}

// Lançamento de notas em lote

export type LancamentoNotasResult = {
  success?: boolean
  message?: string
}

export async function lancarNotasEmLote(
  turmaDisciplinaId: string,
  periodoId: string,
  notas: { alunoId: string; valor: number | null }[]
): Promise<LancamentoNotasResult> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'notas:lancar')) {
    return { message: 'Você não tem permissão para lançar notas.' }
  }

  const turmaDisciplina = await prisma.turmaDisciplina.findUnique({
    where: { id: turmaDisciplinaId },
  })
  const periodo = await prisma.periodoAvaliativo.findUnique({ where: { id: periodoId } })

  if (!turmaDisciplina || !periodo) {
    return { message: 'Turma/disciplina ou período avaliativo inválido.' }
  }

  const professor =
    sessao.perfil === 'PROFESSOR'
      ? await prisma.professor.findUnique({ where: { usuarioId: sessao.userId } })
      : null

  const valorMaximo = 10.0
  let atualizados = 0

  for (const item of notas) {
    if (item.valor === null || Number.isNaN(item.valor)) continue

    const valorClampeado = Math.min(Math.max(item.valor, 0), valorMaximo)

    await prisma.nota.upsert({
      where: {
        alunoId_turmaDisciplinaId_periodoId: {
          alunoId: item.alunoId,
          turmaDisciplinaId,
          periodoId,
        },
      },
      update: {
        valor: valorClampeado,
        professorId: professor?.id,
      },
      create: {
        alunoId: item.alunoId,
        turmaDisciplinaId,
        periodoId,
        valor: valorClampeado,
        valorMaximo,
        professorId: professor?.id,
      },
    })
    atualizados += 1
  }

  await registrarAuditoria({
    tipo: 'NOTAS_LANCADAS',
    descricao: `${atualizados} nota(s) lançada(s) para a turma/disciplina no período "${periodo.nome}".`,
    entidade: 'Nota',
    entidadeId: turmaDisciplinaId,
    usuarioId: sessao.userId,
    dadosDepois: { turmaDisciplinaId, periodoId, notas },
  })

  revalidatePath('/admin/academico/notas')

  return { success: true, message: `${atualizados} nota(s) salva(s) com sucesso.` }
}
