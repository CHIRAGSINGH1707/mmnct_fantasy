const Match = require('../models/Match');
const Prediction = require('../models/Prediction');
const User = require('../models/User');

const createMatch = async (req, res) => {
    try {
        const { teamA, teamB, matchDate } = req.body;
        const match = new Match({ teamA, teamB, matchDate });
        await match.save();
        res.status(201).json(match);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMatches = async (req, res) => {
    try {
        const matches = await Match.find().sort({ matchDate: 1 });
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateMatchStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const match = await Match.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(match);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const declareWinner = async (req, res) => {
    try {
        const { winner } = req.body;
        const match = await Match.findById(req.params.id);

        if (!match) return res.status(404).json({ message: 'Match not found' });
        if (match.status !== 'live') return res.status(400).json({ message: 'Can only declare winner for live matches' });

        match.winner = winner;
        match.status = 'completed';
        await match.save();

        // Resolve predictions
        const predictions = await Prediction.find({ matchId: match._id, status: 'pending' });

        for (let pred of predictions) {
            if (pred.predictedWinner === winner) {
                pred.status = 'won';
                // Simple 2x winnings for now
                const winnings = pred.amount * 2;
                await User.findByIdAndUpdate(pred.userId, { $inc: { walletBalance: winnings } });
            } else {
                pred.status = 'lost';
            }
            await pred.save();
        }

        res.json({ match, message: 'Winner declared and predictions resolved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createMatch, getMatches, updateMatchStatus, declareWinner };
