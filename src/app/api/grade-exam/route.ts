import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { candidateAnswers, sections } = await req.json();

        const systemPrompt = `You are the Senior Clinical Auditor at Balance Nutrition. 
Your task is to grade a counsellor's Certification Exam. 

The exam consists of open-ended questions about BN culture, clinical protocols, operations, and sales logic.

Instructions:
1. Review the candidate's answers against Balance Nutrition's standard operating procedures.
2. Assign a total score from 0 to 100 based on accuracy, professionalism, and clinical depth.
3. Provide a detailed, constructive feedback summary addressing strengths and specific gaps.
4. Pass criteria: 70/100.
5. Tone: Professional, authoritative, yet encouraging.

Format your response ONLY as a JSON object:
{
  "totalScore": number,
  "feedback": "string (markdown allowed)"
}`;

        const userPrompt = `Exam Sections and Questions:
${JSON.stringify(sections, null, 2)}

Candidate's Answers:
${JSON.stringify(candidateAnswers, null, 2)}

Grade this exam now.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const feedback = JSON.parse(chatCompletion.choices[0].message.content || "{}");

        return NextResponse.json(feedback);
    } catch (error: any) {
        console.error("Grading API Error:", error);
        return NextResponse.json({ error: "Failed to grade exam" }, { status: 500 });
    }
}
