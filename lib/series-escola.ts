// Séries e turnos oferecidos pela escola
// Usado no cadastro/edição de aluno (seção Matrícula).
// Todas as séries funcionam nos turnos matutino e vespertino.

export const SERIES_ESCOLA = [
  { codigo: 'G2', nome: 'G2 (2 anos)', nivel: 'educacao_infantil', ordem: 1 },
  { codigo: 'G3', nome: 'G3 (3 anos)', nivel: 'educacao_infantil', ordem: 2 },
  { codigo: 'G4', nome: 'G4 (4 anos)', nivel: 'educacao_infantil', ordem: 3 },
  { codigo: 'G5', nome: 'G5 (5 anos)', nivel: 'educacao_infantil', ordem: 4 },
  { codigo: 'EF1', nome: '1º Ano EF', nivel: 'ensino_fundamental', ordem: 5 },
  { codigo: 'EF2', nome: '2º Ano EF', nivel: 'ensino_fundamental', ordem: 6 },
  { codigo: 'EF3', nome: '3º Ano EF', nivel: 'ensino_fundamental', ordem: 7 },
  { codigo: 'EF4', nome: '4º Ano EF', nivel: 'ensino_fundamental', ordem: 8 },
  { codigo: 'EF5', nome: '5º Ano EF', nivel: 'ensino_fundamental', ordem: 9 },
] as const

export const TURNOS_ESCOLA = [
  { value: 'MANHA', label: 'Matutino' },
  { value: 'TARDE', label: 'Vespertino' },
] as const

export type CodigoSerie = (typeof SERIES_ESCOLA)[number]['codigo']
export type TurnoEscola = (typeof TURNOS_ESCOLA)[number]['value']

export const CODIGOS_SERIE = SERIES_ESCOLA.map((s) => s.codigo) as [CodigoSerie, ...CodigoSerie[]]
export const VALORES_TURNO = TURNOS_ESCOLA.map((t) => t.value) as [TurnoEscola, ...TurnoEscola[]]

export function rotuloTurno(turno: string): string {
  return TURNOS_ESCOLA.find((t) => t.value === turno)?.label ?? turno
}
