const router = require('express').Router();
const mongoose = require('mongoose');
const Diagnostic = require('../models/Diagnostic');
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// GET /api/progress
router.get('/', auth, async (req, res) => {
  try {
    // Agregar % de aciertos por tópico
    const userId = req.userId;
    // Obtener resultados agrupados
    const results = await Result.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $lookup: {
          from: 'activities', localField: 'activityId', foreignField: '_id', as: 'activity'
      }},
      { $unwind: '$activity' },
      { $group: {
          _id: '$activity.topic',
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$correct', 1, 0] } }
      }}
    ]);

    // Mapear a %
    const stats = results.map(r => ({
      topic: r._id,
      percent: Math.round((r.correct / r.total) * 100)
    }));

    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo progreso' });
  }
});

module.exports = router;