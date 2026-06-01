const mongoose = require('mongoose');
const { residentSchema } = require('../../packages/resident/src');

const MONGO_URI = process.env.RESIDENT_MONGO_URI || 'mongodb://localhost:27017/resident_db';

const conn = mongoose.createConnection(MONGO_URI);
conn.on('connected', () => console.log(`[MongoDB] resident_db conectado`));

const ResidentModel = conn.model('Resident', residentSchema);

module.exports = ResidentModel;
