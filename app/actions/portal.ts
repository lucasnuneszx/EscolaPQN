'use server'
// ─────────────────────────────────────────────────────────────
// Server Actions do Portal — chamada e lançamento de notas
// Executadas apenas por PROFESSOR (ou ADMIN), sempre escopadas
// ao vínculo (TurmaDisciplina) de propriedade do professor logado.
// ─────────────────────────────────────────────────────────────
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { temPermissao } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

export type PortalActionState =
  | {
      error?: string
      success?: boolean
      message?: string
    }
  | undefined

const STATUS_FREQUENCIA_VALIDOS = ['PRESENTE', 'FALTA', 'FALTA_JUSTIFICADA']

/**
 * Garante que o professor logado é o dono do vínculo turma+disciplina.
 * Retorna o vínculo com turma/disciplina carregados, ou null se não autorizado.
 */
async function obterVinculoDoProfessor(turmaDisciplinaId: string, usuarioId: string) {
  const vinculo = await prisma.turmaDisciplina.findUnique({
    where: { id: turmaDisciplinaId },
    include: { turma: true, disciplina: true, professor: true },
  })

  if (!vinculo || !vinculo.professor || vinculo.professor.usuarioId !== usuarioId) {
    return null
  }

  return vinculo
}

/**
 * Registra (ou atualiza) a chamada do dia para a turma de um vínculo
 * turma+disciplina, com a frequência de cada aluno matriculado.
 */
export async function fazerChamada(
  _prevState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'chamada:fazer')) {
    return { error: 'Você não tem permissão para fazer chamada.' }
  }

  const turmaDisciplinaId = String(formData.get('turmaDisciplinaId') ?? '').trim()
  const dataStr = String(formData.get('data') ?? '').trim()

  if (!turmaDisciplinaId || !/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
    return { error: 'Dados do formulário incompletos ou inválidos.' }
  }

  const vinculo = await obterVinculoDoProfessor(turmaDisciplinaId, sessao.userId)
  if (!vinculo) {
    return { error: 'Você não tem acesso a esta turma.' }
  }

  const data = new Date(`${dataStr}T12:00:00`)
  if (Number.isNaN(data.getTime())) {
    return { error: 'Data inválida.' }
  }

  // Descobre o período avaliativo vigente para a data escolhida
  const periodo =
    (await prisma.periodoAvaliativo.findFirst({
      where: {
        anoLetivo: { ativo: true },
        dataInicio: { lte: data },
        dataFim: { gte: data },
      },
    })) ??
    (await prisma.periodoAvaliativo.findFirst({
      where: { anoLetivo: { ativo: true }, ativo: true },
      orderBy: { numero: 'desc' },
    }))

  if (!periodo) {
    return { error: 'Nenhum período avaliativo ativo encontrado para o ano letivo vigente.' }
  }

  // Coleta status de frequência por aluno (campos "freq_<alunoId>")
  const registros: { alunoId: string; status: string }[] = []
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('freq_')) continue
    const alunoId = key.slice('freq_'.length)
    const status = String(value)
    if (!STATUS_FREQUENCIA_VALIDOS.includes(status)) continue
    registros.push({ alunoId, status })
  }

  if (registros.length === 0) {
    return { error: 'Nenhum aluno para registrar nesta turma.' }
  }

  // Confirma que os alunos pertencem de fato à turma (matrícula ativa)
  const matriculasValidas = await prisma.matricula.findMany({
    where: { turmaId: vinculo.turmaId, status: 'ATIVA', alunoId: { in: registros.map((r) => r.alunoId) } },
    select: { alunoId: true },
  })
  const alunosValidos = new Set(matriculasValidas.map((m) => m.alunoId))
  const registrosValidos = registros.filter((r) => alunosValidos.has(r.alunoId))

  if (registrosValidos.length === 0) {
    return { error: 'Nenhum aluno válido para registrar nesta turma.' }
  }

  const chamada = await prisma.chamada.upsert({
    where: { turmaId_data: { turmaId: vinculo.turmaId, data } },
    update: { professorId: vinculo.professorId },
    create: {
      turmaId: vinculo.turmaId,
      data,
      periodoId: periodo.id,
      professorId: vinculo.professorId,
    },
  })

  for (const registro of registrosValidos) {
    await prisma.frequencia.upsert({
      where: { alunoId_chamadaId: { alunoId: registro.alunoId, chamadaId: chamada.id } },
      update: { status: registro.status, turmaDisciplinaId },
      create: {
        alunoId: registro.alunoId,
        chamadaId: chamada.id,
        status: registro.status,
        turmaDisciplinaId,
      },
    })
  }

  await registrarAuditoria({
    tipo: 'CHAMADA_REGISTRADA',
    descricao: `Chamada registrada para ${vinculo.turma.nome} (${vinculo.disciplina.nome}) em ${dataStr} — ${registrosValidos.length} aluno(s)`,
    entidade: 'Chamada',
    entidadeId: chamada.id,
    usuarioId: sessao.userId,
    dadosDepois: { turmaId: vinculo.turmaId, data: dataStr, registros: registrosValidos },
  })

  revalidatePath(`/portal/turmas/${turmaDisciplinaId}/chamada`)
  revalidatePath('/portal/frequencia')

  return { success: true, message: 'Chamada registrada com sucesso.' }
}

/**
 * Lança (ou atualiza) as notas de um período avaliativo para todos os
 * alunos matriculados na turma de um vínculo turma+disciplina.
 */
export async function lancarNotas(
  _prevState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const sessao = await getSession()
  if (!sessao || !temPermissao(sessao.perfil, 'notas:lancar')) {
    return { error: 'Você não tem permissão para lançar notas.' }
  }

  const turmaDisciplinaId = String(formData.get('turmaDisciplinaId') ?? '').trim()
  const periodoId = String(formData.get('periodoId') ?? '').trim()

  if (!turmaDisciplinaId || !periodoId) {
    return { error: 'Selecione o período avaliativo.' }
  }

  const vinculo = await obterVinculoDoProfessor(turmaDisciplinaId, sessao.userId)
  if (!vinculo) {
    return { error: 'Você não tem acesso a esta turma.' }
  }

  const periodo = await prisma.periodoAvaliativo.findUnique({ where: { id: periodoId } })
  if (!periodo) {
    return { error: 'Período avaliativo inválido.' }
  }

  // Coleta notas por aluno (campos "nota_<alunoId>")
  const registros: { alunoId: string; valor: number | null }[] = []
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('nota_')) continue
    const alunoId = key.slice('nota_'.length)
    const bruto = String(value).trim().replace(',', '.')

    if (bruto === '') {
      registros.push({ alunoId, valor: null })
      continue
    }

    const numero = Number(bruto)
    if (Number.isNaN(numero) || numero < 0 || numero > 10) {
      return { error: 'Há uma nota inválida no formulário. Use valores entre 0 e 10.' }
    }
    registros.push({ alunoId, valor: numero })
  }

  if (registros.length === 0) {
    return { error: 'Nenhuma nota informada.' }
  }

  // Confirma que os alunos pertencem de fato à turma (matrícula ativa)
  const matriculasValidas = await prisma.matricula.findMany({
    where: { turmaId: vinculo.turmaId, status: 'ATIVA', alunoId: { in: registros.map((r) => r.alunoId) } },
    select: { alunoId: true },
  })
  const alunosValidos = new Set(matriculasValidas.map((m) => m.alunoId))
  const registrosValidos = registros.filter((r) => alunosValidos.has(r.alunoId))

  if (registrosValidos.length === 0) {
    return { error: 'Nenhum aluno válido para lançar notas nesta turma.' }
  }

  for (const registro of registrosValidos) {
    await prisma.nota.upsert({
      where: {
        alunoId_turmaDisciplinaId_periodoId: {
          alunoId: registro.alunoId,
          turmaDisciplinaId,
          periodoId,
        },
      },
      update: { valor: registro.valor, professorId: vinculo.professorId },
      create: {
        alunoId: registro.alunoId,
        turmaDisciplinaId,
        periodoId,
        valor: registro.valor,
        professorId: vinculo.professorId,
      },
    })
  }

  await registrarAuditoria({
    tipo: 'NOTAS_LANCADAS',
    descricao: `Notas lançadas para ${vinculo.turma.nome} (${vinculo.disciplina.nome}) — ${periodo.nome} — ${registrosValidos.length} aluno(s)`,
    entidade: 'Nota',
    entidadeId: turmaDisciplinaId,
    usuarioId: sessao.userId,
    dadosDepois: { periodoId, registros: registrosValidos },
  })

  revalidatePath(`/portal/turmas/${turmaDisciplinaId}/notas`)
  revalidatePath('/portal/notas')

  return { success: true, message: 'Notas lançadas com sucesso.' }
}
