const express = require('express');
const DeliveryModel = require('../mongo/locker');
const delivery = require('../../packages/locker');

const app = express();
const PORT = 3002;

app.use(express.json());

delivery.init(DeliveryModel);

app.post('/delivery', async (req, res) => {
  try {
    const result = await delivery.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/delivery/all', async (_req, res) => {
  const result = await delivery.findAll();
  res.json(result);
});

app.get('/delivery/:id', async (req, res) => {
  try {
    const result = await delivery.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Delivery não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/delivery/:id', async (req, res) => {
  try {
    const result = await delivery.update(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: 'Delivery não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/delivery/:id', async (req, res) => {
  try {
    const result = await delivery.remove(req.params.id);
    if (!result) return res.status(404).json({ error: 'Delivery não encontrado' });
    res.json({ message: 'Delivery removido' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Delivery Service] Rodando na porta ${PORT}`);
});
