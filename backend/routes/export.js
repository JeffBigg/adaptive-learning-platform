const router = require('express').Router();
const { Parser } = require('json2csv');
const Result = require('../models/Result');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

router.get('/:studentId', auth, async (req, res) => {
  try {
    const sid = mongoose.Types.ObjectId(req.params.studentId);
    const results = await Result.aggregate([
      { $match: { userId: sid } },
      { $lookup: { from: 'activities', localField: 'activityId', foreignField: '_id', as: 'act' } },
      { $unwind: '$act' },
      { $project: { activity: '$act.prompt', correct: 1, submittedAt: 1 } }
    ]);
    const parser = new Parser({ fields: ['activity','correct','submittedAt'] });
    const csv = parser.parse(results);
    res.header('Content-Type','text/csv');
    res.attachment(`results_${req.params.studentId}.csv`);
    res.send(csv);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error exportando CSV' });
  }
});

module.exports = router;