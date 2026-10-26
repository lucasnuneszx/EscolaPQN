'use server'
// Server Actions — Financeiro (mensalidades / cobranças Asaas)
//
// `gerarLinkCobranca` ainda não chama a API do Asaas: as credenciais
// não estão configuradas, então a cobrança é registrada localmente
// como simulada para o fluxo de UI funcionar.
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

// Criar mensalidade

const MensalidadeSchema = z.object({
  alunoId: z.string().min(1, { message: 'Selecione um aluno.' }),
  referencia: z
    .string()
    .regex(/^\d{4}-\d{2}$/, { message: 'Use o formato AAAA-MM, ex.: 2026-08.' }),
  valorBase: z.coerce.number().positive({ message: 'Informe um valor base válido.' }),
  valorDesconto: z.coerce.number().min(0).default(0),
  tipoDesconto: z.string().trim().optional(),
  dataVencimento: z.string().min(1, { message: 'Informe a data de vencimento.' }),
})

export type FinanceiroState =
  | { errors?: Record<string, string[]>; message?: string; success?: boolean }
  | undefined

export async function criarMensalidade(
  prevState: FinanceiroState,
  formData: FormData
): Promise<FinanceiroState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'financeiro:criar')) {
    return { message: 'Você não tem permissão para emitir cobranças.' }
  }

  const validated = MensalidadeSchema.safeParse({
    alunoId: formData.get('alunoId'),
    referencia: formData.get('referencia'),
    valorBase: formData.get('valorBase'),
    valorDesconto: formData.get('valorDesconto') || 0,
    tipoDesconto: formData.get('tipoDesconto') || undefined,
    dataVencimento: formData.get('dataVencimento'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { alunoId, referencia, valorBase, valorDesconto, tipoDesconto, dataVencimento } =
    validated.data

  if (valorDesconto > valorBase) {
    return {
      errors: { valorDesconto: ['O desconto não pode ser maior que o valor base.'] },
    }
  }

  const valorFinal = valorBase - valorDesconto

  // Pega automaticamente o responsável financeiro do aluno (se houver)
  const vinculo = await prisma.alunoResponsavel.findFirst({
    where: { alunoId, responsavel: { responsavelFinanceiro: true } },
  })

  let mensalidadeId: string
  try {
    const mensalidade = await prisma.mensalidade.create({
      data: {
        alunoId,
        referencia,
        valorBase,
        valorDesconto,
        tipoDesconto: tipoDesconto || null,
        valorFinal,
        dataVencimento: new Date(dataVencimento),
        responsavelId: vinculo?.responsavelId,
      },
    })
    mensalidadeId = mensalidade.id
  } catch {
    return { message: 'Erro ao emitir a cobrança. Tente novamente.' }
  }

  await registrarAuditoria({
    tipo: 'MENSALIDADE_CRIADA',
    descricao: `Mensalidade de referência ${referencia} emitida no valor de R$ ${valorFinal.toFixed(2)}.`,
    entidade: 'Mensalidade',
    entidadeId: mensalidadeId,
    usuarioId: sessao.userId,
    dadosDepois: validated.data,
  })

  revalidatePath('/admin/financeiro')
  redirect(`/admin/financeiro/${mensalidadeId}`)
}

// Marcar como pago

export async function marcarComoPago(
  id: string,
  prevState: FinanceiroState,
  _formData: FormData
): Promise<FinanceiroState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'financeiro:editar')) {
    return { message: 'Você não tem permissão para atualizar mensalidades.' }
  }

  const mensalidade = await prisma.mensalidade.findUnique({ where: { id } })
  if (!mensalidade) {
    return { message: 'Mensalidade não encontrada.' }
  }
  if (mensalidade.status === 'PAGO') {
    return { message: 'Esta mensalidade já está marcada como paga.' }
  }

  const atualizado = await prisma.mensalidade.update({
    where: { id },
    data: {
      status: 'PAGO',
      dataPagamento: new Date(),
      valorPago: mensalidade.valorFinal,
    },
  })

  await registrarAuditoria({
    tipo: 'MENSALIDADE_PAGA',
    descricao: `Mensalidade de referência ${mensalidade.referencia} marcada como paga manualmente.`,
    entidade: 'Mensalidade',
    entidadeId: id,
    usuarioId: sessao.userId,
    dadosAntes: mensalidade,
    dadosDepois: atualizado,
  })

  revalidatePath(`/admin/financeiro/${id}`)
  revalidatePath('/admin/financeiro')

  return { success: true, message: 'Mensalidade marcada como paga com sucesso.' }
}

// Gerar link de cobrança (SIMULADO)

export async function gerarLinkCobranca(
  id: string,
  prevState: FinanceiroState,
  _formData: FormData
): Promise<FinanceiroState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'financeiro:gerar_cobranca')) {
    return { message: 'Você não tem permissão para gerar cobranças.' }
  }

  const mensalidade = await prisma.mensalidade.findUnique({ where: { id } })
  if (!mensalidade) {
    return { message: 'Mensalidade não encontrada.' }
  }

  // TODO: chamar a API do Asaas quando as credenciais estiverem configuradas.
  const asaasId = `sim_${crypto.randomUUID()}`

  const cobranca = await prisma.asaasCobranca.create({
    data: {
      asaasId,
      tipo: 'BOLETO',
      status: 'PENDING',
      urlBoleto: `https://sandbox.asaas.com/b/pdf/${asaasId}`,
      urlPixQrCode: `https://sandbox.asaas.com/qr/${asaasId}`,
      urlPagamento: `https://sandbox.asaas.com/pay/${asaasId}`,
      dataVencimento: mensalidade.dataVencimento,
      valorCobranca: mensalidade.valorFinal,
      mensalidadeId: id,
    },
  })

  await registrarAuditoria({
    tipo: 'COBRANCA_SIMULADA_GERADA',
    descricao: `Cobrança simulada (sandbox) gerada para a mensalidade de referência ${mensalidade.referencia}.`,
    entidade: 'AsaasCobranca',
    entidadeId: cobranca.id,
    usuarioId: sessao.userId,
    dadosDepois: cobranca,
  })

  revalidatePath(`/admin/financeiro/${id}`)

  return { success: true, message: 'Cobrança simulada gerada com sucesso (ambiente sandbox).' }
}
