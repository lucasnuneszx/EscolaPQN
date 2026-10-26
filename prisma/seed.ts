// Seed de desenvolvimento: 38 alunos fictícios, 20 responsáveis e mensalidades de 2026.
// Uso: npx prisma db seed
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({
  adapter,
  log: ['error']
})

// Nomes fictícios para gerar os dados
const NOMES_MASCULINOS = [
  'Arthur', 'Enzo', 'Gabriel', 'Lucas', 'Matheus', 'Pedro', 'Felipe', 
  'Guilherme', 'Nicolas', 'Gustavo', 'Rafael', 'Daniel', 'Leonardo', 
  'Thiago', 'Vinicius', 'Eduardo', 'Bruno', 'Samuel', 'Rodrigo', 'Murilo',
  'Bernardo', 'Heitor', 'Davi', 'Lorenzo', 'Benjamin', 'Miguel', 'Joao'
]

const NOMES_FEMININOS = [
  'Sophia', 'Alice', 'Julia', 'Isabella', 'Manuela', 'Laura', 'Luiza', 
  'Valentina', 'Giovanna', 'Maria Eduarda', 'Beatriz', 'Maria Clara', 
  'Helena', 'Mariana', 'Camila', 'Ana Julia', 'Isabela', 'Leticia', 
  'Ana Clara', 'Melissa', 'Yasmin', 'Nicole', 'Rafaela', 'Larissa'
]

const SOBRENOMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 
  'Alves', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 
  'Almeida', 'Lopes', 'Soares', 'Dias', 'Vieira', 'Teixeira', 'Araujo'
]

const RESPONSA_NOMES = [
  'Carlos Eduardo Santos', 'Mariana de Souza', 'Beatriz Ramos Ferreira', 
  'Roberto Albuquerque', 'Jefferson Almeida', 'Andreia Ribeiro', 
  'Priscila Lopes', 'Rodrigo Vieira', 'Fernando Carvalho', 
  'Luciana Martins', 'Vanessa Costa', 'Marcelo Oliveira', 
  'Jose Rodrigues', 'Alessandra Silva', 'Fabio Araujo', 'Claudio Lima'
]

const PARENTESCOS = ['Mãe', 'Pai', 'Avó', 'Tutor']

function obterItemAleatorio<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function gerarCPF(): string {
  let cpf = ''
  for (let i = 0; i < 11; i++) {
    cpf += Math.floor(Math.random() * 10).toString()
  }
  return cpf
}

async function main() {
  console.log('Iniciando seed...')

  await prisma.auditLog.deleteMany()
  await prisma.eventoCalendario.deleteMany()
  await prisma.anexoComunicado.deleteMany()
  await prisma.comunicadoTurma.deleteMany()
  await prisma.comunicado.deleteMany()
  await prisma.asaasWebhookLog.deleteMany()
  await prisma.asaasCobranca.deleteMany()
  await prisma.mensalidade.deleteMany()
  await prisma.frequencia.deleteMany()
  await prisma.chamada.deleteMany()
  await prisma.nota.deleteMany()
  await prisma.turmaDisciplina.deleteMany()
  await prisma.disciplina.deleteMany()
  await prisma.contratoDigital.deleteMany()
  await prisma.matricula.deleteMany()
  await prisma.alunoResponsavel.deleteMany()
  await prisma.documentoAluno.deleteMany()
  await prisma.formularioMatricula.deleteMany()
  await prisma.aluno.deleteMany()
  await prisma.responsavel.deleteMany()
  await prisma.funcionario.deleteMany()
  await prisma.professor.deleteMany()
  await prisma.turma.deleteMany()
  await prisma.serie.deleteMany()
  await prisma.periodoAvaliativo.deleteMany()
  await prisma.anoLetivo.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.escola.deleteMany()

  // Configuração da escola
  const escola = await prisma.escola.create({
    data: {
      id: 'escola-pqn',
      nome: 'Centro Educacional Pequeno Príncipe',
      cnpj: '49.575.705/0001-26',
      emailContato: 'secretaria@escolapqn.com.br',
      telefone: '(71) 8722-6877',
      whatsapp: '(71) 8722-6877',
      endereco: 'Av. Catarina Paraguassu, 764 — Jardim Alvorada',
      cidade: 'Dias d\'Ávila',
      estado: 'BA',
      corPrimaria: '#B91C1C',
      corSecundaria: '#F59E0B',
      diaVencimentoPadrao: 10,
      multaPercentual: 2.0,
      jurosPercentual: 1.0,
    },
  })

  // Ano letivo 2026
  const anoLetivo = await prisma.anoLetivo.create({
    data: {
      ano: 2026,
      ativo: true,
      dataInicio: new Date('2026-02-05'),
      dataFim: new Date('2026-12-10'),
      escolaId: escola.id,
    },
  })

  // Bimestres
  const bimestresData = [
    { id: '2026-b1', nome: '1º Bimestre', numero: 1, dataInicio: new Date('2026-02-05'), dataFim: new Date('2026-04-20') },
    { id: '2026-b2', nome: '2º Bimestre', numero: 2, dataInicio: new Date('2026-04-22'), dataFim: new Date('2026-06-30') },
    { id: '2026-b3', nome: '3º Bimestre', numero: 3, dataInicio: new Date('2026-07-15'), dataFim: new Date('2026-09-30') },
    { id: '2026-b4', nome: '4º Bimestre', numero: 4, dataInicio: new Date('2026-10-01'), dataFim: new Date('2026-12-10') },
  ]
  for (const b of bimestresData) {
    await prisma.periodoAvaliativo.create({
      data: { ...b, ativo: b.numero <= 2, anoLetivoId: anoLetivo.id },
    })
  }

  // Séries
  const seriesData = [
    { nome: 'Maternal II', codigo: 'MAT2', nivel: 'educacao_infantil', ordem: 1 },
    { nome: 'Jardim II', codigo: 'JAR2', nivel: 'educacao_infantil', ordem: 2 },
    { nome: '1º Ano EF', codigo: 'EF1', nivel: 'ensino_fundamental', ordem: 3 },
    { nome: '2º Ano EF', codigo: 'EF2', nivel: 'ensino_fundamental', ordem: 4 },
    { nome: '3º Ano EF', codigo: 'EF3', nivel: 'ensino_fundamental', ordem: 5 },
    { nome: '4º Ano EF', codigo: 'EF4', nivel: 'ensino_fundamental', ordem: 6 },
    { nome: '5º Ano EF', codigo: 'EF5', nivel: 'ensino_fundamental', ordem: 7 },
  ]
  const seriesIds: Record<string, string> = {}
  for (const s of seriesData) {
    const criada = await prisma.serie.create({ data: s })
    seriesIds[s.codigo] = criada.id
  }

  // Turmas
  const turmasIds = ['turma-mat2', 'turma-jar2', 'turma-ef1', 'turma-ef5']
  const turmasData = [
    { id: 'turma-mat2', nome: 'Maternal II A', turno: 'TARDE', capacidade: 15, sala: 'Sala A-1', serieId: seriesIds['MAT2'], anoLetivoId: anoLetivo.id },
    { id: 'turma-jar2', nome: 'Jardim II A', turno: 'TARDE', capacidade: 18, sala: 'Sala A-3', serieId: seriesIds['JAR2'], anoLetivoId: anoLetivo.id },
    { id: 'turma-ef1', nome: '1º Ano A', turno: 'MANHA', capacidade: 30, sala: 'Sala B-1', serieId: seriesIds['EF1'], anoLetivoId: anoLetivo.id },
    { id: 'turma-ef5', nome: '5º Ano A', turno: 'MANHA', capacidade: 30, sala: 'Sala B-5', serieId: seriesIds['EF5'], anoLetivoId: anoLetivo.id },
  ]
  for (const t of turmasData) {
    await prisma.turma.create({ data: t })
  }

  // Disciplinas
  const discData = [
    { nome: 'Língua Portuguesa', codigo: 'LP', cargaHoraria: 160 },
    { nome: 'Matemática', codigo: 'MAT', cargaHoraria: 160 },
    { nome: 'Ciências', codigo: 'CIE', cargaHoraria: 80 },
    { nome: 'Geografia', codigo: 'GEO', cargaHoraria: 80 },
    { nome: 'História', codigo: 'HIS', cargaHoraria: 80 },
    { nome: 'Artes', codigo: 'ART', cargaHoraria: 40 },
    { nome: 'Educação Física', codigo: 'EDF', cargaHoraria: 40 },
  ]
  const disciplinasIds: Record<string, string> = {}
  for (const d of discData) {
    const criada = await prisma.disciplina.create({ data: d })
    disciplinasIds[d.codigo] = criada.id
  }

  // Usuários Operadores
  const senhaHash = await bcrypt.hash('Escola@2026', 12)
  const userAdmin = await prisma.usuario.create({
    data: { nome: 'Juliana Castro', email: 'admin@escolapqn.com.br', senhaHash, perfil: 'ADMIN', ativo: true },
  })
  const userSecretaria = await prisma.usuario.create({
    data: { nome: 'Sandra Medeiros', email: 'secretaria@escolapqn.com.br', senhaHash, perfil: 'SECRETARIA', ativo: true },
  })

  // Professores
  const professoresInfo = [
    { nome: 'Clara Peixoto', email: 'clara.prof@escolapqn.com.br', formacao: 'Pedagogia - USP', registro: 'CRB-7123' },
    { nome: 'Marcos Bahia', email: 'marcos.prof@escolapqn.com.br', formacao: 'Licenciatura em Matemática', registro: 'CRB-8149' },
    { nome: 'Eliana Souza', email: 'eliana.prof@escolapqn.com.br', formacao: 'Letras e Literatura', registro: 'CRB-4521' },
  ]
  const professoresIds: string[] = []
  for (const p of professoresInfo) {
    const user = await prisma.usuario.create({
      data: { nome: p.nome, email: p.email, senhaHash, perfil: 'PROFESSOR', ativo: true },
    })
    const prof = await prisma.professor.create({
      data: { usuarioId: user.id, formacao: p.formacao, registro: p.registro, cpf: gerarCPF() },
    })
    professoresIds.push(prof.id)
  }

  // Vinculando Docentes às Turmas
  await prisma.turmaDisciplina.create({ data: { turmaId: 'turma-ef1', disciplinaId: disciplinasIds['LP'], professorId: professoresIds[0] } })
  await prisma.turmaDisciplina.create({ data: { turmaId: 'turma-ef1', disciplinaId: disciplinasIds['MAT'], professorId: professoresIds[1] } })
  await prisma.turmaDisciplina.create({ data: { turmaId: 'turma-ef5', disciplinaId: disciplinasIds['LP'], professorId: professoresIds[2] } })
  await prisma.turmaDisciplina.create({ data: { turmaId: 'turma-ef5', disciplinaId: disciplinasIds['MAT'], professorId: professoresIds[1] } })

  // Criação de Responsáveis (20 responsáveis)
  const responsaveisIds: string[] = []
  for (let i = 0; i < RESPONSA_NOMES.length; i++) {
    const nomeResp = RESPONSA_NOMES[i]
    const emailResp = `responsa${i}@escolapqn-teste.com.br`
    const telResp = `(71) 99${Math.floor(10000000 + Math.random() * 90000000)}`

    const user = await prisma.usuario.create({
      data: { nome: nomeResp, email: emailResp, senhaHash, perfil: 'RESPONSAVEL', ativo: true },
    })
    const resp = await prisma.responsavel.create({
      data: {
        usuarioId: user.id,
        nome: nomeResp,
        email: emailResp,
        telefone: telResp,
        parentesco: obterItemAleatorio(PARENTESCOS),
        responsavelFinanceiro: true,
        responsavelPedagogico: true,
        cpf: gerarCPF(),
        endereco: `Rua das Flores, ${i + 12} — Dias d'Ávila, BA`,
        consentimentoLGPD: true,
        consentimentoDataHora: new Date(),
      },
    })
    responsaveisIds.push(resp.id)
  }

  // Geração de Alunos (38 alunos no total)
  let contMatricula = 2000

  for (let i = 0; i < 38; i++) {
    const sexo = Math.random() > 0.5 ? 'M' : 'F'
    const nomePilha = sexo === 'M' ? NOMES_MASCULINOS : NOMES_FEMININOS
    
    const nomeAluno = `${obterItemAleatorio(nomePilha)} ${obterItemAleatorio(SOBRENOMES)} ${obterItemAleatorio(SOBRENOMES)}`
    
    // Distribuir aniversários de 2015 a 2022
    const anoNasc = 2015 + (i % 8)
    const dataNascimento = new Date(`${anoNasc}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`)

    // Definir Turma adequada à idade aproximada
    let turmaId = 'turma-ef1'
    if (anoNasc >= 2021) turmaId = 'turma-mat2'
    else if (anoNasc === 2020) turmaId = 'turma-jar2'
    else if (anoNasc <= 2016) turmaId = 'turma-ef5'

    // Status do aluno
    const status = i === 12 || i === 25 ? 'PENDENTE' : i === 34 ? 'INATIVO' : 'ATIVO'

    const aluno = await prisma.aluno.create({
      data: {
        nome: nomeAluno,
        sexo: sexo,
        dataNascimento: dataNascimento,
        status: status,
        cpf: gerarCPF(),
        endereco: `Rua das Flores, ${i + 12} — Dias d'Ávila, BA`,
        cidade: 'Dias d\'Ávila',
        estado: 'BA',
      },
    })

    const respId = responsaveisIds[i % responsaveisIds.length]
    await prisma.alunoResponsavel.create({
      data: { alunoId: aluno.id, responsavelId: respId, principal: true },
    })

    if (status === 'ATIVO') {
      contMatricula++
      const matricula = await prisma.matricula.create({
        data: {
          numero: `2026-${contMatricula}`,
          status: 'ATIVA',
          dataEfetivacao: new Date('2026-01-15'),
          alunoId: aluno.id,
          turmaId: turmaId,
        },
      })

      await prisma.contratoDigital.create({
        data: {
          versao: '2026.v1',
          textoContrato: 'Contrato de Prestação de Serviços Letivos do Centro Educacional Pequeno Príncipe...',
          assinado: true,
          aceiteData: new Date('2026-01-15'),
          aceiteIp: '192.168.0.32',
          matriculaId: matricula.id,
        },
      })

      // Geração de Financeiro Completo para 2026
      const valorBase = turmaId.includes('mat2') || turmaId.includes('jar2') ? 430.0 : 540.0
      // 15% dos alunos têm algum tipo de bolsa letiva de 10% ou 20%
      const descPercentual = i % 7 === 0 ? 20.0 : i % 9 === 0 ? 10.0 : 0
      const valorDesconto = (valorBase * descPercentual) / 100
      const valorFinal = valorBase - valorDesconto

      const meses = [
        { ref: '2026-02', data: new Date('2026-02-10'), pago: true },
        { ref: '2026-03', data: new Date('2026-03-10'), pago: true },
        { ref: '2026-04', data: new Date('2026-04-10'), pago: true },
        { ref: '2026-05', data: new Date('2026-05-10'), pago: true },
        { ref: '2026-06', data: new Date('2026-06-10'), pago: true },
        // Junho em atraso apenas para alguns alunos específicos para gerar inadimplência no dashboard (cerca de 20%)
        { ref: '2026-06', data: new Date('2026-06-10'), pago: i % 5 !== 0 }, 
        { ref: '2026-07', data: new Date('2026-07-10'), pago: false }, // Julho pendente (a vencer)
        { ref: '2026-08', data: new Date('2026-08-10'), pago: false },
        { ref: '2026-09', data: new Date('2026-09-10'), pago: false },
      ]

      for (const m of meses) {
        let statusFin = 'PENDENTE'
        const hoje = new Date()

        if (m.pago) {
          statusFin = 'PAGO'
        } else if (m.data < hoje) {
          statusFin = 'VENCIDO'
        }

        const mensalidade = await prisma.mensalidade.create({
          data: {
            referencia: m.ref,
            valorBase,
            valorDesconto,
            tipoDesconto: descPercentual > 0 ? 'BOLSA' : null,
            valorFinal,
            dataVencimento: m.data,
            status: statusFin,
            dataPagamento: statusFin === 'PAGO' ? m.data : null,
            valorPago: statusFin === 'PAGO' ? valorFinal : null,
            alunoId: aluno.id,
            responsavelId: respId,
          },
        })

        // Boleto Asaas
        await prisma.asaasCobranca.create({
          data: {
            asaasId: `pay_asaas_${Math.random().toString(36).substr(2, 9)}`,
            tipo: 'BOLETO',
            status: statusFin === 'PAGO' ? 'RECEIVED' : statusFin === 'VENCIDO' ? 'OVERDUE' : 'PENDING',
            urlBoleto: 'https://sandbox.asaas.com/d/cobrancas/exemplo',
            dataVencimento: m.data,
            valorCobranca: valorFinal,
            mensalidadeId: mensalidade.id,
          },
        })
      }
    }
  }

  // Comunicados
  await prisma.comunicado.create({
    data: {
      titulo: 'Retorno das Atividades Pedagógicas - Recesso de Julho',
      conteudo: 'Estimadas famílias,\n\nRelembramos que as férias letivas de julho finalizarão no dia 14 de julho. Retornaremos com as atividades letivas normais a partir do dia 15 no turno contratado. Pedimos que revisem as mochilas e certifiquem-se de que todos os cadernos e estojos estejam completos para este segundo semestre.\n\nAtenciosamente,\nDireção Acadêmica.',
      tipo: 'GERAL',
      fixado: true,
      autorId: userAdmin.id,
      anoLetivoId: anoLetivo.id,
    },
  })

  await prisma.comunicado.create({
    data: {
      titulo: 'Plantão de Atendimento e Entrega de Boletins - 2º Bimestre',
      conteudo: 'Prezados pais e responsáveis,\n\nNo dia 18 de julho realizaremos nosso Plantão Pedagógico para entrega dos boletins de desempenho escolar referentes ao 2º Bimestre letivo. O atendimento ocorrerá no auditório da escola das 08:00 às 11:30 para o turno matutino, e das 14:00 às 17:30 para o turno vespertino.\n\nA presença de todos é fundamental para o acompanhamento dos alunos.\n\nAtenciosamente,\nSecretaria Escolar.',
      tipo: 'GERAL',
      fixado: true,
      autorId: userSecretaria.id,
      anoLetivoId: anoLetivo.id,
    },
  })

  await prisma.comunicado.create({
    data: {
      titulo: 'Campanha de Conscientização sobre Uso de Uniforme Escolar',
      conteudo: 'Reforçamos aos senhores responsáveis que a entrada de alunos nas dependências da escola só será autorizada mediante o uso completo do uniforme escolar (camiseta padrão da escola, calça ou short azul marinho e calçado fechado).\n\nEssa medida visa a segurança, fácil identificação de nossos alunos e a manutenção da organização interna. Contamos com a sua colaboração.\n\nSetor de Disciplina.',
      tipo: 'GERAL',
      fixado: false,
      autorId: userAdmin.id,
      anoLetivoId: anoLetivo.id,
    },
  })

  await prisma.comunicado.create({
    data: {
      titulo: 'Cardápio Nutricional Mensal - Julho 2026',
      conteudo: 'Prezados responsáveis,\n\nJá está disponível para consulta o novo cardápio de merenda escolar desenvolvido para o mês de julho pela nutricionista responsável pela alimentação escolar de nossa instituição. O cardápio foca em frutas frescas, cereais integrais e proteínas adequadas para o desenvolvimento energético dos alunos.\n\nVocê pode solicitar a cópia impressa na secretaria ou baixar na aba de Documentos.\n\nAtenciosamente,\nNutrição Pequeno Príncipe.',
      tipo: 'GERAL',
      fixado: false,
      autorId: userSecretaria.id,
      anoLetivoId: anoLetivo.id,
    },
  })

  await prisma.comunicado.create({
    data: {
      titulo: 'Inscrições Abertas: Atividades Extracurriculares de Balé e Judô',
      conteudo: 'Temos a alegria de informar que a partir de agosto iniciaremos as turmas extras de Judô (com professor credenciado da Federação Baiana) e Balé Clássico no contraturno letivo. As vagas são limitadas por faixa etária.\n\nAs fichas de inscrição e os valores das mensalidades promocionais para alunos ativos já estão disponíveis para retirada na secretaria escolar.\n\nCoordenação de Projetos.',
      tipo: 'GERAL',
      fixado: false,
      autorId: userAdmin.id,
      anoLetivoId: anoLetivo.id,
    },
  })

  // Calendário
  const eventos = [
    { titulo: 'Retorno Escolar - 2º Semestre', dataInicio: new Date('2026-07-15'), tipo: 'evento', cor: '#1e3a8a' },
    { titulo: 'Conselho de Classe - 2º Bimestre', dataInicio: new Date('2026-07-18'), tipo: 'reuniao', cor: '#d97706' },
    { titulo: 'Feriado Municipal em Dias d\'Ávila', dataInicio: new Date('2026-08-25'), tipo: 'feriado', cor: '#dc2626' },
  ]
  for (const e of eventos) {
    await prisma.eventoCalendario.create({ data: { ...e, anoLetivoId: anoLetivo.id } })
  }

  // Auditoria
  await prisma.auditLog.create({
    data: { tipo: 'USUARIO_CRIADO', descricao: 'Operador de sementes populou 38 alunos de teste no sistema', entidade: 'Usuario', ip: '127.0.0.1', usuarioId: userAdmin.id },
  })

  console.log('Seed concluído.')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
