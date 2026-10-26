# Escola Pequeno Príncipe

Site institucional e sistema de gestão do Centro Educacional Pequeno Príncipe: páginas públicas com captação de matrículas e visitas, painel administrativo (alunos, turmas, financeiro, comunicados, leads) e portal para professores, responsáveis e alunos.

## Stack

- Next.js 16 (App Router, Server Actions, `proxy.ts` para checagem de sessão)
- React 19, TypeScript, Tailwind CSS 4
- Prisma 7 com PostgreSQL (`@prisma/adapter-pg`)
- Sessão própria com JWT (`jose`) e senhas com `bcryptjs`
- Validação com `zod`

## Rodando localmente

Requer Node 20+ e um PostgreSQL acessível.

```bash
npm install
# crie o .env.local com as variáveis abaixo
npm run db:push              # cria as tabelas
npm run db:seed              # opcional: dados fictícios de desenvolvimento
npm run dev
```

Acesse http://localhost:3000. O painel fica em `/admin` e o portal em `/portal`.

Outros scripts: `npm run build`, `npm run lint`, `npm run db:studio`.

## Variáveis de ambiente

Em `.env.local` (não versionado):

- `DATABASE_URL` — conexão do PostgreSQL
- `POSTGRES_PRISMA_URL` — conexão com pool (opcional; tem prioridade sobre `DATABASE_URL` na aplicação)
- `DATABASE_URL_UNPOOLED` ou `POSTGRES_URL_NON_POOLING` — conexão direta usada pelo Prisma CLI (opcional)
- `SESSION_SECRET` — chave para assinar o JWT de sessão
- `NEXT_PUBLIC_APP_URL` — URL base da aplicação (usada no link de redefinição de senha)

## Estrutura

```
app/            rotas (site público, /admin, /portal, /api) e Server Actions em app/actions
components/     componentes por área: admin, portal, public, auth, theme
lib/            prisma, sessão, controle de acesso (rbac), auditoria
prisma/         schema.prisma e seed
proxy.ts        autenticação e redirecionamento por perfil
```

## Pendências conhecidas

- Envio de e-mail na recuperação de senha ainda não integrado (o link é registrado no log do servidor).
- Cobrança via Asaas é simulada localmente.
- Documentos usam link externo; não há upload de arquivos.
