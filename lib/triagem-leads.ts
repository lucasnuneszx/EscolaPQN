// Triagem automática de formulários do site: identifica propaganda e mensagens fora do perfil da escola
import 'server-only'

const PALAVRAS_INGLES = new Set([
  'the', 'and', 'you', 'your', 'we', 'our', 'i', "i'm", "i've", 'have', 'been', 'with', 'for',
  'this', 'that', 'would', 'like', 'hello', 'hi', 'dear', 'website', 'business', 'services',
  'offer', 'looking', 'researching', 'help', 'can', 'are', 'will', 'more', 'get', 'free',
])

const PALAVRAS_PORTUGUES = new Set([
  'de', 'que', 'para', 'com', 'não', 'nao', 'uma', 'um', 'meu', 'minha', 'filho', 'filha',
  'gostaria', 'olá', 'ola', 'oi', 'bom', 'dia', 'tarde', 'noite', 'matrícula', 'matricula',
  'sobre', 'por', 'favor', 'os', 'as', 'é', 'do', 'da', 'no', 'na', 'quero', 'saber', 'valor',
])

const TERMOS_PROPAGANDA = [
  'seo', 'backlink', 'guest post', 'web design', 'google ranking', 'first page of google',
  'crypto', 'bitcoin', 'casino', 'loan', 'outsourc', 'lead generation', 'digital marketing',
]

const REGEX_LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|info|xyz|ru|in)\b)/i

function contarPalavras(texto: string, lista: Set<string>): number {
  return texto
    .toLowerCase()
    .split(/[^\p{L}']+/u)
    .filter((p) => lista.has(p)).length
}

/**
 * Retorna o motivo pelo qual o envio parece propaganda/spam, ou null se parece legítimo.
 */
export function motivoSuspeita(dados: { mensagem?: string | null; emailResponsavel?: string | null }): string | null {
  const mensagem = (dados.mensagem ?? '').replace(/^\[Assunto:[^\]]*\]\s*/, '')
  if (!mensagem.trim()) return null

  if (REGEX_LINK.test(mensagem)) return 'mensagem contém link'

  const texto = mensagem.toLowerCase()
  const termo = TERMOS_PROPAGANDA.find((t) => new RegExp(`\\b${t}`).test(texto))
  if (termo) return `mensagem com termo de propaganda ("${termo}")`

  const ingles = contarPalavras(mensagem, PALAVRAS_INGLES)
  const portugues = contarPalavras(mensagem, PALAVRAS_PORTUGUES)
  if (ingles >= 4 && ingles > portugues * 2) return 'mensagem escrita em inglês'

  return null
}
