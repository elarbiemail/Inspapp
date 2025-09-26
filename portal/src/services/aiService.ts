import { GoogleGenerativeAI } from "@google/genai";

export type Provider = 'gemini';

export interface GenerateReportParams {
  prompt: string;
  apiKey?: string;
}

export const aiService = {
  async generateText({ prompt, apiKey }: GenerateReportParams): Promise<string> {
    const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error('Gemini API key missing. Set VITE_GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const res = await model.generateContent(prompt);
    return res.response.text();
  }
};
