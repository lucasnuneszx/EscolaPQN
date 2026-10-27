'use server'
// Server Actions — Depoimentos de pais e responsáveis
// O responsável envia pelo portal; a escola aprova antes de publicar no site.
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

export type DepoimentoState =
  | { errors?: Record<string, string[]>; message?: string; success?: boolean }
  | undefined

const DepoimentoSchema = z.object({
  nome: z.string().trim().min(2, { message: 'Informe como seu nome deve aparecer.' }).max(80),
  relacao: z.string().trim().min(3, { message: 'Ex.: Mãe de aluno do 2º ano.' }).max(80),
  texto: z
    .string()
    .trim()
    .min(20, { message: 'Escreva pelo menos algumas frases.' })
    .max(600, { message: 'Use no máximo 600 caracteres.' }),
})

export async function enviarDepoimento(
  prevState: DepoimentoState,
  formData: FormData
): Promise<DepoimentoState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'depoimentos:enviar')) {
    return { message: 'Apenas responsáveis podem enviar depoimentos.' }
  }

  const validated = DepoimentoSchema.safeParse({
    nome: formData.get('nome'),
    relacao: formData.get('relacao'),
    texto: formData.get('texto'),
  })
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  try {
    const depoimento = await prisma.depoimento.create({
      data: { ...validated.data, usuarioId: sessao.userId },
    })
    await registrarAuditoria({
      tipo: 'DEPOIMENTO_ENVIADO',
      descricao: `Depoimento enviado por ${validated.data.nome}.`,
      entidade: 'Depoimento',
      entidadeId: depoimento.id,
      usuarioId: sessao.userId,
    })
  } catch {
    return { message: 'Não foi possível enviar agora. Tente novamente.' }
  }

  revalidatePath('/portal/depoimento')
  revalidatePath('/admin/depoimentos')
  return { success: true, message: 'Obrigado! Seu depoimento foi enviado e aparecerá no site após a aprovação da escola.' }
}

async function alterarStatus(id: string, status: 'APROVADO' | 'REJEITADO' | 'PENDENTE') {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'depoimentos:moderar')) {
    return { message: 'Você não tem permissão para moderar depoimentos.' }
  }

  const antes = await prisma.depoimento.findUnique({ where: { id } })
  if (!antes) return { message: 'Depoimento não encontrado.' }

  const depois = await prisma.depoimento.update({
    where: { id },
    data: { status, aprovadoEm: status === 'APROVADO' ? new Date() : null },
  })

  await registrarAuditoria({
    tipo: `DEPOIMENTO_${status}`,
    descricao: `Depoimento de ${antes.nome} marcado como ${status.toLowerCase()}.`,
    entidade: 'Depoimento',
    entidadeId: id,
    usuarioId: sessao.userId,
    dadosAntes: { status: antes.status },
    dadosDepois: { status: depois.status },
  })

  revalidatePath('/admin/depoimentos')
  revalidatePath('/depoimentos')
  return { success: true }
}

export async function aprovarDepoimento(id: string) {
  return alterarStatus(id, 'APROVADO')
}

export async function rejeitarDepoimento(id: string) {
  return alterarStatus(id, 'REJEITADO')
}

export async function voltarParaPendente(id: string) {
  return alterarStatus(id, 'PENDENTE')
}

export async function excluirDepoimento(id: string) {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'depoimentos:moderar')) {
    return { message: 'Você não tem permissão para excluir depoimentos.' }
  }

  const antes = await prisma.depoimento.findUnique({ where: { id } })
  if (!antes) return { message: 'Depoimento não encontrado.' }

  await prisma.depoimento.delete({ where: { id } })
  await registrarAuditoria({
    tipo: 'DEPOIMENTO_EXCLUIDO',
    descricao: `Depoimento de ${antes.nome} excluído.`,
    entidade: 'Depoimento',
    entidadeId: id,
    usuarioId: sessao.userId,
    dadosAntes: antes,
  })

  revalidatePath('/admin/depoimentos')
  revalidatePath('/depoimentos')
  return { success: true }
}
