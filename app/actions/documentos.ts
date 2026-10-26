'use server'
// ─────────────────────────────────────────────────────────────
// Server Actions — Repositório de Documentos Escolares
//
// NOTA IMPORTANTE: não há integração real de upload/storage aqui.
// O campo `url` é um link de texto livre colado manualmente pelo
// operador. Uma integração real com um provedor de storage (S3,
// R2, etc.) ainda não foi configurada (ver placeholders em
// .env.local — STORAGE_PROVIDER, STORAGE_BUCKET, ...).
// ─────────────────────────────────────────────────────────────
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { isAdminOuSecretaria } from '@/lib/rbac'
import { registrarAuditoria } from '@/lib/audit'

const VISIBILIDADES = ['TODOS', 'RESPONSAVEL', 'PROFESSOR', 'ALUNO'] as const

const DocumentoSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, { message: 'O título deve ter ao menos 3 caracteres.' })
    .max(200, { message: 'O título deve ter no máximo 200 caracteres.' }),
  descricao: z.string().trim().optional(),
  url: z
    .string()
    .trim()
    .url({ message: 'Informe uma URL válida (ex.: https://...).' }),
  categoria: z.enum(['regimento', 'circular', 'cronograma', 'cardapio', 'outro'], {
    message: 'Selecione uma categoria válida.',
  }),
  visivelPara: z
    .array(z.enum(VISIBILIDADES))
    .min(1, { message: 'Selecione ao menos um público de visibilidade.' }),
  mimeType: z.string().trim().optional(),
  tamanhoBytes: z.coerce.number().int().nonnegative().optional(),
  publicadoEm: z.string().min(1, { message: 'Informe a data de publicação.' }),
})

export type DocumentoState =
  | {
      errors?: Record<string, string[]>
      message?: string
      success?: boolean
    }
  | undefined

function extrairDados(formData: FormData) {
  const tamanho = formData.get('tamanhoBytes')
  return {
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || undefined,
    url: formData.get('url'),
    categoria: formData.get('categoria'),
    visivelPara: formData.getAll('visivelPara').map(String),
    mimeType: formData.get('mimeType') || undefined,
    tamanhoBytes: tamanho ? Number(tamanho) : undefined,
    publicadoEm: formData.get('publicadoEm'),
  }
}

export async function criarDocumento(
  prevState: DocumentoState,
  formData: FormData
): Promise<DocumentoState> {
  const sessao = await getSession()
  if (!sessao || !isAdminOuSecretaria(sessao.perfil)) {
    return { message: 'Você não tem permissão para publicar documentos.' }
  }

  const validated = DocumentoSchema.safeParse(extrairDados(formData))
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { titulo, descricao, url, categoria, visivelPara, mimeType, tamanhoBytes, publicadoEm } =
    validated.data

  let documentoId: string
  try {
    const documento = await prisma.documentoEscolar.create({
      data: {
        titulo,
        descricao,
        url,
        categoria,
        visivelPara: visivelPara.join(','),
        mimeType,
        tamanhoBytes,
        publicadoEm: new Date(publicadoEm),
      },
    })
    documentoId = documento.id
  } catch {
    return { message: 'Erro ao salvar o documento. Tente novamente.' }
  }

  await registrarAuditoria({
    tipo: 'DOCUMENTO_CRIADO',
    descricao: `Documento "${titulo}" foi publicado no repositório.`,
    entidade: 'DocumentoEscolar',
    entidadeId: documentoId,
    usuarioId: sessao.userId,
    dadosDepois: validated.data,
  })

  revalidatePath('/admin/documentos')
  redirect('/admin/documentos')
}

export async function excluirDocumento(id: string, _formData: FormData): Promise<void> {
  const sessao = await getSession()
  if (!sessao || !isAdminOuSecretaria(sessao.perfil)) return

  const documento = await prisma.documentoEscolar.findUnique({ where: { id } })
  if (!documento) return

  await prisma.documentoEscolar.delete({ where: { id } })

  await registrarAuditoria({
    tipo: 'DOCUMENTO_EXCLUIDO',
    descricao: `Documento "${documento.titulo}" foi removido do repositório.`,
    entidade: 'DocumentoEscolar',
    entidadeId: id,
    usuarioId: sessao.userId,
    dadosAntes: documento,
  })

  revalidatePath('/admin/documentos')
}
