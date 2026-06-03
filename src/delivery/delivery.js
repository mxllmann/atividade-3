const express = require('express');
const DeliveryModel = require('../mongo/delivery');
const delivery = require('../../packages/delivery');
const { publish } = require('../queue/publisher');
const { LOCKER_OPEN, LOGGER_LOG } = require('../queue/queues');

const app = express();
const PORT = 3002;

app.use(express.json());

delivery.init(DeliveryModel);

// Criar entrega (entregador deposita encomenda)
app.post('/delivery', async (req, res) => {
  try {
    const result = await delivery.create(req.body);

    await publish(LOCKER_OPEN, {
      lockerId: result.lockerId,
      deliveryId: result._id,
      action: 'occupy',
    });

    await publish(LOGGER_LOG, {
      deliveryId: result._id,
      lockerId: result.lockerId,
      residentId: result.residentId,
      status: 'Delivered',
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retirar encomenda (residente busca)
app.put('/delivery/:id/withdraw', async (req, res) => {
  try {
    const existing = await delivery.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Delivery não encontrado' });
    if (existing.status === 'withdrawn') return res.status(400).json({ error: 'Encomenda já retirada' });

    const result = await delivery.withdraw(req.params.id);

    await publish(LOCKER_OPEN, {
      lockerId: result.lockerId,
      deliveryId: result._id,
      residentId: result.residentId,
      action: 'release',
    });

    await publish(LOGGER_LOG, {
      deliveryId: result._id,
      lockerId: result.lockerId,
      residentId: result.residentId,
      status: 'Withdrawn',
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Buscar entregas por residente
app.get('/delivery/resident/:residentId', async (req, res) => {
  try {
    const result = await delivery.findByResidentId(req.params.residentId);
    res.json(result);
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
    const result = await delivery.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Delivery não encontrado' });
    await DeliveryModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Delivery removido' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Delivery Service] Rodando na porta ${PORT}`);
});
