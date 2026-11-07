// Regras de validação e proteção anti-robô dos formulários do site público
import { z } from 'zod'

// Campo invisível para pessoas; robôs costumam preenchê-lo
export const CAMPO_ARMADILHA = 'site'

export function enviadoPorRobo(formData: FormData): boolean {
  const valor = formData.get(CAMPO_ARMADILHA)
  return typeof valor === 'string' && valor.trim().length > 0
}

const REGEX_NOME = /^[\p{L}\p{M}' .-]+$/u
const REGEX_TELEFONE = /^[\d\s()+-]+$/

export const nomePessoa = (mensagem: string) =>
  z
    .string()
    .trim()
    .min(2, { message: mensagem })
    .max(120, { message: 'Nome muito longo.' })
    .regex(REGEX_NOME, { message: 'Use apenas letras no nome.' })

export const emailPublico = z
  .string()
  .trim()
  .toLowerCase()
  .max(160, { message: 'E-mail muito longo.' })
  .email({ message: 'E-mail inválido.' })

export const telefonePublico = (mensagem: string) =>
  z
    .string()
    .trim()
    .max(20, { message: mensagem })
    .regex(REGEX_TELEFONE, { message: mensagem })
    .refine((v) => v.replace(/\D/g, '').length >= 10, { message: mensagem })

export const textoCurto = z.string().trim().max(80).optional()

export const textoLivre = (max = 1000) =>
  z.string().trim().max(max, { message: `Use no máximo ${max} caracteres.` })
