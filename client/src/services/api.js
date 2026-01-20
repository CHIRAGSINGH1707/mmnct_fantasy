import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

// Matches
export const getMatches = () => api.get('/matches');
export const createMatch = (data) => api.post('/matches', data);
export const updateMatchStatus = (id, status) => api.patch(`/matches/${id}/status`, { status });
export const declareWinner = (id, winner) => api.post(`/matches/${id}/winner`, { winner });

// Predictions
export const placePrediction = (data) => api.post('/predictions', data);
export const getMyPredictions = () => api.get('/predictions/my');
export const getLeaderboard = () => api.get('/predictions/leaderboard');

export default api;
