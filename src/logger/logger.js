const express = require('express');
const LoggerModel = require('../mongo/logger');
const logger = require('../../packages/logger');
const { consume } = require('../queue/consumer');
const { LOGGER_LOG } = require('../queue/queues');

const app = express();
const PORT = 3004;

app.use(express.json());

logger.init(LoggerModel);

// Consome mensagens da fila de logging
consume(LOGGER_LOG, async (data) => {
  await logger.create(data);
  console.log(`\n[Logger] 📝 Log registrado!`);
  console.log(`[Logger]    ├── Entrega #${data.deliveryId}`);
  console.log(`[Logger]    ├── Locker #${data.lockerId}`);
  console.log(`[Logger]    ├── Residente #${data.residentId}`);
  console.log(`[Logger]    └── Status: ${data.status}`);
});

app.post('/log', async (req, res) => {
  try {
    const result = await logger.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/log/all', async (_req, res) => {
  const result = await logger.findAll();
  res.json(result);
});

app.get('/log/delivery/:deliveryId', async (req, res) => {
  try {
    const result = await logger.findByDeliveryId(Number(req.params.deliveryId));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/log/:deliveryId', async (req, res) => {
  try {
    const result = await logger.remove(Number(req.params.deliveryId));
    if (!result) return res.status(404).json({ error: 'Log não encontrado' });
    console.log(`\n[Logger] 🗑️  Log da entrega #${req.params.deliveryId} removido`);
    res.json({ message: 'Log removido' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n📝 [Logger Service] Rodando na porta ${PORT}`);
});
