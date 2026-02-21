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
    Award,
    ClipboardList,
    UserPlus,
    Lock,
    Mail,
    User,
    ShieldCheck,
    Upload,
    Link as LinkIcon,
    File as FileIcon,
    Plus,
    Database,
    Key as BNKeyIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { syllabusData } from "@/data/syllabus";

interface Profile {
    id: string;
    email: string;
    full_name: string;
    created_at?: string;
}

interface MentorProfile extends Profile {
    last_login?: string;
    stats?: {
        progress: number;
        avgScore: number;
        totalQuizzes: number;
        totalAudits: number;
        totalActivity: number;
        lastActive: string;
    }
}

export default function AdminDashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'credentials' | 'content-architect' | 'mentor-logs'>('credentials');
    const [loading, setLoading] = useState(true);
    const [mentors, setMentors] = useState<MentorProfile[]>([]);
    const [stats, setStats] = useState({
        totalMentors: 0,
        avgKnowledge: 0,
        pendingReviews: 0,
        totalActivity: 0
    });

    interface ActivityLog {
        id: string;
        user_id: string;
        activity_type: string;
        content_title: string;
        created_at: string;
        module_id?: string;
    }

    interface SummaryAudit {
        id: string;
        user_id: string;
        topic_code: string;
        score: number;
        created_at: string;
    }

    const [allActivity, setAllActivity] = useState<ActivityLog[]>([]);
    const [allAudits, setAllAudits] = useState<SummaryAudit[]>([]);

    // Sync state with URL params
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && (tab === 'credentials' || tab === 'content-architect' || tab === 'mentor-logs')) {
            setActiveTab(tab as any);
        } else {
            setActiveTab('credentials');
        }
    }, [searchParams]);

    // Credential State
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        fullName: "",
        role: "mentor"
    });
    const [creatingUser, setCreatingUser] = useState(false);
    const [userSuccess, setUserSuccess] = useState("");
    const [userError, setUserError] = useState("");

    // Content State
    const [contentForm, setContentForm] = useState({
        moduleId: "",
        topicTitle: "",
        contentType: "video",
        contentLink: "",
    });
    const [uploadingContent, setUploadingContent] = useState(false);
    const [contentSuccess, setContentSuccess] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            await fetchMentorData();
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const fetchMentorData = async () => {
        try {
            // Fetch all profiles
            const { data: profiles, error: pError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'mentor');

            if (pError) throw pError;

            // Fetch all assessment logs to calculate scores/progress
            const { data: assessments, error: aError } = await supabase
                .from('assessment_logs')
                .select('*');

            if (aError) throw aError;

            // Fetch activity logs
            const { data: activity, error: actError } = await supabase
                .from('mentor_activity_logs')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch summary audits (peer reviews)
            const { data: audits, error: audError } = await supabase
                .from('summary_audits')
                .select('id, user_id, topic_code, score, created_at')
                .order('created_at', { ascending: false });

            setAllActivity(activity || []);
            setAllAudits(audits || []);

            // Map stats to mentors
            const mappedMentors = (profiles || []).map(p => {
                const mentorAssessments = (assessments || []).filter((a: any) => a.user_id === p.id);
                const mentorActivity = (activity || []).filter((a: any) => a.user_id === p.id);
                const mentorAudits = (audits || []).filter((a: any) => a.user_id === p.id);

                const uniqueCompletedTopics = new Set(mentorAssessments.map((a: any) => a.topic_code));

                // Calculate progress based on unique topics vs total topics in syllabus
                const totalTopics = syllabusData.reduce((acc, m) => acc + m.topics.length, 0);
                const progress = totalTopics > 0 ? Math.round((uniqueCompletedTopics.size / totalTopics) * 100) : 0;

                const avgScore = mentorAssessments.length > 0
                    ? Math.round((mentorAssessments.reduce((acc: number, curr: any) => acc + (curr.score / curr.total_questions), 0) / mentorAssessments.length) * 100)
                    : 0;

                return {
                    ...p,
                    stats: {
                        progress,
                        avgScore,
                        totalQuizzes: mentorAssessments.length,
                        totalAudits: mentorAudits.length,
                        totalActivity: mentorActivity.length,
                        lastActive: mentorActivity.length > 0 ? mentorActivity[0].created_at : (p.created_at || new Date().toISOString())
                    }
                } as MentorProfile;
            });

            setMentors(mappedMentors);
            setStats(prev => ({
                ...prev,
                totalMentors: mappedMentors.length,
                avgKnowledge: mappedMentors.length > 0 ? Math.round(mappedMentors.reduce((acc, m) => acc + (m.stats?.avgScore || 0), 0) / mappedMentors.length) : 0,
                pendingReviews: (audits || []).filter((a: any) => a.score === 0).length,
                totalActivity: (activity || []).length
            }));
        } catch (err) {
            console.error("Error fetching mentor data:", err);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingUser(true);
        setUserError("");
        setUserSuccess("");

        try {
            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create user');

            setUserSuccess(`Credentials generated for ${data.user.email}. ID: ${data.user.id}`);
            setNewUser({ email: "", password: "", fullName: "", role: "mentor" });
            fetchMentorData(); // Refresh list
        } catch (err: any) {
            setUserError(err.message);
        } finally {
            setCreatingUser(false);
        }
    };

    const handleUploadContent = (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingContent(true);
        setTimeout(() => {
            setContentSuccess("Content architecture updated successfully!");
            setUploadingContent(false);
            setContentForm({ moduleId: "", topicTitle: "", contentType: "video", contentLink: "" });
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FAFCEE]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#0E5858]/10 border-t-[#00B6C1] rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-[#0E5858]/30 uppercase tracking-[0.2em]">Synchronizing Systems...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="p-8 lg:p-12 xl:p-16 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0E5858] flex items-center justify-center text-white shadow-xl">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="badge-teal">System Architect</span>
                    </div>
                    <h1 className="text-5xl font-serif text-[#0E5858] tracking-tight">BN Command Center</h1>
                    <p className="text-gray-400 mt-2 font-medium italic">"Managing the engines of clinical excellence."</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#0E5858]/5 flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Mentors</p>
                            <p className="text-xl font-serif text-[#0E5858]">{stats.totalMentors}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#FAFCEE] flex items-center justify-center text-[#0E5858]">
                            <Users size={18} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {[
                    { id: 'credentials', label: 'Provision Keys', icon: BNKeyIcon },
                    { id: 'content-architect', label: 'Content Architect', icon: Database },
                    { id: 'mentor-logs', label: 'Mentor Logs', icon: BarChart3 }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as any);
                            router.push(`/admin?tab=${tab.id}`);
                        }}
                        className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-[#0E5858] text-white shadow-2xl scale-105 border-b-4 border-[#00B6C1]'
                            : 'bg-white text-gray-400 hover:text-[#0E5858] border border-[#0E5858]/5'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="premium-card bg-white min-h-[600px] overflow-hidden border border-[#0E5858]/10"
                >
                    {activeTab === 'credentials' && (
                        <div className="p-12 lg:p-20">
                            <div className="max-w-2xl mx-auto">
                                <div className="text-center mb-16">
                                    <div className="w-24 h-24 bg-[#FAFCEE] rounded-[2.5rem] flex items-center justify-center text-[#0E5858] mx-auto mb-8 shadow-inner border border-[#0E5858]/5">
                                        <Lock size={48} />
                                    </div>
                                    <h2 className="text-4xl font-serif text-[#0E5858] mb-4">Credentials Management</h2>
                                    <p className="text-gray-400 font-medium max-w-md mx-auto">Securely provision new mentor accounts and system access keys.</p>
                                </div>

                                <form onSubmit={handleCreateUser} className="space-y-8 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0E5858]/50 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00B6C1] transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    value={newUser.fullName}
                                                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                                    placeholder="Mentor Name"
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-semibold focus:ring-4 focus:ring-[#00B6C1]/5 focus:border-[#00B6C1] transition-all outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0E5858]/50 uppercase tracking-[0.2em] ml-2">Corporate Email</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00B6C1] transition-colors" size={20} />
                                                <input
                                                    type="email"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                    placeholder="name@balancenutrition.in"
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-semibold focus:ring-4 focus:ring-[#00B6C1]/5 focus:border-[#00B6C1] transition-all outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0E5858]/50 uppercase tracking-[0.2em] ml-2">Temporary Access Key</label>
                                            <div className="relative group">
                                                <BNKeyIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00B6C1] transition-colors" size={20} />
                                                <input
                                                    type="password"
                                                    value={newUser.password}
                                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-semibold focus:ring-4 focus:ring-[#00B6C1]/5 focus:border-[#00B6C1] transition-all outline-none"
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0E5858]/50 uppercase tracking-[0.2em] ml-2">System Permission Level</label>
                                            <div className="relative">
                                                <select
                                                    value={newUser.role}
                                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-6 text-sm font-semibold focus:ring-4 focus:ring-[#00B6C1]/5 focus:border-[#00B6C1] transition-all outline-none appearance-none cursor-not-allowed cursor-pointer"
                                                >
                                                    <option value="mentor">Clinical Counselor (Mentor)</option>
                                                    <option value="moderator">Lead Moderator</option>
                                                    <option value="admin">System Administrator</option>
                                                </select>
                                                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {userError && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold flex items-center gap-3">
                                            <AlertCircle size={16} /> {userError}
                                        </motion.div>
                                    )}

                                    {userSuccess && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-green-50 border border-green-100 rounded-2xl text-green-700">
                                            <div className="flex items-center gap-3 mb-2 font-black text-[10px] uppercase tracking-widest text-green-600">
                                                <CheckCircle2 size={16} /> Key Provisioned
                                            </div>
                                            <p className="text-xs font-semibold">{userSuccess}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={creatingUser}
                                        className="w-full py-6 bg-[#0E5858] text-white rounded-[2rem] font-bold shadow-2xl hover:bg-[#00B6C1] transition-all flex items-center justify-center gap-4 group mt-6"
                                    >
                                        {creatingUser ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                                            <>
                                                <span className="text-[10px] uppercase tracking-[0.3em]">Authorize New Account</span>
                                                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'content-architect' && (
                        <div className="p-12 lg:p-20">
                            <div className="max-w-4xl mx-auto">
                                <div className="text-center mb-16">
                                    <div className="w-24 h-24 bg-[#FAFCEE] rounded-[2.5rem] flex items-center justify-center text-[#0E5858] mx-auto mb-8 shadow-inner border border-[#0E5858]/5">
                                        <Database size={48} />
                                    </div>
                                    <h2 className="text-4xl font-serif text-[#0E5858] mb-4">Content Architecture</h2>
                                    <p className="text-gray-400 font-medium max-w-lg mx-auto">Upload training materials, link clinical videos, and update module syllabi.</p>
                                </div>

                                <form onSubmit={handleUploadContent} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0E5858]/50 uppercase tracking-[0.2em] ml-2">Target Module</label>
                                            <div className="relative">
                                                <select
                                                    value={contentForm.moduleId}
                                                    onChange={(e) => setContentForm({ ...contentForm, moduleId: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 px-6 text-sm font-semibold focus:ring-4 focus:ring-[#00B6C1]/5 outline-none appearance-none"
                                                    required
                                                >
                                                    <option value="">Select a Module</option>
                                                    {syllabusData.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                                </select>
                                                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0E5858]/50 uppercase tracking-[0.2em] ml-2">Topic Heading</label>
                                            <input
                                                type="text"
                                                value={contentForm.topicTitle}
                                                onChange={(e) => setContentForm({ ...contentForm, topicTitle: e.target.value })}
                                                placeholder="e.g. Advanced PCOS Management"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 px-6 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#00B6C1]/5"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0E5858]/50 uppercase tracking-[0.2em] ml-2">Content Classification</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['video', 'document', 'quiz', 'link'].map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setContentForm({ ...contentForm, contentType: type })}
                                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${contentForm.contentType === type
                                                            ? 'bg-[#0E5858] text-white border-transparent'
                                                            : 'bg-white text-gray-400 border-gray-100 hover:border-[#00B6C1]/20'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 flex flex-col justify-between">
                                        <div className="space-y-2 flex-grow">
                                            <label className="text-[10px] font-black text-[#0E5858]/50 uppercase tracking-[0.2em] ml-2">Source Link / File URL</label>
                                            <div className="relative group">
                                                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                                                <input
                                                    type="url"
                                                    value={contentForm.contentLink}
                                                    onChange={(e) => setContentForm({ ...contentForm, contentLink: e.target.value })}
                                                    placeholder="https://youtube.com/..."
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 pl-14 pr-6 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#00B6C1]/5"
                                                />
                                            </div>
                                            <div className="mt-4 p-8 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-[#00B6C1]/50 transition-all cursor-pointer">
                                                <Upload size={32} className="text-gray-200 group-hover:text-[#00B6C1] mb-3 transition-colors" />
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#0E5858]">Drop assets here</p>
                                                <p className="text-[8px] text-gray-300 mt-1">PDF, MP4 or Excel (Max 50MB)</p>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={uploadingContent}
                                            className="w-full py-5 bg-[#00B6C1] text-[#0E5858] rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:shadow-[#00B6C1]/20 transition-all group"
                                        >
                                            {uploadingContent ? "Syncing Modules..." : "Update Course Syllabus"}
                                        </button>
                                    </div>
                                </form>

                                {contentSuccess && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-6 bg-[#FAFCEE] border border-[#00B6C1]/20 rounded-3xl text-center text-[#0E5858] font-bold text-sm">
                                        <CheckCircle2 size={24} className="mx-auto mb-2 text-[#00B6C1]" />
                                        {contentSuccess}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'mentor-logs' && (
                        <div className="p-10">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-serif text-[#0E5858]">Mentor Performance Directory</h2>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Total Mentors Indexed: {mentors.length}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {mentors.map((mentor) => (
                                        <motion.div
                                            key={mentor.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 flex flex-col lg:flex-row lg:items-center gap-8 hover:bg-white hover:shadow-2xl hover:border-[#00B6C1]/20 transition-all group"
                                        >
                                            {/* Profile Section */}
                                            <div className="flex items-center gap-6 lg:min-w-[300px]">
                                                <div className="w-20 h-20 rounded-3xl bg-[#0E5858] text-white flex items-center justify-center text-2xl font-black shadow-lg relative overflow-hidden group-hover:bg-[#00B6C1] transition-colors">
                                                    {mentor.full_name?.[0] || 'M'}
                                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-serif text-[#0E5858] group-hover:text-[#00B6C1] transition-colors">{mentor.full_name}</h3>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{mentor.email}</p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className="badge-teal text-[8px] py-1">Clinical Mentor</span>
                                                        <span className="text-[9px] text-gray-400 font-medium">Joined: {new Date(mentor.stats?.lastActive || mentor.created_at || '').toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats Divider */}
                                            <div className="hidden lg:block w-px h-16 bg-gray-100"></div>

                                            {/* Performance Stats */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Training Progress</p>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-2xl font-serif text-[#0E5858]">{mentor.stats?.progress}%</span>
                                                        <div className="flex-grow h-1.5 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#00B6C1] transition-all duration-1000"
                                                                style={{ width: `${mentor.stats?.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Avg. Depth Score</p>
                                                    <p className="text-2xl font-serif text-[#0E5858]">{mentor.stats?.avgScore}%</p>
                                                </div>

                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Audits & activity</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-xl font-serif text-[#0E5858]">{mentor.stats?.totalAudits || 0}</span>
                                                            <span className="text-[7px] font-bold text-gray-400 uppercase">Peer Audits</span>
                                                        </div>
                                                        <div className="w-px h-6 bg-gray-200"></div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xl font-serif text-[#0E5858]">{mentor.stats?.totalActivity || 0}</span>
                                                            <span className="text-[7px] font-bold text-gray-400 uppercase">Views</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Last Activation</p>
                                                    <p className="text-xs font-bold text-[#0E5858]">
                                                        {new Date(mentor.stats?.lastActive || '').toLocaleDateString()}
                                                    </p>
                                                    <p className="text-[9px] text-gray-400 font-medium italic mt-1">
                                                        {Math.floor((new Date().getTime() - new Date(mentor.stats?.lastActive || '').getTime()) / (1000 * 60 * 60 * 24))} days ago
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="lg:min-w-[150px] flex justify-end">
                                                <a
                                                    href={`mailto:${mentor.email}`}
                                                    className="w-full lg:w-auto px-6 py-4 bg-white border border-[#0E5858]/10 text-[#0E5858] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0E5858] hover:text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Mail size={14} />
                                                    Contact
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {mentors.length === 0 && (
                                        <div className="p-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                                            <Users size={48} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No mentors found in database</p>
                                        </div>
                                    )}
                                </div>

                                {/* Detailed Activity Feed */}
                                <div className="mt-12 p-10 bg-[#FAFCEE]/30 rounded-[3rem] border border-[#0E5858]/5">
                                    <h3 className="text-xl font-serif text-[#0E5858] mb-8 flex items-center gap-3">
                                        <Activity size={20} className="text-[#00B6C1]" />
                                        Global System Activity
                                    </h3>
                                    <div className="space-y-4">
                                        {allActivity.slice(0, 15).map((log) => {
                                            const mentor = mentors.find(m => m.id === log.user_id);
                                            return (
                                                <div key={log.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-lg bg-[#0E5858]/10 text-[#0E5858] flex items-center justify-center text-[10px] font-black">
                                                            {mentor?.full_name?.[0] || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-bold text-[#0E5858]">
                                                                <span className="opacity-50">{mentor?.full_name || 'System'}</span> {log.activity_type.replace('_', ' ')}
                                                            </p>
                                                            <p className="text-[10px] text-[#00B6C1] font-medium">{log.content_title || log.module_id || 'Global Navigation'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {allActivity.length === 0 && (
                                            <p className="text-center py-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">No recent neural activity detected</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}

// Custom Activity Icon if not imported
function Activity(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}

// Icons
function KeyIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21 2-2 2" />
            <circle cx="10" cy="14" r="8" />
            <path d="m21 2-9.6 9.6" />
            <path d="m19 10 2 2" />
        </svg>
    );
}
