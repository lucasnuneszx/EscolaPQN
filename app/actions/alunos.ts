'use server'
// Server Actions de Alunos
// Criar, atualizar, alterar status e vincular responsável
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'
import { SERIES_ESCOLA, CODIGOS_SERIE, VALORES_TURNO, rotuloTurno, type TurnoEscola } from '@/lib/series-escola'

// Utilitários

function textoOpcional(v: FormDataEntryValue | null): string | undefined {
  const s = typeof v === 'string' ? v.trim() : ''
  return s.length > 0 ? s : undefined
}

function valorOpcional(v: FormDataEntryValue | null): number | undefined {
  const s = typeof v === 'string' ? v.trim().replace(',', '.') : ''
  if (!s) return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n : Number.NaN
}

function boolCheckbox(v: FormDataEntryValue | null): boolean {
  return v === 'on' || v === 'true' || v === '1'
}

// Esquemas de validação

const StatusAlunoEnum = z.enum(['ATIVO', 'INATIVO', 'TRANSFERIDO', 'TRANCADO', 'PENDENTE'])

const AlunoBaseSchema = z.object({
  nome: z.string().trim().min(2, { message: 'Informe o nome completo do aluno.' }),
  nomeSocial: z.string().trim().optional(),
  cpf: z.string().trim().optional(),
  rg: z.string().trim().optional(),
  certidaoNascimento: z.string().trim().optional(),
  dataNascimento: z
    .string()
    .min(1, { message: 'Informe a data de nascimento.' })
    .refine((v) => !Number.isNaN(new Date(v).getTime()), { message: 'Data de nascimento inválida.' }),
  sexo: z.string().trim().optional(),
  status: StatusAlunoEnum.optional(),
  endereco: z.string().trim().optional(),
  cidade: z.string().trim().optional(),
  estado: z.string().trim().optional(),
  cep: z.string().trim().optional(),
  escolaAnterior: z.string().trim().optional(),
  alergias: z.string().trim().optional(),
  necessidadesEspeciais: z.string().trim().optional(),
  planoDeSaude: z.string().trim().optional(),
  observacoes: z.string().trim().optional(),
  consentimentoImagem: z.boolean().optional(),
  valorMensalidade: z.number({ message: 'Informe um valor válido.' }).min(0, { message: 'Informe um valor válido.' }).optional(),
  descontoMensalidade: z.number({ message: 'Informe um desconto válido.' }).min(0, { message: 'Informe um desconto válido.' }).optional(),
})

const CriarAlunoSchema = AlunoBaseSchema.extend({
  turmaId: z.string().trim().optional(),
  serieCodigo: z.enum(CODIGOS_SERIE).optional(),
  turno: z.enum(VALORES_TURNO).optional(),
  responsavelModo: z.enum(['existente', 'novo', 'nenhum']).optional(),
  responsavelId: z.string().trim().optional(),
  respNome: z.string().trim().optional(),
  respCpf: z.string().trim().optional(),
  respEmail: z.string().trim().optional(),
  respTelefone: z.string().trim().optional(),
  respWhatsapp: z.string().trim().optional(),
  respParentesco: z.string().trim().optional(),
  respEndereco: z.string().trim().optional(),
  respFinanceiro: z.boolean().optional(),
  respPedagogico: z.boolean().optional(),
})

const AtualizarAlunoSchema = AlunoBaseSchema.extend({
  id: z.string().trim().min(1),
  turmaId: z.string().trim().optional(),
  serieCodigo: z.enum(CODIGOS_SERIE).optional(),
  turno: z.enum(VALORES_TURNO).optional(),
})

// Tipos de estado

export type AlunoState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

// Helper de erro do Prisma

function mensagemErroPrisma(error: unknown): string {
  if (error instanceof ErroMatricula) return error.message
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return 'Já existe um cadastro com este CPF/e-mail.'
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

// Resolução de turma a partir de série + turno

class ErroMatricula extends Error {}

/**
 * Encontra a turma da série/turno no ano letivo ativo mais recente.
 * Se a série ainda não existir no banco, ela é criada; se não houver
 * turma para aquela série e turno, uma turma padrão é criada.
 */
async function resolverTurma(
  tx: Prisma.TransactionClient,
  serieCodigo: string,
  turno: TurnoEscola,
): Promise<string> {
  const def = SERIES_ESCOLA.find((s) => s.codigo === serieCodigo)
  if (!def) throw new ErroMatricula('Série inválida.')

  const anoLetivo = await tx.anoLetivo.findFirst({ where: { ativo: true }, orderBy: { ano: 'desc' } })
  if (!anoLetivo) {
    throw new ErroMatricula('Nenhum ano letivo ativo. Cadastre o ano letivo antes de matricular.')
  }

  const serie = await tx.serie.upsert({
    where: { codigo: def.codigo },
    update: {},
    create: { codigo: def.codigo, nome: def.nome, nivel: def.nivel, ordem: def.ordem },
  })

  const existente = await tx.turma.findFirst({
    where: { serieId: serie.id, turno, anoLetivoId: anoLetivo.id },
    orderBy: { criadoEm: 'asc' },
  })
  if (existente) return existente.id

  const nova = await tx.turma.create({
    data: {
      nome: `${def.nome} — ${rotuloTurno(turno)}`,
      turno,
      serieId: serie.id,
      anoLetivoId: anoLetivo.id,
    },
  })
  return nova.id
}

// Ações

/**
 * Cria um novo aluno, opcionalmente efetivando matrícula em uma turma
 * e vinculando (ou cadastrando) um responsável principal.
 */
export async function criarAluno(
  prevState: AlunoState,
  formData: FormData
): Promise<AlunoState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'alunos:criar')) {
    return { message: 'Você não tem permissão para cadastrar alunos.' }
  }

  const validated = CriarAlunoSchema.safeParse({
    nome: formData.get('nome'),
    nomeSocial: textoOpcional(formData.get('nomeSocial')),
    cpf: textoOpcional(formData.get('cpf')),
    rg: textoOpcional(formData.get('rg')),
    certidaoNascimento: textoOpcional(formData.get('certidaoNascimento')),
    dataNascimento: formData.get('dataNascimento'),
    sexo: textoOpcional(formData.get('sexo')),
    status: textoOpcional(formData.get('status')),
    endereco: textoOpcional(formData.get('endereco')),
    cidade: textoOpcional(formData.get('cidade')),
    estado: textoOpcional(formData.get('estado')),
    cep: textoOpcional(formData.get('cep')),
    escolaAnterior: textoOpcional(formData.get('escolaAnterior')),
    alergias: textoOpcional(formData.get('alergias')),
    necessidadesEspeciais: textoOpcional(formData.get('necessidadesEspeciais')),
    planoDeSaude: textoOpcional(formData.get('planoDeSaude')),
    observacoes: textoOpcional(formData.get('observacoes')),
    consentimentoImagem: boolCheckbox(formData.get('consentimentoImagem')),
    valorMensalidade: valorOpcional(formData.get('valorMensalidade')),
    descontoMensalidade: valorOpcional(formData.get('descontoMensalidade')),
    turmaId: textoOpcional(formData.get('turmaId')),
    serieCodigo: textoOpcional(formData.get('serieCodigo')),
    turno: textoOpcional(formData.get('turno')),
    responsavelModo: textoOpcional(formData.get('responsavelModo')) ?? 'nenhum',
    responsavelId: textoOpcional(formData.get('responsavelId')),
    respNome: textoOpcional(formData.get('respNome')),
    respCpf: textoOpcional(formData.get('respCpf')),
    respEmail: textoOpcional(formData.get('respEmail')),
    respTelefone: textoOpcional(formData.get('respTelefone')),
    respWhatsapp: textoOpcional(formData.get('respWhatsapp')),
    respParentesco: textoOpcional(formData.get('respParentesco')),
    respEndereco: textoOpcional(formData.get('respEndereco')),
    respFinanceiro: boolCheckbox(formData.get('respFinanceiro')),
    respPedagogico: boolCheckbox(formData.get('respPedagogico')) || true,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const data = validated.data

  if ((data.descontoMensalidade ?? 0) > (data.valorMensalidade ?? 0) && data.descontoMensalidade) {
    return { errors: { descontoMensalidade: ['O desconto não pode ser maior que a mensalidade.'] } }
  }

  // Validações condicionais do bloco de responsável
  if (data.responsavelModo === 'existente' && !data.responsavelId) {
    return { message: 'Selecione um responsável existente ou troque o modo de vínculo.' }
  }
  if (data.responsavelModo === 'novo') {
    if (!data.respNome || data.respNome.length < 2) {
      return { message: 'Informe o nome completo do responsável.' }
    }
    if (!data.respTelefone) {
      return { message: 'Informe o telefone do responsável.' }
    }
    if (!data.respParentesco) {
      return { message: 'Informe o parentesco do responsável.' }
    }
  }

  try {
    const novoAluno = await prisma.$transaction(async (tx) => {
      const aluno = await tx.aluno.create({
        data: {
          nome: data.nome,
          nomeSocial: data.nomeSocial,
          cpf: data.cpf,
          rg: data.rg,
          certidaoNascimento: data.certidaoNascimento,
          dataNascimento: new Date(data.dataNascimento),
          sexo: data.sexo,
          status: data.status ?? 'PENDENTE',
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          escolaAnterior: data.escolaAnterior,
          alergias: data.alergias,
          necessidadesEspeciais: data.necessidadesEspeciais,
          planoDeSaude: data.planoDeSaude,
          observacoes: data.observacoes,
          consentimentoImagem: data.consentimentoImagem ?? false,
          valorMensalidade: data.valorMensalidade ?? null,
          descontoMensalidade: data.descontoMensalidade ?? 0,
        },
      })

      // Matrícula (turma escolhida diretamente ou resolvida por série + turno)
      const turmaMatricula =
        data.turmaId ?? (data.serieCodigo ? await resolverTurma(tx, data.serieCodigo, data.turno ?? 'MANHA') : undefined)
      if (turmaMatricula) {
        const ano = new Date().getFullYear()
        const numero = `${ano}-${Date.now().toString().slice(-6)}`
        await tx.matricula.create({
          data: {
            numero,
            status: 'ATIVA',
            dataEfetivacao: new Date(),
            alunoId: aluno.id,
            turmaId: turmaMatricula,
          },
        })
      }

      // Responsável (vincular existente ou cadastrar novo)
      if (data.responsavelModo === 'existente' && data.responsavelId) {
        await tx.alunoResponsavel.create({
          data: {
            alunoId: aluno.id,
            responsavelId: data.responsavelId,
            principal: true,
          },
        })
      } else if (data.responsavelModo === 'novo' && data.respNome && data.respTelefone && data.respParentesco) {
        const responsavel = await tx.responsavel.create({
          data: {
            nome: data.respNome,
            cpf: data.respCpf,
            email: data.respEmail,
            telefone: data.respTelefone,
            whatsapp: data.respWhatsapp,
            parentesco: data.respParentesco,
            endereco: data.respEndereco,
            responsavelFinanceiro: data.respFinanceiro ?? false,
            responsavelPedagogico: data.respPedagogico ?? true,
          },
        })
        await tx.alunoResponsavel.create({
          data: {
            alunoId: aluno.id,
            responsavelId: responsavel.id,
            principal: true,
          },
        })
      }

      return aluno
    })

    await registrarAuditoria({
      tipo: 'ALUNO_CRIADO',
      descricao: `Aluno "${novoAluno.nome}" cadastrado.`,
      entidade: 'Aluno',
      entidadeId: novoAluno.id,
      usuarioId: sessao.userId,
      dadosDepois: novoAluno,
    })
  } catch (error) {
    return { message: mensagemErroPrisma(error) }
  }

  redirect('/admin/alunos')
}

/**
 * Atualiza os dados cadastrais de um aluno já existente.
 * Também permite reatribuir a turma da matrícula ativa (ou criar uma nova).
 */
export async function atualizarAluno(
  prevState: AlunoState,
  formData: FormData
): Promise<AlunoState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'alunos:editar')) {
    return { message: 'Você não tem permissão para editar alunos.' }
  }

  const validated = AtualizarAlunoSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    nomeSocial: textoOpcional(formData.get('nomeSocial')),
    cpf: textoOpcional(formData.get('cpf')),
    rg: textoOpcional(formData.get('rg')),
    certidaoNascimento: textoOpcional(formData.get('certidaoNascimento')),
    dataNascimento: formData.get('dataNascimento'),
    sexo: textoOpcional(formData.get('sexo')),
    status: textoOpcional(formData.get('status')),
    endereco: textoOpcional(formData.get('endereco')),
    cidade: textoOpcional(formData.get('cidade')),
    estado: textoOpcional(formData.get('estado')),
    cep: textoOpcional(formData.get('cep')),
    escolaAnterior: textoOpcional(formData.get('escolaAnterior')),
    alergias: textoOpcional(formData.get('alergias')),
    necessidadesEspeciais: textoOpcional(formData.get('necessidadesEspeciais')),
    planoDeSaude: textoOpcional(formData.get('planoDeSaude')),
    observacoes: textoOpcional(formData.get('observacoes')),
    consentimentoImagem: boolCheckbox(formData.get('consentimentoImagem')),
    valorMensalidade: valorOpcional(formData.get('valorMensalidade')),
    descontoMensalidade: valorOpcional(formData.get('descontoMensalidade')),
    turmaId: textoOpcional(formData.get('turmaId')),
    serieCodigo: textoOpcional(formData.get('serieCodigo')),
    turno: textoOpcional(formData.get('turno')),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Verifique os campos destacados.' }
  }

  const { id, turmaId: turmaIdForm, serieCodigo, turno, ...resto } = validated.data

  if ((resto.descontoMensalidade ?? 0) > (resto.valorMensalidade ?? 0) && resto.descontoMensalidade) {
    return { errors: { descontoMensalidade: ['O desconto não pode ser maior que a mensalidade.'] } }
  }

  try {
    const alunoAntes = await prisma.aluno.findUnique({
      where: { id },
      include: { matriculas: true },
    })
    if (!alunoAntes) {
      return { message: 'Aluno não encontrado.' }
    }

    const alunoAtualizado = await prisma.$transaction(async (tx) => {
      const aluno = await tx.aluno.update({
        where: { id },
        data: {
          nome: resto.nome,
          nomeSocial: resto.nomeSocial,
          cpf: resto.cpf,
          rg: resto.rg,
          certidaoNascimento: resto.certidaoNascimento,
          dataNascimento: new Date(resto.dataNascimento),
          sexo: resto.sexo,
          status: resto.status ?? alunoAntes.status,
          endereco: resto.endereco,
          cidade: resto.cidade,
          estado: resto.estado,
          cep: resto.cep,
          escolaAnterior: resto.escolaAnterior,
          alergias: resto.alergias,
          necessidadesEspeciais: resto.necessidadesEspeciais,
          planoDeSaude: resto.planoDeSaude,
          observacoes: resto.observacoes,
          consentimentoImagem: resto.consentimentoImagem ?? false,
          valorMensalidade: resto.valorMensalidade ?? null,
          descontoMensalidade: resto.descontoMensalidade ?? 0,
        },
      })

      // Reatribuição de turma (direta ou por série + turno)
      const turmaId =
        turmaIdForm ?? (serieCodigo ? await resolverTurma(tx, serieCodigo, turno ?? 'MANHA') : undefined)
      if (turmaId) {
        const matriculaAtiva = alunoAntes.matriculas.find((m) => m.status === 'ATIVA')
        if (matriculaAtiva && matriculaAtiva.turmaId !== turmaId) {
          await tx.matricula.update({
            where: { id: matriculaAtiva.id },
            data: { turmaId },
          })
        } else if (!matriculaAtiva) {
          const ano = new Date().getFullYear()
          const numero = `${ano}-${Date.now().toString().slice(-6)}`
          await tx.matricula.create({
            data: {
              numero,
              status: 'ATIVA',
              dataEfetivacao: new Date(),
              alunoId: aluno.id,
              turmaId,
            },
          })
        }
      }

      return aluno
    })

    await registrarAuditoria({
      tipo: 'ALUNO_ATUALIZADO',
      descricao: `Aluno "${alunoAtualizado.nome}" atualizado.`,
      entidade: 'Aluno',
      entidadeId: alunoAtualizado.id,
      usuarioId: sessao.userId,
      dadosAntes: alunoAntes,
      dadosDepois: alunoAtualizado,
    })
  } catch (error) {
    return { message: mensagemErroPrisma(error) }
  }

  revalidatePath('/admin/alunos')
  redirect('/admin/alunos')
}

/**
 * Altera apenas o status do aluno (ex.: ATIVO -> TRANCADO).
 */
export async function atualizarStatusAluno(
  alunoId: string,
  novoStatus: string
): Promise<{ success: boolean; message: string }> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'alunos:status')) {
    return { success: false, message: 'Você não tem permissão para alterar o status de alunos.' }
  }

  const statusValidado = StatusAlunoEnum.safeParse(novoStatus)
  if (!statusValidado.success) {
    return { success: false, message: 'Status inválido.' }
  }

  const alunoAntes = await prisma.aluno.findUnique({ where: { id: alunoId } })
  if (!alunoAntes) {
    return { success: false, message: 'Aluno não encontrado.' }
  }

  const alunoDepois = await prisma.aluno.update({
    where: { id: alunoId },
    data: { status: statusValidado.data },
  })

  await registrarAuditoria({
    tipo: 'ALUNO_STATUS_ALTERADO',
    descricao: `Status do aluno "${alunoAntes.nome}" alterado de ${alunoAntes.status} para ${alunoDepois.status}.`,
    entidade: 'Aluno',
    entidadeId: alunoId,
    usuarioId: sessao.userId,
    dadosAntes: { status: alunoAntes.status },
    dadosDepois: { status: alunoDepois.status },
  })

  revalidatePath('/admin/alunos')
  return { success: true, message: 'Status atualizado com sucesso.' }
}

/**
 * Vincula um responsável já cadastrado a um aluno existente.
 */
export async function vincularResponsavelAoAluno(
  prevState: AlunoState,
  formData: FormData
): Promise<AlunoState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'alunos:editar')) {
    return { message: 'Você não tem permissão para vincular responsáveis.' }
  }

  const alunoId = textoOpcional(formData.get('alunoId'))
  const responsavelId = textoOpcional(formData.get('responsavelId'))
  const principal = boolCheckbox(formData.get('principal'))

  if (!alunoId || !responsavelId) {
    return { message: 'Selecione o aluno e o responsável para vincular.' }
  }

  try {
    await prisma.alunoResponsavel.create({
      data: { alunoId, responsavelId, principal },
    })

    await registrarAuditoria({
      tipo: 'ALUNO_RESPONSAVEL_VINCULADO',
      descricao: `Responsável vinculado ao aluno.`,
      entidade: 'AlunoResponsavel',
      entidadeId: alunoId,
      usuarioId: sessao.userId,
      dadosDepois: { alunoId, responsavelId, principal },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { message: 'Este responsável já está vinculado a este aluno.' }
    }
    return { message: 'Ocorreu um erro ao vincular o responsável.' }
  }

  revalidatePath(`/admin/alunos/editar/${alunoId}`)
  return { success: true, message: 'Responsável vinculado com sucesso.' }
}
