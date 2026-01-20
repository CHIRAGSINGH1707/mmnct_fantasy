const express = require('express');
const router = express.Router();
const { createMatch, getMatches, updateMatchStatus, declareWinner } = require('../controllers/matchController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getMatches);
router.post('/', protect, admin, createMatch);
router.patch('/:id/status', protect, admin, updateMatchStatus);
router.post('/:id/winner', protect, admin, declareWinner);

module.exports = router;
