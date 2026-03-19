# Biblioteca Online Full Stack (TypeScript)

Aplicacao full stack para gerenciamento de livros com:

- Front-end em React + Vite + TypeScript + Sass
- API REST em Node.js + Express + TypeScript
- Banco de dados **Supabase** (nuvem)

## Funcionalidades

- Listar livros
- Visualizar detalhes de um livro
- Cadastrar livro
- Editar livro
- Deletar livro
- Estados de carregamento e erro no front-end

## Estrutura do Projeto

```
.
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- database/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   `-- server.ts
|   |-- .env.example
|   |-- package.json
|   `-- tsconfig.json
|-- src/
|   |-- api/
|   |-- components/
|   |-- types/
|   |-- views/
|   |-- global.scss
|   `-- main.tsx
|-- .env.example
`-- package.json
```

## Requisitos

- Node.js 18+
- npm

## Primeiros Passos

1. Instale as dependencias (frontend):
   ```
   npm install
   ```

2. Instale as dependencias (backend):
   ```
   cd backend
   npm install
   cd ..
   ```

3. Configure o arquivo `.env` na raiz (frontend)
4. Configure o arquivo `backend/.env` (backend) com as credenciais do Supabase
5. Execute as migracoes (informativo para modo Supabase):
   ```
   npm --prefix backend run migrate
   ```
6. (Opcional) Insira dados iniciais:
   ```
   npm --prefix backend run seed
   ```

## Configuracao de Ambiente

### Front-end

1. Crie um arquivo `.env` na raiz com base no `.env.example`:

```
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publicavel
```

### Back-end

1. Crie um arquivo `.env` dentro de `backend` com base no `.env.example`:

```
PORT=3000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua_service_role_key
```

> **Nota**: Se necessario, o backend aceita fallback para `SUPABASE_PUBLISHABLE_KEY` quando `SUPABASE_SERVICE_KEY` nao estiver definida.

## Integracao Supabase

### ✅ Supabase já está configurado!

O projeto foi configurado com suporte a **Supabase**. As credenciais estão em `.env` (frontend) e `backend/.env` (backend).

### Como usar Supabase

#### Frontend (React)

Use `LivrosSupabaseService` para fazer requisições diretas ao Supabase (sem passar pela API):

```typescript
import { LivrosSupabaseService } from "@/api/LivrosSupabaseService";

// Buscar todos os livros
const { data: livros } = await LivrosSupabaseService.getLivros();

// Buscar um livro específico
const { data: livro } = await LivrosSupabaseService.getLivro(1);

// Criar novo livro
const { data: novoLivro } = await LivrosSupabaseService.createLivro({
  titulo: "Novo Livro",
  numero_paginas: 300,
  isbn: "123456789",
  editora: "Editora"
});

// Atualizar livro
const { data: livroAtualizado } = await LivrosSupabaseService.updateLivro(1, {
  titulo: "Título Atualizado",
  numero_paginas: 350,
  isbn: "123456789",
  editora: "Editora"
});

// Deletar livro
await LivrosSupabaseService.deleteLivro(1);
```

#### Backend (Node.js)

Use o cliente Supabase no backend:

```typescript
import { supabase } from "./src/database/supabaseClient";

// Exemplo: buscar livros
const { data, error } = await supabase
  .from("livros")
  .select("*");
```

### Criar Tabela no Supabase

Se ainda não criou a tabela no Supabase, execute o SQL abaixo no editor SQL do Supabase:

```sql
CREATE TABLE livros (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  numero_paginas INTEGER NOT NULL,
  isbn TEXT NOT NULL UNIQUE,
  editora TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### Usar API Local + Supabase

Você pode optar por:

1. **Usar a API REST** (`localhost:3000` em desenvolvimento) → a API usa Supabase no backend
2. **Usar Supabase diretamente no frontend** → sem passar pela API

Mude a importação em seus componentes:

- Para **API local**: use `LivrosService` (axios)
- Para **Supabase**: use `LivrosSupabaseService` (promise-based)


## Criacao da Tabela e Seed

### 1. Crie a tabela no SQL Editor do Supabase

Use a query da secao "Criar Tabela no Supabase".

### 2. Seed (opcional)

No terminal da pasta `backend`:

```
npm run seed
```

Isso insere 3 livros iniciais na tabela `livros` do Supabase.

## Execucao em Desenvolvimento

### Opcao recomendada (front + back juntos)

No terminal da raiz do projeto:

```
npm run dev
```

Esse comando inicia:

- API em `http://localhost:3000`
- Front-end Vite em `http://localhost:5173` (ou proxima porta livre)

### 1. Iniciar API

No terminal da pasta `backend`:

```
npm run dev
```

### 2. Iniciar Front-end

No terminal da raiz do projeto:

```
npm run dev:front
```

## Build

### Front-end

```
npm run build
```

### Back-end (checagem de tipos)

```
cd backend
npx tsc --noEmit
```

## Rotas da API

- GET `/livros` -> lista todos os livros
- GET `/livros/:id` -> busca livro por ID
- POST `/livros` -> cria novo livro
- PUT `/livros/:id` -> atualiza livro
- DELETE `/livros/:id` -> remove livro

### Exemplo de payload (POST/PUT)

```json
{
	"titulo": "Clean Code",
	"numero_paginas": 464,
	"isbn": "9780132350884",
	"editora": "Prentice Hall"
}
```

## Testes das Rotas (Postman/Insomnia)

Valide os cenarios:

1. GET `/livros` com lista vazia e com dados
2. POST `/livros` com payload valido
3. GET `/livros/:id` com id existente
4. PUT `/livros/:id` com atualizacao
5. DELETE `/livros/:id` com id existente
6. Erros esperados (ID invalido, livro nao encontrado, ISBN duplicado)

## Deploy

### Front-end (Netlify)

- Build command: `npm run build`
- Publish directory: `dist`
- Variavel de ambiente: `VITE_API_URL` apontando para a API publicada

### Front-end (Vercel)

- Build command: `npm run build`
- Output directory: `dist`
- Variaveis de ambiente:
  - `VITE_API_URL`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- O arquivo `vercel.json` com rewrite SPA ja existe no projeto para evitar erro 404 ao atualizar rotas.

### API (Render/Railway)

- Diretorio de deploy: `backend`
- Start command: `npm run start`
- Configurar variaveis de ambiente de `backend/.env.example`

## Troubleshooting

### Erro de chave invalida no Supabase

Se receber erro de autenticacao no Supabase:

1. Verifique `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` em `backend/.env`
2. Em frontend, confirme `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`

### Erro `Sem permissao no Supabase. Verifique as politicas RLS da tabela livros.`

Esse erro indica bloqueio por RLS no Supabase.

Checklist rapido:

1. Em producao, configure `SUPABASE_SERVICE_KEY` no backend (preferivel).
2. Se estiver usando somente chave anon no backend, configure politicas RLS para `anon`/`authenticated`.
3. Verifique se a tabela esta em `public.livros`.

Exemplo de politicas para ambiente de desenvolvimento:

```sql
ALTER TABLE public.livros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS livros_select ON public.livros;
DROP POLICY IF EXISTS livros_insert ON public.livros;
DROP POLICY IF EXISTS livros_update ON public.livros;
DROP POLICY IF EXISTS livros_delete ON public.livros;

CREATE POLICY livros_select
ON public.livros
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY livros_insert
ON public.livros
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY livros_update
ON public.livros
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY livros_delete
ON public.livros
FOR DELETE
TO anon, authenticated
USING (true);
```

### Erro `PGRST205` (relation does not exist)

Se receber erro de tabela inexistente:

1. Crie a tabela `livros` no SQL Editor do Supabase
2. Rode `npm --prefix backend run seed` para popular dados iniciais

### Erro 404 ao atualizar pagina em producao (Vercel)

Se a aplicacao abrir em `/livros` mas der 404 ao atualizar:

1. Confirme que o arquivo `vercel.json` foi publicado.
2. Garanta que o rewrite SPA esteja configurado para direcionar `/(.*)` para `/index.html`.
3. Execute novo deploy no Vercel.

## Status de Entrega

- API RESTful com CRUD completo
- Estrutura em camadas: controllers, routes, services, models
- Middlewares de validacao e tratamento de erros
- dotenv e CORS configurados
- Front-end React integrado com service layer
- CRUD refletindo na interface
- Projeto em TypeScript (front e back)
