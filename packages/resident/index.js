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

async function findById(id) {
  return Resident.findById(id);
}

async function findByCpf(cpf) {
  return Resident.findOne({ cpf });
}

async function update(id, data) {
  return Resident.findByIdAndUpdate(id, data, { new: true });
}

async function remove(id) {
  return Resident.findByIdAndDelete(id);
}

module.exports = { residentSchema, init, create, findAll, findById, findByCpf, update, remove };
