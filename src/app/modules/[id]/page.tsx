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
    ChevronLeft,
    Play,
    Share2,
    Bookmark
} from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { syllabusData } from "@/data/syllabus";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import AIAssessment from "@/components/AIAssessment";
import ClinicalSimulator from "@/components/ClinicalSimulator";
import SummaryGrader from "@/components/SummaryGrader";
import { supabase } from "@/lib/supabase";

export default function ModulePage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = params.id as string;

    const module = syllabusData.find(m => m.id === moduleId);

    const [completedTopics, setCompletedTopics] = useState<string[]>([]);

    useEffect(() => {
        const fetchProgress = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase
                    .from('mentor_progress')
                    .select('topic_code')
                    .eq('user_id', session.user.id)
                    .eq('module_id', moduleId);

                if (data) {
                    setCompletedTopics(data.map(p => p.topic_code));
                }
            }
        };
        fetchProgress();
    }, [moduleId]);

    const toggleTopic = async (topicCode: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const isCompleted = completedTopics.includes(topicCode);

        if (isCompleted) {
            const { error } = await supabase
                .from('mentor_progress')
                .delete()
                .eq('user_id', session.user.id)
                .eq('topic_code', topicCode);

            if (!error) {
                setCompletedTopics(completedTopics.filter(t => t !== topicCode));
            }
        } else {
            const { error } = await supabase
                .from('mentor_progress')
                .insert([{
                    user_id: session.user.id,
                    topic_code: topicCode,
                    module_id: moduleId
                }]);

            if (!error) {
                setCompletedTopics([...completedTopics, topicCode]);
            }
        }
    };

    const currentModuleIndex = syllabusData.findIndex(m => m.id === moduleId);
    const prevModule = syllabusData[currentModuleIndex - 1];
    const nextModule = syllabusData[currentModuleIndex + 1];

    const handlePrev = () => {
        if (prevModule) {
            router.push(`/modules/${prevModule.id}`);
        }
    };

    const handleContinue = () => {
        if (nextModule) {
            router.push(`/modules/${nextModule.id}`);
        } else {
            router.push('/');
        }
    };

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

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="h-12 px-6 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all bg-white text-[#0E5858] hover:bg-green-50 border border-green-100"
                        title="Go Back"
                    >
                        <ChevronLeft size={20} />
                        <span className="hidden md:inline">Back</span>
                    </button>

                    <button
                        onClick={() => router.forward()}
                        className="h-12 px-6 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all bg-white text-[#0E5858] hover:bg-green-50 border border-green-100"
                        title="Go Forward"
                    >
                        <span className="hidden md:inline">Forward</span>
                        <ChevronRight size={20} />
                    </button>

                    <div className="w-px h-8 bg-gray-200 mx-2"></div>

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
            <div className="space-y-6">
                <h3 className="text-2xl font-serif text-[#0E5858] mb-6 flex items-center gap-4">
                    The Syllabus Breakdown
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
                </h3>

                {module.topics.length > 0 ? (
                    module.topics.map((topic, index) => (
                        <motion.div
                            key={topic.code}
                            variants={topicVariants}
                            whileHover={{ x: 10 }}
                            className={`premium-card p-6 lg:p-8 group cursor-default relative transition-all duration-300 ${completedTopics.includes(topic.code) ? 'bg-green-50/80 border-green-200' : 'bg-white'}`}
                        >
                            {/* Absolute Positioned Tickbox */}
                            <button
                                onClick={() => toggleTopic(topic.code)}
                                className={`absolute top-4 right-4 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all z-20 ${completedTopics.includes(topic.code)
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-200 text-gray-200 hover:border-green-500 hover:text-green-500'
                                    }`}
                            >
                                <CheckCircle size={14} />
                            </button>
                            <div className="flex flex-col xl:flex-row gap-6">
                                {/* Topic Index */}
                                <div className="shrink-0 flex flex-col items-center">
                                    <div className={`w-12 h-12 border border-[#00B6C1]/20 rounded-2xl flex items-center justify-center text-[#00B6C1] text-lg font-bold shadow-inner transition-all duration-700 font-serif ${completedTopics.includes(topic.code) ? 'bg-green-100 border-green-300' : 'bg-[#FAFCEE] group-hover:bg-[#00B6C1] group-hover:text-white'}`}>
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </div>
                                    <div className="mt-4 flex flex-col items-center gap-1">
                                        <div className="w-0.5 h-8 bg-gradient-to-b from-[#00B6C1]/30 to-transparent"></div>
                                        <span className="text-[8px] font-bold text-[#00B6C1] tracking-widest rotate-90 translate-y-4">{topic.code}</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-6">
                                        <h2 className={`text-2xl font-serif text-[#0E5858] leading-tight group-hover:text-[#00B6C1] transition-colors decoration-[#00B6C1]/30 decoration-2 underline-offset-8 group-hover:underline ${completedTopics.includes(topic.code) ? 'line-through decoration-green-500' : ''}`}>
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

                                    <div
                                        className={`text-base text-gray-500 font-medium mb-6 leading-relaxed tracking-tight group-hover:text-[#0E5858] transition-colors ${completedTopics.includes(topic.code) ? 'line-through opacity-60' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: topic.content }}
                                    />

                                    <div className="flex flex-wrap items-center gap-6">
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
                                                        key={link.label}
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

                                    {/* AI Mentor Training Suite */}
                                    <div className="mt-10 pt-10 border-t border-[#00B6C1]/10 space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#00B6C1] flex items-center justify-center text-white"><Sparkles size={14} /></div>
                                            <h4 className="text-xs font-bold text-[#0E5858] uppercase tracking-[0.2em]">AI Training Suite</h4>
                                        </div>

                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="p-6 bg-[#FAFCEE]/50 rounded-3xl border border-[#00B6C1]/10">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Phase 1: Knowledge Check</p>
                                                    <AIAssessment topicTitle={topic.title} topicContent={topic.content} topicCode={topic.code} />
                                                </div>
                                                <div className="p-6 bg-[#FAFCEE]/50 rounded-3xl border border-[#00B6C1]/10">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Phase 2: Live Interaction</p>
                                                    <ClinicalSimulator topicTitle={topic.title} topicContent={topic.content} topicCode={topic.code} />
                                                </div>
                                            </div>

                                            <div className="p-6 bg-[#FAFCEE]/50 rounded-3xl border border-[#00B6C1]/10 bg-gradient-to-br from-white to-[#FAFCEE]">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Phase 3: Learning Audit</p>
                                                <SummaryGrader topicTitle={topic.title} topicContent={topic.content} topicCode={topic.code} />
                                            </div>
                                        </div>
                                    </div>
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
            {/* Editorial Footer */}
            <footer className="mt-32 pt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <button
                    onClick={handlePrev}
                    disabled={!prevModule}
                    className={`px-8 py-4 rounded-[2rem] font-bold shadow-xl flex items-center gap-3 transition-all ${prevModule
                        ? 'bg-white text-[#0E5858] hover:bg-gray-50 border border-gray-100 hover:shadow-2xl'
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                        }`}
                >
                    <ChevronLeft size={20} />
                    Previous Module
                </button>

                <button
                    onClick={handleContinue}
                    className="px-10 py-5 bg-[#0E5858] text-white rounded-[2rem] font-bold shadow-3xl hover:bg-[#00B6C1] hover:shadow-[#00B6C1]/40 hover:translate-y-[-5px] transition-all duration-500 flex items-center gap-4"
                >
                    {nextModule ? 'Next Module' : 'Return to Hub'}
                    <ChevronRight size={20} />
                </button>
            </footer>
        </motion.main>
    );
}
