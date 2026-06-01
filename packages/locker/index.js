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

async function occupy(id) {
  return Locker.findByIdAndUpdate(id, { status: 'occupied' }, { new: true });
}

async function release(id) {
  return Locker.findByIdAndUpdate(id, { status: 'empty' }, { new: true });
}

module.exports = { lockerSchema, init, create, findAll, findById, occupy, release };
