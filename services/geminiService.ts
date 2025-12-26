
import { GoogleGenAI, Type } from "@google/genai";
import { Strategy, Attachment } from "../types.ts";

const RESEARCH_MODEL = "gemini-3-pro-preview";
const IMAGE_MODEL = "gemini-3-pro-image-preview";

export const geminiService = {
  async draftStrategies(task: string, attachments: Attachment[] = []): Promise<Strategy[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [
      { text: `Execute Phase 1: Structural Analysis.
        Objective: "${task}"
        Draft 10 strategies across categories: 'Logic', 'Narrative', 'Structure', 'Constraint', or 'Persona'.
        Provide a 'relevance' score (0-100) for each based on the core objective.` }
    ];

    attachments.forEach(att => {
      parts.push({ inlineData: { mimeType: att.mimeType, data: att.data } });
    });

    try {
      const response = await ai.models.generateContent({
        model: RESEARCH_MODEL,
        contents: { parts },
        config: {
          thinkingConfig: { thinkingBudget: 16384 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['Logic', 'Narrative', 'Structure', 'Constraint', 'Persona'] },
                relevance: { type: Type.INTEGER }
              },
              required: ["name", "description", "category", "relevance"]
            }
          }
        },
      });

      const data = JSON.parse(response.text || "[]");
      return data.map((item: any, index: number) => ({
        ...item,
        id: `strat-${index}-${Date.now()}`
      }));
    } catch (error) {
      throw new Error("Research engine connection failure.");
    }
  },

  async generateFinalPrompt(
    task: string, 
    selectedStrategies: Strategy[], 
    repoName: string = "Sovereign Artifact", 
    repoDesc: string = ""
  ): Promise<{ prompt: string; trace: string }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const strategiesStr = selectedStrategies.map(s => `[${s.category}] ${s.name}: ${s.description}`).join("\n");
    
    try {
      const response = await ai.models.generateContent({
        model: RESEARCH_MODEL,
        contents: `Construct the final Zero-Failure Artifact for: "${repoName}".
        Objective: ${task}
        Strategies: ${strategiesStr}
        Include a hidden "Architect's Thought Trace" section at the end wrapped in <!-- THOUGHT_TRACE START --> tags explaining the semantic reasoning.`,
        config: { thinkingConfig: { thinkingBudget: 32768 } }
      });

      const fullText = response.text || "";
      const traceMatch = fullText.match(/<!-- THOUGHT_TRACE START -->([\s\S]*?)<!-- THOUGHT_TRACE END -->/);
      const trace = traceMatch ? traceMatch[1].trim() : "Reasoning path synthesized via internal logic gates.";
      const prompt = fullText.replace(/<!-- THOUGHT_TRACE START -->[\s\S]*?<!-- THOUGHT_TRACE END -->/, "").trim();

      return { prompt, trace };
    } catch (error) {
      throw new Error("Synthesis protocol interrupted.");
    }
  },

  async generateDeploymentCode(task: string, finalPrompt: string, repoName: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: RESEARCH_MODEL,
        contents: `Generate a production-ready Python Streamlit app for: "${task}". 
        Logic source: ${finalPrompt}. Use clean, professional UI patterns.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are a Senior Python Developer. Output ONLY raw code. No commentary."
        }
      });
      let code = response.text || "";
      return code.replace(/```python|```/g, "").trim();
    } catch (error) {
      throw new Error("Deployment protocol failed.");
    }
  },

  async generateAppIcon(prompt: string, style: string = 'Blueprint'): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const styledPrompt = `${prompt} Architectural Style: ${style}. High contrast sketch on parchment background.`;
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: { parts: [{ text: styledPrompt }] },
        config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } },
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      throw new Error("No payload.");
    } catch (error) {
      throw error;
    }
  }
};
