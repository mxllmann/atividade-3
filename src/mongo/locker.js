const mongoose = require('mongoose');
const { lockerSchema } = require('../../packages/locker');

const MONGO_URI = process.env.LOCKER_MONGO_URI || 'mongodb://localhost:27017/locker_db';

const conn = mongoose.createConnection(MONGO_URI);
conn.on('connected', () => console.log('🍃 [MongoDB] locker_db conectado'));

const LockerModel = conn.model('Locker', lockerSchema);

module.exports = LockerModel;
