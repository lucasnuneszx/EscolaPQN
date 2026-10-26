// ─────────────────────────────────────────────────────────────
// Auditoria — helper compartilhado para registrar AuditLog
// ─────────────────────────────────────────────────────────────
import 'server-only'
import { prisma } from '@/lib/prisma'

interface RegistrarAuditoriaParams {
  tipo: string
  descricao: string
  entidade: string
  entidadeId?: string
  usuarioId?: string
  dadosAntes?: unknown
  dadosDepois?: unknown
  ip?: string
}

export async function registrarAuditoria(params: RegistrarAuditoriaParams): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tipo: params.tipo,
      descricao: params.descricao,
      entidade: params.entidade,
      entidadeId: params.entidadeId,
      usuarioId: params.usuarioId,
      ip: params.ip,
      dadosAntes: params.dadosAntes !== undefined ? JSON.stringify(params.dadosAntes) : undefined,
      dadosDepois: params.dadosDepois !== undefined ? JSON.stringify(params.dadosDepois) : undefined,
    },
  })
}
