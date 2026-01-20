import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyPredictions } from '../services/api';
import { Wallet, History, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPredictions();
    }, []);

    const fetchPredictions = async () => {
        try {
            const res = await getMyPredictions();
            setPredictions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
                    <p className="text-slate-400">Manage your predictions and wallet balance here.</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-emerald-500/70 uppercase">Available Balance</p>
                        <p className="text-3xl font-black text-emerald-400 tracking-tight">₹{user?.walletBalance}</p>
                    </div>
                </div>
            </header>

            <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <History size={20} className="text-blue-400" />
                    <h2 className="text-xl font-bold">Prediction History</h2>
                </div>

                <div className="grid gap-4">
                    {loading ? (
                        <div className="h-32 bg-slate-900 animate-pulse rounded-2xl"></div>
                    ) : predictions.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900 rounded-3xl border border-dashed border-slate-800 text-slate-500">
                            <p>No predictions placed yet. Go to matches to start playing!</p>
                        </div>
                    ) : (
                        predictions.map((p) => (
                            <div key={p._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap justify-between items-center gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500 font-medium">
                                        {new Date(p.matchId.matchDate).toLocaleDateString()}
                                    </p>
                                    <h3 className="text-lg font-bold">
                                        {p.matchId.teamA} vs {p.matchId.teamB}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-400">Predicted:</span>
                                        <span className="font-bold text-blue-400">{p.predictedWinner}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 font-bold uppercase">Staked</p>
                                        <p className="text-xl font-bold">₹{p.amount}</p>
                                    </div>

                                    <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${p.status === 'won' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            p.status === 'lost' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        }`}>
                                        {p.status === 'won' ? <CheckCircle2 size={16} /> :
                                            p.status === 'lost' ? <AlertCircle size={16} /> :
                                                <Clock size={16} />}
                                        <span className="capitalize">{p.status}</span>
                                    </div>

                                    {p.status === 'won' && (
                                        <div className="text-right">
                                            <p className="text-xs text-emerald-500 font-bold uppercase">Winnings</p>
                                            <p className="text-xl font-bold text-emerald-400">+₹{p.potentialWinnings}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
