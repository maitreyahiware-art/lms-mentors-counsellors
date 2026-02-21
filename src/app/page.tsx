"use client";

import {
  ArrowRight,
  Trophy,
  Clock,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  Target,
  User,
  Activity,
  Share2,
  Layers,
  Leaf,
  Briefcase,
  ListChecks,
  ShoppingBag,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { syllabusData } from "@/data/syllabus";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const displayModules = syllabusData;
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [userStats, setUserStats] = useState({ progress: 0, avgScore: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Fetch Assessment Scores
      const { data: assessments } = await supabase
        .from('assessment_logs')
        .select('*')
        .eq('user_id', session.user.id);

      // 2. Fetch Detailed Topic Progress
      const { data: topicProgress, error: tpError } = await supabase
        .from('mentor_progress')
        .select('topic_code')
        .eq('user_id', session.user.id);

      console.log(`[Supabase Check] Fetched ${topicProgress?.length || 0} progress records. Error:`, tpError);

      const completedTopicCodes = new Set(topicProgress?.map(p => p.topic_code) || []);
      const dbCompletedModules: string[] = [];

      // Calculate which modules are done based on syllabus
      syllabusData.forEach(module => {
        const allTopicsDone = module.topics.every(t => completedTopicCodes.has(t.code));
        if (allTopicsDone && module.topics.length > 0) {
          dbCompletedModules.push(module.id);
        }
      });

      setCompletedModules(dbCompletedModules);

      const totalTopics = syllabusData.reduce((acc, m) => acc + m.topics.length, 0);
      const compositeProgress = totalTopics > 0 ? Math.round((completedTopicCodes.size / totalTopics) * 100) : 0;

      if (assessments && assessments.length > 0) {
        const avgScore = Math.round((assessments.reduce((acc: number, curr: any) => acc + (curr.score / curr.total_questions), 0) / assessments.length) * 100);

        setUserStats({
          progress: compositeProgress,
          avgScore,
          quizzes: assessments.length
        });
      } else {
        setUserStats(prev => ({ ...prev, progress: compositeProgress }));
      }

      // Fallback to localStorage only if DB is empty for this user
      if (completedTopicCodes.size === 0) {
        const saved = localStorage.getItem('bn-lms-completed-modules');
        if (saved) {
          setCompletedModules(JSON.parse(saved));
        }
      }
      setLoading(false);
    };
    fetchPersonalStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFCEE]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0E5858]/10 border-t-[#00B6C1] rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-[#0E5858]/30 uppercase tracking-[0.2em]">Synchronizing Your Dashboard...</p>
        </div>
      </div>
    );
  }

  const toggleModule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCompleted = completedModules.includes(id)
      ? completedModules.filter(m => m !== id)
      : [...completedModules, id];
    setCompletedModules(newCompleted);
    localStorage.setItem('bn-lms-completed-modules', JSON.stringify(newCompleted));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const nextModule = displayModules.find(m => !completedModules.includes(m.id)) || displayModules[displayModules.length - 1];
  const progressPercent = displayModules.length > 0 ? (completedModules.length / displayModules.length) : 0;
  const remainingHours = Math.max(0, Math.round(72 * (1 - progressPercent)));

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 lg:p-12 max-w-[1600px] mx-auto min-h-screen"
    >
      {/* Top Header Section */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-10">
        <motion.div variants={itemVariants} className="max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            <img
              src="/assets/BN_Logo-BlueBG-Square-HD.png"
              alt="Balance Nutrition"
              className="w-20 h-20 object-contain rounded-2xl shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 text-[#00B6C1] font-bold uppercase tracking-[0.3em] text-[10px] mb-1">
                <Sparkles size={14} />
                <span>Clinical Excellence</span>
              </div>
              <h1 className="text-5xl lg:text-7xl leading-[1.1] font-serif text-[#0E5858]">
                Counselor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E5858] via-[#00B6C1] to-[#0E5858]">Training Dashboard</span>
              </h1>
            </div>
          </div>
          <p className="text-xl text-[#0E5858]/60 font-medium leading-relaxed">
            Welcome to your official counselor onboarding portal. This space is designed to help you master our specialized clinical protocols and counselling methodologies.
          </p>
        </motion.div>

        {/* Main Hero Card (Overall Progress) */}
        <motion.div
          variants={itemVariants}
          className="premium-card p-10 min-w-[380px] relative overflow-hidden group bg-gradient-to-br from-[#0E5858] to-[#083D3D] text-white"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock size={120} className="text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-3 inline-block">Estimated Completion</span>
                <p className="text-5xl font-serif text-white">
                  {remainingHours}h <span className="text-sm font-sans font-bold uppercase tracking-widest text-[#00B6C1]">Left</span>
                </p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2 italic">Based on 72-hour training target</p>
              </div>
              <div className="w-14 h-14 bg-[#00B6C1] rounded-2xl flex items-center justify-center text-[#0E5858] shadow-lg shadow-[#00B6C1]/20">
                <Trophy size={28} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-tighter">
                <span>Certification Progress</span>
                <span className="text-white">{Math.round(progressPercent * 100)}% Complete</span>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Dashboard Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">

        {/* Meet Our Team */}
        <motion.section variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-[#0E5858]">Clinical Support Team</h3>
          </div>

          <div className="premium-card p-8 flex-1 space-y-6">
            {[
              { name: 'Vishal Rupani', role: 'Leadership, CEO' },
              { name: 'Khyati Rupani', role: 'Founder & Clinical Lead' },
              { name: 'Vaibhav Gonjari', role: 'Team Lead' },
              { name: 'Maitreya Hiware', role: 'Founder Office' },
            ].map((member, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className={`w-12 h-12 bg-[#FAFCEE] text-[#00B6C1] rounded-2xl flex items-center justify-center transition-transform group-hover:bg-[#00B6C1] group-hover:text-white`}>
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#0E5858] group-hover:text-[#00B6C1] transition-colors">{member.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Active Learning Module (Replaced Stepper) */}
        <motion.section variants={itemVariants} className="lg:col-span-8">
          <div className="premium-card p-10 h-full relative overflow-hidden bg-white border-2 border-[#FAFCEE] shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAFCEE] rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#0E5858] text-white rounded-lg">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-[10px] font-black text-[#0E5858] uppercase tracking-[0.2em]">Active Learning Module</span>
                  </div>
                  <h2 className="text-4xl font-serif text-[#0E5858] mb-2">{nextModule.title}</h2>
                  <p className="text-gray-400 font-medium max-w-lg mb-8">{nextModule.subtitle || nextModule.description}</p>

                  <button
                    onClick={() => router.push(`/modules/${nextModule.id}`)}
                    className="group bg-[#0E5858] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-[#00B6C1] transition-all"
                  >
                    Continue Training
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="min-w-[240px] p-6 bg-[#FAFCEE] rounded-3xl border border-[#0E5858]/5">
                  <p className="text-[9px] font-black text-[#0E5858]/40 uppercase tracking-[0.2em] mb-4">Module Snapshot</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-[#0E5858]">
                      <span className="opacity-40">Topics</span>
                      <span>{nextModule.topics.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-[#0E5858]">
                      <span className="opacity-40">Tasks</span>
                      <span>{nextModule.hasAssignment ? '1 Clinical Audit' : 'Self-Review'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-[#0E5858]">
                      <span className="opacity-40">Type</span>
                      <span className="badge-teal text-[9px]">{nextModule.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

    </motion.main>
  );
}
