
import { GoogleGenAI, Type } from "@google/genai";
import { Strategy } from "../types";

/**
 * Sovereign Syntax Engine Configuration
 * Using Gemini 3 Pro for complex reasoning and architectural drafting.
 * Using Gemini 3 Pro Image for high-fidelity visual branding synthesis.
 */
const RESEARCH_MODEL = "gemini-3-pro-preview";
const IMAGE_MODEL = "gemini-3-pro-image-preview";

export const geminiService = {
  /**
   * Drafts 10 architectural prompting strategies based on the user's task.
   */
  async draftStrategies(task: string): Promise<Strategy[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: RESEARCH_MODEL,
        contents: `Draft 10 architectural prompting strategies for: "${task}".
        Group each by category: 'Logic', 'Narrative', 'Structure', 'Constraint', or 'Persona'.`,
        config: {
          thinkingConfig: { thinkingBudget: 16384 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Professional name of the strategy" },
                description: { type: Type.STRING, description: "Detailed implementation guide" },
                category: { type: Type.STRING, enum: ['Logic', 'Narrative', 'Structure', 'Constraint', 'Persona'] },
              },
              required: ["name", "description", "category"]
            }
          },
          systemInstruction: "You are the Architect of Intelligence. Refine task objectives into distinct, categorized reasoning strategies."
        },
      });

      const data = JSON.parse(response.text || "[]");
      return data.map((item: any, index: number) => ({
        ...item,
        id: `strat-${index}-${Date.now()}`
      }));
    } catch (error) {
      console.error("Architectural Drafting Failure:", error);
      throw new Error("The drafting engine failed to initialize strategies. Please verify network connectivity and API quota.");
    }
  },

  /**
   * Generates a comprehensive GitHub-ready README artifact.
   */
  async generateFinalPrompt(
    task: string, 
    selectedStrategies: Strategy[], 
    repoName: string = "Sovereign Artifact", 
    repoDesc: string = ""
  ): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const strategiesStr = selectedStrategies.map(s => `[${s.category}] ${s.name}: ${s.description}`).join("\n");
    
    try {
      const response = await ai.models.generateContent({
        model: RESEARCH_MODEL,
        contents: `Construct the final high-fidelity GitHub README for the project: "${repoName}".
        
        Contextual Information:
        - Project Description: ${repoDesc}
        - Primary Objective: ${task}
        
        Mandatory Structure:
        1. Use professional README.md formatting.
        2. Create a clear '# High-Fidelity Prompt' section containing the actual finalized instruction.
        3. Create an '## Architectural Breakdown' section explaining these applied strategies:
        ${strategiesStr}
        4. Include a '## Operational Parameters' section for execution guidance.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are the Lead Architect. Output only the README content. Demarcate the Prompt in a prominent code block. Avoid conversational filler."
        }
      });

      return response.text || "";
    } catch (error) {
      console.error("Artifact Synthesis Failure:", error);
      throw new Error("Artifact synthesis was interrupted. Ensure the selected strategies do not exceed logical complexity limits.");
    }
  },

  /**
   * Generates a custom visual identity/icon for the prompt task.
   */
  async generateAppIcon(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        },
      });

      const candidates = response.candidates || [];
      for (const candidate of candidates) {
        const parts = candidate.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("No visual payload received. Image generation may have been filtered.");
    } catch (error) {
      console.error("Visual Materialization Failure:", error);
      throw error; // Let caller handle re-selection of API Key if needed
    }
  }
};
