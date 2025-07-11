const router = require('express').Router();
const axios = require('axios');
const Diagnostic = require('../models/Diagnostic');
const Result = require('../models/Result');
// Middleware auth placeholder (JWT)
const auth = require('../middleware/auth');

// POST /api/diagnostic
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { responses, topic } = req.body;  // responses: [0,1,1,...]
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'Respuestas no válidas' });
    }

    // Calcular porcentaje de respuestas correctas
    const total = responses.length;
    const correctas = responses.filter(a => a === 1).length;
    const percent = Math.round((correctas / total) * 100);

    // Definir nivel según porcentaje
    let level = 'fácil';
    if (percent >= 80) level = 'avanzado';
    else if (percent >= 50) level = 'intermedio';

    // Guardar en MongoDB
    const diag = new Diagnostic({ userId, responses, level, topic, percent });
    await diag.save();
    res.json({ level, percent, id: diag._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en diagnóstico' });
  }
});

// POST /api/results
router.post('/results', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { activityId, correct } = req.body;
    const result = new Result({ userId, activityId, correct });
    await result.save();
    res.json({ id: result._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error guardando resultado' });
  }
});

module.exports = router;