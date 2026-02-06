"use client";

import {
    ArrowLeft,
    BookOpen,
    ExternalLink,
    CheckCircle,
    Clock,
    User,
    Sparkles,
    ChevronRight,
    Play,
    Share2,
    Bookmark
} from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { syllabusData } from "@/data/syllabus";
import { motion, Variants } from "framer-motion";

export default function ModulePage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = params.id as string;

    const module = syllabusData.find(m => m.id === moduleId);

    if (!module) {
        return (
            <main className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Sparkles className="text-[#00B6C1] mb-6" size={64} />
                <h1 className="text-4xl font-serif text-[#0E5858] mb-4">Module Out of Reach</h1>
                <p className="text-gray-400 mb-8 max-w-xs">This curriculum path hasn't been mapped yet.</p>
                <Link href="/" className="px-8 py-3 bg-[#0E5858] text-white rounded-2xl font-bold shadow-xl">Return to Hub</Link>
            </main>
        );
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const topicVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 lg:p-12 xl:p-16 max-w-7xl mx-auto"
        >
            {/* Editorial Navigation */}
            <nav className="flex items-center justify-between mb-16">
                <Link href="/" className="group flex items-center gap-4 text-[#0E5858] transition-all">
                    <div className="w-14 h-14 flex items-center justify-center group-hover:bg-[#0E5858] rounded-2xl transition-all duration-500">
                        <img src="/assets/BN_Logo-BlueBG-Square-HD.png" alt="BN" className="w-full h-full object-contain rounded-xl shadow-lg" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#00B6C1] uppercase tracking-[0.2em]">Clinical Protocol Hub</span>
                        <span className="text-lg font-serif">Balance Nutrition</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#0E5858]/40 hover:text-[#0E5858] transition-all"><Bookmark size={20} /></button>
                    <button className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#0E5858]/40 hover:text-[#0E5858] transition-all"><Share2 size={20} /></button>
                </div>
            </nav>

            {/* Hero Content Header */}
            <header className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8">
                    <motion.div variants={topicVariants} className="flex items-center gap-3 mb-6">
                        <span className="badge-teal">CURRICULUM v3.1</span>
                        <span className="text-[#0E5858]/20 font-light">•</span>
                        <span className="text-sm font-bold text-[#0E5858]/40 uppercase tracking-widest">{module.topics.length} Sections Found</span>
                    </motion.div>
                    <motion.h1
                        variants={topicVariants}
                        className="text-6xl lg:text-7xl font-serif text-[#0E5858] mb-8 leading-[0.95] tracking-tight"
                    >
                        {module.title}
                    </motion.h1>
                    <motion.p
                        variants={topicVariants}
                        className="text-2xl text-gray-500 leading-relaxed max-w-3xl italic font-light"
                    >
                        “{module.subtitle || module.description}”
                    </motion.p>
                </div>

                <motion.div variants={topicVariants} className="lg:col-span-4 bg-[#0E5858] rounded-[3rem] p-10 text-white shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000"></div>
                    <p className="text-[10px] font-bold text-[#00B6C1] uppercase tracking-[0.3em] mb-6">Learning Metrics</p>
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl"><Clock size={20} /></div>
                                <span className="text-sm font-medium">Estimated Time</span>
                            </div>
                            <span className="text-lg font-serif">2.5 Hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl"><Sparkles size={20} /></div>
                                <span className="text-sm font-medium">Difficulty level</span>
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-[#00B6C1]">Advanced</span>
                        </div>
                        <button className="w-full py-4 bg-[#00B6C1] text-[#0E5858] rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-[#00B6C1]/20 hover:scale-[1.02] transition-all">
                            <Play size={18} fill="currentColor" />
                            Start Immersive Session
                        </button>
                    </div>
                </motion.div>
            </header>

            {/* Topics Content Grid */}
            <div className="space-y-12">
                <h3 className="text-3xl font-serif text-[#0E5858] mb-10 flex items-center gap-4">
                    The Syllabus Breakdown
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
                </h3>

                {module.topics.length > 0 ? (
                    module.topics.map((topic, index) => (
                        <motion.div
                            key={topic.code}
                            variants={topicVariants}
                            whileHover={{ x: 10 }}
                            className="premium-card p-10 lg:p-12 group cursor-default"
                        >
                            <div className="flex flex-col xl:flex-row gap-12">
                                {/* Topic Index */}
                                <div className="shrink-0 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-[#FAFCEE] border border-[#00B6C1]/20 rounded-[2rem] flex items-center justify-center text-[#00B6C1] text-2xl font-bold shadow-inner group-hover:bg-[#00B6C1] group-hover:text-white transition-all duration-700 font-serif">
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </div>
                                    <div className="mt-6 flex flex-col items-center gap-1">
                                        <div className="w-0.5 h-12 bg-gradient-to-b from-[#00B6C1]/30 to-transparent"></div>
                                        <span className="text-[10px] font-bold text-[#00B6C1] tracking-widest rotate-90 translate-y-6">{topic.code}</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                                        <h2 className="text-4xl font-serif text-[#0E5858] leading-tight group-hover:text-[#00B6C1] transition-colors decoration-[#00B6C1]/30 decoration-2 underline-offset-8 group-hover:underline">
                                            {topic.title}
                                        </h2>
                                        {topic.owner && (
                                            <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl">
                                                <div className="w-8 h-8 rounded-xl bg-[#00B6C1] flex items-center justify-center text-white"><User size={14} /></div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Mentor Lead</p>
                                                    <p className="text-xs font-bold text-[#0E5858]">{topic.owner}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed tracking-tight group-hover:text-[#0E5858] transition-colors">
                                        {topic.content}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-10">
                                        {topic.outcome && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#FAFCEE] flex items-center justify-center text-[#00B6C1] shadow-sm"><CheckCircle size={18} /></div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Learning Outcome</p>
                                                    <p className="text-sm font-bold text-[#0E5858]">{topic.outcome}</p>
                                                </div>
                                            </div>
                                        )}

                                        {topic.links && topic.links.length > 0 && (
                                            <div className="flex items-center gap-3">
                                                {topic.links.map(link => (
                                                    <a
                                                        key={link.url}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#0E5858] shadow-xl rounded-2xl text-xs font-bold border border-gray-50 hover:bg-[#00B6C1] hover:text-white transition-all"
                                                    >
                                                        <ExternalLink size={14} />
                                                        {link.label}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mark Complete Checkbox Style */}
                                <div className="shrink-0 flex items-center justify-center">
                                    <button className="w-16 h-16 rounded-[1.75rem] border-2 border-gray-100 bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-[#00B6C1]/10 hover:border-[#00B6C1] hover:text-[#00B6C1] transition-all group-hover:scale-110 active:scale-95">
                                        <CheckCircle size={28} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="premium-card p-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-[#0E5858] rounded-[2.5rem] flex items-center justify-center text-[#00B6C1] mb-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <BookOpen size={40} className="relative z-10" />
                        </div>
                        <h2 className="text-4xl font-serif text-[#0E5858] mb-4">Curriculum Mapping</h2>
                        <p className="text-gray-400 max-w-sm mb-12 text-lg">Detailed educational paths and clinical simulations are coming soon to this module.</p>
                        <button className="px-12 py-4 bg-[#0E5858] text-white rounded-[1.5rem] font-bold shadow-2xl hover:bg-black transition-all">Mark as Review Ready</button>
                    </div>
                )}
            </div>

            {/* Editorial Footer */}
            <footer className="mt-32 pt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-gray-300 font-bold uppercase tracking-[0.3em] text-[10px]">
                        <Clock size={14} />
                        <span>Next Milestone</span>
                    </div>
                    <p className="text-xl font-serif text-[#0E5858]">Business Mastery Certificate <span className="text-[#00B6C1]">Lvl. 1</span></p>
                </div>

                <div className="flex items-center gap-6">
                    <button className="text-sm font-bold text-gray-400 hover:text-[#0E5858] transition-colors uppercase tracking-widest">Manual Mode</button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-12 py-5 bg-[#0E5858] text-white rounded-[2rem] font-bold shadow-3xl hover:bg-[#00B6C1] hover:shadow-[#00B6C1]/40 hover:translate-y-[-5px] transition-all duration-500 flex items-center gap-4"
                    >
                        Continue Pathway
                        <ChevronRight size={20} />
                    </button>
                </div>
            </footer>
        </motion.main>
    );
}
