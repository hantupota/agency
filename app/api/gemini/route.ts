import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ text: "API Key hilang bos." });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Instruksi Persona
    const prompt = `Jawab user ini dengan gaya singkat, padat, agency profesional tapi agak sombong. User bilang: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    return NextResponse.json({ text: "Error: Otak sedang gangguan." });
  }
}
