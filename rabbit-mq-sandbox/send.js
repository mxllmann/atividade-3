const amqp = require('amqp-connection-manager');

const QUEUE = 'hello';

// connect() abre a connection TCP com o broker e ja embute logica de reconexao.
// Pode receber um array de URLs para failover (cluster). Aqui, so localhost.
const connection = amqp.connect(['amqp://localhost']);

connection.on('connect', () => console.log('[send] conectado ao broker'));
connection.on('disconnect', (err) => console.log('[send] desconectado:', err?.err?.message));

// createChannel cria um "channel wrapper". O callback `setup` roda toda vez
// que reconecta — tudo que precisa existir antes de operar vai aqui dentro.
const channelWrapper = connection.createChannel({
  json: false, // mensagem como Buffer puro; se true, serializa JSON automaticamente
  setup: (channel) => {
    // assertQueue: cria a fila se nao existir, ou confirma que existe com essas opcoes.
    // durable: false -> definicao da fila some se o broker reiniciar.
    return channel.assertQueue(QUEUE, { durable: true });
  },
});

async function main() {
  const mensagem = 'Hello World!';

  // sendToQueue eh um atalho: publica na default exchange ('') com
  // routing key = nome da fila. Equivalente a publish('', QUEUE, ...).
  await channelWrapper.sendToQueue(QUEUE, Buffer.from(mensagem));
  console.log(`[send] enviado: "${mensagem}"`);

  // amqp-connection-manager bufferiza publicacoes ate o channel estar pronto.
  // close() espera o buffer drenar antes de fechar — sem ele, podemos perder
  // a mensagem se fecharmos rapido demais.
  await channelWrapper.close();
  await connection.close();
}

main().catch((err) => {
  console.error('[send] erro:', err);
  process.exit(1);
});
