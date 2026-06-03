const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  sequenceId: {
    type: Number,
    required: true,
    unique: true,
  },
  residentId: {
    type: Number,
    required: true,
  },
  lockerId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['delivered', 'withdrawn'],
    default: 'delivered',
  },
}, { timestamps: true });

module.exports = deliverySchema;
