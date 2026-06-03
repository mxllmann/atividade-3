const loggerSchema = require('./src/entities/Logger');

let Logger;

function init(model) {
  Logger = model;
}

async function create(data) {
  return Logger.create(data);
}

async function findAll() {
  return Logger.find();
}

async function findByDeliveryId(deliveryId) {
  return Logger.find({ deliveryId });
}

async function remove(deliveryId) {
  return Logger.findOneAndDelete({ deliveryId });
}

module.exports = { loggerSchema, init, create, findAll, findByDeliveryId, remove };
