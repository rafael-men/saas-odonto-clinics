# OdontoClinic

Plataforma SaaS para gerenciamento de clinicas odontologicas. Permite que clinicas cadastrem seus servicos, profissionais e horarios, enquanto pacientes agendam consultas, acompanham seus atendimentos e gerenciam sua conta.

## Tecnologias

- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19** com React Hook Form + Zod
- **Prisma 7** com PostgreSQL (Neon)
- **NextAuth v5** (autenticacao de clinicas via Google OAuth)
- **Tailwind CSS 3** + shadcn/ui
- **TanStack React Query** para data fetching client-side
- **Nodemailer** para envio de emails transacionais
- **TypeScript**

## Funcionalidades

### Pagina Publica
- Hero com gradiente, esfera com imagem e call-to-action
- Listagem de clinicas em destaque (limite de 5 na home, todas em `/clinicas`)
- Busca e filtros por nome, endereco, periodo (manha/tarde/noite) e disponibilidade
- Status "Aberta" / "Fechada" calculado automaticamente pelos horarios de funcionamento
- Skeleton loading durante carregamento

### Sistema de Pacientes
- Cadastro e login com sessao via cookie httpOnly (separado do NextAuth das clinicas)
- Validacao de email, senha (min. 6 caracteres, letras + numeros) e telefone com mascara brasileira
- Pagina de consultas com secoes: Proximas, Historico e Canceladas
- Cancelamento de consulta com modal de confirmacao e limite de 30 minutos de antecedencia
- Redefinicao de senha via email com token expiravel (1 hora)
- Pre-preenchimento do formulario de agendamento quando logado
- Bloqueio de agendamento quando nao logado (formulario desabilitado + aviso)
- Header exibe nome do paciente quando logado; botao "Acessar Minha Conta" escondido quando logado

### Agendamento
- Selecao de data com react-datepicker (locale pt-BR)
- Horarios disponiveis calculados em tempo real (exclui ocupados, passados e cancelados)
- Deteccao de conflito de horarios com base na duracao do servico
- Selecao de forma de pagamento (PIX ou Credito)
- Redirecionamento para pagina de consultas apos agendar
- Email de confirmacao enviado ao paciente com detalhes da consulta

### Emails Transacionais
- Confirmacao de agendamento
- Confirmacao de cancelamento
- Link de redefinicao de senha
- Templates HTML com gradientes e layout responsivo
- Configuracao via variaveis de ambiente SMTP (Gmail)

### Dashboard da Clinica
- Autenticacao via Google OAuth
- Perfil: nome, endereco, CNPJ, telefone, foto (upload base64), fuso horario, horarios de funcionamento
- Profissionais: CRUD com nome, CRM, telefone, WhatsApp (com mascara), foto
- Servicos: CRUD com nome, preco, duracao, status e profissional associado
- Agenda: visualizacao estilo Google Calendar com navegacao por dia

### Rota Secreta
- `/social` redireciona para `/login` (acesso ao dashboard das clinicas sem link visivel na UI)

## Variaveis de Ambiente

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
NEXT_PUBLIC_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
```

## Como Rodar

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

## Estrutura do Projeto

```
src/
  app/
    _components/       # Componentes compartilhados (hero, header, footer, clinics, skeleton, badge)
    _data_access/      # Data access layer publica
    api/               # API routes (horarios de agendamento)
    clinica/[id]/      # Pagina de agendamento por clinica
    clinicas/          # Listagem de todas as clinicas com filtros
    dashboard/         # Dashboard da clinica (perfil, servicos, profissionais, agenda)
    paciente/          # Sistema de pacientes (login, consultas, redefinir senha)
    social/            # Rota secreta de acesso ao dashboard
  components/          # UI components (shadcn/ui, toast)
  generated/prisma/    # Prisma client gerado
  lib/                 # Auth, Prisma singleton, email service, utils
  providers/           # QueryClient provider
  utils/               # Utilitarios (currency converter, date picker)
prisma/
  schema.prisma        # Schema do banco de dados
  migrations/          # Migracoes SQL
```

## Modelos do Banco

- **User** - Clinicas (autenticacao, perfil, horarios)
- **Patient** - Pacientes (cadastro, login, sessao)
- **Professional** - Profissionais da clinica (nome, CRM, contato, foto)
- **Service** - Servicos (nome, preco, duracao, profissional)
- **Appointments** - Agendamentos (paciente, clinica, servico, data, horario, status, pagamento)
- **Reminder** - Lembretes da clinica
- **PasswordResetToken** - Tokens de redefinicao de senha
