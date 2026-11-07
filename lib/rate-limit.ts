// Limite de requisições por IP nas ações públicas (formulários do site, login e senha)
import 'server-only'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { registrarAuditoria } from '@/lib/audit'

const MINUTO = 60 * 1000

export const LIMITES = {
  formulario: { limite: 8, janelaMs: 10 * MINUTO },
  login: { limite: 10, janelaMs: 15 * MINUTO },
  senha: { limite: 5, janelaMs: 60 * MINUTO },
} as const

export type AcaoLimitada = keyof typeof LIMITES

export const MENSAGEM_LIMITE =
  'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.'

let tabelaPronta: Promise<unknown> | null = null

// Cria a tabela na primeira chamada caso o schema ainda não tenha sido aplicado no banco
function garantirTabela() {
  tabelaPronta ??= prisma
    .$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "RateLimite" (
        "chave" TEXT NOT NULL,
        "contador" INTEGER NOT NULL,
        "expiraEm" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "RateLimite_pkey" PRIMARY KEY ("chave")
      )`
    )
    .catch((erro: unknown) => {
      tabelaPronta = null
      throw erro
    })
  return tabelaPronta
}

export async function obterIp(): Promise<string> {
  const h = await headers()
  return (
    h.get('x-real-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'desconhecido'
  )
}

/**
 * Registra uma tentativa da ação para o IP atual e informa se o limite foi ultrapassado.
 * Em caso de falha no banco a requisição é liberada, para não derrubar os formulários.
 */
export async function limiteExcedido(acao: AcaoLimitada): Promise<boolean> {
  const { limite, janelaMs } = LIMITES[acao]

  try {
    await garantirTabela()

    const chave = `${acao}:${await obterIp()}`
    const agora = new Date()
    const expiraEm = new Date(agora.getTime() + janelaMs)

    const [registro] = await prisma.$queryRaw<{ contador: number }[]>`
      INSERT INTO "RateLimite" ("chave", "contador", "expiraEm")
      VALUES (${chave}, 1, ${expiraEm})
      ON CONFLICT ("chave") DO UPDATE SET
        "contador" = CASE WHEN "RateLimite"."expiraEm" < ${agora} THEN 1 ELSE "RateLimite"."contador" + 1 END,
        "expiraEm" = CASE WHEN "RateLimite"."expiraEm" < ${agora} THEN ${expiraEm} ELSE "RateLimite"."expiraEm" END
      RETURNING "contador"
    `

    // Limpeza ocasional de registros vencidos
    if (Math.random() < 0.02) {
      await prisma.$executeRaw`DELETE FROM "RateLimite" WHERE "expiraEm" < ${agora}`
    }

    const contador = Number(registro?.contador ?? 0)
    if (contador === limite + 1) {
      await registrarAuditoria({
        tipo: 'LIMITE_EXCEDIDO',
        descricao: `Limite de tentativas excedido em "${acao}" — novas requisições deste IP ficam bloqueadas por até ${janelaMs / MINUTO} minutos`,
        entidade: 'RateLimite',
        entidadeId: chave,
      })
    }

    return contador > limite
  } catch (erro) {
    console.error('Falha ao verificar limite de requisições:', erro)
    return false
  }
}
