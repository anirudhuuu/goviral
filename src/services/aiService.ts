import { AIResponse } from "@/types";

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
  }

  private createSystemPrompt(
    transcript: string,
    streamTopic: string
  ): string {
    return `
      You are simulating authentic live stream viewers for: "${streamTopic}".
      
      Speaker just said: "${transcript}"
      
      Generate 2-4 diverse, realistic viewer comments with 1 matching reaction.
      
      Guidelines:
      1. **Diversity:** Mix question-askers, supporters, critics, jokers. Vary tone & style.
      2. **Language:** Natural English/Hindi/Hinglish mix. Use slang, abbreviations, emojis.
      3. **Authenticity:** Reference specific words/moments. Show genuine reactions.
      4. **Variety:** Different personalities - enthusiastic, skeptical, curious, funny.
      5. **Relevance:** Comments MUST relate to what was just said.
      
      Output JSON:
      {
        "comments": [
          { "user": "string (varied names)", "text": "string (10-30 words max)" }
        ],
        "dominantReaction": "love" | "laugh" | "fire" | "clap" | "shock" | "sad" | "party"
      }
    `;
  }

  async generateResponse(
    transcript: string,
    contextHistory: string,
    streamTopic: string
  ): Promise<AIResponse | null> {
    const url = `${this.baseUrl}?key=${this.apiKey}`;
    const systemPrompt = this.createSystemPrompt(transcript, streamTopic);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      return JSON.parse(text) as AIResponse;
    } catch (error) {
      console.error("AI Generation failed:", error);
      return null;
    }
  }
}

export const aiService = new AIService();

