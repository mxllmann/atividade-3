const mongoose = require('mongoose');
const { deliverySchema } = require('../../packages/delivery');

const MONGO_URI = process.env.DELIVERY_MONGO_URI || 'mongodb://localhost:27017/delivery_db';

const conn = mongoose.createConnection(MONGO_URI);
conn.on('connected', () => console.log('🍃 [MongoDB] delivery_db conectado'));

const DeliveryModel = conn.model('Delivery', deliverySchema);

module.exports = DeliveryModel;
