const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  correct:    { type: Boolean, required: true },
  submittedAt:{ type: Date, default: Date.now }
});
module.exports = mongoose.model('Result', ResultSchema);