// Gravação de formulários do site público com proteção contra pedidos duplicados
import 'server-only'
import { prisma } from '@/lib/prisma'
import { motivoSuspeita } from '@/lib/triagem-leads'

type FormularioMatricula = Awaited<ReturnType<typeof prisma.formularioMatricula.create>>

const JANELA_DUPLICIDADE_MS = 24 * 60 * 60 * 1000

const TIPOS_EQUIVALENTES: Record<string, string[]> = {
  MATRICULA: ['MATRICULA', 'WHATSAPP_EXPRESS'],
  WHATSAPP_EXPRESS: ['MATRICULA', 'WHATSAPP_EXPRESS'],
  VISITA: ['VISITA'],
  CONTATO: ['CONTATO'],
}

export interface DadosFormulario {
  tipo: string
  nomeResponsavel: string
  emailResponsavel?: string | null
  telefone: string
  nomeAluno?: string | null
  idadeAluno?: number | null
  serieInteresse?: string | null
  turnoPreferido?: string | null
  mensagem?: string | null
}

const apenasDigitos = (valor?: string | null) => (valor ?? '').replace(/\D/g, '')
const normalizar = (valor?: string | null) => (valor ?? '').trim().toLowerCase()
const vazio = (valor: unknown) => valor === null || valor === undefined || valor === ''

function mesmoSolicitante(existente: FormularioMatricula, dados: DadosFormulario): boolean {
  const telNovo = apenasDigitos(dados.telefone)
  if (telNovo.length >= 8 && apenasDigitos(existente.telefone) === telNovo) return true

  const emailNovo = normalizar(dados.emailResponsavel)
  if (emailNovo && normalizar(existente.emailResponsavel) === emailNovo) return true

  const alunoNovo = normalizar(dados.nomeAluno)
  return (
    !!alunoNovo &&
    normalizar(existente.nomeAluno) === alunoNovo &&
    normalizar(existente.nomeResponsavel) === normalizar(dados.nomeResponsavel)
  )
}

function dadosParaGravar(dados: DadosFormulario) {
  return {
    tipo: dados.tipo,
    nomeResponsavel: dados.nomeResponsavel,
    emailResponsavel: dados.emailResponsavel || null,
    telefone: dados.telefone,
    nomeAluno: dados.nomeAluno || null,
    idadeAluno: dados.idadeAluno ?? null,
    serieInteresse: dados.serieInteresse || null,
    turnoPreferido: dados.turnoPreferido || null,
    mensagem: dados.mensagem || null,
  }
}

/**
 * Envios com cara de propaganda vão direto para o status SUSPEITO, já marcados como vistos,
 * para não entrarem na fila de atendimento nem dispararem notificação.
 * Cria o formulário ou, se o mesmo responsável já enviou um pedido equivalente
 * nas últimas 24h e ele ainda não foi tratado, complementa o registro existente.
 */
export async function salvarFormulario(
  dados: DadosFormulario
): Promise<{ formulario: FormularioMatricula; duplicado: boolean }> {
  const suspeita = motivoSuspeita(dados)
  if (suspeita) {
    const formulario = await prisma.formularioMatricula.create({
      data: {
        ...dadosParaGravar(dados),
        status: 'SUSPEITO',
        lido: true,
        observacoesInternas: `Triagem automática: ${suspeita}.`,
      },
    })
    return { formulario, duplicado: false }
  }

  const recentes = await prisma.formularioMatricula.findMany({
    where: {
      tipo: { in: TIPOS_EQUIVALENTES[dados.tipo] ?? [dados.tipo] },
      status: 'NOVO',
      criadoEm: { gte: new Date(Date.now() - JANELA_DUPLICIDADE_MS) },
    },
    orderBy: { criadoEm: 'desc' },
    take: 200,
  })

  const existente = recentes.find((f) => mesmoSolicitante(f, dados))

  if (existente) {
    const complemento: Partial<DadosFormulario> = {}
    if (apenasDigitos(existente.telefone).length < 8 && apenasDigitos(dados.telefone).length >= 8) {
      complemento.telefone = dados.telefone
    }
    if (vazio(existente.emailResponsavel) && !vazio(dados.emailResponsavel)) complemento.emailResponsavel = dados.emailResponsavel
    if (vazio(existente.nomeAluno) && !vazio(dados.nomeAluno)) complemento.nomeAluno = dados.nomeAluno
    if (vazio(existente.idadeAluno) && !vazio(dados.idadeAluno)) complemento.idadeAluno = dados.idadeAluno
    if (vazio(existente.serieInteresse) && !vazio(dados.serieInteresse)) complemento.serieInteresse = dados.serieInteresse
    if (vazio(existente.turnoPreferido) && !vazio(dados.turnoPreferido)) complemento.turnoPreferido = dados.turnoPreferido
    if (vazio(existente.mensagem) && !vazio(dados.mensagem)) complemento.mensagem = dados.mensagem

    const formulario = Object.keys(complemento).length
      ? await prisma.formularioMatricula.update({ where: { id: existente.id }, data: complemento })
      : existente

    return { formulario, duplicado: true }
  }

  const formulario = await prisma.formularioMatricula.create({
    data: { ...dadosParaGravar(dados), status: 'NOVO', lido: false },
  })

  return { formulario, duplicado: false }
}
