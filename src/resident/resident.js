const express = require('express');
const ResidentModel = require('../mongo/resident');
const resident = require('../../packages/resident');

const app = express();
const PORT = 3003;

app.use(express.json());

resident.init(ResidentModel);

app.post('/resident', async (req, res) => {
  try {
    const result = await resident.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/resident/all', async (_req, res) => {
  const result = await resident.findAll();
  res.json(result);
});

app.get('/resident/:id', async (req, res) => {
  try {
    const result = await resident.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Residente não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/resident/:id', async (req, res) => {
  try {
    const result = await resident.update(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: 'Residente não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/resident/:id', async (req, res) => {
  try {
    const result = await resident.remove(req.params.id);
    if (!result) return res.status(404).json({ error: 'Residente não encontrado' });
    res.json({ message: 'Residente removido' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Resident Service] Rodando na porta ${PORT}`);
});
