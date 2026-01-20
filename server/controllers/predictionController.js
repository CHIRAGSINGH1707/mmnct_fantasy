const Prediction = require('../models/Prediction');
const User = require('../models/User');
const Match = require('../models/Match');

const placePrediction = async (req, res) => {
    try {
        const { matchId, predictedWinner, amount } = req.body;
        const userId = req.user.id;

        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ message: 'Match not found' });
        if (match.status !== 'upcoming') return res.status(400).json({ message: 'Prediction only allowed for upcoming matches' });

        const user = await User.findById(userId);
        if (user.walletBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Check for existing prediction
        const existing = await Prediction.findOne({ userId, matchId });
        if (existing) return res.status(400).json({ message: 'Already predicted for this match' });

        const prediction = new Prediction({
            userId,
            matchId,
            predictedWinner,
            amount,
            potentialWinnings: amount * 2 // Strategy defined in matchController
        });

        await User.findByIdAndUpdate(userId, { $inc: { walletBalance: -amount } });
        await prediction.save();

        res.status(201).json(prediction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.find({ userId: req.user.id })
            .populate('matchId')
            .sort({ createdAt: -1 });
        res.json(predictions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({}, 'username walletBalance')
            .sort({ walletBalance: -1 })
            .limit(10);

        // Add win percentage if possible
        const leaderboard = await Promise.all(users.map(async (user) => {
            const predictions = await Prediction.countDocuments({ userId: user._id });
            const wins = await Prediction.countDocuments({ userId: user._id, status: 'won' });
            return {
                username: user.username,
                walletBalance: user.walletBalance,
                winPercentage: predictions > 0 ? ((wins / predictions) * 100).toFixed(1) : 0
            };
        }));

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { placePrediction, getUserPredictions, getLeaderboard };
