import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import { checkDatabase, prisma } from './config/database.js';

dotenv.config();
if (!process.env.JWT_SECRET) throw new Error('Configure JWT_SECRET no arquivo backend/.env');
const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.FRONTEND_URL || 'http://localhost:8443').split(',').map((v) => v.trim()), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Planeta e Clima API' }));
app.use('/api/auth', authRoutes);
app.use('/api', itemRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 'P2002' || err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Este e-mail ou registro já existe.' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Registro não encontrado.' });
  res.status(500).json({ error: 'Erro interno do servidor. Confira o terminal do backend.' });
});
const port = Number(process.env.PORT || 8000);
try {
  await checkDatabase();
  app.listen(port, '127.0.0.1', () => console.log(`API Planeta e Clima: http://localhost:${port}/api/health`));
} catch (error) {
  console.error('Não foi possível conectar ao MySQL. Verifique o MySQL e DATABASE_URL.', error.message);
  process.exitCode = 1;
} 
process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
