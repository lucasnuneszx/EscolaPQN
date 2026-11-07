// Auditoria — helper compartilhado para registrar AuditLog
import 'server-only'
import { headers } from 'next/headers'
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
  userAgent?: string
}

// IP e navegador de quem fez a requisição (vazio fora de uma requisição)
async function origemDaRequisicao(): Promise<{ ip?: string; userAgent?: string }> {
  try {
    const h = await headers()
    const ip = h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
    const userAgent = h.get('user-agent')?.slice(0, 300) || undefined
    return { ip, userAgent }
  } catch {
    return {}
  }
}

export async function registrarAuditoria(params: RegistrarAuditoriaParams): Promise<void> {
  const origem = await origemDaRequisicao()
  await prisma.auditLog.create({
    data: {
      tipo: params.tipo,
      descricao: params.descricao,
      entidade: params.entidade,
      entidadeId: params.entidadeId,
      usuarioId: params.usuarioId,
      ip: params.ip ?? origem.ip,
      userAgent: params.userAgent ?? origem.userAgent,
      dadosAntes: params.dadosAntes !== undefined ? JSON.stringify(params.dadosAntes) : undefined,
      dadosDepois: params.dadosDepois !== undefined ? JSON.stringify(params.dadosDepois) : undefined,
    },
  })
}

/**
 * Registra um envio barrado pela armadilha anti-robô, guardando um resumo do que foi enviado.
 */
export async function registrarTentativaRobo(formulario: string, formData: FormData): Promise<void> {
  const enviado: Record<string, string> = {}
  for (const [campo, valor] of formData.entries()) {
    if (campo.startsWith('$') || typeof valor !== 'string') continue
    enviado[campo] = valor.slice(0, 200)
  }

  try {
    await registrarAuditoria({
      tipo: 'ROBO_BLOQUEADO',
      descricao: `Envio automático bloqueado no formulário de ${formulario}`,
      entidade: 'FormularioMatricula',
      dadosDepois: enviado,
    })
  } catch (erro: unknown) {
    console.error('Falha ao registrar tentativa de robô:', erro)
  }
}
