const connection = require('./connection');

const channelWrapper = connection.createChannel({
  json: true,
  setup(channel) {
    const { LOCKER_CONTROL, LOGGER_LOG } = require('./queues');
    return Promise.all([
      channel.assertQueue(LOCKER_CONTROL, { durable: true }),
      channel.assertQueue(LOGGER_LOG, { durable: true }),
    ]);
  },
});

async function publish(queue, message) {
  await channelWrapper.sendToQueue(queue, message, { persistent: true });
  console.log(`[Queue] 📨 Mensagem publicada na fila "${queue}"`);
}

module.exports = { publish };
