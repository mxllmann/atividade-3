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
    console.log(`\n[Resident] 👤 Residente #${result.sequenceId} cadastrado | ${result.name} | Condomínio ${result.condominium}`);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/resident/all', async (_req, res) => {
  const result = await resident.findAll();
  res.json(result);
});

app.get('/resident/:sequenceId', async (req, res) => {
  try {
    const result = await resident.findBySequenceId(req.params.sequenceId);
    if (!result) return res.status(404).json({ error: 'Residente não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/resident/:sequenceId', async (req, res) => {
  try {
    const result = await resident.update(req.params.sequenceId, req.body);
    if (!result) return res.status(404).json({ error: 'Residente não encontrado' });
    console.log(`\n[Resident] ✏️  Residente #${req.params.sequenceId} atualizado`);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/resident/:sequenceId', async (req, res) => {
  try {
    const result = await resident.remove(req.params.sequenceId);
    if (!result) return res.status(404).json({ error: 'Residente não encontrado' });
    console.log(`\n[Resident] 🗑️  Residente #${req.params.sequenceId} removido`);
    res.json({ message: 'Residente removido' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n👤 [Resident Service] Rodando na porta ${PORT}`);
});
