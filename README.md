# Planeta & Clima — execução local

Projeto React + Vite com API Node.js/Express e banco MySQL acessado pelo Prisma ORM. Esta versão é para rodar na própria máquina, sem GitHub Pages, Render ou Railway.

## Requisitos

- Windows 10/11 (ou Linux/macOS)
- Node.js 22.22.0 ou superior (ou Node.js 24 ou superior)
- MySQL Server 8.x em execução
- VS Code (recomendado)

## 1. Preparar o MySQL

Abra o MySQL Workbench ou o terminal do MySQL e execute:

```sql
CREATE DATABASE planeta_clima CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Guarde o usuário e a senha do MySQL. Não coloque a senha em arquivos enviados ou compartilhados.

## 2. Configurar o backend e Prisma

Abra a pasta `Planeta-Clima` no VS Code. Abra um terminal e execute:

```powershell
cd backend
copy .env.example .env
```

Edite `backend/.env` e ajuste a linha `DATABASE_URL`. Exemplo para usuário `root`:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/planeta_clima"
```

Se sua senha tiver caracteres especiais (`@`, `#`, `/`, `:`), codifique-os na URL ou use uma senha local simples para o ambiente de desenvolvimento.

Ainda dentro da pasta `backend`, execute:

```powershell
npm install
npx prisma generate
npx prisma db push
```

`db push` cria/atualiza as tabelas conforme `backend/prisma/schema.prisma`.

## 3. Iniciar a API

No terminal da pasta `backend`:

```powershell
npm run dev
```

A API deve iniciar em `http://localhost:8000`. Teste abrindo `http://localhost:8000/api/health` no navegador; deve aparecer `status: ok`.

## 4. Iniciar o React

Abra um **segundo terminal** no VS Code, na pasta principal `Planeta-Clima` (não dentro de `backend`):

```powershell
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## 5. Criar o administrador

Na primeira execução, abra o site e escolha **Criar conta**. A primeira conta cadastrada no banco recebe automaticamente o perfil `ADMIN` e poderá acessar o painel administrativo em `/conta`. As contas seguintes recebem perfil `USER`.

No painel, o administrador pode cadastrar, consultar, editar e excluir usuários, problemas e soluções. As senhas são armazenadas com hash bcrypt, nunca em texto puro.

## 6. Prisma Studio (visualizar o banco)

Em outro terminal:

```powershell
cd backend
npx prisma studio
```

O Prisma Studio abre uma interface no navegador para visualizar as tabelas.

## Endereços locais

- React: `http://localhost:5173`
- API: `http://localhost:8000`
- Saúde da API: `http://localhost:8000/api/health`
- Prisma Studio: endereço exibido no terminal (normalmente `http://localhost:5555`)

## Problemas comuns

- **ECONNREFUSED / Can't reach database:** confirme se o serviço MySQL está iniciado e se host, porta, usuário e senha em `backend/.env` estão corretos.
- **Unknown database:** crie o banco com o SQL da etapa 1.
- **JWT_SECRET:** confirme que `backend/.env` existe e contém uma chave local longa.
- **Porta 8000 ocupada:** feche o outro processo ou altere `PORT` no `backend/.env`.
- **Porta 5173 ocupada:** o Vite oferecerá outra porta; mantenha a API em execução.

## Estrutura

```text
Planeta-Clima/
├── src/                 # React, páginas e componentes
├── backend/
│   ├── prisma/          # Modelo do banco Prisma/MySQL
│   ├── src/             # API Express, autenticação e CRUD
│   ├── .env.example
│   └── package.json
├── package.json         # Frontend Vite
└── README.md
```

## Segurança local

O arquivo `backend/.env` contém credenciais e não deve ser compartilhado. Ele já está listado no `.gitignore`. Use o sistema apenas em ambiente local enquanto não configurar HTTPS, política de acesso e demais controles para publicação pública.
