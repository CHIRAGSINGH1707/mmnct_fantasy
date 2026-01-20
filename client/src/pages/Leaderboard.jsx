import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/api';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getLeaderboard();
            setPlayers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black uppercase tracking-widest text-sm">
                    <Star size={16} fill="currentColor" /> Global Rankings
                </div>
                <h1 className="text-5xl font-black">Hall of Fame</h1>
                <p className="text-slate-400">The top predictors in the MMNCT Fantasy Arena</p>
            </header>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-950/50 border-b border-slate-800">
                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Player</th>
                            <th className="px-8 py-6 text-right text-sm font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                            <th className="px-8 py-6 text-right text-sm font-bold text-slate-500 uppercase tracking-wider">Win Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan="4" className="px-8 py-6"><div className="h-6 bg-slate-800 rounded-lg w-full"></div></td>
                                </tr>
                            ))
                        ) : players.map((p, i) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        {i === 0 ? <Medal className="text-amber-500" size={24} /> :
                                            i === 1 ? <Medal className="text-slate-300" size={24} /> :
                                                i === 2 ? <Medal className="text-amber-700" size={24} /> :
                                                    <span className="text-lg font-bold text-slate-600 px-1">{i + 1}</span>}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-lg font-bold group-hover:text-blue-400 transition-colors">{p.username}</span>
                                </td>
                                <td className="px-8 py-6 text-right font-black text-emerald-400 text-xl">
                                    ₹{p.walletBalance}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <TrendingUp size={16} className="text-slate-500" />
                                        <span className="font-bold text-slate-300">{p.winPercentage}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
