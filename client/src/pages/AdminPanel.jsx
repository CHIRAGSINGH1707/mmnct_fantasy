import React, { useEffect, useState } from 'react';
import { getMatches, createMatch, updateMatchStatus, declareWinner } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Check, Play, Trophy, Users, ShieldAlert } from 'lucide-react';

const AdminPanel = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMatch, setNewMatch] = useState({ teamA: '', teamB: '', matchDate: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getMatches();
            setMatches(res.data);
        } catch (err) {
            toast.error("Failed to fetch matches");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMatch = async (e) => {
        e.preventDefault();
        try {
            await createMatch(newMatch);
            toast.success("Match created successfully!");
            setNewMatch({ teamA: '', teamB: '', matchDate: '' });
            fetchData();
        } catch (err) {
            toast.error("Failed to create match");
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateMatchStatus(id, status);
            toast.success(`Match status updated to ${status}`);
            fetchData();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleDeclareWinner = async (id, winner) => {
        try {
            await declareWinner(id, winner);
            toast.success(`Winner declared: ${winner}`);
            fetchData();
        } catch (err) {
            toast.error("Failed to declare winner");
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex items-center gap-4 p-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                <ShieldAlert className="text-amber-500" size={40} />
                <div>
                    <h1 className="text-3xl font-black text-amber-500">Admin Control Center</h1>
                    <p className="text-amber-500/70 font-medium">Manage matches, declare results, and resolve predictions.</p>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Create Match Form */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Plus size={24} className="text-blue-400" /> Add New Match
                    </h2>
                    <form onSubmit={handleCreateMatch} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4">
                        <div className="grid gap-4">
                            <div>
                                <label className="text-sm font-bold text-slate-500 uppercase block mb-2">Team A</label>
                                <input
                                    type="text"
                                    value={newMatch.teamA}
                                    onChange={(e) => setNewMatch(prev => ({ ...prev, teamA: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-blue-500 outline-none font-bold"
                                    placeholder="Enter Team A"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-500 uppercase block mb-2">Team B</label>
                                <input
                                    type="text"
                                    value={newMatch.teamB}
                                    onChange={(e) => setNewMatch(prev => ({ ...prev, teamB: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-blue-500 outline-none font-bold"
                                    placeholder="Enter Team B"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-500 uppercase block mb-2">Match Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={newMatch.matchDate}
                                    onChange={(e) => setNewMatch(prev => ({ ...prev, matchDate: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-blue-500 outline-none font-bold"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4">
                            <Plus size={20} /> Create Match
                        </button>
                    </form>
                </section>

                {/* Match Management List */}
                <section className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Play size={24} className="text-emerald-400" /> Manage Matches
                    </h2>
                    <div className="grid gap-4">
                        {loading ? (
                            <div className="h-40 bg-slate-900 animate-pulse rounded-3xl"></div>
                        ) : matches.length === 0 ? (
                            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-dashed border-slate-800 text-slate-500 font-bold">
                                No matches created yet.
                            </div>
                        ) : (
                            matches.map(m => (
                                <div key={m._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col gap-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-black">{m.teamA} <span className="text-slate-500 mx-2 italic font-medium">vs</span> {m.teamB}</h3>
                                            <p className="text-slate-500 text-sm font-bold">{new Date(m.matchDate).toLocaleString()}</p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${m.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                m.status === 'live' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            }`}>
                                            {m.status}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {m.status === 'upcoming' && (
                                            <button
                                                onClick={() => handleUpdateStatus(m._id, 'live')}
                                                className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-3 rounded-xl font-bold border border-blue-600/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Play size={18} /> Make Live
                                            </button>
                                        )}
                                        {m.status === 'live' && (
                                            <>
                                                <button
                                                    onClick={() => handleDeclareWinner(m._id, m.teamA)}
                                                    className="flex-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 py-3 rounded-xl font-bold border border-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Trophy size={18} /> {m.teamA} Wins
                                                </button>
                                                <button
                                                    onClick={() => handleDeclareWinner(m._id, m.teamB)}
                                                    className="flex-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 py-3 rounded-xl font-bold border border-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Trophy size={18} /> {m.teamB} Wins
                                                </button>
                                            </>
                                        )}
                                        {m.status === 'completed' && (
                                            <div className="w-full p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
                                                <p className="text-emerald-500 font-black">MATCH COMPLETED - WINNER: {m.winner}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminPanel;
