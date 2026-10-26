'use server'
// Server Actions do formulário de contato (site público)
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { registrarAuditoria } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

const ContatoSchema = z.object({
  nome: z.string().trim().min(2, { message: 'Informe seu nome completo.' }),
  email: z.string().email({ message: 'E-mail inválido.' }).trim().toLowerCase(),
  telefone: z.string().trim().min(8, { message: 'Informe um telefone válido.' }),
  assunto: z.string().trim().min(2, { message: 'Selecione um assunto.' }),
  mensagem: z.string().trim().min(10, { message: 'Escreva uma mensagem com pelo menos 10 caracteres.' }),
})

export type ContatoState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

/**
 * Recebe uma mensagem de contato do site público e registra no banco de leads e em auditoria.
 */
export async function enviarMensagemContato(
  prevState: ContatoState,
  formData: FormData
): Promise<ContatoState> {
  const validated = ContatoSchema.safeParse({
    nome: formData.get('nome'),
    email: formData.get('email'),
    telefone: formData.get('telefone'),
    assunto: formData.get('assunto'),
    mensagem: formData.get('mensagem'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { nome, email, telefone, assunto, mensagem } = validated.data

  const lead = await prisma.formularioMatricula.create({
    data: {
      tipo: 'CONTATO',
      nomeResponsavel: nome,
      emailResponsavel: email,
      telefone,
      mensagem: `[Assunto: ${assunto}] ${mensagem}`,
      status: 'NOVO',
      lido: false,
    },
  })

  await registrarAuditoria({
    tipo: 'CONTATO_RECEBIDO',
    descricao: `Mensagem de contato recebida de ${nome} (${email}) — assunto: ${assunto}`,
    entidade: 'FormularioMatricula',
    entidadeId: lead.id,
    dadosDepois: { nome, email, telefone, assunto, mensagem },
  })

  revalidatePath('/admin/leads')

  return {
    success: true,
    message: 'Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.',
  }
}
