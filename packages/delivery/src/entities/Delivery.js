const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  sequenceId: {
    type: Number,
    required: true,
    unique: true,
  },
  residentId: {
    type: String,
    required: true,
  },
  lockerId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['delivered', 'withdrawn'],
    default: 'delivered',
  },
}, { timestamps: true });

module.exports = deliverySchema;
