const connection = require('./connection');

function consume(queue, handler) {
  const channelWrapper = connection.createChannel({
    json: true,
    setup(channel) {
      return channel.assertQueue(queue, { durable: true }).then(() => {
        return channel.consume(queue, async (msg) => {
          if (!msg) return;
          try {
            const data = JSON.parse(msg.content.toString());
            await handler(data);
            channel.ack(msg);
          } catch (err) {
            console.error(`[RabbitMQ] Erro ao processar mensagem de ${queue}:`, err.message);
            channel.nack(msg, false, false);
          }
        });
      });
    },
  });

  return channelWrapper;
}

module.exports = { consume };
