const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['estudiante','docente','admin'], default: 'estudiante' },
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);