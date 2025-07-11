const router = require('express').Router();
const Question = require('../models/Question');

// Obtener 70% fáciles y 30% intermedias aleatorias
router.get('/', async (req, res) => {
  try {
    // Contar cuántas preguntas hay de cada nivel
    const total = parseInt(req.query.limit) || 10;
    const easyCount = Math.round(total * 0.7);
    const interCount = total - easyCount;

    // Obtener aleatoriamente preguntas fáciles
    const easyQuestions = await Question.aggregate([
      { $match: { level: 'fácil' } },
      { $sample: { size: easyCount } }
    ]);

    // Obtener aleatoriamente preguntas intermedias
    const interQuestions = await Question.aggregate([
      { $match: { level: 'intermedio' } },
      { $sample: { size: interCount } }
    ]);

    // Unir y mezclar aleatoriamente el resultado final
    const allQuestions = [...easyQuestions, ...interQuestions]
      .sort(() => Math.random() - 0.5);

    res.json(allQuestions);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo preguntas' });
  }
});

// Crear
router.post('/', async (req, res) => {
  const q = new Question(req.body);
  await q.save();
  res.status(201).json(q);
});
// Actualizar
router.put('/:id', async (req, res) => {
  const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(q);
});
// Eliminar
router.delete('/:id', async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: 'Pregunta eliminada' });
});

module.exports = router;