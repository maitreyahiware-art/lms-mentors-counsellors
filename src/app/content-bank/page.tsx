"use client";

import { motion, Variants } from "framer-motion";
import { syllabusData } from "@/data/syllabus";
import {
    FileText,
    Video,
    ExternalLink,
    Search,
    Filter,
    Download,
    Share2,
    FolderOpen
} from "lucide-react";

export default function ContentBankPage() {
    // Extract resource bank module
    const resourceModule = syllabusData.find(m => m.type === 'resource' || m.id === 'resource-bank');

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
    };

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 lg:p-12 max-w-7xl mx-auto"
        >
            <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 text-[#00B6C1] font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
                        <FolderOpen size={16} />
                        <span>Asset Library</span>
                    </div>
                    <h1 className="text-5xl font-serif text-[#0E5858] mb-4">Clinical Content Bank</h1>
                    <p className="text-xl text-gray-500">
                        Access patient counseling manuals, clinical video protocols, and essential mentor resources.
                    </p>
                </div>

                <div className="w-full md:w-auto flex items-center gap-4">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00B6C1]/20 transition-all font-medium"
                        />
                    </div>
                    <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-[#0E5858] transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            {resourceModule ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resourceModule.topics.map((resource, index) => (
                        <motion.div
                            key={resource.code}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="premium-card p-8 flex flex-col h-full bg-white group"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 bg-[#FAFCEE] rounded-2xl flex items-center justify-center text-[#00B6C1] group-hover:bg-[#00B6C1] group-hover:text-white transition-all">
                                    {resource.title.toLowerCase().includes('video') ? <Video size={24} /> : <FileText size={24} />}
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-[#0E5858] transition-colors"><Share2 size={16} /></button>
                                    <button className="p-2 text-gray-400 hover:text-[#0E5858] transition-colors"><Download size={16} /></button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#0E5858] mb-4 group-hover:text-[#00B6C1] transition-colors tracking-tight">
                                    {resource.title}
                                </h3>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                                    {resource.content || "Clinical documentation and protocols for patient management and counselling excelence."}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{resource.code}</span>
                                {resource.links && resource.links[0] && (
                                    <a
                                        href={resource.links[0].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00B6C1] font-bold text-sm flex items-center gap-2 hover:underline"
                                    >
                                        Access Now
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="premium-card p-20 text-center flex flex-col items-center border-dashed border-2">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                        <FolderOpen size={32} />
                    </div>
                    <h2 className="text-2xl font-serif text-[#0E5858] mb-2">Vault is being populated</h2>
                    <p className="text-gray-400 max-w-sm">We are currently migrating all clinical manuals and video protocols to this bank.</p>
                </div>
            )}
        </motion.main>
    );
}
