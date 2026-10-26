// ─────────────────────────────────────────────────────────────
// RBAC — Controle de acesso baseado em perfil
// ─────────────────────────────────────────────────────────────
import { PerfilUsuario } from '@/lib/session'

/**
 * Mapa de permissões por recurso e ação.
 * Escalonado do mais restrito ao mais permissivo.
 */
const PERMISSOES: Record<string, PerfilUsuario[]> = {
  // ── Administração ─────────────────────────────────────────
  'admin:acesso':        ['ADMIN'],
  'admin:configuracoes': ['ADMIN'],
  'admin:usuarios:criar': ['ADMIN'],
  'admin:relatorios':    ['ADMIN', 'SECRETARIA'],

  // ── Secretaria / Alunos ───────────────────────────────────
  'alunos:ver':         ['ADMIN', 'SECRETARIA', 'PROFESSOR'],
  'alunos:criar':       ['ADMIN', 'SECRETARIA'],
  'alunos:editar':      ['ADMIN', 'SECRETARIA'],
  'alunos:excluir':     ['ADMIN'],
  'alunos:status':      ['ADMIN', 'SECRETARIA'],
  'alunos:documentos':  ['ADMIN', 'SECRETARIA'],

  // ── Turmas ────────────────────────────────────────────────
  'turmas:ver':         ['ADMIN', 'SECRETARIA', 'PROFESSOR'],
  'turmas:criar':       ['ADMIN', 'SECRETARIA'],
  'turmas:editar':      ['ADMIN', 'SECRETARIA'],

  // ── Financeiro ────────────────────────────────────────────
  'financeiro:ver':           ['ADMIN', 'SECRETARIA'],
  'financeiro:criar':         ['ADMIN', 'SECRETARIA'],
  'financeiro:editar':        ['ADMIN', 'SECRETARIA'],
  'financeiro:gerar_cobranca': ['ADMIN', 'SECRETARIA'],
  'financeiro:meu':           ['ADMIN', 'SECRETARIA', 'RESPONSAVEL'],

  // ── Notas ─────────────────────────────────────────────────
  'notas:ver':          ['ADMIN', 'SECRETARIA', 'PROFESSOR'],
  'notas:lancar':       ['ADMIN', 'PROFESSOR'],
  'notas:editar':       ['ADMIN', 'PROFESSOR'],
  'notas:minhas':       ['ADMIN', 'SECRETARIA', 'PROFESSOR', 'RESPONSAVEL', 'ALUNO'],

  // ── Chamada / Frequência ───────────────────────────────────
  'chamada:fazer':      ['ADMIN', 'PROFESSOR'],
  'chamada:ver':        ['ADMIN', 'SECRETARIA', 'PROFESSOR'],
  'chamada:minha':      ['ADMIN', 'SECRETARIA', 'PROFESSOR', 'RESPONSAVEL'],

  // ── Comunicados ───────────────────────────────────────────
  'comunicados:criar':  ['ADMIN', 'SECRETARIA', 'PROFESSOR'],
  'comunicados:ver':    ['ADMIN', 'SECRETARIA', 'PROFESSOR', 'RESPONSAVEL', 'ALUNO'],

  // ── Portal (responsável/aluno) ────────────────────────────
  'portal:acesso':      ['ADMIN', 'SECRETARIA', 'PROFESSOR', 'RESPONSAVEL', 'ALUNO'],

  // ── Auditoria ─────────────────────────────────────────────
  'auditoria:ver':      ['ADMIN'],
}

/**
 * Verifica se um perfil tem permissão para executar uma ação.
 */
export function temPermissao(
  perfil: PerfilUsuario,
  recurso: string
): boolean {
  const permitidos = PERMISSOES[recurso]
  if (!permitidos) return false
  return permitidos.includes(perfil)
}

/**
 * Verifica múltiplas permissões de uma vez (todas devem ser satisfeitas).
 */
export function temTodasPermissoes(
  perfil: PerfilUsuario,
  recursos: string[]
): boolean {
  return recursos.every((r) => temPermissao(perfil, r))
}

/**
 * Retorna true se o perfil tem acesso ao dashboard administrativo.
 */
export function isAdminOuSecretaria(perfil: PerfilUsuario): boolean {
  return perfil === 'ADMIN' || perfil === 'SECRETARIA'
}

/**
 * Retorna true se o perfil tem acesso ao portal (responsável/aluno/professor).
 */
export function isPortalUser(perfil: PerfilUsuario): boolean {
  return ['RESPONSAVEL', 'ALUNO', 'PROFESSOR'].includes(perfil)
}

/**
 * Redireciona pelo perfil para a rota correta após o login.
 */
export function getRedirectUrlPorPerfil(perfil: PerfilUsuario): string {
  switch (perfil) {
    case 'ADMIN':
    case 'SECRETARIA':
      return '/admin/dashboard'
    case 'PROFESSOR':
      return '/portal/turmas'
    case 'RESPONSAVEL':
      return '/portal/inicio'
    case 'ALUNO':
      return '/portal/inicio'
    default:
      return '/login'
  }
}
