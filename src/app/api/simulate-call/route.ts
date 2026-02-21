import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { messages, topicTitle, topicContent } = await req.json();

        const systemPrompt = `You are a potential client calling Balance Nutrition. 
        You are inquiring about the topic: "${topicTitle}".
        Your personality: Slightly skeptical but curious. You have some health issues related to this topic.
        
        Knowledge Base for this conversation:
        ${topicContent}
        
        Your Goal:
        1. Challenge the counsellor to explain the BN protocol clearly.
        2. Ask about pricing, features, or USPs specifically mentioned in the knowledge base.
        3. If the counsellor explains well, become more interested.
        4. Keep your responses short and natural—like a real person on a call.
        
        IMPORTANT: STAY IN CHARACTER. Do not reveal you are an AI. Do not provide information not consistent with being a client.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
        });

        const response = chatCompletion.choices[0]?.message?.content || "I'm not sure what to say.";
        return NextResponse.json({ content: response });
    } catch (error) {
        console.error("Simulation API Error:", error);
        return NextResponse.json({ error: "Failed to simulate call" }, { status: 500 });
    }
}
