import Groq from "groq-sdk";

const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

export const groq = new Groq({ apiKey: groqApiKey });
