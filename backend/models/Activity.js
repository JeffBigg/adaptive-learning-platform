const mongoose = require('mongoose');
const ActivitySchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  inputs: [{ label: String, type: String }],
  topic: { type: String, required: true },
  level: { type: String, enum: ['fácil','intermedio','avanzado'], required: true }
});
module.exports = mongoose.model('Activity', ActivitySchema);