# Backend local — Planeta & Clima

API Node.js + Express com Prisma ORM e MySQL.

1. Instale o MySQL Server e crie um banco vazio chamado `planeta_clima` (ou deixe o Prisma criá-lo, se seu usuário tiver permissão).
2. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` com a senha do MySQL.
3. No terminal, dentro de `backend`, execute `npm install`.
4. Execute `npx prisma generate` e `npx prisma db push`.
5. Execute `npm run dev`.

A API fica em `http://localhost:8000` e o teste de saúde em `/api/health`.
A primeira conta cadastrada recebe o perfil ADMIN; as seguintes recebem USER.
