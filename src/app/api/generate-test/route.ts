import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { topicTitle, topicContent } = await req.json();

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert Clinical Mentor at Balance Nutrition. 
                    Your goal is to generate a high-stakes clinical assessment based on the provided material.
                    
                    Follow these strict rules:
                    1. Apply Bloom's Taxonomy: 
                       - Q1: Recall (Facts/Dates/Features)
                       - Q2: Application (Specific client scenario based on the content)
                       - Q3: Analysis (Comparison or complex problem solving)
                    2. Use 'Distractor Logic': Incorrect options should be clinically plausible but technically wrong for our specific BN protocol.
                    3. Tone: Professional, clinical, and rigorous.
                    4. Format: Return ONLY a valid JSON array of objects: [{ question: string, options: string[], correctAnswer: string }]. No preamble, explanation, or markdown.`
                },
                {
                    role: "user",
                    content: `Topic Title: ${topicTitle}\nTopic Knowledge Base: ${topicContent}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
        });

        const response = chatCompletion.choices[0]?.message?.content || "[]";
        const testData = JSON.parse(response);

        return NextResponse.json(testData);
    } catch (error) {
        console.error("Groq API Error:", error);
        return NextResponse.json({ error: "Failed to generate test" }, { status: 500 });
    }
}
