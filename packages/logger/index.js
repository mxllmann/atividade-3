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

async function findById(id) {
  return Logger.findById(id);
}

async function findByDeliveryId(deliveryId) {
  return Logger.find({ deliveryId });
}

async function remove(id) {
  return Logger.findByIdAndDelete(id);
}

module.exports = { loggerSchema, init, create, findAll, findById, findByDeliveryId, remove };
