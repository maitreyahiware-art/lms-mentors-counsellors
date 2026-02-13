"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Send, User, Bot, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ClinicalSimulator({ topicTitle, topicContent, topicCode }: { topicTitle: string, topicContent: string, topicCode: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const startSimulation = () => {
        setIsOpen(true);
        if (messages.length === 0) {
            const initialMessage = "Hello, I was looking at Balance Nutrition. Can you tell me more about " + topicTitle + "?";
            setMessages([{ role: 'assistant', content: initialMessage }]);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user' as const, content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/simulate-call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages,
                    topicTitle,
                    topicContent
                }),
            });
            const data = await response.json();
            const finalMessages = [...newMessages, { role: 'assistant' as const, content: data.content }];
            setMessages(finalMessages);

            // Save to Supabase for Founder Review
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await supabase.from('simulation_logs').insert([{
                    user_id: session.user.id,
                    topic_code: topicCode,
                    chat_history: finalMessages
                }]);
            }
        } catch (error) {
            console.error("Simulation error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={startSimulation}
                className="flex items-center gap-3 px-6 py-3 bg-[#0E5858] text-white rounded-2xl text-xs font-bold hover:bg-[#00B6C1] transition-all shadow-lg hover:scale-105 active:scale-95"
            >
                <Phone size={16} className="animate-pulse" />
                Practice Simulated Client Call
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-8 right-8 w-full max-w-[400px] h-[600px] premium-card flex flex-col z-[100] border-2 border-[#00B6C1]/30 overflow-hidden shadow-4xl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-[#0E5858] text-white flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00B6C1] flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-serif">Simulated Client</span>
                                    <span className="text-[10px] font-bold text-[#00B6C1] uppercase tracking-widest">Live Practise Mode</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFCEE]/50">
                            <div className="flex justify-center mb-4">
                                <div className="px-4 py-1.5 bg-white/50 border border-[#0E5858]/10 rounded-full text-[10px] uppercase font-bold text-[#0E5858]/40 tracking-widest flex items-center gap-2">
                                    <Sparkles size={10} />
                                    AI Simulation Session Active
                                </div>
                            </div>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-[#0E5858] text-white rounded-br-none'
                                        : 'bg-white text-[#0E5858] border border-[#0E5858]/5 rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-[#0E5858]/5 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-[#00B6C1]" />
                                        <span className="text-xs font-medium text-gray-400">Client is typing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 bg-white border-t border-[#0E5858]/5 flex items-center gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Pitch your response..."
                                className="flex-1 bg-[#FAFCEE] border border-[#0E5858]/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B6C1]/20 focus:border-[#00B6C1] transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-12 h-12 bg-[#0E5858] text-white rounded-xl flex items-center justify-center hover:bg-[#00B6C1] transition-all disabled:opacity-50"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
