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

async function findBySequenceId(sequenceId) {
  return Delivery.findOne({ sequenceId });
}

async function findByResidentId(residentId) {
  return Delivery.find({ residentId });
}

async function update(sequenceId, data) {
  return Delivery.findOneAndUpdate({ sequenceId }, data, { returnDocument: 'after' });
}

async function withdraw(sequenceId) {
  return Delivery.findOneAndUpdate({ sequenceId }, { status: 'withdrawn' }, { returnDocument: 'after' });
}

module.exports = { deliverySchema, init, create, findAll, findBySequenceId, findByResidentId, update, withdraw };
