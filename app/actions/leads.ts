'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { registrarAuditoria } from '@/lib/audit'

const LeadRapidoSchema = z.object({
  tipo: z.enum(['MATRICULA', 'VISITA', 'CONTATO', 'WHATSAPP_EXPRESS']),
  nomeResponsavel: z.string().trim().min(2),
  emailResponsavel: z.string().email().optional().or(z.literal('')),
  telefone: z.string().trim().min(8),
  nomeAluno: z.string().trim().optional().or(z.literal('')),
  idadeAluno: z.number().optional(),
  serieInteresse: z.string().optional().or(z.literal('')),
  turnoPreferido: z.string().optional().or(z.literal('')),
  mensagem: z.string().optional().or(z.literal('')),
})

/**
 * Salva qualquer lead instantaneamente no banco antes de redirecionar para o WhatsApp
 */
export async function salvarLeadRapido(dados: {
  tipo: 'MATRICULA' | 'VISITA' | 'CONTATO' | 'WHATSAPP_EXPRESS'
  nomeResponsavel: string
  emailResponsavel?: string
  telefone: string
  nomeAluno?: string
  idadeAluno?: number
  serieInteresse?: string
  turnoPreferido?: string
  mensagem?: string
}) {
  try {
    const validated = LeadRapidoSchema.safeParse(dados)
    if (!validated.success) {
      return { success: false, error: 'Dados incompletos' }
    }

    const { tipo, nomeResponsavel, emailResponsavel, telefone, nomeAluno, idadeAluno, serieInteresse, turnoPreferido, mensagem } = validated.data

    const lead = await prisma.formularioMatricula.create({
      data: {
        tipo,
        nomeResponsavel,
        emailResponsavel: emailResponsavel || null,
        telefone,
        nomeAluno: nomeAluno || null,
        idadeAluno: idadeAluno || null,
        serieInteresse: serieInteresse || null,
        turnoPreferido: turnoPreferido || null,
        mensagem: mensagem || null,
        status: 'NOVO',
        lido: false,
      },
    })

    await registrarAuditoria({
      tipo: 'LEAD_RECEBIDO',
      descricao: `Novo lead (${tipo}) capturado: ${nomeResponsavel} (${telefone}) - Aluno: ${nomeAluno || 'N/A'}`,
      entidade: 'FormularioMatricula',
      entidadeId: lead.id,
      dadosDepois: lead,
    })

    revalidatePath('/admin/leads')
    return { success: true, leadId: lead.id }
  } catch (error) {
    console.error('Erro ao salvar lead rápido:', error)
    return { success: false, error: 'Falha ao gravar lead' }
  }
}

/**
 * Marca um lead como lido/visto pelo gestor
 */
export async function marcarLeadLido(id: string) {
  const session = await getSession()
  if (!session || (session.perfil !== 'ADMIN' && session.perfil !== 'SECRETARIA')) {
    throw new Error('Não autorizado')
  }

  await prisma.formularioMatricula.update({
    where: { id },
    data: { lido: true },
  })

  revalidatePath('/admin/leads')
  return { success: true }
}

/**
 * Atualiza o status do lead no funil do gestor
 */
export async function atualizarStatusLead(id: string, status: 'NOVO' | 'CONTATADO' | 'EM_NEGOCIACAO' | 'MATRICULADO' | 'ARQUIVADO') {
  const session = await getSession()
  if (!session || (session.perfil !== 'ADMIN' && session.perfil !== 'SECRETARIA')) {
    throw new Error('Não autorizado')
  }

  const lead = await prisma.formularioMatricula.update({
    where: { id },
    data: {
      status,
      lido: true,
    },
  })

  await registrarAuditoria({
    tipo: 'LEAD_STATUS_ATUALIZADO',
    descricao: `Status do lead ${lead.nomeResponsavel} alterado para ${status} por ${session.nome}`,
    entidade: 'FormularioMatricula',
    entidadeId: id,
    usuarioId: session.userId,
  })

  revalidatePath('/admin/leads')
  return { success: true }
}

/**
 * Salva anotações internas da equipe pedagógica/secretaria sobre o lead
 */
export async function salvarAnotacaoLead(id: string, observacoesInternas: string) {
  const session = await getSession()
  if (!session || (session.perfil !== 'ADMIN' && session.perfil !== 'SECRETARIA')) {
    throw new Error('Não autorizado')
  }

  await prisma.formularioMatricula.update({
    where: { id },
    data: { observacoesInternas },
  })

  revalidatePath('/admin/leads')
  return { success: true }
}

/**
 * Exclui um lead
 */
export async function excluirLead(id: string) {
  const session = await getSession()
  if (!session || (session.perfil !== 'ADMIN' && session.perfil !== 'SECRETARIA')) {
    throw new Error('Não autorizado')
  }

  const lead = await prisma.formularioMatricula.findUnique({
    where: { id },
  })

  if (!lead) return { success: false, error: 'Lead não encontrado' }

  await prisma.formularioMatricula.delete({
    where: { id },
  })

  await registrarAuditoria({
    tipo: 'LEAD_EXCLUIDO',
    descricao: `Lead ${lead.nomeResponsavel} (${lead.telefone}) excluído por ${session.nome}`,
    entidade: 'FormularioMatricula',
    entidadeId: id,
    usuarioId: session.userId,
  })

  revalidatePath('/admin/leads')
  return { success: true }
}
