const express = require('express');
const amqp = require('amqplib');
const LockerModel = require('../mongo/locker');
const locker = require('../../packages/locker');

const PORT = process.env.PORT || 3001;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

const QUEUES = {
  OCCUPY: 'locker.occupy',
  RELEASE: 'locker.release',
};

async function main() {
  locker.init(LockerModel);

  // --- RabbitMQ consumers ---
  const mqConn = await amqp.connect(RABBITMQ_URL);
  const channel = await mqConn.createChannel();

  await channel.assertQueue(QUEUES.OCCUPY, { durable: true });
  await channel.assertQueue(QUEUES.RELEASE, { durable: true });

  channel.consume(QUEUES.OCCUPY, async (msg) => {
    if (!msg) return;
    try {
      const { lockerId } = JSON.parse(msg.content.toString());
      console.log(`[RabbitMQ] Ocupando locker ${lockerId}`);
      await locker.occupy(lockerId);
      channel.ack(msg);
    } catch (err) {
      console.error('[RabbitMQ] Erro ao ocupar:', err.message);
      channel.nack(msg, false, false);
    }
  });

  channel.consume(QUEUES.RELEASE, async (msg) => {
    if (!msg) return;
    try {
      const { lockerId } = JSON.parse(msg.content.toString());
      console.log(`[RabbitMQ] Liberando locker ${lockerId}`);
      await locker.release(lockerId);
      channel.ack(msg);
    } catch (err) {
      console.error('[RabbitMQ] Erro ao liberar:', err.message);
      channel.nack(msg, false, false);
    }
  });

  console.log(`[RabbitMQ] Consumindo filas: ${Object.values(QUEUES).join(', ')}`);

  // --- Express routes ---
  const app = express();
  app.use(express.json());

  app.post('/lockers', async (req, res) => {
    try {
      const result = await locker.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/lockers', async (_req, res) => {
    const result = await locker.findAll();
    res.json(result);
  });

  app.get('/lockers/:id', async (req, res) => {
    try {
      const result = await locker.findById(req.params.id);
      if (!result) return res.status(404).json({ error: 'Locker não encontrado' });
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`[Locker Service] Rodando na porta ${PORT}`);
  });
}

main().catch((err) => {
  console.error('[Locker Service] Erro ao iniciar:', err);
  process.exit(1);
});
