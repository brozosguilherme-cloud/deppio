# Deppio — SaaS de Gestão Inteligente de Estoque

Sistema completo de gerenciamento de estoque para pequenas e médias empresas brasileiras.

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend:** Next.js API Routes
- **Banco de dados:** PostgreSQL via Supabase (com Row Level Security)
- **ORM:** Prisma
- **Autenticação:** Supabase Auth (email/senha + Google OAuth)
- **Gráficos:** Recharts

## Setup local

### 1. Pré-requisitos

- Node.js 18+
- Uma conta no [Supabase](https://supabase.com) (gratuita)

### 2. Clonar e instalar

```bash
cd inventory-saas
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role |
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection pooling (Mode: Transaction) |
| `DIRECT_URL` | Supabase → Project Settings → Database → Connection string (Direct) |

### 4. Configurar o banco de dados

```bash
# Gera o client Prisma
npm run db:generate

# Aplica o schema no banco (cria todas as tabelas)
npm run db:push
```

### 5. Configurar OAuth do Google (opcional)

No Supabase:
1. Acesse **Authentication → Providers → Google**
2. Ative e adicione as credenciais OAuth do [Google Cloud Console](https://console.cloud.google.com)
3. Adicione `http://localhost:3000/auth/callback` como redirect URI

### 6. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` e crie sua conta.

---

## Módulos

| Módulo | URL | Descrição |
|---|---|---|
| Dashboard | `/dashboard` | KPIs, alertas e gráficos de movimentações |
| Produtos | `/produtos` | CRUD de produtos com SKU, preços e estoque mínimo |
| Estoque | `/estoque` | Entradas, saídas e histórico de movimentações |
| PDV | `/pdv` | Ponto de venda simplificado para balcão |
| Vendas | `/vendas` | Histórico completo de vendas |
| Faturamento | `/faturamento` | Análise financeira com gráficos e exportação CSV |
| Fornecedores | `/fornecedores` | Cadastro e ordens de compra |
| Relatórios | `/relatorios` | Lucratividade por produto e categoria |

## Scripts

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run db:push      # Aplica schema no banco
npm run db:generate  # Regenera Prisma Client
npm run db:studio    # Abre Prisma Studio (UI para o banco)
```

## Deploy no Vercel

1. Conecte o repositório ao Vercel
2. Adicione todas as variáveis de ambiente do `.env.example`
3. Deploy automático a cada push na main

---

## Estrutura de pastas

```
src/
├── app/
│   ├── (auth)/          # Páginas de login e cadastro
│   ├── (dashboard)/     # Páginas protegidas (após login)
│   └── api/             # API Routes do Next.js
├── components/
│   ├── layout/          # Sidebar e Topbar
│   ├── ui/              # Componentes base (Button, Modal, Badge...)
│   ├── dashboard/       # Componentes do dashboard
│   ├── products/        # Formulários de produto
│   ├── stock/           # Modais de movimentação
│   └── suppliers/       # Componentes de fornecedores
├── lib/
│   ├── supabase/        # Helpers do Supabase (client, server, middleware)
│   ├── auth.ts          # Helper de autenticação para API routes
│   ├── prisma.ts        # Singleton do Prisma Client
│   └── utils.ts         # Funções utilitárias
├── types/
│   └── index.ts         # Tipos TypeScript centrais
└── middleware.ts        # Proteção de rotas
```
