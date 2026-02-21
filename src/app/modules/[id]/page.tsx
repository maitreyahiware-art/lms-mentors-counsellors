"use client";

import {
    BookOpen,
    ExternalLink,
    CheckCircle,
    Clock,
    User,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Brain,
    ShoppingBag,
    Globe,
    Activity,
    Target,
    ArrowRight
} from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { syllabusData } from "@/data/syllabus";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import TopicCard from "@/components/TopicCard";
import { supabase } from "@/lib/supabase";
import AIAssessment from "@/components/AIAssessment";
import ClinicalSimulator from "@/components/ClinicalSimulator";
import { AnimatePresence } from "framer-motion";
import { logActivity } from "@/lib/activity";

export default function ModulePage() {

    const params = useParams();
    const router = useRouter();
    const moduleId = params.id as string;

    const module = syllabusData.find(m => m.id === moduleId);

    const [completedTopics, setCompletedTopics] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | undefined>();
    const [showModuleAssessment, setShowModuleAssessment] = useState(false);
    const [assessmentPassed, setAssessmentPassed] = useState(false);
    const [showVivaIntro, setShowVivaIntro] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);
    const [simulationDone, setSimulationDone] = useState(false);

    // Concatenate module content for AI test generation
    const moduleContentSummary = module?.topics.map(t => `${t.title}: ${t.content}`).join("\n\n") || "";

    useEffect(() => {
        if (moduleId) {
            logActivity('view_topic', { moduleId, contentTitle: module?.title });
        }
    }, [moduleId, module?.title]);

    useEffect(() => {
        const fetchProgress = async () => {

            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
                const { data } = await supabase
                    .from('mentor_progress')
                    .select('topic_code')
                    .eq('user_id', session.user.id)
                    .eq('module_id', moduleId);

                if (data) {
                    setCompletedTopics(data.map(p => p.topic_code));
                }

                // Check if module assessment already passed
                const { data: assessmentData } = await supabase
                    .from('assessment_logs')
                    .select('id')
                    .eq('user_id', session.user.id)
                    .eq('topic_code', `MODULE_${moduleId}`);

                if (assessmentData && assessmentData.length > 0) {
                    setAssessmentPassed(true);
                }

                // Check if module simulation done (specifically for M3)
                const { data: simData } = await supabase
                    .from('simulation_logs')
                    .select('id')
                    .eq('user_id', session.user.id)
                    .eq('topic_code', `SIM_${moduleId}`);

                if (simData && simData.length > 0) {
                    setSimulationDone(true);
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
        // Special logic for Module 2: Block until Peer Review (M2-04) is done
        if (moduleId === 'module-2') {
            const hasPeerReview = completedTopics.includes('M2-04');
            if (!hasPeerReview) {
                alert("Please submit your Peer Review report before proceeding to the Final Audit.");
                return;
            }
        }

        // If all topics done but assessment not passed, show assessment
        const allTopicsDone = module?.topics.every(t => completedTopics.includes(t.code));

        if (allTopicsDone) {
            // Requirement for Module 3: Must do clinical simulation first
            if (moduleId === 'module-3' && !simulationDone) {
                setShowSimulation(true);
                return;
            }

            if (!assessmentPassed) {
                if (moduleId === 'module-2') {
                    setShowVivaIntro(true);
                } else {
                    setShowModuleAssessment(true);
                }
            } else if (nextModule) {
                router.push(`/modules/${nextModule.id}`);
            } else {
                router.push('/');
            }
        } else {
            alert("Please complete all sections in this module before proceeding.");
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
            <AnimatePresence>
                {showVivaIntro && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#0E5858]/95 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-xl bg-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden text-center"
                        >
                            <div className="w-20 h-20 bg-[#FAFCEE] text-[#00B6C1] rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <Brain size={40} />
                            </div>

                            <h2 className="text-4xl font-serif text-[#0E5858] mb-4">Final Audit: Viva Session</h2>
                            <p className="text-gray-500 font-medium mb-10 italic">"Clinical proficiency check for Phase 1 certification."</p>

                            <div className="bg-[#FAFCEE] rounded-3xl p-8 text-left mb-10 space-y-4 border border-[#00B6C1]/10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00B6C1] mb-2">Audit Rules & Protocols</h4>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-xs font-bold text-[#0E5858]/70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00B6C1] mt-1.5"></div>
                                        <span>Time Limit: 10 Minutes to complete all segments.</span>
                                    </li>
                                    <li className="flex gap-3 text-xs font-bold text-[#0E5858]/70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00B6C1] mt-1.5"></div>
                                        <span>No Mid-Way Exit: Closing the window will void the attempt.</span>
                                    </li>
                                    <li className="flex gap-3 text-xs font-bold text-[#0E5858]/70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00B6C1] mt-1.5"></div>
                                        <span>Reporting: Scores are shared directly with the Founder & Admin Dashboard.</span>
                                    </li>
                                    <li className="flex gap-3 text-xs font-bold text-[#0E5858]/70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00B6C1] mt-1.5"></div>
                                        <span>Retest Protocol: Low scores require clinical lead approval for re-attempt.</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => {
                                    setShowVivaIntro(false);
                                    setShowModuleAssessment(true);
                                }}
                                className="w-full py-5 bg-[#0E5858] text-white rounded-[1.5rem] font-bold shadow-2xl hover:bg-[#00B6C1] transition-all flex items-center justify-center gap-3"
                            >
                                Start Final Audit
                                <ChevronRight size={18} />
                            </button>

                            <button
                                onClick={() => setShowVivaIntro(false)}
                                className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#0E5858] transition-colors"
                            >
                                I need more preparation
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {showSimulation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-[#0E5858]/95 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-2xl bg-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
                        >
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B6C1]/10 text-[#00B6C1] rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <Activity size={12} />
                                    Clinical Simulation
                                </div>
                                <h2 className="text-4xl font-serif text-[#0E5858] mb-2">Protocol Viva Simulation</h2>
                                <p className="text-gray-500 font-medium">Practice your consultation pitch with our AI client before the final module check.</p>
                            </div>

                            <ClinicalSimulator
                                topicTitle="Consultation Protocol Mastery"
                                topicContent="Deep dive into program pitching, client engagement, and medical history discovery."
                                topicCode={`SIM_${moduleId}`}
                            />

                            <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Complete at least 3 turns to proceed</p>
                                <button
                                    onClick={() => {
                                        setSimulationDone(true);
                                        setShowSimulation(false);
                                        handleContinue(); // Re-trigger flow
                                    }}
                                    className="px-8 py-4 bg-[#0E5858] text-white rounded-2xl font-bold hover:bg-[#00B6C1] transition-all shadow-xl"
                                >
                                    I've Practiced Enough
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showModuleAssessment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0E5858]/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-2xl bg-[#FAFCEE] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                        >
                            <button
                                onClick={() => setShowModuleAssessment(false)}
                                className="absolute top-8 right-8 text-[#0E5858]/40 hover:text-[#0E5858]"
                            >
                                Skip for now
                            </button>

                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B6C1]/10 text-[#00B6C1] rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <Brain size={12} />
                                    Module Certification
                                </div>
                                <h2 className="text-4xl font-serif text-[#0E5858] mb-2">{module.title} Check</h2>
                                <p className="text-gray-500 font-medium">Verify your clinical knowledge before proceeding to the next segment.</p>
                            </div>

                            <AIAssessment
                                topicTitle={module.title}
                                topicContent={moduleContentSummary}
                                topicCode={`MODULE_${moduleId}`}
                                onComplete={() => {
                                    setAssessmentPassed(true);
                                    // Give a small delay before hiding so they see the result
                                    setTimeout(() => {
                                        setShowModuleAssessment(false);
                                        if (nextModule) {
                                            router.push(`/modules/${nextModule.id}`);
                                        } else {
                                            router.push('/');
                                        }
                                    }, 2000);
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        <TopicCard
                            key={topic.code}
                            topic={topic}
                            index={index}
                            isCompleted={completedTopics.includes(topic.code)}
                            onToggleComplete={() => toggleTopic(topic.code)}
                            userId={userId}
                        />
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

            {/* BN Ecosystem Hub (Only for Module 1) */}
            {moduleId === 'module-1' && (
                <section className="mt-24 mb-10">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-1.5 h-10 bg-[#00B6C1] rounded-full"></div>
                        <div>
                            <h3 className="text-3xl font-serif text-[#0E5858]">BN Ecosystem Hub</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Cross-Platform Resource Deep Links</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "BN Shop",
                                url: "https://www.balancenutrition.in/shop",
                                desc: "E-Commerce & Product Inventory",
                                icon: ShoppingBag,
                                color: "#FFCC00"
                            },
                            {
                                title: "Nutripreneur",
                                url: "https://nutripreneur.balancenutrition.in/",
                                desc: "Entrepreneurial Learning Platform",
                                icon: Target,
                                color: "#00B6C1"
                            },
                            {
                                title: "BN Franchise",
                                url: "https://bnlifecentre.balancenutrition.in/#",
                                desc: "Life Centre & Franchise Operations",
                                icon: Globe,
                                color: "#0E5858"
                            },
                            {
                                title: "Smart Clinic",
                                url: "https://smart-clinic-v2.vercel.app/",
                                desc: "Clinical OS & Patient Management",
                                icon: Activity,
                                color: "#FF5733"
                            }
                        ].map((link, i) => (
                            <motion.a
                                key={i}
                                href={link.url}
                                target="_blank"
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="premium-card p-8 group relative overflow-hidden flex flex-col items-center text-center hover:border-[#00B6C1]/30 transition-all border border-transparent bg-white shadow-xl"
                            >
                                <div
                                    className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl transition-all group-hover:rotate-12"
                                    style={{ backgroundColor: `${link.color}15`, color: link.color }}
                                >
                                    <link.icon size={28} />
                                </div>
                                <h4 className="text-xl font-serif font-bold text-[#0E5858] mb-2">{link.title}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed px-4 font-medium">{link.desc}</p>

                                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00B6C1] opacity-0 group-hover:opacity-100 transition-all">
                                    Launch Platform
                                    <ArrowRight size={14} />
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </section>
            )}

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
