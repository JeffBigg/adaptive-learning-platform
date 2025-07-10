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
    // Llamada al IA service
    const iaRes = await axios.post('http://localhost:5000/predict', { responses });
    const level = iaRes.data.level;
    // Guardar en MongoDB
    const diag = new Diagnostic({ userId, responses, level, topic });
    await diag.save();
    res.json({ level, id: diag._id });
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