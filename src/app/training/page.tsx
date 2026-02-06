"use client";

import { motion, Variants } from "framer-motion";
import { syllabusData } from "@/data/syllabus";
import { BookOpen, ArrowRight, Play, Clock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrainingPage() {
    const router = useRouter();

    // Filter for training modules only
    const trainingModules = syllabusData.filter(m => m.type === 'module' || m.type === 'pre-joining');

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 lg:p-12 max-w-7xl mx-auto"
        >
            <header className="mb-16">
                <h1 className="text-5xl font-serif text-[#0E5858] mb-4">Mentor Training Academy</h1>
                <p className="text-xl text-gray-500 max-w-2xl">
                    Complete the following modules to master the Balance Nutrition clinical protocols and counselling standards.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {trainingModules.map((module, index) => (
                    <motion.div
                        key={module.id}
                        variants={itemVariants}
                        onClick={() => router.push(`/modules/${module.id}`)}
                        className="premium-card p-8 group cursor-pointer hover:border-[#00B6C1]/30 transition-all"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 bg-[#FAFCEE] rounded-3xl flex items-center justify-center text-[#00B6C1] group-hover:bg-[#00B6C1] group-hover:text-white transition-all">
                                <BookOpen size={32} />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                    <span className="badge-teal">{module.type}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{module.topics.length} Topics</span>
                                </div>
                                <h2 className="text-3xl font-serif text-[#0E5858] mb-2">{module.title}</h2>
                                <p className="text-gray-500 font-medium">{module.subtitle || module.description}</p>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-4 min-w-[200px]">
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#0E5858] to-[#00B6C1]"
                                        style={{ width: `${module.progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                                        <Clock size={16} />
                                        <span>{module.topics.length * 30} mins</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[#00B6C1] font-bold group-hover:translate-x-2 transition-all">
                                        <span>{module.progress === 100 ? 'Review' : 'Continue'}</span>
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.main>
    );
}
