const mongoose = require('mongoose');
const DiagnosticSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses:  [{ type: Number, required: true }],
  level:      { type: String, required: true },
  topic:      { type: String },
  createdAt:  { type: Date, default: Date.now }
});
module.exports = mongoose.model('Diagnostic', DiagnosticSchema);