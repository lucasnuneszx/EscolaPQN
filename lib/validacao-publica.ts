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

const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
])

/**
 * Confere se o número é um telefone brasileiro plausível: DDD existente,
 * celular com 9 dígitos começando em 9 ou fixo com 8 dígitos, sem sequências repetidas.
 */
export function telefoneBrasileiroValido(valor: string): boolean {
  let digitos = valor.replace(/\D/g, '')
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith('55')) digitos = digitos.slice(2)
  if ((digitos.length === 11 || digitos.length === 12) && digitos.startsWith('0')) digitos = digitos.slice(1)
  if (digitos.length !== 10 && digitos.length !== 11) return false

  if (!DDDS_VALIDOS.has(Number(digitos.slice(0, 2)))) return false

  const numero = digitos.slice(2)
  if (numero.length === 9 && numero[0] !== '9') return false
  if (numero.length === 8 && !/^[2-9]/.test(numero)) return false

  return !/^(\d)\1+$/.test(numero.slice(1))
}

export const telefonePublico = (mensagem: string) =>
  z
    .string()
    .trim()
    .max(20, { message: mensagem })
    .regex(REGEX_TELEFONE, { message: mensagem })
    .refine(telefoneBrasileiroValido, { message: mensagem })

export const textoCurto = z.string().trim().max(80).optional()

export const textoLivre = (max = 1000) =>
  z.string().trim().max(max, { message: `Use no máximo ${max} caracteres.` })
