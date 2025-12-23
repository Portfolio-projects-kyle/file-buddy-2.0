import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import pdf from 'pdf-parse-fork';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  let responseData: any = null;
  let responseStatus = 200;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const question = formData.get('question') as string;

    if (!file) {
      responseData = { error: "No file uploaded" };
      responseStatus = 400;
      return;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.type === 'application/pdf') {
      const data = await pdf(buffer);
      text = data.text;
    } else if (file.type.includes('word') || file.type.includes('officedocument')) {
      const data = await mammoth.extractRawText({ buffer });
      text = data.value;
    } else {
      text = buffer.toString('utf-8');
    }

    const cleanText = text.replace(/\s+/g, ' ').trim();

    // Updated to Gemini 2.5 Flash
    // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); -- 20 limits per day only
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }); // -- 1500 limits per day

    const prompt = `
      Context from the document:
      ---
      ${cleanText}
      ---
      Question: ${question}
      
      Instructions: Answer based ONLY on the provided context. If the answer is not there, say "I couldn't find that in the file."
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    responseData = { answer: response.text() };

  } catch (error: any) {
    console.error("API Route Error:", error.message);
    // If 2.0 is not available in your region yet, it will throw a 404
    responseData = { error: error.message };
    responseStatus = 500;
  } finally {
    return NextResponse.json(responseData, { status: responseStatus });
  }
}