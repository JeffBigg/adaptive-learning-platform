const router = require('express').Router();
const Question = require('../models/Question');

// Obtener todas o filtrar
router.get('/', async (req, res) => {
  const questions = await Question.find().limit(100);
  res.json(questions);
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