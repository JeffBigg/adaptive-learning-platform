const router = require('express').Router();
const Activity = require('../models/Activity');
// Similar CRUD a questions:
router.get('/', async (req, res) => {
  const list = await Activity.find().limit(100);
  res.json(list);
});
router.post('/', async (req, res) => {
  const a = new Activity(req.body);
  await a.save(); res.status(201).json(a);
});
router.put('/:id', async (req, res) => {
  const a = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(a);
});
router.delete('/:id', async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.json({ message: 'Actividad eliminada' });
});
module.exports = router;