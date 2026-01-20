import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Trophy, LayoutDashboard, Calendar, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-slate-900 text-white p-4 shadow-xl border-b border-slate-700">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    MMNCT Fantasy
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <Link to="/matches" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                <Calendar size={18} /> Matches
                            </Link>
                            <Link to="/leaderboard" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                <Trophy size={18} /> Leaderboard
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="flex items-center gap-1 hover:text-amber-400 transition-colors text-amber-500">
                                    <Settings size={18} /> Admin
                                </Link>
                            )}
                            <div className="h-6 w-px bg-slate-700 mx-2" />
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-slate-300">{user.username}</span>
                                <span className="text-xs font-bold text-emerald-400">₹{user.walletBalance}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-red-400"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors font-semibold">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
