const mongoose = require('mongoose');
const { loggerSchema } = require('../../packages/logger');

const MONGO_URI = process.env.LOGGER_MONGO_URI || 'mongodb://localhost:27017/logger_db';

const conn = mongoose.createConnection(MONGO_URI);
conn.on('connected', () => console.log(`[MongoDB] logger_db conectado`));

const loggerModel = conn.model('Logger', loggerSchema);

module.exports = loggerModel;
