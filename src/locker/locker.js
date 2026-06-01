const express = require('express');
const LockerModel = require('../mongo/locker');
const locker = require('../../packages/locker');

const app = express();
const PORT = 3001;

app.use(express.json());

locker.init(LockerModel);

app.post('/locker', async (req, res) => {
  try {
    const result = await locker.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/locker/all', async (_req, res) => {
  const result = await locker.findAll();
  res.json(result);
});

app.get('/locker/:id', async (req, res) => {
  try {
    const result = await locker.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Locker não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/locker/:id', async (req, res) => {
  try {
    const result = await locker.update(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: 'Locker não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/locker/:id', async (req, res) => {
  try {
    const result = await locker.remove(req.params.id);
    if (!result) return res.status(404).json({ error: 'Locker não encontrado' });
    res.json({ message: 'Locker removido' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Locker Service] Rodando na porta ${PORT}`);
});
