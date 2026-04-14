import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazily initialised so the module can be imported without a key set
let _client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!_client) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set in .env");
    _client = new GoogleGenerativeAI(key);
  }
  return _client;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Send a prompt to Gemini and return the text response.
 * All group-specific functions should call this.
 */
export async function generate(prompt: string): Promise<string> {
  const model = getClient().getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ─── Group A stub ─────────────────────────────────────────────────────────────
// TODO (Group A): implement your AI feature here
export async function groupAFeature(input: string): Promise<string> {
  throw new Error("Not implemented — Group A owns this function");
}

// ─── Group B stub ─────────────────────────────────────────────────────────────
// TODO (Group B): implement your AI feature here
export async function groupBFeature(input: string): Promise<string> {
  throw new Error("Not implemented — Group B owns this function");
}

// ─── Group C stub ─────────────────────────────────────────────────────────────
// TODO (Group C): implement your AI feature here
export async function groupCFeature(input: string): Promise<string> {
  throw new Error("Not implemented — Group C owns this function");
}
