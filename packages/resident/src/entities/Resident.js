const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  sequenceId: {
    type: Number,
    required: true,
    unique: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  condominium: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true,
  },
}, { timestamps: true });

module.exports = residentSchema;
