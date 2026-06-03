const express = require('express');
const DeliveryModel = require('../mongo/delivery');
const delivery = require('../../packages/delivery');
const { publish } = require('../queue/publisher');
const { LOCKER_CONTROL, LOGGER_LOG } = require('../queue/queues');

const LOCKER_SERVICE_URL = process.env.LOCKER_SERVICE_URL || 'http://localhost:3001';
const RESIDENT_SERVICE_URL = process.env.RESIDENT_SERVICE_URL || 'http://localhost:3003';

const app = express();
const PORT = 3002;

app.use(express.json());

delivery.init(DeliveryModel);

// Criar entrega (entregador escolhe tamanho e residente)
app.post('/delivery', async (req, res) => {
  try {
    const { sequenceId, residentId, size } = req.body;

    if (!size) return res.status(400).json({ error: 'Tamanho da encomenda é obrigatório (P, M, G, XG)' });
    if (!residentId) return res.status(400).json({ error: 'Residente é obrigatório' });

    // Busca residente para saber o condomínio
    const residentRes = await fetch(`${RESIDENT_SERVICE_URL}/resident/${residentId}`);
    if (!residentRes.ok) return res.status(404).json({ error: 'Residente não encontrado' });
    const resident = await residentRes.json();

    // Busca locker disponível do tamanho escolhido no condomínio do residente
    const availableRes = await fetch(`${LOCKER_SERVICE_URL}/locker/available/${size}?condominium=${resident.condominium}`);
    const available = await availableRes.json();

    if (!available.length) {
      console.log(`\n[Delivery] ❌ Entrega recusada! Nenhum locker ${size} disponível no condomínio ${resident.condominium}`);
      return res.status(400).json({ error: `Nenhum locker tamanho ${size} disponível no condomínio ${resident.condominium}` });
    }

    const locker = available[0];

    const result = await delivery.create({ sequenceId, residentId, size, lockerId: locker.sequenceId });

    console.log(`\n[Delivery] 📬 Nova entrega criada!`);
    console.log(`[Delivery]    ├── Entrega #${result.sequenceId}`);
    console.log(`[Delivery]    ├── Locker #${locker.sequenceId} (${locker.capacity}) ← Encomenda (${size})`);
    console.log(`[Delivery]    ├── Residente #${result.residentId} (${resident.name})`);
    console.log(`[Delivery]    └── Condomínio ${resident.condominium}`);

    await publish(LOCKER_CONTROL, {
      lockerId: locker.sequenceId,
      deliveryId: result.sequenceId,
      action: 'occupy',
    });

    await publish(LOGGER_LOG, {
      deliveryId: result.sequenceId,
      lockerId: locker.sequenceId,
      residentId: result.residentId,
      status: 'Delivered',
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retirar encomenda (residente busca)
app.put('/delivery/:sequenceId/withdraw', async (req, res) => {
  try {
    const existing = await delivery.findBySequenceId(req.params.sequenceId);
    if (!existing) return res.status(404).json({ error: 'Delivery não encontrado' });
    if (existing.status === 'withdrawn') return res.status(400).json({ error: 'Encomenda já retirada' });

    const result = await delivery.withdraw(req.params.sequenceId);

    console.log(`\n[Delivery] 📭 Encomenda retirada!`);
    console.log(`[Delivery]    ├── Entrega #${result.sequenceId}`);
    console.log(`[Delivery]    ├── Locker #${result.lockerId}`);
    console.log(`[Delivery]    └── Residente #${result.residentId}`);

    await publish(LOCKER_CONTROL, {
      lockerId: result.lockerId,
      deliveryId: result.sequenceId,
      residentId: result.residentId,
      action: 'release',
    });

    await publish(LOGGER_LOG, {
      deliveryId: result.sequenceId,
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
    const result = await delivery.findByResidentId(Number(req.params.residentId));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/delivery/all', async (_req, res) => {
  const result = await delivery.findAll();
  res.json(result);
});

app.get('/delivery/:sequenceId', async (req, res) => {
  try {
    const result = await delivery.findBySequenceId(req.params.sequenceId);
    if (!result) return res.status(404).json({ error: 'Delivery não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/delivery/:sequenceId', async (req, res) => {
  try {
    const result = await delivery.update(req.params.sequenceId, req.body);
    if (!result) return res.status(404).json({ error: 'Delivery não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/delivery/:sequenceId', async (req, res) => {
  try {
    const result = await delivery.findBySequenceId(req.params.sequenceId);
    if (!result) return res.status(404).json({ error: 'Delivery não encontrado' });
    await DeliveryModel.findOneAndDelete({ sequenceId: req.params.sequenceId });
    console.log(`\n[Delivery] 🗑️  Entrega #${req.params.sequenceId} removida`);
    res.json({ message: 'Delivery removido' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n📬 [Delivery Service] Rodando na porta ${PORT}`);
});
