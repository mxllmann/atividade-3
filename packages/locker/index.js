const lockerSchema = require('./src/entities/Locker');

let Locker;

function init(model) {
  Locker = model;
}

async function create(data) {
  return Locker.create(data);
}

async function findAll() {
  return Locker.find();
}

async function findById(id) {
  return Locker.findById(id);
}

async function update(id, data) {
  return Locker.findByIdAndUpdate(id, data, { new: true });
}

async function remove(id) {
  return Locker.findByIdAndDelete(id);
}

async function occupy(id) {
  return Locker.findByIdAndUpdate(id, { status: 'occupied' }, { new: true });
}

async function release(id) {
  return Locker.findByIdAndUpdate(id, { status: 'empty' }, { new: true });
}

module.exports = { lockerSchema, init, create, findAll, findById, update, remove, occupy, release };
