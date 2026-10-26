'use server'
// Server Actions de interesse de matrícula e agendamento de visita
// (site público — não requer autenticação)
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { registrarAuditoria } from '@/lib/audit'

const InteresseMatriculaSchema = z.object({
  nomeResponsavel: z.string().trim().min(2, { message: 'Informe o nome completo do responsável.' }),
  emailResponsavel: z.string().email({ message: 'E-mail inválido.' }).trim().toLowerCase(),
  telefone: z.string().trim().min(8, { message: 'Informe um telefone válido com DDD.' }),
  nomeAluno: z.string().trim().min(2, { message: 'Informe o nome completo da criança.' }),
  idadeAluno: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 0 && v <= 18), {
      message: 'Informe uma idade válida.',
    }),
  serieInteresse: z.string().trim().optional(),
  turnoPreferido: z.string().trim().optional(),
  mensagem: z.string().trim().optional(),
})

export type MatriculaState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

/**
 * Registra o interesse de matrícula enviado pelo site público.
 */
export async function submeterInteresseMatricula(
  prevState: MatriculaState,
  formData: FormData
): Promise<MatriculaState> {
  const validated = InteresseMatriculaSchema.safeParse({
    nomeResponsavel: formData.get('nomeResponsavel'),
    emailResponsavel: formData.get('emailResponsavel'),
    telefone: formData.get('telefone'),
    nomeAluno: formData.get('nomeAluno'),
    idadeAluno: formData.get('idadeAluno'),
    serieInteresse: formData.get('serieInteresse'),
    turnoPreferido: formData.get('turnoPreferido'),
    mensagem: formData.get('mensagem'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { nomeResponsavel, emailResponsavel, telefone, nomeAluno, idadeAluno, serieInteresse, turnoPreferido, mensagem } =
    validated.data

  const formulario = await prisma.formularioMatricula.create({
    data: {
      tipo: 'MATRICULA',
      nomeResponsavel,
      emailResponsavel,
      telefone,
      nomeAluno,
      idadeAluno,
      serieInteresse: serieInteresse || undefined,
      turnoPreferido: turnoPreferido || undefined,
      mensagem: mensagem || undefined,
      status: 'NOVO',
      lido: false,
    },
  })

  await registrarAuditoria({
    tipo: 'MATRICULA_INTERESSE_RECEBIDO',
    descricao: `Interesse de matrícula recebido para ${nomeAluno}, enviado por ${nomeResponsavel} (${emailResponsavel})`,
    entidade: 'FormularioMatricula',
    entidadeId: formulario.id,
    dadosDepois: formulario,
  })

  return {
    success: true,
    message:
      'Recebemos seu interesse de matrícula! Nossa secretaria entrará em contato em breve para dar continuidade ao processo.',
  }
}

const AgendamentoVisitaSchema = z.object({
  nomeResponsavel: z.string().trim().min(2, { message: 'Informe o nome completo.' }),
  emailResponsavel: z.string().email({ message: 'E-mail inválido.' }).trim().toLowerCase(),
  telefone: z.string().trim().min(8, { message: 'Informe um telefone válido com DDD.' }),
  nomeAluno: z.string().trim().min(2, { message: 'Informe o nome da criança.' }),
  diaPreferido: z.string().trim().optional(),
  turnoPreferido: z.string().trim().optional(),
  mensagem: z.string().trim().optional(),
})

/**
 * Registra a solicitação de agendamento de visita à escola.
 * Reaproveita o modelo FormularioMatricula, prefixando a mensagem.
 */
export async function solicitarAgendamentoVisita(
  prevState: MatriculaState,
  formData: FormData
): Promise<MatriculaState> {
  const validated = AgendamentoVisitaSchema.safeParse({
    nomeResponsavel: formData.get('nomeResponsavel'),
    emailResponsavel: formData.get('emailResponsavel'),
    telefone: formData.get('telefone'),
    nomeAluno: formData.get('nomeAluno'),
    diaPreferido: formData.get('diaPreferido'),
    turnoPreferido: formData.get('turnoPreferido'),
    mensagem: formData.get('mensagem'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { nomeResponsavel, emailResponsavel, telefone, nomeAluno, diaPreferido, turnoPreferido, mensagem } =
    validated.data

  const mensagemCompleta = [
    'Interesse: agendar visita.',
    diaPreferido ? `Dia preferido: ${diaPreferido}.` : null,
    mensagem ? `Observações: ${mensagem}` : null,
  ]
    .filter(Boolean)
    .join(' ')

  const formulario = await prisma.formularioMatricula.create({
    data: {
      tipo: 'VISITA',
      nomeResponsavel,
      emailResponsavel,
      telefone,
      nomeAluno,
      turnoPreferido: turnoPreferido || undefined,
      mensagem: mensagemCompleta,
      status: 'NOVO',
      lido: false,
    },
  })

  await registrarAuditoria({
    tipo: 'MATRICULA_INTERESSE_RECEBIDO',
    descricao: `Agendamento de visita solicitado por ${nomeResponsavel} (${emailResponsavel}) para conhecer a escola com ${nomeAluno}`,
    entidade: 'FormularioMatricula',
    entidadeId: formulario.id,
    dadosDepois: formulario,
  })

  return {
    success: true,
    message: 'Solicitação de visita recebida! Entraremos em contato para confirmar o melhor horário.',
  }
}
