import React, { useEffect, useState } from 'react';
import { getMatches, placePrediction } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Calendar, Users, Send } from 'lucide-react';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [predictingId, setPredictingId] = useState(null);
    const [predictionForm, setPredictionForm] = useState({ winner: '', amount: '' });
    const { user, fetchUser } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getMatches();
            setMatches(res.data);
        } catch (err) {
            toast.error("Failed to load matches");
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = async (matchId) => {
        if (!predictionForm.winner || !predictionForm.amount) {
            return toast.warning("Please select a winner and amount");
        }

        if (Number(predictionForm.amount) > user.walletBalance) {
            return toast.error("Insufficient balance");
        }

        try {
            await placePrediction({
                matchId,
                predictedWinner: predictionForm.winner,
                amount: Number(predictionForm.amount)
            });
            toast.success("Prediction placed successfully!");
            setPredictingId(null);
            setPredictionForm({ winner: '', amount: '' });
            fetchUser(); // Update balance
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to place prediction");
        }
    };

    const upcomingMatches = matches.filter(m => m.status === 'upcoming');
    const liveMatches = matches.filter(m => m.status === 'live');

    return (
        <div className="space-y-12">
            <header className="space-y-2">
                <h1 className="text-4xl font-black">Match Center</h1>
                <p className="text-slate-400">Live and upcoming MMNCT fixtures</p>
            </header>

            {/* Live Matches */}
            {liveMatches.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <h2 className="text-2xl font-bold">Live Now</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {liveMatches.map(m => (
                            <div key={m._id} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl flex flex-col items-center">
                                <div className="flex items-center justify-between w-full mb-8">
                                    <div className="text-center flex-1">
                                        <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center font-black text-2xl text-blue-400 border border-slate-700 mb-2">
                                            {m.teamA[0]}
                                        </div>
                                        <p className="font-bold">{m.teamA}</p>
                                    </div>
                                    <div className="px-6 py-2 bg-red-500/10 text-red-500 font-black text-lg italic border border-red-500/20 rounded-xl">
                                        VS
                                    </div>
                                    <div className="text-center flex-1">
                                        <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center font-black text-2xl text-emerald-400 border border-slate-700 mb-2">
                                            {m.teamB[0]}
                                        </div>
                                        <p className="font-bold">{m.teamB}</p>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    Match in Progress - Predictions Closed
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Matches */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <Calendar size={24} className="text-blue-400" />
                    <h2 className="text-2xl font-bold">Upcoming Fixtures</h2>
                </div>

                <div className="grid gap-6">
                    {loading ? (
                        <div className="h-64 bg-slate-900 animate-pulse rounded-3xl"></div>
                    ) : upcomingMatches.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900 rounded-3xl border border-dashed border-slate-800 text-slate-500">
                            No upcoming matches found. Check back later!
                        </div>
                    ) : (
                        upcomingMatches.map(m => (
                            <div key={m._id} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex-1 flex justify-between items-center w-full md:w-auto gap-8">
                                        <div className="text-center">
                                            <p className="text-2xl font-black">{m.teamA}</p>
                                        </div>
                                        <div className="px-4 py-1.5 bg-slate-800 text-slate-400 text-xs font-black rounded-lg">VS</div>
                                        <div className="text-center">
                                            <p className="text-2xl font-black">{m.teamB}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center md:items-end gap-1">
                                        <span className="text-slate-500 text-sm font-medium">
                                            {new Date(m.matchDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </span>
                                        <span className="text-slate-400 text-sm font-bold">
                                            {new Date(m.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setPredictingId(m._id)}
                                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        Place Prediction
                                    </button>
                                </div>

                                {/* Prediction Form Overlay/Expansion */}
                                {predictingId === m._id && (
                                    <div className="mt-8 pt-8 border-t border-slate-800 animate-in slide-in-from-top-4 duration-300">
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-sm font-bold text-slate-500 uppercase block mb-2">Select Winner</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[m.teamA, m.teamB].map(team => (
                                                        <button
                                                            key={team}
                                                            onClick={() => setPredictionForm(prev => ({ ...prev, winner: team }))}
                                                            className={`py-3 rounded-xl font-bold border ${predictionForm.winner === team
                                                                    ? 'bg-blue-600 border-blue-500 text-white'
                                                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                                                } transition-all`}
                                                        >
                                                            {team}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-slate-500 uppercase block mb-2">Prediction Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    value={predictionForm.amount}
                                                    onChange={(e) => setPredictionForm(prev => ({ ...prev, amount: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold"
                                                    placeholder="Enter amount"
                                                />
                                            </div>
                                            <div className="flex items-end gap-3">
                                                <button
                                                    onClick={() => handlePredict(m._id)}
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Send size={18} /> Confirm
                                                </button>
                                                <button
                                                    onClick={() => setPredictingId(null)}
                                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Matches;
