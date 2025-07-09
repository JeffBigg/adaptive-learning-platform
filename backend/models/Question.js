const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  topic: { type: String, required: true },
  level: { type: String, enum: ['fácil','intermedio','avanzado'], required: true }
});
module.exports = mongoose.model('Question', QuestionSchema);