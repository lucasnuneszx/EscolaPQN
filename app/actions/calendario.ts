'use server'
// ─────────────────────────────────────────────────────────────
// Server Actions — Calendário de Eventos
// ─────────────────────────────────────────────────────────────
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { isAdminOuSecretaria } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

const EventoSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, { message: 'O título deve ter ao menos 3 caracteres.' })
    .max(200, { message: 'O título deve ter no máximo 200 caracteres.' }),
  descricao: z.string().trim().optional(),
  dataInicio: z.string().min(1, { message: 'Informe a data de início.' }),
  dataFim: z.string().optional(),
  local: z.string().trim().optional(),
  tipo: z.enum(['evento', 'reuniao', 'feriado', 'prova', 'ferias'], {
    message: 'Selecione um tipo de evento válido.',
  }),
  cor: z.string().trim().optional(),
})

export type EventoState =
  | {
      errors?: Record<string, string[]>
      message?: string
      success?: boolean
    }
  | undefined

export async function criarEvento(
  prevState: EventoState,
  formData: FormData
): Promise<EventoState> {
  const sessao = await getSession()
  if (!sessao || !isAdminOuSecretaria(sessao.perfil)) {
    return { message: 'Você não tem permissão para criar eventos no calendário.' }
  }

  const validated = EventoSchema.safeParse({
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || undefined,
    dataInicio: formData.get('dataInicio'),
    dataFim: formData.get('dataFim') || undefined,
    local: formData.get('local') || undefined,
    tipo: formData.get('tipo'),
    cor: formData.get('cor') || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { titulo, descricao, dataInicio, dataFim, local, tipo, cor } = validated.data

  const anoLetivoAtivo = await prisma.anoLetivo.findFirst({ where: { ativo: true } })

  let eventoId: string
  try {
    const evento = await prisma.eventoCalendario.create({
      data: {
        titulo,
        descricao,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        local,
        tipo,
        cor,
        anoLetivoId: anoLetivoAtivo?.id,
      },
    })
    eventoId = evento.id
  } catch {
    return { message: 'Erro ao criar o evento. Tente novamente.' }
  }

  await registrarAuditoria({
    tipo: 'EVENTO_CRIADO',
    descricao: `Evento "${titulo}" foi adicionado ao calendário letivo.`,
    entidade: 'EventoCalendario',
    entidadeId: eventoId,
    usuarioId: sessao.userId,
    dadosDepois: validated.data,
  })

  revalidatePath('/admin/calendario')
  redirect('/admin/calendario')
}

export async function excluirEvento(id: string, _formData: FormData): Promise<void> {
  const sessao = await getSession()
  if (!sessao || !isAdminOuSecretaria(sessao.perfil)) return

  const evento = await prisma.eventoCalendario.findUnique({ where: { id } })
  if (!evento) return

  await prisma.eventoCalendario.delete({ where: { id } })

  await registrarAuditoria({
    tipo: 'EVENTO_EXCLUIDO',
    descricao: `Evento "${evento.titulo}" foi removido do calendário letivo.`,
    entidade: 'EventoCalendario',
    entidadeId: id,
    usuarioId: sessao.userId,
    dadosAntes: evento,
  })

  revalidatePath('/admin/calendario')
}
