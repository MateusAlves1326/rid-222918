# Biblioteca Online Full Stack (TypeScript)

Aplicacao full stack para gerenciamento de livros com:

- Front-end em React + Vite + TypeScript + Sass
- API REST em Node.js + Express + TypeScript
- Banco de dados PostgreSQL

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
- PostgreSQL 14+

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
4. Configure o arquivo `backend/.env` (backend) com suas credenciais PostgreSQL
5. Crie o banco de dados:
   ```
   node backend/scripts/create-db.js
   ```
6. Execute as migracoes:
   ```
   npm --prefix backend run migrate
   ```
7. (Opcional) Insira dados iniciais:
   ```
   npm --prefix backend run seed
   ```

## Configuracao de Ambiente

### Front-end

1. Crie um arquivo `.env` na raiz com base no `.env.example`:

```
VITE_API_URL=http://localhost:3000
```

### Back-end

1. Crie um arquivo `.env` dentro de `backend` com base no `.env.example`:

```
PORT=3000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_postgres
DB_NAME=biblioteca
```

> **Nota**: Você pode usar `DATABASE_URL` alternamente. O sistema detecta automaticamente qual configuração você está usando.


## Criacao do Banco de Dados

### Opcao 1: Criar automaticamente (recomendado)

No terminal da raiz do projeto:

```
node backend/scripts/create-db.js
```

### Opcao 2: Migracoes e Seed

No terminal da pasta `backend`:

```
npm run migrate
npm run seed
```

Isso cria a tabela `livros` no PostgreSQL e insere 3 livros iniciais.

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

### API (Render/Railway)

- Diretorio de deploy: `backend`
- Start command: `npm run start`
- Configurar variaveis de ambiente de `backend/.env.example`

## Troubleshooting

### Erro de autenticacao PostgreSQL (28P01)

Se receber erro `autenticacao do tipo senha falhou para o usuario "postgres"`:

1. Verifique as credenciais em `backend/.env`
2. Confirme que o usuario e senha estao corretos no PostgreSQL
3. Certifique-se que o PostgreSQL esta rodando

### Erro "banco de dados nao existe" (3D000)

Se receber erro `nao existe o banco de dados "biblioteca"`:

1. Execute o script de criacao de banco:
   ```
   node backend/scripts/create-db.js
   ```
2. Ou crie manualmente via `psql` ou pgAdmin

## Status de Entrega

- API RESTful com CRUD completo
- Estrutura em camadas: controllers, routes, services, models
- Middlewares de validacao e tratamento de erros
- dotenv e CORS configurados
- Front-end React integrado com service layer
- CRUD refletindo na interface
- Projeto em TypeScript (front e back)
