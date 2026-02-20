"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    Lock,
    Play,
    Sparkles,
    User,
    ExternalLink,
    BookOpen,
    Target,
    Share2,
    Activity,
    ListChecks,
    CheckCircle2,
    X,
    FileText,
    Maximize2,
    ArrowUpRight,
    BrainCircuit
} from "lucide-react";
import YouTubePlayer from "./YouTubePlayer";
import ClinicalSimulator from "./ClinicalSimulator";
import AIAssessment from "./AIAssessment";
import SummaryGrader from "./SummaryGrader";
import AssignmentForm from "./AssignmentForm";
import { Topic } from "@/data/syllabus";

interface TopicCardProps {
    topic: Topic;
    index: number;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

function getEmbedUrl(url: string | undefined): string | null {
    if (!url) return null;

    // YouTube
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
        return `https://www.youtube.com/embed/${ytMatch[2]}`;
    }

    // Google Drive
    if (url.includes('drive.google.com')) {
        const driveMatch = url.match(/\/file\/d\/([^\/]+)/);
        if (driveMatch) {
            return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
        }
    }

    return null;
}

function getDocEmbedUrl(url: string): string {
    if (url.includes('docs.google.com/presentation')) {
        // Use /embed for better iframe rendering in slideshow mode
        const idMatch = url.match(/\/d\/([^\/]+)/);
        if (idMatch) {
            return `https://docs.google.com/presentation/d/${idMatch[1]}/embed?start=false&loop=false&delayms=3000`;
        }
        return url.replace(/\/(edit|preview|present).*$/, '/embed');
    }
    if (url.includes('docs.google.com')) {
        return url.replace(/\/(edit|view|present).*$/, '/preview');
    }
    return url;
}

export default function TopicCard({ topic, index, isCompleted, onToggleComplete }: TopicCardProps) {
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [simulationCompleted, setSimulationCompleted] = useState(false);
    const [assignmentCompleted, setAssignmentCompleted] = useState(false);
    const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null);

    // Find main video/media link
    const mediaLink = topic.links?.find(l =>
        l.url.includes('youtube') ||
        l.url.includes('youtu.be') ||
        l.url.includes('drive.google.com')
    );
    const embedUrl = getEmbedUrl(mediaLink?.url);

    // Persist progress to local storage
    useEffect(() => {
        const key = `bn-topic-progress-${topic.code}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            const progress = JSON.parse(saved);
            setVideoCompleted(progress.video || false);
            setSimulationCompleted(progress.simulation || false);
            setAssignmentCompleted(progress.assignment || false);
        } else if (isCompleted) {
            setVideoCompleted(true);
            setSimulationCompleted(true);
            setAssignmentCompleted(true);
        }
    }, [topic.code, isCompleted]);

    useEffect(() => {
        // Don't save if it's already fully completed via the global toggle to avoid redundancy
        if (isCompleted) return;

        const key = `bn-topic-progress-${topic.code}`;
        localStorage.setItem(key, JSON.stringify({
            video: videoCompleted,
            simulation: simulationCompleted,
            assignment: assignmentCompleted
        }));
    }, [videoCompleted, simulationCompleted, assignmentCompleted, topic.code, isCompleted]);

    const handleVideoComplete = () => {
        setVideoCompleted(true);
    };

    const isReadyToComplete =
        (topic.isAssignment ? assignmentCompleted : true) &&
        (embedUrl ? videoCompleted : true) &&
        (topic.hasLive ? simulationCompleted : true);

    return (
        <div className={`premium-card p-6 lg:p-10 group cursor-default relative transition-all duration-500 ${isCompleted ? 'bg-[#FAFCEE]/80 border-[#0E5858]/10' : 'bg-white'}`}>
            {/* Case Study Overlay */}
            <AnimatePresence>
                {selectedCaseStudy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#0E5858]/95 backdrop-blur-xl p-8 lg:p-16 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-3xl font-serif text-white mb-1">Case Study Analysis</h3>
                                <p className="text-[#00B6C1] text-xs font-bold uppercase tracking-widest">Clinical Protocol Deep Dive</p>
                            </div>
                            <button
                                onClick={() => setSelectedCaseStudy(null)}
                                className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/10"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <div className="flex-1 w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black">
                            <iframe
                                src={getDocEmbedUrl(selectedCaseStudy)}
                                className="w-full h-full"
                                allow="autoplay"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FAFCEE] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                {/* Topic Index & Sidebar Line */}
                <div className="flex lg:flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#0E5858] flex items-center justify-center text-white font-serif text-xl font-bold shadow-xl group-hover:bg-[#00B6C1] transition-all duration-500">
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="hidden lg:block w-px h-full bg-gradient-to-b from-[#0E5858]/20 via-[#0E5858]/10 to-transparent"></div>
                </div>

                <div className="flex-1">
                    {/* Header: Title & Info */}
                    <div className="mb-10">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold text-[#00B6C1] uppercase tracking-[0.3em]">{topic.code}</span>
                            {topic.isAssignment && (
                                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100">Assignment Module</span>
                            )}
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-serif text-[#0E5858] mb-6 tracking-tight leading-tight">{topic.title}</h2>

                        <div className="max-w-4xl mb-8">
                            <div
                                className="text-gray-500 leading-relaxed text-base font-medium"
                                dangerouslySetInnerHTML={{ __html: topic.content }}
                            />
                        </div>

                        <div className="flex flex-wrap items-start gap-8">
                            {topic.outcome && (
                                <div className="flex-1 min-w-[300px] flex items-start gap-4 p-5 bg-green-50/30 rounded-3xl border border-green-50/50">
                                    <div className="shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-green-700/60 uppercase tracking-widest mb-1.5">Learning Outcome</p>
                                        <p className="text-sm font-bold text-[#0E5858] leading-snug italic opacity-80">“{topic.outcome}”</p>
                                    </div>
                                </div>
                            )}

                            {topic.links && topic.links.length > 0 && !topic.caseStudyLinks && (
                                <div className="space-y-4 flex-1 min-w-[300px]">
                                    <div className="flex items-center justify-between mb-1 px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00B6C1]"></div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{topic.isAssignment ? 'Peer Audit Resource Links' : 'Reference Materials'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {topic.links.map(link => (
                                            <a
                                                key={link.label}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group/link flex items-center justify-between px-4 py-3 bg-white text-[#0E5858] shadow-sm hover:shadow-xl rounded-2xl text-[11px] font-bold border border-[#0E5858]/5 hover:border-[#00B6C1]/20 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#FAFCEE] rounded-lg text-[#00B6C1] group-hover/link:bg-[#00B6C1] group-hover/link:text-white transition-colors">
                                                        <Share2 size={12} />
                                                    </div>
                                                    {link.label}
                                                </div>
                                                <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-[#00B6C1]" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Engagement Area */}
                    <div className="space-y-12">
                        {/* PHASE 1: MATERIAL CONSUMPTION / RESEARCH */}
                        <div className="max-w-5xl">
                            {!topic.isAssignment && (
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl transition-transform ${videoCompleted ? 'bg-green-500 shadow-green-500/10' : 'bg-[#00B6C1] shadow-[#00B6C1]/20'}`}>
                                        {videoCompleted ? <CheckCircle size={20} /> : <BookOpen size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif text-[#0E5858]">
                                            {topic.caseStudyLinks ? 'Case Study Repository' : 'Material Review'}
                                        </h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                            {topic.caseStudyLinks ? 'Select a case study to analyze' : 'Complete this to unlock simulations'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Case Study Grid OR Video/Mark as Read OR Assignment Resources */}
                            {topic.isAssignment && !assignmentCompleted && !videoCompleted ? (
                                <div className="p-8 bg-gradient-to-br from-[#0E5858] to-[#00B6C1] rounded-[2.5rem] text-center shadow-2xl shadow-[#0E5858]/20 animate-in fade-in zoom-in duration-700">
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                                        <BrainCircuit size={32} className="text-white animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-serif text-white mb-2">Ready for Performance Audit?</h3>
                                    <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">Use the peer resource links above to gather your data, then click below to initialize your clinical audit matrix.</p>
                                    <button
                                        onClick={() => {
                                            setVideoCompleted(true);
                                            setTimeout(() => {
                                                document.getElementById(`assignment-${topic.code}`)?.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        }}
                                        className="inline-flex items-center gap-4 px-12 py-5 bg-white text-[#0E5858] rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:bg-[#FAFCEE] transition-all hover:-translate-y-1 shadow-xl"
                                    >
                                        <Sparkles size={20} className="text-[#00B6C1]" />
                                        Start Your Peer Review
                                    </button>
                                </div>
                            ) : topic.caseStudyLinks ? (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {topic.caseStudyLinks.map((link, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -5, scale: 1.02 }}
                                                onClick={() => setSelectedCaseStudy(link)}
                                                className="aspect-[4/5] bg-[#FAFCEE] border border-[#0E5858]/5 rounded-2xl p-4 flex flex-col justify-between cursor-pointer group/case shadow-sm hover:shadow-xl hover:bg-white transition-all overflow-hidden relative"
                                            >
                                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/case:opacity-100 transition-opacity">
                                                    <Maximize2 size={12} className="text-[#00B6C1]" />
                                                </div>
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#00B6C1] shadow-sm transform group-hover/case:rotate-12 transition-transform">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-[#00B6C1] uppercase tracking-[0.2em] mb-1">Case study</p>
                                                    <p className="text-xs font-bold text-[#0E5858] leading-tight">Patient Journal #{String(i + 1).padStart(2, '0')}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {!videoCompleted && (
                                        <div className="flex justify-center pt-4">
                                            <button
                                                onClick={() => setVideoCompleted(true)}
                                                className="px-10 py-4 bg-[#FAFCEE] text-[#0E5858] border border-[#0E5858]/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#0E5858] hover:text-white transition-all shadow-xl"
                                            >
                                                Confirm All Cases Studied
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : embedUrl ? (
                                <div className={`transition-all duration-700 ${videoCompleted ? "opacity-60 grayscale-[0.5]" : ""}`}>
                                    <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 ring-1 ring-black/[0.03]">
                                        {embedUrl.includes('youtube.com') ? (
                                            <YouTubePlayer videoId={embedUrl.split('/').pop() || ''} onComplete={handleVideoComplete} />
                                        ) : (
                                            <iframe
                                                src={embedUrl}
                                                className="w-full h-full"
                                                allow="autoplay"
                                                allowFullScreen
                                            />
                                        )}
                                    </div>
                                    {!videoCompleted && (
                                        <div className="mt-6 flex justify-center">
                                            <button
                                                onClick={() => setVideoCompleted(true)}
                                                className="px-10 py-4 bg-[#FAFCEE] text-[#0E5858] border border-[#0E5858]/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#0E5858] hover:text-white transition-all shadow-xl"
                                            >
                                                Confirm Session Watched
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="max-w-2xl">
                                    {topic.isAssignment ? null : !videoCompleted ? (
                                        <button
                                            onClick={() => setVideoCompleted(true)}
                                            className="w-full py-5 bg-[#0E5858] text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#00B6C1] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#0E5858]/20"
                                        >
                                            <CheckCircle size={20} />
                                            Mark Material as Reviewed
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-4 text-green-600 text-xs font-black uppercase tracking-[0.2em] justify-center py-5 bg-green-50/50 rounded-2xl border border-green-100/50">
                                            <CheckCircle2 size={24} />
                                            Learning Material Consumed
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* PHASE 2: INTERACTION (ONLY IF APPLICABLE) */}
                        {(topic.hasLive || topic.isAssignment) && (
                            <div
                                id={`assignment-${topic.code}`}
                                className={`${videoCompleted ? "opacity-100" : (topic.isAssignment ? "opacity-0 h-0 overflow-hidden" : "opacity-40 blur-[4px] pointer-events-none grayscale select-none")} transition-all duration-1000 max-w-5xl`}
                            >
                                {!topic.isAssignment && (
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl ${simulationCompleted || assignmentCompleted ? 'bg-green-500 shadow-green-500/10' : 'bg-purple-500 shadow-purple-500/20'}`}>
                                            {topic.hasLive ? <User size={20} /> : <Activity size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-serif text-[#0E5858]">{topic.hasLive ? 'Clinical Protocol Simulation' : 'Analytical Research Task'}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Practical Implementation Phase</p>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 bg-gradient-to-br from-white to-[#FAFCEE]/30 rounded-[3rem] border border-[#0E5858]/5 shadow-2xl relative overflow-hidden">
                                    {topic.hasLive ? (
                                        <>
                                            <ClinicalSimulator topicTitle={topic.title} topicContent={topic.content} topicCode={topic.code} />
                                            {!simulationCompleted && (
                                                <div className="mt-8 flex justify-center">
                                                    <button
                                                        onClick={() => setSimulationCompleted(true)}
                                                        className="px-8 py-3 bg-white text-[#0E5858] border border-[#0E5858]/10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-[#0E5858] hover:text-white transition-all"
                                                    >
                                                        Confirm Protocol Practice
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <AssignmentForm
                                            topicCode={topic.code}
                                            questions={topic.assignmentQuestions || []}
                                            persona={topic.persona}
                                            onComplete={() => setAssignmentCompleted(true)}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* FOOTER: THE "MARK COMPLETED" ACTION */}
                        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${isReadyToComplete ? 'bg-green-500 animate-pulse' : 'bg-gray-200'}`}></div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {isCompleted ? 'Segment Completed & Logged' : (isReadyToComplete ? 'Requirements Met • Ready to Mark' : 'Incomplete Requirements')}
                                </p>
                            </div>

                            <button
                                onClick={onToggleComplete}
                                disabled={!isReadyToComplete && !isCompleted}
                                className={`group flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all duration-500 ${isCompleted
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : (isReadyToComplete
                                        ? 'bg-[#0E5858] text-white hover:bg-[#00B6C1] hover:-translate-y-1 shadow-2xl shadow-[#0E5858]/30'
                                        : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed opacity-50')
                                    }`}
                            >
                                {isCompleted ? (
                                    <>
                                        <CheckCircle2 size={20} />
                                        Success Fully Logged
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} className="group-hover:scale-125 transition-transform" />
                                        Complete Segment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
