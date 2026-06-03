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

async function findBySequenceId(sequenceId) {
  return Locker.findOne({ sequenceId });
}

async function update(sequenceId, data) {
  return Locker.findOneAndUpdate({ sequenceId }, data, { returnDocument: 'after' });
}

async function remove(sequenceId) {
  return Locker.findOneAndDelete({ sequenceId });
}

async function occupy(sequenceId) {
  return Locker.findOneAndUpdate({ sequenceId }, { status: 'occupied' }, { returnDocument: 'after' });
}

async function release(sequenceId) {
  return Locker.findOneAndUpdate({ sequenceId }, { status: 'empty' }, { returnDocument: 'after' });
}

async function findAvailable(capacity) {
  return Locker.find({ capacity, status: 'empty' });
}

module.exports = { lockerSchema, init, create, findAll, findBySequenceId, update, remove, occupy, release, findAvailable };
