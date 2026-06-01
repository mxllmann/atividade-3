const deliverySchema = require('./src/entities/Delivery');

let Delivery;

function init(model) {
  Delivery = model;
}

async function create(data) {
  return Delivery.create(data);
}

async function findAll() {
  return Delivery.find();
}

async function findById(id) {
  return Delivery.findById(id);
}

async function findBySequenceId(sequenceId) {
  return Delivery.findOne({ sequenceId });
}

module.exports = { deliverySchema, init, create, findAll, findById, findBySequenceId };
