"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Users,
    BookOpen,
    Brain,
    Phone,
    FileText,
    BarChart3,
    ChevronRight,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    MessageSquare,
    Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Profile {
    id: string;
    email: string;
    full_name: string;
}

interface AssessmentLog {
    id: string;
    user_id: string;
    topic_code: string;
    score: number;
    total_questions: number;
    created_at: string;
    profiles: Profile;
}

interface SimulationLog {
    id: string;
    user_id: string;
    topic_code: string;
    chat_history: any[];
    created_at: string;
    profiles: Profile;
}

interface SummaryAudit {
    id: string;
    user_id: string;
    topic_code: string;
    summary_text: string;
    ai_feedback: string;
    score: number;
    created_at: string;
    profiles: Profile;
}

export default function FounderDashboard() {
    const [activeTab, setActiveTab] = useState<'assessments' | 'simulations' | 'audits' | 'certifications'>('assessments');
    const [assessments, setAssessments] = useState<AssessmentLog[]>([]);
    const [simulations, setSimulations] = useState<SimulationLog[]>([]);
    const [audits, setAudits] = useState<SummaryAudit[]>([]);
    const [certifications, setCertifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [stats, setStats] = useState({
        totalMentors: 0,
        totalQuizzes: 0,
        avgScore: 0,
        totalSims: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Session Validation
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;
            if (!session) {
                router.push('/login');
                return;
            }

            // 2. Performance Audit Logic (Defensive Fetching)
            // Fetch everything individually to identify exactly which table or join is failing

            // A. Fetch Assessments
            const { data: assessData, error: aError } = await supabase
                .from('assessment_logs')
                .select('*, profiles:user_id(email, full_name)')
                .order('created_at', { ascending: false });

            if (aError) {
                console.error("Assessment Fetch Error:", aError);
                // Fallback: try fetching without join if join fails
                const { data: simpleAssess } = await supabase.from('assessment_logs').select('*');
                setAssessments((simpleAssess as any) || []);
            } else {
                setAssessments(assessData || []);
            }

            // B. Fetch Simulations
            const { data: simData, error: sError } = await supabase
                .from('simulation_logs')
                .select('*, profiles:user_id(email, full_name)')
                .order('created_at', { ascending: false });

            if (sError) {
                console.error("Simulation Fetch Error:", sError);
                const { data: simpleSim } = await supabase.from('simulation_logs').select('*');
                setSimulations((simpleSim as any) || []);
            } else {
                setSimulations(simData || []);
            }

            // C. Fetch Audits
            const { data: auditData, error: auError } = await supabase
                .from('summary_audits')
                .select('*, profiles:user_id(email, full_name)')
                .order('created_at', { ascending: false });

            if (auError) {
                console.error("Audit Fetch Error:", auError);
                const { data: simpleAudit } = await supabase.from('summary_audits').select('*');
                setAudits((simpleAudit as any) || []);
            } else {
                setAudits(auditData || []);
            }

            // E. Fetch Certifications
            const { data: certData, error: certError } = await supabase
                .from('certification_attempts')
                .select('*, profiles:user_id(email, full_name)')
                .order('created_at', { ascending: false });

            if (certError) {
                console.error("Certification Fetch Error:", certError);
                const { data: simpleCert } = await supabase.from('certification_attempts').select('*');
                setCertifications(simpleCert || []);
            } else {
                setCertifications(certData || []);
            }

            // D. Aggregate Statistics
            const finalAssessData = assessData || [];
            const avg = finalAssessData.length
                ? finalAssessData.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0) / finalAssessData.length
                : 0;

            setStats({
                totalMentors: new Set(finalAssessData.map(a => a.user_id)).size || 0,
                totalQuizzes: finalAssessData.length || 0,
                avgScore: Math.round(avg * 100),
                totalSims: simData?.length || 0
            });

        } catch (err: any) {
            console.error("Founder Dashboard Critical Failure:", err);
            setError(err.message || "An unexpected error occurred while syncing with the intelligence database.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-8 lg:p-12 xl:p-16 max-w-7xl mx-auto min-h-screen">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0E5858] flex items-center justify-center text-white shadow-xl">
                            <BarChart3 size={20} />
                        </div>
                        <span className="badge-teal">Founder Intelligence</span>
                    </div>
                    <h1 className="text-5xl font-serif text-[#0E5858] tracking-tight">Mentor Performance Control</h1>
                    <p className="text-gray-400 mt-2">Real-time oversight of clinical excellence and knowledge distribution.</p>
                </div>

                <button
                    onClick={fetchData}
                    className="h-12 px-6 bg-white border border-[#0E5858]/10 text-[#0E5858] font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                    <Clock size={16} />
                    Refresh Intelligence
                </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Active Mentors', value: stats.totalMentors, icon: Users, color: 'text-[#0E5858]' },
                    { label: 'Total Assessments', value: stats.totalQuizzes, icon: Brain, color: 'text-[#00B6C1]' },
                    { label: 'Avg Knowledge Depth', value: `${stats.avgScore}%`, icon: ArrowUpRight, color: 'text-green-600' },
                    { label: 'Simulations Run', value: stats.totalSims, icon: Phone, color: 'text-[#00B6C1]' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="premium-card p-6 flex items-center gap-6 bg-white"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#FAFCEE] flex items-center justify-center text-[#0E5858]">
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={`text-3xl font-serif ${stat.color}`}>{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Tabs */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
                {[
                    { id: 'assessments', label: 'Quiz Scores', icon: Brain },
                    { id: 'simulations', label: 'Call Transcripts', icon: Phone },
                    { id: 'audits', label: 'Summary Audits', icon: FileText },
                    { id: 'certifications', label: 'Certifications', icon: Award }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
                            ? 'bg-[#0E5858] text-white shadow-xl scale-105'
                            : 'bg-white text-gray-400 hover:text-[#0E5858]'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="premium-card bg-white p-0 overflow-hidden"
                >
                    {error ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-serif text-[#0E5858]">Database Sync Error</h3>
                            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6"> {error}</p>
                            <button
                                onClick={fetchData}
                                className="px-6 py-2 bg-[#0E5858] text-white rounded-xl text-xs font-bold"
                            >
                                Try Reconnecting
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#0E5858]/10 border-t-[#00B6C1] rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-[#0E5858]/30 uppercase tracking-[0.2em]">Aggregating Logs...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#FAFCEE]/50 border-b border-[#0E5858]/5">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Mentor</th>
                                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Topic</th>
                                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Result/Status</th>
                                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Time</th>
                                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTab === 'assessments' && assessments.map((log, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-[#FAFCEE]/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#00B6C1] flex items-center justify-center text-white text-[10px] font-bold uppercase">
                                                        {log.profiles?.email[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#0E5858]">{log.profiles?.full_name || 'Anonymous Mentor'}</p>
                                                        <p className="text-[10px] text-gray-400">{log.profiles?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="badge-teal">{log.topic_code}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-serif ${log.score / log.total_questions >= 0.7 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {log.score}/{log.total_questions}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">({Math.round((log.score / log.total_questions) * 100)}%)</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[11px] text-gray-400">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="text-[#00B6C1] hover:text-[#0E5858] transition-colors"><ChevronRight size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'simulations' && simulations.map((log, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-[#FAFCEE]/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#0E5858] flex items-center justify-center text-white text-[10px] font-bold uppercase">
                                                        {log.profiles?.email[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#0E5858]">{log.profiles?.full_name || 'Anonymous Mentor'}</p>
                                                        <p className="text-[10px] text-gray-400">{log.profiles?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="badge-teal">{log.topic_code}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-xs font-bold text-[#00B6C1]">
                                                    <MessageSquare size={14} />
                                                    {log.chat_history?.length} Messages Exchanged
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[11px] text-gray-400">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="px-4 py-2 bg-[#FAFCEE] text-[#0E5858] text-[10px] font-bold rounded-xl border border-[#0E5858]/5 hover:bg-[#0E5858] hover:text-white transition-all">Review Call</button>
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'audits' && audits.map((log, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-[#FAFCEE]/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-[10px] font-bold uppercase">
                                                        {log.profiles?.email[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#0E5858]">{log.profiles?.full_name || 'Anonymous Mentor'}</p>
                                                        <p className="text-[10px] text-gray-400">{log.profiles?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="badge-teal">{log.topic_code}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-serif ${log.score >= 7 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {log.score}/10
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">Audit Grade</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[11px] text-gray-400">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="px-4 py-2 bg-[#FAFCEE] text-[#0E5858] text-[10px] font-bold rounded-xl border border-[#0E5858]/5 hover:bg-[#0E5858] hover:text-white transition-all">Deep Review</button>
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'certifications' && certifications.map((log, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-[#FAFCEE]/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold uppercase">
                                                        {log.profiles?.email?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#0E5858]">{log.profiles?.full_name || 'Anonymous Mentor'}</p>
                                                        <p className="text-[10px] text-gray-400">{log.profiles?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="badge-teal">MASTER EXAM</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-lg font-serif ${log.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {log.score}%
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${log.status === 'passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[11px] text-gray-400">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="px-4 py-2 bg-[#FAFCEE] text-[#0E5858] text-[10px] font-bold rounded-xl border border-[#0E5858]/5 hover:bg-[#0E5858] hover:text-white transition-all">Review Exam</button>
                                            </td>
                                        </tr>
                                    ))}

                                    {((activeTab === 'assessments' && assessments.length === 0) ||
                                        (activeTab === 'simulations' && simulations.length === 0) ||
                                        (activeTab === 'certifications' && certifications.length === 0) ||
                                        (activeTab === 'audits' && audits.length === 0)) && !loading && (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <AlertCircle size={40} className="text-[#0E5858]/10" />
                                                        <p className="text-sm font-bold text-[#0E5858]/20 uppercase tracking-[0.2em]">No intelligence logged for this sector yet.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
