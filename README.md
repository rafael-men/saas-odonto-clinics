# Odonto Clinics — SaaS de Gestão Odontológica

Plataforma SaaS para gestão de clínicas odontológicas, com agendamento online, gerenciamento de serviços, profissionais e lembretes.

---

## Funcionalidades

### Área Pública

- Página inicial com apresentação da plataforma
- Listagem de clínicas disponíveis com filtros por nome, localização, disponibilidade e horário de funcionamento (`/clinicas`)
- Agendamento de consultas por pacientes sem necessidade de cadastro (`/clinica/[id]`)

### Dashboard da Clínica

- **Agendamentos** — visualização estilo Google Calendar com navegação por dia, cores por evento e duração proporcional
- **Serviços** — CRUD de serviços com nome, valor, duração e profissional responsável
- **Profissionais** — CRUD de profissionais com foto (upload base64), CRM, telefone e WhatsApp
- **Perfil** — edição de dados da clínica, horários disponíveis, fuso horário e imagem

---

## Stack

| Camada       | Tecnologia                            |
| ------------ | ------------------------------------- |
| Framework    | Next.js 16 (App Router)               |
| Linguagem    | TypeScript 5                          |
| Banco        | PostgreSQL (Neon)                     |
| ORM          | Prisma 7                              |
| Autenticação | NextAuth v5 (credentials + Google)    |
| UI           | Tailwind CSS + shadcn/ui + Radix UI   |
| Formulários  | React Hook Form + Zod                 |
| Estado       | TanStack React Query                  |
| Ícones       | Lucide React                          |

---

## Estrutura do Projeto

```text
src/
├── app/
│   ├── _actions/              # Server actions globais (register, login)
│   ├── _actions-appointments/ # Server actions de agendamentos
│   ├── _components/           # Componentes da área pública
│   ├── _data_access/          # Funções de acesso a dados (área pública)
│   ├── api/                   # API Routes
│   │   ├── auth/              # NextAuth handler
│   │   ├── clinica/           # Agendamentos da clínica
│   │   └── schedule/          # Slots bloqueados
│   ├── clinica/[id]/          # Página de agendamento do paciente
│   ├── clinicas/              # Listagem pública de clínicas com filtros
│   ├── dashboard/             # Área restrita da clínica
│   │   ├── page.tsx           # Agenda (Google Calendar style)
│   │   ├── services/          # Gestão de serviços
│   │   ├── profissionais/     # Gestão de profissionais
│   │   └── profile/           # Perfil da clínica
│   ├── login/                 # Login e registro
│   └── social/                # Rota secreta → redireciona para /login
├── components/ui/             # Componentes shadcn/ui
├── generated/prisma/          # Client Prisma gerado
└── lib/                       # Utilitários (prisma, auth, session)

prisma/
├── schema.prisma              # Schema do banco de dados
└── migrations/                # Histórico de migrations
```

---

## Modelos do Banco de Dados

```prisma
User          # Clínica/usuário — dados, horários, imagem
Service       # Serviços da clínica com profissional associado
Professional  # Profissionais (CRM, contato, foto)
Appointments  # Agendamentos de pacientes
Reminder      # Lembretes internos da clínica
```

---

## Configuração Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL (ou conta no [Neon](https://neon.tech))

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Rodar migrations
npx prisma migrate dev

# Gerar client Prisma
npx prisma generate

# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Variáveis de Ambiente

```env
DATABASE_URL=          # String de conexão PostgreSQL
NEXTAUTH_SECRET=       # Segredo para JWT do NextAuth
NEXTAUTH_URL=          # URL base da aplicação (ex: http://localhost:3000)
GOOGLE_CLIENT_ID=      # ID do app Google OAuth
GOOGLE_CLIENT_SECRET=  # Secret do app Google OAuth
NEXT_PUB=              # URL pública da API (mesmo valor que NEXTAUTH_URL)
```

---

## Acesso ao Dashboard

O acesso ao dashboard das clínicas é feito pela rota `/social`, que redireciona para a tela de login. Essa rota não está exposta na navegação pública.

---

## Scripts

```bash
npm run dev    # Servidor de desenvolvimento (Webpack)
npm run build  # Build de produção
npm run start  # Servidor de produção
```

---
