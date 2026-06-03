const { consume } = require('../queue/consumer');
const { LOCKER_OPEN } = require('../queue/queues');

const LOCKER_SERVICE_URL = process.env.LOCKER_SERVICE_URL || 'http://localhost:3001';

async function handleLockerOpen(data) {
  const { lockerId, action, deliveryId, residentId } = data;

  if (action === 'occupy') {
    console.log(`[Controle de Abertura] Abrindo compartimento ${lockerId} para depósito de encomenda ${deliveryId}`);
    console.log(`[Controle de Abertura] Encomenda depositada. Fechando compartimento ${lockerId}.`);

    await fetch(`${LOCKER_SERVICE_URL}/locker/${lockerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'occupied' }),
    });

    console.log(`[Controle de Abertura] Locker ${lockerId} marcado como ocupado.`);
  }

  if (action === 'release') {
    console.log(`[Controle de Abertura] Abrindo compartimento ${lockerId} para retirada pelo residente ${residentId}`);
    console.log(`[Controle de Abertura] Encomenda retirada. Fechando compartimento ${lockerId}.`);

    await fetch(`${LOCKER_SERVICE_URL}/locker/${lockerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'empty' }),
    });

    console.log(`[Controle de Abertura] Locker ${lockerId} marcado como vazio.`);
  }
}

consume(LOCKER_OPEN, handleLockerOpen);

console.log('[Controle de Abertura] Serviço iniciado. Aguardando mensagens...');
