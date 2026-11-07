'use server'
// Server Actions de interesse de matrícula e agendamento de visita
// (site público — não requer autenticação)
import { z } from 'zod'
import { registrarAuditoria, registrarTentativaRobo } from '@/lib/audit'
import { salvarFormulario } from '@/lib/formularios'
import { limiteExcedido, MENSAGEM_LIMITE } from '@/lib/rate-limit'
import {
  emailPublico,
  enviadoPorRobo,
  nomePessoa,
  telefonePublico,
  textoCurto,
  textoLivre,
} from '@/lib/validacao-publica'

const InteresseMatriculaSchema = z.object({
  nomeResponsavel: nomePessoa('Informe o nome completo do responsável.'),
  emailResponsavel: emailPublico,
  telefone: telefonePublico('Informe um telefone válido com DDD.'),
  nomeAluno: nomePessoa('Informe o nome completo da criança.'),
  idadeAluno: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 0 && v <= 18), {
      message: 'Informe uma idade válida.',
    }),
  serieInteresse: textoCurto,
  turnoPreferido: textoCurto,
  mensagem: textoLivre().optional(),
})

export type MatriculaState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

const SUCESSO_MATRICULA: MatriculaState = {
  success: true,
  message:
    'Recebemos seu interesse de matrícula! Nossa secretaria entrará em contato em breve para dar continuidade ao processo.',
}

const SUCESSO_VISITA: MatriculaState = {
  success: true,
  message: 'Solicitação de visita recebida! Entraremos em contato para confirmar o melhor horário.',
}

/**
 * Registra o interesse de matrícula enviado pelo site público.
 */
export async function submeterInteresseMatricula(
  prevState: MatriculaState,
  formData: FormData
): Promise<MatriculaState> {
  if (await limiteExcedido('formulario')) return { message: MENSAGEM_LIMITE }
  if (enviadoPorRobo(formData)) {
    await registrarTentativaRobo('matrícula', formData)
    return SUCESSO_MATRICULA
  }

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

  const { formulario, duplicado } = await salvarFormulario({
    tipo: 'MATRICULA',
    nomeResponsavel,
    emailResponsavel,
    telefone,
    nomeAluno,
    idadeAluno,
    serieInteresse,
    turnoPreferido,
    mensagem,
  })

  if (!duplicado) await registrarAuditoria({
    tipo: 'MATRICULA_INTERESSE_RECEBIDO',
    descricao: `Interesse de matrícula recebido para ${nomeAluno}, enviado por ${nomeResponsavel} (${emailResponsavel})`,
    entidade: 'FormularioMatricula',
    entidadeId: formulario.id,
    dadosDepois: formulario,
  })

  return SUCESSO_MATRICULA
}

const AgendamentoVisitaSchema = z.object({
  nomeResponsavel: nomePessoa('Informe o nome completo.'),
  emailResponsavel: emailPublico,
  telefone: telefonePublico('Informe um telefone válido com DDD.'),
  nomeAluno: nomePessoa('Informe o nome da criança.'),
  diaPreferido: textoCurto,
  turnoPreferido: textoCurto,
  mensagem: textoLivre().optional(),
})

/**
 * Registra a solicitação de agendamento de visita à escola.
 * Reaproveita o modelo FormularioMatricula, prefixando a mensagem.
 */
export async function solicitarAgendamentoVisita(
  prevState: MatriculaState,
  formData: FormData
): Promise<MatriculaState> {
  if (await limiteExcedido('formulario')) return { message: MENSAGEM_LIMITE }
  if (enviadoPorRobo(formData)) {
    await registrarTentativaRobo('visita', formData)
    return SUCESSO_VISITA
  }

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

  const { formulario, duplicado } = await salvarFormulario({
    tipo: 'VISITA',
    nomeResponsavel,
    emailResponsavel,
    telefone,
    nomeAluno,
    turnoPreferido,
    mensagem: mensagemCompleta,
  })

  if (!duplicado) await registrarAuditoria({
    tipo: 'MATRICULA_INTERESSE_RECEBIDO',
    descricao: `Agendamento de visita solicitado por ${nomeResponsavel} (${emailResponsavel}) para conhecer a escola com ${nomeAluno}`,
    entidade: 'FormularioMatricula',
    entidadeId: formulario.id,
    dadosDepois: formulario,
  })

  return SUCESSO_VISITA
}
