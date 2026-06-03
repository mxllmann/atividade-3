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

// Criar entrega (entregador deposita encomenda)
app.post('/delivery', async (req, res) => {
  try {
    const { lockerId, residentId } = req.body;

    const [lockerRes, residentRes] = await Promise.all([
      fetch(`${LOCKER_SERVICE_URL}/locker/${lockerId}`),
      fetch(`${RESIDENT_SERVICE_URL}/resident/${residentId}`),
    ]);

    if (!lockerRes.ok) return res.status(404).json({ error: 'Locker não encontrado' });
    if (!residentRes.ok) return res.status(404).json({ error: 'Residente não encontrado' });

    const locker = await lockerRes.json();
    const resident = await residentRes.json();

    if (locker.condominium !== resident.condominium) {
      console.log(`\n[Delivery] ❌ Entrega recusada! Residente #${residentId} (cond. ${resident.condominium}) ≠ Locker #${lockerId} (cond. ${locker.condominium})`);
      return res.status(400).json({ error: 'Residente não pertence ao condomínio deste locker' });
    }

    if (locker.status === 'occupied') {
      console.log(`\n[Delivery] ❌ Entrega recusada! Locker #${lockerId} já está ocupado`);
      return res.status(400).json({ error: 'Locker já está ocupado' });
    }

    const result = await delivery.create(req.body);

    console.log(`\n[Delivery] 📬 Nova entrega criada!`);
    console.log(`[Delivery]    ├── Entrega #${result.sequenceId}`);
    console.log(`[Delivery]    ├── Locker #${result.lockerId} (${locker.capacity})`);
    console.log(`[Delivery]    ├── Residente #${result.residentId} (${resident.name})`);
    console.log(`[Delivery]    └── Condomínio ${locker.condominium}`);

    await publish(LOCKER_CONTROL, {
      lockerId: result.lockerId,
      deliveryId: result.sequenceId,
      action: 'occupy',
    });

    await publish(LOGGER_LOG, {
      deliveryId: result.sequenceId,
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
