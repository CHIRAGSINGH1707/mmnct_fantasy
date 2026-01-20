import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center gap-16 py-12">
            {/* Hero Section */}
            <header className="text-center max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm animate-pulse">
                    <Zap size={16} /> Beta Launch - Win ₹5000 Welcome Bonus
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                    Predict. Compete. <br />
                    <span className="bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
                        Own the Arena.
                    </span>
                </h1>
                <p className="text-xl text-slate-400">
                    The ultimate fantasy prediction platform for MMNCT cricket matches.
                    Use virtual currency to predict winners and climb the global leaderboard.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
                        Join the Arena
                    </Link>
                    <Link to="/matches" className="bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-slate-700">
                        View Match List
                    </Link>
                </div>
            </header>

            {/* Legal Disclaimer Card */}
            <div className="w-full max-w-2xl bg-amber-500/5 border border-amber-500/20 p-8 rounded-3xl space-y-4 text-center">
                <ShieldCheck className="mx-auto text-amber-500" size={48} />
                <h2 className="text-2xl font-bold text-amber-500">Legal Disclaimer</h2>
                <div className="space-y-2 text-slate-300">
                    <p>MMNCT Fantasy Arena is a fun-based fantasy platform.</p>
                    <p className="font-bold text-white uppercase tracking-wider">No real money is involved.</p>
                    <p>All currency used (₹) is strictly virtual and has no real-world value. No withdrawals, deposits, or payments are processed on this platform.</p>
                </div>
            </div>

            {/* Features */}
            <section className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
                {[
                    { icon: <TrendingUp className="text-blue-400" />, title: "Live Predictions", desc: "Predict winners for every MMNCT match as they happen." },
                    { icon: <Trophy className="text-emerald-400" />, title: "Leaderboard", desc: "Climb the ranks and prove your cricket knowledge." },
                    { icon: <Zap className="text-amber-400" />, title: "Virtual Stakes", desc: "Risk-free gameplay with ₹5000 starting balance." }
                ].map((f, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6">
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                        <p className="text-slate-400">{f.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Home;
