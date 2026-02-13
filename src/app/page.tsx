"use client";

import {
  PlayCircle,
  ArrowRight,
  Trophy,
  Clock,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Zap,
  Target,
  MessageSquare,
  User,
  Activity,
  Share2,
  Layers,
  Leaf,
  Briefcase,
  ListChecks
} from "lucide-react";
import { useRouter } from "next/navigation";
import { syllabusData } from "@/data/syllabus";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const displayModules = syllabusData;
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bn-lms-completed-modules');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
  }, []);

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

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 lg:p-12 max-w-[1600px] mx-auto min-h-screen"
    >
      {/* Floating AI Assistant (New Feature UI) */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <button className="w-16 h-16 bg-[#0E5858] text-white rounded-full shadow-[0_20px_40px_rgba(14,88,88,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative">
          <div className="absolute inset-0 bg-[#00B6C1] rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
          <MessageSquare size={24} className="relative z-10" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00B6C1] rounded-full border-2 border-[#FAFCEE] animate-pulse"></div>
        </button>
      </div>

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
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E5858] via-[#00B6C1] to-[#0E5858]">Balance Nutrition</span>
              </h1>
            </div>
          </div>
          <p className="text-xl text-[#0E5858]/60 font-medium leading-relaxed">
            Welcome to your official mentor onboarding portal. We're excited to have you on the team. This space is designed to help you master our specialized clinical protocols and counselling methodologies.
          </p>
        </motion.div>

        {/* Main Hero Card (Overall Progress) */}
        <motion.div
          variants={itemVariants}
          className="premium-card p-10 min-w-[380px] relative overflow-hidden group bg-gradient-to-br from-white to-[#FAFCEE]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy size={120} className="text-[#0E5858]" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="badge-teal mb-3 inline-block">Certification Path: Active</span>
                <p className="text-5xl font-serif text-[#0E5858]">
                  {displayModules.length > 0 ? Math.round((completedModules.length / displayModules.length) * 100) : 0}%
                </p>
                <p className="text-sm font-bold text-[#0E5858]/40 uppercase tracking-widest mt-1">Counselling Protocol Mastery</p>
              </div>
              <div className="w-14 h-14 bg-[#FFCC00] rounded-2xl flex items-center justify-center text-[#0E5858] shadow-lg shadow-[#FFCC00]/20">
                <Target size={28} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-3 w-full bg-[#0E5858]/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${displayModules.length > 0 ? (completedModules.length / displayModules.length) * 100 : 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0E5858] to-[#00B6C1]"
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-[#0E5858]/40 uppercase tracking-tighter">
                <span>Foundation Phase</span>
                <span className="text-[#00B6C1]">{completedModules.length}/{displayModules.length} Modules Done</span>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Dashboard Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">

        {/* Meet Our Team (Updated Section) */}
        <motion.section variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-[#0E5858]">Meet our team</h3>
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

        {/* Module Progression Tracker (Hero Stepper) */}
        <motion.section variants={itemVariants} className="lg:col-span-8">
          <div className="premium-card p-10 h-full relative overflow-hidden bg-[#0E5858] text-[#FAFCEE]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_-20%,rgba(0,182,193,0.3),transparent)]"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/10 shadow-lg text-[#00B6C1]">
                  <Clock size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-serif leading-tight">Onboarding Pathway</h2>
                  <p className="text-white/40 text-sm font-medium">Tracking your certification from trainee to mentor</p>
                </div>
              </div>
              <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                <span className="text-xs font-bold tracking-[0.2em] uppercase">Onboarding Phase: Foundation</span>
              </div>
            </div>

            {/* Stepper Logic UI */}
            <div className="relative z-10 flex items-center justify-between px-10">
              <div className="absolute left-[50%] top-[40%] w-[80%] h-[1px] bg-white/10 -translate-x-1/2 -z-0"></div>

              {[
                { step: 1, label: 'Foundation', status: 'active' },
                { step: 2, label: 'Growth', status: 'locked' },
                { step: 3, label: 'Ecosystem', status: 'locked' }
              ].map((s, i) => (
                <div key={i} className={`relative z-10 flex flex-col items-center ${s.status === 'locked' ? 'opacity-30' : ''}`}>
                  <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center font-bold text-xl shadow-2xl transition-all ${s.status === 'active' ? 'bg-[#00B6C1] text-[#0E5858] rotate-6 scale-110 shadow-[#00B6C1]/30' : 'bg-white/5 border border-white/10 text-white'
                    }`}>
                    {s.status === 'active' ? <CheckCircle2 size={32} /> : s.step}
                  </div>
                  <span className="mt-5 font-bold tracking-tight">{s.label}</span>
                  {s.status === 'active' && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] bg-white text-[#0E5858] px-2.5 py-1 rounded-full mt-2 font-bold uppercase tracking-widest shadow-lg"
                    >
                      Current
                    </motion.span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Simplified Side-Aligned Timeline */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-6 mb-16">
          <div className="w-1.5 h-10 bg-[#00B6C1] rounded-full"></div>
          <h3 className="text-4xl font-serif text-[#0E5858]">Clinical Training Path</h3>
        </div>

        <div className="relative">
          {/* Continuous Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-[#00B6C1]/20"></div>

          <div className="space-y-12">
            {displayModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Step Indicator Dot */}
                <div className="absolute left-0 top-8 flex items-center justify-center -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-[#00B6C1] flex items-center justify-center p-1.5 shadow-sm z-10 transition-transform hover:scale-125">
                    <div className={`w-full h-full rounded-full ${module.status === 'Locked' ? 'bg-gray-200' : 'bg-[#00B6C1]'}`}></div>
                  </div>
                </div>

                <div
                  onClick={() => router.push(`/modules/${module.id}`)}
                  className={`group premium-card p-4 cursor-pointer flex flex-col md:flex-row items-center gap-4 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 relative ${completedModules.includes(module.id) ? 'bg-green-50/80 border-green-200' : 'bg-white'}`}
                >
                  {/* Absolute Positioned Tickbox */}
                  <button
                    onClick={(e) => toggleModule(module.id, e)}
                    className={`absolute top-3 right-3 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all z-20 ${completedModules.includes(module.id)
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-200 text-gray-200 hover:border-green-500 hover:text-green-500'
                      }`}
                  >
                    <CheckCircle2 size={14} />
                  </button>

                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm ${module.status === 'Locked'
                    ? 'bg-gray-50 text-gray-300'
                    : 'bg-[#FAFCEE] text-[#00B6C1] group-hover:bg-[#00B6C1] group-hover:text-white group-hover:rotate-6'
                    }`}>
                    {module.icon === 'social' ? <Share2 size={24} /> :
                      module.icon === 'health' ? <Activity size={24} /> :
                        module.icon === 'business' ? <Briefcase size={24} /> :
                          module.icon === 'programs' ? <Layers size={24} /> :
                            module.icon === 'cleanse' ? <Leaf size={24} /> :
                              module.type === 'checklist' ? <ListChecks size={24} /> :
                                module.type === 'resource' ? <FileSpreadsheet size={24} /> :
                                  <BookOpen size={24} />}
                  </div>

                  <div className={`flex-1 ${completedModules.includes(module.id) ? 'opacity-80' : ''}`}>
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className="text-[8px] font-bold text-[#00B6C1] uppercase tracking-[0.2em]">Step {index + 1}</span>
                      <span className="w-0.5 h-0.5 bg-gray-100 rounded-full"></span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{module.type}</span>
                    </div>
                    <h4 className={`text-lg font-bold text-[#0E5858] mb-0.5 group-hover:text-[#00B6C1] transition-colors ${completedModules.includes(module.id) ? 'line-through decoration-green-500 decoration-1' : ''}`}>
                      {module.title}
                    </h4>
                    <p className={`text-gray-400 text-[10px] font-medium line-clamp-1 ${completedModules.includes(module.id) ? 'line-through' : ''}`}>
                      {module.subtitle || module.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {module.hasAssignment && (
                      <button className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${module.status === 'Locked'
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'bg-[#0E5858] text-white hover:bg-black'
                        }`}>
                        Submit Assignment
                      </button>
                    )}
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-[#00B6C1] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
