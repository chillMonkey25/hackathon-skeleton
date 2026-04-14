// ─── AI helper — optional ─────────────────────────────────────────────────────
// Only used if your project needs AI. If not, delete this file and remove
// @google/generative-ai from package.json.
//
// Supported models (swap in generateContent calls):
//   gemini-1.5-flash   — fast, free tier, good for most tasks
//   gemini-1.5-pro     — slower, smarter, better for complex reasoning
//
// To use a different provider (OpenAI, Anthropic, etc.) replace this file
// entirely — nothing else in the skeleton imports from here.

import { GoogleGenerativeAI } from "@google/generative-ai";

let _client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!_client) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set in .env");
    _client = new GoogleGenerativeAI(key);
  }
  return _client;
}

/**
 * Send a plain text prompt and get a plain text response back.
 * Use this for simple generation tasks.
 */
export async function generate(prompt: string): Promise<string> {
  const model = getClient().getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Send a prompt and parse the response as JSON.
 * Use this when you need structured output.
 * Wrap your prompt with: "Respond only with valid JSON. No explanation. Schema: ..."
 */
export async function generateJSON<T>(prompt: string): Promise<T> {
  const raw = await generate(prompt);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

// ─── Group stubs — Claude fills these in once the prompt is known ─────────────
// Each group that needs AI gets one function here.
// Claude will rename and implement these based on the hackathon prompt.

export async function groupAI(input: string): Promise<string> {
  throw new Error("Not implemented — fill in once prompt is known");
}
