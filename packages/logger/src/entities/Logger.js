const mongoose = require('mongoose');

const loggerSchema = new mongoose.Schema({
  deliveryId: {
    type: Number,
    required: true,
  },
  lockerId: {
    type: Number,
    required: true,
  },
  residentId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Delivered', 'Withdrawn'],
    required: true,
  },
}, { timestamps: true });

module.exports = loggerSchema;
