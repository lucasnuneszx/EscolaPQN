// Depoimentos aprovados para exibição nas páginas públicas
import 'server-only'
import { prisma } from '@/lib/prisma'

export interface DepoimentoPublico {
  id: string
  nome: string
  relacao: string
  texto: string
}

export async function listarDepoimentosAprovados(limite?: number): Promise<DepoimentoPublico[]> {
  try {
    return await prisma.depoimento.findMany({
      where: { status: 'APROVADO' },
      orderBy: { aprovadoEm: 'desc' },
      select: { id: true, nome: true, relacao: true, texto: true },
      take: limite,
    })
  } catch {
    return []
  }
}
