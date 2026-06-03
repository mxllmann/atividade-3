const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
  sequenceId: {
    type: Number,
    required: true,
    unique: true,
  },
  location: {
    type: String,
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
