const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    teamA: {
        type: String,
        required: true
    },
    teamB: {
        type: String,
        required: true
    },
    matchDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'completed'],
        default: 'upcoming'
    },
    winner: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
