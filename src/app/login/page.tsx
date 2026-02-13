"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ChevronRight, Sparkles, UserCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/");
            }
        };
        checkUser();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#FAFCEE]">
            {/* Premium Background Blobs */}
            <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00B6C1]/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFCC00]/5 rounded-full blur-[100px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative"
            >
                <div className="flex flex-col items-center mb-12 text-center">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 mb-6 flex items-center justify-center bg-[#0E5858] rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#00B6C1]/20 to-transparent"></div>
                        <img src="/assets/BN_Logo-BlueBG-Square-HD.png" alt="BN Logo" className="w-full h-full object-contain p-4 rounded-xl group-hover:scale-110 transition-transform duration-500 relative z-10" />
                    </motion.div>

                    <h1 className="text-4xl font-serif text-[#0E5858] mb-2 tracking-tight">Mentor Portal</h1>
                    <p className="text-[10px] font-bold text-[#00B6C1] uppercase tracking-[0.4em] flex items-center gap-2">
                        <Sparkles size={12} className="animate-pulse" />
                        Clinical Excellence
                    </p>
                </div>

                <div className="premium-card p-10 bg-white/70 backdrop-blur-2xl border border-white isolate relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <UserCheck size={80} className="text-[#0E5858]" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-[10px] font-bold text-[#0E5858]/40 uppercase tracking-[0.2em] mb-3 ml-1">Identity Access</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0E5858]/20 group-focus-within:text-[#00B6C1] transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="test@bn.com"
                                    className="w-full bg-white border border-[#0E5858]/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B6C1]/20 focus:border-[#00B6C1] transition-all placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-[#0E5858]/40 uppercase tracking-[0.2em] mb-3 ml-1">Secure Key</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0E5858]/20 group-focus-within:text-[#00B6C1] transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="515148"
                                    className="w-full bg-white border border-[#0E5858]/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00B6C1]/20 focus:border-[#00B6C1] transition-all placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-[11px] font-bold text-red-500 bg-red-50/50 p-4 rounded-2xl border border-red-100 flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0E5858] text-white py-4 rounded-[1.8rem] font-bold shadow-2xl shadow-[#0E5858]/20 hover:bg-[#00B6C1] transition-all duration-500 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-xs uppercase tracking-widest">Verifying...</span>
                                </div>
                            ) : (
                                <>
                                    <UserCheck size={18} />
                                    <span className="uppercase tracking-[0.1em] text-xs">Enter Dashboard</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-[#0E5858]/5 text-center">
                        <p className="text-[10px] font-bold text-[#0E5858]/20 uppercase tracking-[0.3em]">Balance Nutrition Secure Access</p>
                    </div>
                </div>

                <p className="mt-12 text-center text-[10px] text-[#0E5858]/30 font-medium tracking-[0.1em] italic leading-relaxed max-w-[280px] mx-auto">
                    "The world's most trusted Indian health ecosystem mentor portal."
                </p>
            </motion.div>
        </main>
    );
}
