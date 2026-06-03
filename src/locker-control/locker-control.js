const { consume } = require('../queue/consumer');
const { LOCKER_CONTROL } = require('../queue/queues');

const LOCKER_SERVICE_URL = process.env.LOCKER_SERVICE_URL || 'http://localhost:3001';

async function handleLockerOpen(data) {
  const { lockerId, action, deliveryId, residentId } = data;

  if (action === 'occupy') {
    console.log(`\n[Locker Control] 🔓 Abrindo compartimento #${lockerId}...`);
    console.log(`[Locker Control]    ├── Motivo: depósito de encomenda #${deliveryId}`);
    console.log(`[Locker Control]    ├── 📦 Encomenda depositada com sucesso`);
    console.log(`[Locker Control]    └── 🔒 Fechando compartimento #${lockerId}`);

    await fetch(`${LOCKER_SERVICE_URL}/locker/${lockerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'occupied' }),
    });

    console.log(`[Locker Control]    ✅ Locker #${lockerId} → ocupado\n`);
  }

  if (action === 'release') {
    console.log(`\n[Locker Control] 🔓 Abrindo compartimento #${lockerId}...`);
    console.log(`[Locker Control]    ├── Motivo: retirada pelo residente #${residentId}`);
    console.log(`[Locker Control]    ├── 📭 Encomenda retirada com sucesso`);
    console.log(`[Locker Control]    └── 🔒 Fechando compartimento #${lockerId}`);

    await fetch(`${LOCKER_SERVICE_URL}/locker/${lockerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'empty' }),
    });

    console.log(`[Locker Control]    ✅ Locker #${lockerId} → vazio\n`);
  }
}

consume(LOCKER_CONTROL, handleLockerOpen);

console.log(`\n🔐 [Locker Control] Serviço iniciado. Aguardando mensagens da fila...`);
