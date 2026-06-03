const amqp = require('amqp-connection-manager');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

const connection = amqp.connect([RABBITMQ_URL]);

connection.on('connect', () => console.log('🐰 [RabbitMQ] Conectado'));
connection.on('disconnect', (err) => console.log('🐰 [RabbitMQ] Desconectado', err?.message));

module.exports = connection;
