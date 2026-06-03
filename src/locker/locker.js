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
    console.log(`\n[Locker] 📦 Locker #${result.sequenceId} criado | Condomínio: ${result.condominium} | Tamanho: ${result.capacity}`);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/locker/all', async (_req, res) => {
  const result = await locker.findAll();
  res.json(result);
});

app.get('/locker/available/:capacity', async (req, res) => {
  try {
    const result = await locker.findAvailable(req.params.capacity);
    console.log(`\n[Locker] 🔍 Busca por lockers disponíveis tamanho ${req.params.capacity} → ${result.length} encontrado(s)`);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/locker/:sequenceId', async (req, res) => {
  try {
    const result = await locker.findBySequenceId(req.params.sequenceId);
    if (!result) return res.status(404).json({ error: 'Locker não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/locker/:sequenceId', async (req, res) => {
  try {
    const result = await locker.update(req.params.sequenceId, req.body);
    if (!result) return res.status(404).json({ error: 'Locker não encontrado' });
    console.log(`\n[Locker] ✏️  Locker #${req.params.sequenceId} atualizado → status: ${result.status}`);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/locker/:sequenceId', async (req, res) => {
  try {
    const result = await locker.remove(req.params.sequenceId);
    if (!result) return res.status(404).json({ error: 'Locker não encontrado' });
    console.log(`\n[Locker] 🗑️  Locker #${req.params.sequenceId} removido`);
    res.json({ message: 'Locker removido' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n📦 [Locker Service] Rodando na porta ${PORT}`);
});
