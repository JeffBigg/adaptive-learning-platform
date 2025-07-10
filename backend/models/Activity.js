const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  expected: { type: String, required: true }, // Añadido para coincidir con el frontend
  inputs: [{ 
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'textarea'], default: 'text' }
  }],
  topic: { type: String, required: true },
  level: { type: String, enum: ['fácil','intermedio','avanzado'], required: true }
});

module.exports = mongoose.model('Activity', ActivitySchema);