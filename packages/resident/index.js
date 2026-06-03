const residentSchema = require('./src/entities/Resident');

let Resident;

function init(model) {
  Resident = model;
}

async function create(data) {
  return Resident.create(data);
}

async function findAll() {
  return Resident.find();
}

async function findBySequenceId(sequenceId) {
  return Resident.findOne({ sequenceId });
}

async function findByCpf(cpf) {
  return Resident.findOne({ cpf });
}

async function update(sequenceId, data) {
  return Resident.findOneAndUpdate({ sequenceId }, data, { returnDocument: 'after' });
}

async function remove(sequenceId) {
  return Resident.findOneAndDelete({ sequenceId });
}

module.exports = { residentSchema, init, create, findAll, findBySequenceId, findByCpf, update, remove };
