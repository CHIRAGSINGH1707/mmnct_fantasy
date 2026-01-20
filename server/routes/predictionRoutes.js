const express = require('express');
const router = express.Router();
const { placePrediction, getUserPredictions, getLeaderboard } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getUserPredictions);
router.post('/', protect, placePrediction);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
