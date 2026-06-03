const connection = require('./connection');

const channelWrapper = connection.createChannel({
  json: true,
  setup(channel) {
    const { LOCKER_OPEN, LOGGER_LOG } = require('./queues');
    return Promise.all([
      channel.assertQueue(LOCKER_OPEN, { durable: true }),
      channel.assertQueue(LOGGER_LOG, { durable: true }),
    ]);
  },
});

async function publish(queue, message) {
  await channelWrapper.sendToQueue(queue, message, { persistent: true });
  console.log(`[RabbitMQ] Mensagem publicada em ${queue}:`, message);
}

module.exports = { publish };
