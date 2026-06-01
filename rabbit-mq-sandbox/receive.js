const amqp = require('amqp-connection-manager');

const QUEUE = 'hello';

const connection = amqp.connect(['amqp://localhost']);

connection.on('connect', () => console.log('[receive] conectado ao broker'));
connection.on('disconnect', (err) => console.log('[receive] desconectado:', err?.err?.message));

// Mesmo fluxo do send: criamos um channel wrapper e declaramos a topologia no setup.
// A diferenca eh que aqui tambem registramos um consumer dentro do setup.
const channelWrapper = connection.createChannel({
  setup: (channel) => {
    // Importante: mesmas opcoes do send. Se divergir, assertQueue falha.
    return Promise.all([
      channel.assertQueue(QUEUE, { durable: true }),

      // consume escuta a fila. O handler eh chamado pra cada mensagem entregue.
      channel.consume(QUEUE, (msg) => {
        if (msg === null) return; // consumer foi cancelado

        const conteudo = msg.content.toString();
        console.log(`[receive] recebido: "${conteudo}"`);

        // ack confirma o processamento. Ate o ack, a mensagem fica "unacked":
        // se o consumer cair, o broker reentrega pra outro consumer.
        // Sem ack, ela fica unacked pra sempre (vaza na fila).
        channel.ack(msg);
      }),
    ]);
  },
});

channelWrapper.waitForConnect().then(() => {
  console.log(`[receive] aguardando mensagens na fila "${QUEUE}". CTRL+C para sair.`);
});

// Fechamento limpo no CTRL+C
process.on('SIGINT', async () => {
  console.log('\n[receive] fechando...');
  await channelWrapper.close();
  await connection.close();
  process.exit(0);
});
