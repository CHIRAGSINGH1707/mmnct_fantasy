const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    predictedWinner: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost'],
        default: 'pending'
    },
    potentialWinnings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
