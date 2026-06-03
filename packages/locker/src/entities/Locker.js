const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
  sequenceId: {
    type: Number,
    required: true,
    unique: true,
  },
  condominium: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true,
  },
  capacity: {
    type: String,
    enum: ['P', 'M', 'G', 'XG'],
    required: true,
  },
  status: {
    type: String,
    enum: ['empty', 'occupied'],
    default: 'empty',
  },
}, { timestamps: true });

module.exports = lockerSchema;
