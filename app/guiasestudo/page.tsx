import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/public/SiteHeader'
import SiteFooter from '@/components/public/SiteFooter'

export const metadata: Metadata = {
  title: 'Guias de Uso',
  description:
    'Guias passo a passo para usar o site e o sistema do Centro Educacional Pequeno Príncipe: portal do responsável, área do professor e painel da secretaria.',
}

type Passo = { titulo: string; texto: string }
type Modulo = { id: string; titulo: string; resumo: string; passos: Passo[] }
type Grupo = { id: string; nome: string; descricao: string; modulos: Modulo[] }

const GRUPOS: Grupo[] = [
  {
    id: 'site',
    nome: 'Site da escola',
    descricao: 'Para famílias que estão conhecendo a escola.',
    modulos: [
      {
        id: 'navegar-site',
        titulo: 'Navegando pelo site',
        resumo: 'Onde encontrar cada informação sobre a escola.',
        passos: [
          { titulo: 'Use o menu do topo', texto: 'Nele estão Sobre, Educação Infantil, Ensino Fundamental, Estrutura, Depoimentos e Contato. No celular, toque no ícone de três linhas para abrir o menu.' },
          { titulo: 'Troque o tema, se preferir', texto: 'O botão de sol/lua no topo alterna entre o modo claro e o escuro.' },
          { titulo: 'Tire dúvidas rápidas', texto: 'A página FAQ, no rodapé, reúne as perguntas mais comuns sobre a escola.' },
          { titulo: 'Fale pelo WhatsApp', texto: 'O botão verde no canto da tela abre uma conversa direta com a secretaria.' },
        ],
      },
      {
        id: 'matricula-online',
        titulo: 'Fazendo a pré-matrícula online',
        resumo: 'Como enviar o interesse de matrícula para 2027.',
        passos: [
          { titulo: 'Abra a página de matrículas', texto: 'Clique no botão vermelho "Matrículas 2027" no topo do site.' },
          { titulo: 'Confira etapas e documentos', texto: 'A página mostra as 4 etapas do processo e a lista de documentos necessários.' },
          { titulo: 'Preencha o formulário', texto: 'Informe os dados do responsável, o nome da criança e a série de interesse.' },
          { titulo: 'Envie e aguarde o contato', texto: 'A secretaria retorna em até 2 dias úteis para continuar o processo.' },
        ],
      },
      {
        id: 'agendar-visita',
        titulo: 'Agendando uma visita',
        resumo: 'Como marcar um horário para conhecer a escola.',
        passos: [
          { titulo: 'Acesse Agendar visita', texto: 'O link aparece na página inicial e nas páginas de cada etapa de ensino.' },
          { titulo: 'Escolha data e horário', texto: 'Preencha seus dados e indique o melhor dia para a visita.' },
          { titulo: 'Confirme o agendamento', texto: 'Envie o formulário. A secretaria confirma o horário com você pelo WhatsApp ou telefone.' },
        ],
      },
    ],
  },
  {
    id: 'responsaveis',
    nome: 'Portal do Responsável',
    descricao: 'Para pais e responsáveis de alunos matriculados.',
    modulos: [
      {
        id: 'primeiro-acesso',
        titulo: 'Primeiro acesso e login',
        resumo: 'Como entrar no portal pela primeira vez.',
        passos: [
          { titulo: 'Clique em Portal', texto: 'O link fica no topo do site, ao lado do botão de matrículas.' },
          { titulo: 'Digite e-mail e senha', texto: 'Use o e-mail cadastrado na secretaria e a senha enviada pela escola.' },
          { titulo: 'Esqueceu a senha?', texto: 'Na tela de login, clique em "Esqueci minha senha", informe seu e-mail e siga o link recebido para criar uma nova.' },
          { titulo: 'Chegue à tela Início', texto: 'Depois de entrar você verá o resumo do seu filho e o menu lateral com todas as seções.' },
        ],
      },
      {
        id: 'notas-frequencia',
        titulo: 'Consultando notas e frequência',
        resumo: 'Acompanhe o desempenho e a presença do aluno.',
        passos: [
          { titulo: 'Abra a aba Notas', texto: 'No menu lateral, clique em Notas para ver as notas por disciplina e por período.' },
          { titulo: 'Abra a aba Frequência', texto: 'Mostra as presenças e faltas registradas pelos professores.' },
          { titulo: 'Fique atento aos alertas', texto: 'Se algo não estiver certo, fale com a secretaria ou com o professor da disciplina.' },
        ],
      },
      {
        id: 'financeiro-responsavel',
        titulo: 'Mensalidades e pagamentos',
        resumo: 'Como ver boletos, vencimentos e o que já foi pago.',
        passos: [
          { titulo: 'Abra a aba Financeiro', texto: 'Lista todas as mensalidades com valor, vencimento e situação.' },
          { titulo: 'Pague a cobrança em aberto', texto: 'Clique na mensalidade para acessar o boleto ou o Pix.' },
          { titulo: 'Confira a baixa', texto: 'Depois do pagamento, o status muda para pago automaticamente em alguns minutos ou até 1 dia útil.' },
        ],
      },
      {
        id: 'comunicados-documentos',
        titulo: 'Comunicados e documentos',
        resumo: 'Avisos da escola e arquivos para baixar.',
        passos: [
          { titulo: 'Leia os Comunicados', texto: 'Avisos, eventos e lembretes publicados pela escola aparecem nessa aba.' },
          { titulo: 'Baixe Documentos', texto: 'Declarações, contratos e arquivos da escola ficam disponíveis para download.' },
          { titulo: 'Saia com segurança', texto: 'Ao terminar, clique em Sair, principalmente em computadores compartilhados.' },
        ],
      },
    ],
  },
  {
    id: 'professores',
    nome: 'Área do Professor',
    descricao: 'Para professores lançarem chamada e notas.',
    modulos: [
      {
        id: 'turmas-professor',
        titulo: 'Acessando suas turmas',
        resumo: 'Como encontrar as turmas em que você leciona.',
        passos: [
          { titulo: 'Entre pelo Portal', texto: 'Use o mesmo login da área do professor, pelo link Portal no topo do site.' },
          { titulo: 'Abra Minhas Turmas', texto: 'No menu lateral, a lista mostra todas as turmas e disciplinas vinculadas a você.' },
          { titulo: 'Escolha a turma', texto: 'Clique na turma para acessar a chamada e o lançamento de notas.' },
        ],
      },
      {
        id: 'chamada',
        titulo: 'Fazendo a chamada',
        resumo: 'Registro de presença diária.',
        passos: [
          { titulo: 'Abra Chamada', texto: 'Dentro da turma, clique em Chamada.' },
          { titulo: 'Marque presença ou falta', texto: 'Todos começam como presentes. Marque apenas os alunos que faltaram.' },
          { titulo: 'Salve a chamada', texto: 'Clique em salvar. A frequência aparece na hora para os responsáveis.' },
        ],
      },
      {
        id: 'notas-professor',
        titulo: 'Lançando notas',
        resumo: 'Como registrar as avaliações do período.',
        passos: [
          { titulo: 'Abra Notas na turma', texto: 'Dentro da turma, clique em Notas e escolha a disciplina e o período.' },
          { titulo: 'Digite as notas', texto: 'Preencha a nota de cada aluno na grade.' },
          { titulo: 'Revise e salve', texto: 'Confira os valores antes de salvar. As notas ficam visíveis no portal dos responsáveis.' },
        ],
      },
    ],
  },
  {
    id: 'secretaria',
    nome: 'Painel da Secretaria',
    descricao: 'Para a equipe administrativa e a direção.',
    modulos: [
      {
        id: 'dashboard-leads',
        titulo: 'Dashboard e Leads & Matrículas',
        resumo: 'Acompanhe os interessados que chegam pelo site.',
        passos: [
          { titulo: 'Veja o Dashboard', texto: 'A tela inicial do painel mostra os números da escola e alertas financeiros.' },
          { titulo: 'Abra Leads & Matrículas', texto: 'Cada formulário de matrícula, visita ou contato enviado no site aparece aqui. Novos leads geram aviso no painel.' },
          { titulo: 'Responda pelo WhatsApp', texto: 'Use o botão do lead para abrir o WhatsApp já com uma mensagem pronta.' },
          { titulo: 'Atualize o status', texto: 'Marque em que etapa está cada família para não perder nenhum contato.' },
        ],
      },
      {
        id: 'cadastros',
        titulo: 'Cadastrando alunos, responsáveis e professores',
        resumo: 'Ordem recomendada para montar os cadastros.',
        passos: [
          { titulo: 'Cadastre o responsável', texto: 'Em Responsáveis, clique em Novo. O e-mail informado será o login do portal.' },
          { titulo: 'Cadastre o aluno', texto: 'Em Alunos, clique em Novo e vincule o aluno ao responsável e à turma.' },
          { titulo: 'Cadastre os professores', texto: 'Em Professores, clique em Novo. Eles recebem acesso à Área do Professor.' },
          { titulo: 'Edite quando precisar', texto: 'Em cada lista, use o botão de editar para corrigir dados.' },
        ],
      },
      {
        id: 'turmas-academico',
        titulo: 'Turmas, matérias e notas',
        resumo: 'Organização acadêmica do ano letivo.',
        passos: [
          { titulo: 'Crie as séries e disciplinas', texto: 'Em Matérias & Notas, cadastre as séries e as disciplinas da escola.' },
          { titulo: 'Crie as turmas', texto: 'Em Turmas, clique em Novo e informe série, turno e ano.' },
          { titulo: 'Configure a turma', texto: 'Em Configurar, vincule as disciplinas e os professores responsáveis.' },
          { titulo: 'Acompanhe as notas', texto: 'Em Matérias & Notas você vê e corrige as notas lançadas pelos professores.' },
        ],
      },
      {
        id: 'financeiro-admin',
        titulo: 'Mensalidades e cobranças',
        resumo: 'Gerando e acompanhando os pagamentos.',
        passos: [
          { titulo: 'Abra Mensalidades', texto: 'Lista todas as cobranças com filtros por situação e mês.' },
          { titulo: 'Gere uma cobrança', texto: 'Clique em Nova cobrança, escolha o aluno, o valor e o mês de referência.' },
          { titulo: 'Use o faturamento em lote', texto: 'Em Faturamento, gere as mensalidades do mês para todos os alunos de uma vez.' },
          { titulo: 'Acompanhe pagamentos', texto: 'Pagamentos confirmados mudam de status sozinhos. Clique na cobrança para ver detalhes ou dar baixa manual.' },
        ],
      },
      {
        id: 'avisos-calendario',
        titulo: 'Mural de Avisos, Documentos e Calendário',
        resumo: 'Comunicação com as famílias.',
        passos: [
          { titulo: 'Publique um aviso', texto: 'Em Mural de Avisos, clique em Novo, escreva o comunicado e publique. Ele aparece no portal das famílias.' },
          { titulo: 'Envie documentos', texto: 'Em Documentos, clique em Novo e anexe o arquivo para disponibilizar aos responsáveis.' },
          { titulo: 'Monte o calendário', texto: 'Em Calendário Letivo, cadastre feriados, provas, reuniões e eventos.' },
        ],
      },
      {
        id: 'sistema',
        titulo: 'Ajustes e Auditoria (direção)',
        resumo: 'Configurações gerais, disponíveis só para o perfil Admin.',
        passos: [
          { titulo: 'Ajustes Escolares', texto: 'Confira os dados oficiais da escola, como nome e CNPJ.' },
          { titulo: 'Auditoria de Logs', texto: 'Mostra quem fez cada alteração no sistema e quando.' },
          { titulo: 'Proteja os acessos', texto: 'Cada pessoa deve usar o próprio login. Nunca compartilhe senhas.' },
        ],
      },
    ],
  },
]

export default function GuiasEstudoPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <SiteHeader paginaAtiva="/guiasestudo" />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-4">Guias de uso</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5 font-display max-w-2xl">
          Aprenda a usar o site e o sistema, passo a passo
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
          Escolha o seu perfil e siga os módulos. Cada um mostra, em poucos passos, como fazer as tarefas
          mais comuns.
        </p>

        <nav className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Perfis">
          {GRUPOS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-xl border border-slate-200 p-4 hover:border-[#b91c1c] transition-colors"
            >
              <span className="block font-semibold text-slate-900">{g.nome}</span>
              <span className="block text-sm text-slate-500 mt-1">{g.descricao}</span>
              <span className="block text-xs text-[#b91c1c] font-semibold mt-2">{g.modulos.length} módulos</span>
            </a>
          ))}
        </nav>
      </section>

      {GRUPOS.map((g, gi) => (
        <section
          key={g.id}
          id={g.id}
          className={`scroll-mt-24 border-t border-slate-100 ${gi % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
        >
          <div className="max-w-4xl mx-auto px-6 py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-2">
              {String(gi + 1).padStart(2, '0')} · {g.descricao}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 font-display">{g.nome}</h2>

            <div className="space-y-4">
              {g.modulos.map((m, mi) => (
                <details
                  key={m.id}
                  id={m.id}
                  open={mi === 0}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-xs scroll-mt-24"
                >
                  <summary className="cursor-pointer list-none p-6 flex items-start gap-4">
                    <span className="text-lg font-bold text-[#b91c1c] font-display shrink-0">
                      {gi + 1}.{mi + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-bold text-slate-900">{m.titulo}</span>
                      <span className="block text-sm text-slate-500 mt-1">{m.resumo}</span>
                    </span>
                    <span className="text-slate-400 text-xl transition-transform group-open:rotate-45 shrink-0" aria-hidden>
                      +
                    </span>
                  </summary>
                  <ol className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-5">
                    {m.passos.map((p, idx) => (
                      <li key={p.titulo} className="flex gap-4">
                        <span className="w-7 h-7 rounded-full bg-[#b91c1c]/10 text-[#b91c1c] text-sm font-semibold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{p.titulo}</p>
                          <p className="text-sm text-slate-500 leading-relaxed">{p.texto}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="max-w-6xl mx-auto px-6 py-16 text-center border-t border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-3 font-display">Ainda com dúvida?</h2>
        <p className="text-slate-500 mb-6">A secretaria ajuda você a usar qualquer parte do sistema.</p>
        <Link
          href="/contato"
          className="inline-flex bg-[#b91c1c] hover:bg-[#991b1b] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
        >
          Falar com a escola
        </Link>
      </section>

      <SiteFooter />
    </div>
  )
}
