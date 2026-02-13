"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, CheckCircle2, XCircle, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

export default function AIAssessment({ topicTitle, topicContent, topicCode }: { topicTitle: string, topicContent: string, topicCode: string }) {
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);

    const generateTest = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/generate-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicTitle, topicContent }),
            });
            const data = await response.json();
            setQuestions(data);
            setCurrentStep(0);
            setAnswers([]);
            setShowResult(false);
        } catch (error) {
            console.error("Error generating test:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (option: string) => {
        const newAnswers = [...answers, option];
        setAnswers(newAnswers);

        if (currentStep < (questions?.length || 0) - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Save to Supabase
            const finalScore = newAnswers.reduce((acc, curr, idx) => {
                return curr === questions![idx].correctAnswer ? acc + 1 : acc;
            }, 0);

            const { data: { session } } = await supabase.auth.getSession();
            if (session && questions) {
                await supabase.from('assessment_logs').insert([{
                    user_id: session.user.id,
                    topic_code: topicCode,
                    score: finalScore,
                    total_questions: questions.length,
                    raw_data: { questions, answers: newAnswers }
                }]);
            }
            setShowResult(true);
        }
    };

    const getScore = () => {
        if (!questions) return 0;
        return answers.reduce((acc, curr, idx) => {
            return curr === questions[idx].correctAnswer ? acc + 1 : acc;
        }, 0);
    };

    return (
        <div className="w-full">
            {!questions && !loading && (
                <button
                    onClick={generateTest}
                    className="group flex items-center gap-3 px-6 py-3 bg-[#FAFCEE] border border-[#00B6C1]/20 text-[#0E5858] rounded-2xl text-xs font-bold hover:bg-[#00B6C1] hover:text-white transition-all shadow-sm"
                >
                    <Brain size={16} className="text-[#00B6C1] group-hover:text-white transition-colors" />
                    Generate AI Knowledge Check
                    <Sparkles size={14} className="animate-pulse" />
                </button>
            )}

            {loading && (
                <div className="flex items-center gap-4 p-6 bg-[#FAFCEE] rounded-3xl border border-[#00B6C1]/10">
                    <Loader2 className="animate-spin text-[#00B6C1]" size={24} />
                    <p className="text-sm font-bold text-[#0E5858]/60 uppercase tracking-widest">Groq Llama 3.3 is crafting your assessment...</p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {questions && !showResult && (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-8 bg-white rounded-3xl shadow-xl border border-[#00B6C1]/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Brain size={80} />
                        </div>

                        <div className="mb-6 flex items-center justify-between">
                            <span className="badge-teal">Question {currentStep + 1} of {questions.length}</span>
                            <div className="flex gap-1">
                                {questions.map((_, i) => (
                                    <div key={i} className={`w-8 h-1 rounded-full ${i <= currentStep ? 'bg-[#00B6C1]' : 'bg-gray-100'}`}></div>
                                ))}
                            </div>
                        </div>

                        <h4 className="text-xl font-serif text-[#0E5858] mb-8 leading-tight">{questions[currentStep].question}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {questions[currentStep].options.map((option, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(option)}
                                    className="p-4 text-left bg-[#FAFCEE]/50 border border-[#0E5858]/5 rounded-2xl hover:border-[#00B6C1] hover:bg-white transition-all text-sm font-medium group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-[#0E5858]/5 flex items-center justify-center text-[10px] font-bold text-[#00B6C1] group-hover:bg-[#00B6C1] group-hover:text-white transition-all">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        {option}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {showResult && questions && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 bg-[#FAFCEE] rounded-3xl border-2 border-[#00B6C1]/20 text-center"
                    >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-[#00B6C1]/10">
                            <Sparkles size={32} className="text-[#00B6C1]" />
                        </div>
                        <h3 className="text-2xl font-serif text-[#0E5858] mb-2">Internal Assessment Complete</h3>
                        <p className="text-sm font-bold text-[#0E5858]/40 mb-8 uppercase tracking-widest">AI analysis of your knowledge depth</p>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#0E5858]/5">
                                <p className="text-3xl font-serif text-[#0E5858]">{getScore()}/{questions.length}</p>
                                <p className="text-[10px] font-bold text-[#00B6C1] uppercase tracking-widest">Score</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#0E5858]/5">
                                <p className="text-3xl font-serif text-[#0E5858]">{Math.round((getScore() / questions.length) * 100)}%</p>
                                <p className="text-[10px] font-bold text-[#00B6C1] uppercase tracking-widest">Accuracy</p>
                            </div>
                        </div>

                        <button
                            onClick={generateTest}
                            className="px-8 py-3 bg-[#0E5858] text-white rounded-2xl font-bold hover:bg-[#00B6C1] transition-all flex items-center gap-2 mx-auto"
                        >
                            Retake Assessment
                            <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
