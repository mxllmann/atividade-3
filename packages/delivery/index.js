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

async function findByResidentId(residentId) {
  return Delivery.find({ residentId });
}

async function update(id, data) {
  return Delivery.findByIdAndUpdate(id, data, { new: true });
}

async function withdraw(id) {
  return Delivery.findByIdAndUpdate(id, { status: 'withdrawn' }, { new: true });
}

module.exports = { deliverySchema, init, create, findAll, findById, findBySequenceId, findByResidentId, update, withdraw };
