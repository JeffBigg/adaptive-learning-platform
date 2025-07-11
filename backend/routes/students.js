const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const studs = await User.find({ role: 'estudiante' }, 'email _id');
    res.json(studs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error obteniendo estudiantes' });
  }
});

module.exports = router;