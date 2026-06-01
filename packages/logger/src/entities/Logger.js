const mongoose = require('mongoose');

const loggerSchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    required: true,
  },
  lockerId: {
    type: String,
    required: true,
  },
  residentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Delivered', 'Withdrawn'],
    required: true,
  },
}, { timestamps: true });

module.exports = loggerSchema;
