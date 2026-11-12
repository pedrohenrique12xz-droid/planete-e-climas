import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireAdmin);
const models = { problems: prisma.problem, solutions: prisma.solution };
const selectItem = { id: true, title: true, category: true, description: true, createdAt: true };

router.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: 'desc' }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
    res.json({ items: users });
  } catch (error) { next(error); }
});

router.post('/users', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || typeof password !== 'string' || password.length < 6)
      return res.status(400).json({ error: 'Informe nome, e-mail e senha com pelo menos 6 caracteres.' });
    const user = await prisma.user.create({ data: { name: name.trim(), email: email.trim().toLowerCase(), passwordHash: await bcrypt.hash(password, 12), role: 'USER' }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
    res.status(201).json({ item: user });
  } catch (error) { next(error); }
});

router.put('/users/:id', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim()) return res.status(400).json({ error: 'Informe nome e e-mail.' });
    const data = { name: name.trim(), email: email.trim().toLowerCase() };
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
      data.passwordHash = await bcrypt.hash(password, 12);
    }
    const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data, select: { id: true, name: true, email: true, role: true, createdAt: true } });
    res.json({ item: user });
  } catch (error) { next(error); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (id === Number(req.user.id)) return res.status(400).json({ error: 'Não é possível excluir a conta administrativa em uso.' });
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) { next(error); }
});

router.get('/:type', async (req, res, next) => {
  try {
    const model = models[req.params.type];
    if (!model) return res.status(404).json({ error: 'Recurso não encontrado.' });
    const items = await model.findMany({ orderBy: { id: 'desc' }, select: selectItem });
    res.json({ items });
  } catch (error) { next(error); }
});

router.post('/:type', async (req, res, next) => {
  try {
    const model = models[req.params.type];
    const { title, category, description } = req.body;
    if (!model) return res.status(404).json({ error: 'Recurso não encontrado.' });
    if (!title?.trim() || !category?.trim() || !description?.trim()) return res.status(400).json({ error: 'Preencha título, categoria e descrição.' });
    const item = await model.create({ data: { title: title.trim(), category: category.trim(), description: description.trim(), createdBy: Number(req.user.id) }, select: selectItem });
    res.status(201).json({ item });
  } catch (error) { next(error); }
});

router.put('/:type/:id', async (req, res, next) => {
  try {
    const model = models[req.params.type];
    const { title, category, description } = req.body;
    if (!model) return res.status(404).json({ error: 'Recurso não encontrado.' });
    if (!title?.trim() || !category?.trim() || !description?.trim()) return res.status(400).json({ error: 'Preencha título, categoria e descrição.' });
    const item = await model.update({ where: { id: Number(req.params.id) }, data: { title: title.trim(), category: category.trim(), description: description.trim() }, select: selectItem });
    res.json({ item });
  } catch (error) { next(error); }
});

router.delete('/:type/:id', async (req, res, next) => {
  try {
    const model = models[req.params.type];
    if (!model) return res.status(404).json({ error: 'Recurso não encontrado.' });
    await model.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Registro excluído com sucesso.' });
  } catch (error) { next(error); }
});

export default router;
