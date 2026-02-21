import { NextResponse } from 'next/server';
import { groq } from '@/lib/groq';

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
                    1. **Generate EXACTLY 5 Multiple Choice Questions (MCQs)**.
                    2. Apply Bloom's Taxonomy: 
                       - Q1-Q2: Recall (Facts/Dates/Features)
                       - Q3-Q4: Application (Specific client scenario based on the content)
                       - Q5: Analysis (Comparison or complex problem solving)
                    3. Use 'Distractor Logic': Incorrect options should be clinically plausible but technically wrong for our specific BN protocol.
                    4. Tone: Professional, clinical, and rigorous.
                    5. Format: Return ONLY a valid JSON array of objects: [{ question: string, options: string[], correctAnswer: string }]. No preamble, explanation, or markdown.`
                },
                {
                    role: "user",
                    content: `Topic Title: ${topicTitle}\nTopic Knowledge Base: ${topicContent}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
        });

        const responseContent = chatCompletion.choices[0]?.message?.content || "[]";
        // Clean up markdown if present (e.g. ```json ... ```)
        const jsonContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();

        let testData;
        try {
            testData = JSON.parse(jsonContent);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            testData = [];
        }

        return NextResponse.json(testData);
    } catch (error) {
        console.error("Groq API Error:", error);
        return NextResponse.json({ error: "Failed to generate test" }, { status: 500 });
    }
}
