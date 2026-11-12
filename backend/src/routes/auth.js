import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });
const makeToken = (user) => jwt.sign(publicUser(user), process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || typeof password !== 'string' || password.length < 6)
      return res.status(400).json({ error: 'Informe nome, e-mail e senha com pelo menos 6 caracteres.' });
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) return res.status(409).json({ error: 'Já existe uma conta cadastrada com este e-mail.' });
    // A primeira conta criada no banco recebe o perfil ADMIN automaticamente.
    const userCount = await prisma.user.count();
    const user = await prisma.user.create({ data: {
      name: name.trim(), email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      role: userCount === 0 ? 'ADMIN' : 'USER',
    } });
    res.status(201).json({ user: publicUser(user), token: makeToken(user) });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Informe e-mail e senha.' });
    const user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    res.json({ user: publicUser(user), token: makeToken(user) });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.user.id) } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
});

export default router;
