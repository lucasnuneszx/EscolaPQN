'use server'
// Server Actions do formulário de contato (site público)
import { z } from 'zod'
import { registrarAuditoria } from '@/lib/audit'
import { salvarFormulario } from '@/lib/formularios'
import { revalidatePath } from 'next/cache'
import { limiteExcedido, MENSAGEM_LIMITE } from '@/lib/rate-limit'
import { emailPublico, enviadoPorRobo, nomePessoa, telefonePublico, textoLivre } from '@/lib/validacao-publica'

const ContatoSchema = z.object({
  nome: nomePessoa('Informe seu nome completo.'),
  email: emailPublico,
  telefone: telefonePublico('Informe um telefone válido com DDD.'),
  assunto: z.string().trim().min(2, { message: 'Selecione um assunto.' }).max(80),
  mensagem: textoLivre().min(10, { message: 'Escreva uma mensagem com pelo menos 10 caracteres.' }),
})

export type ContatoState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

const SUCESSO_CONTATO: ContatoState = {
  success: true,
  message: 'Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.',
}

/**
 * Recebe uma mensagem de contato do site público e registra no banco de leads e em auditoria.
 */
export async function enviarMensagemContato(
  prevState: ContatoState,
  formData: FormData
): Promise<ContatoState> {
  if (enviadoPorRobo(formData)) return SUCESSO_CONTATO
  if (await limiteExcedido('formulario')) return { message: MENSAGEM_LIMITE }

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

  const { formulario: lead, duplicado } = await salvarFormulario({
    tipo: 'CONTATO',
    nomeResponsavel: nome,
    emailResponsavel: email,
    telefone,
    mensagem: `[Assunto: ${assunto}] ${mensagem}`,
  })

  if (!duplicado) await registrarAuditoria({
    tipo: 'CONTATO_RECEBIDO',
    descricao: `Mensagem de contato recebida de ${nome} (${email}) — assunto: ${assunto}`,
    entidade: 'FormularioMatricula',
    entidadeId: lead.id,
    dadosDepois: { nome, email, telefone, assunto, mensagem },
  })

  revalidatePath('/admin/leads')

  return SUCESSO_CONTATO
}
