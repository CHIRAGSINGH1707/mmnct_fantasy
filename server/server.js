require('dotenv').config(); // 1. Load env vars AT THE VERY TOP

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Import routes (Moved after dotenv to ensure they can access env if needed)
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);

// 3. Database Connection Configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Matches your .env variable name

// 4. Debugging: Print URI (Masking password for security)
if (MONGO_URI) {
    const maskedUri = MONGO_URI.replace(/:([^@]+)@/, ':****@');
    console.log('DEBUG: Attempting to connect to:', maskedUri);
} else {
    console.error('ERROR: MONGO_URI is not defined in your .env file!');
}

// 5. Connect to MongoDB Atlas
mongoose.set('strictQuery', false); // Prepare for Mongoose 7
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error Details:');
        console.error('Message:', err.message);
        console.error('Error Code:', err.code);
        // Do not crash, but log specifically
        if (err.message.includes('ECONNREFUSED')) {
            console.error('HINT: It looks like Mongoose tried to connect to a local database. Double check your MONGO_URI variable.');
        }
    });

// 6. Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});
app.get("/", (req, res) => {
    res.send("🚀 MMNCT Backend is running");
});
