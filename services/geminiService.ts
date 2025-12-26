
import { GoogleGenAI, Type } from "@google/genai";
import { Strategy, Attachment } from "../types";

/**
 * The Prompt Architect: Sovereign Syntax Engine
 * Adheres to the Zero-Failure Protocol for absolute code integrity.
 */
const RESEARCH_MODEL = "gemini-3-pro-preview";
const IMAGE_MODEL = "gemini-3-pro-image-preview";

export const geminiService = {
  /**
   * Drafts architectural prompting strategies using the Zero-Failure Protocol.
   * Includes analysis of provided reference materials.
   */
  async draftStrategies(task: string, attachments: Attachment[] = []): Promise<Strategy[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare multi-part content for Gemini 3 Pro
    const parts: any[] = [
      { text: `Execute Phase 1: Structural & Multimodal Analysis.
        Objective: "${task}"
        Draft 10 architectural prompting strategies grouped by: 'Logic', 'Narrative', 'Structure', 'Constraint', or 'Persona'.
        If reference materials (images/files) are attached, analyze them for specific technical requirements or UI constraints.
        Each strategy must serve a specific justification in the final user story.` }
    ];

    // Add attachments as inline data
    attachments.forEach(att => {
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.data
        }
      });
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
                name: { type: Type.STRING, description: "Professional name of the strategy" },
                description: { type: Type.STRING, description: "Detailed implementation guide using the Zero-Failure Protocol" },
                category: { type: Type.STRING, enum: ['Logic', 'Narrative', 'Structure', 'Constraint', 'Persona'] },
              },
              required: ["name", "description", "category"]
            }
          },
          systemInstruction: "You are the Lead Architect and Ruthless QA Engineer. Your objective is absolute code integrity. Analyze all provided text and reference materials (images/files) to draft a robust prompt architecture."
        },
      });

      const data = JSON.parse(response.text || "[]");
      return data.map((item: any, index: number) => ({
        ...item,
        id: `strat-${index}-${Date.now()}`
      }));
    } catch (error) {
      console.error("Architectural Drafting Failure:", error);
      throw new Error("Research engine connection failure. The Lead Architect is currently unavailable.");
    }
  },

  /**
   * Generates a high-fidelity README artifact using the Zero-Failure Protocol.
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
        contents: `Construct the final high-fidelity Zero-Failure Artifact for: "${repoName}".
        
        Objective: ${task}
        Context: ${repoDesc}
        Applied Strategies:
        ${strategiesStr}
        
        Requirements:
        - Strict Markdown formatting.
        - High-fidelity # High-Fidelity Prompt section.
        - Detailed Architectural Breakdown.
        - Operational Parameters for cross-environment execution.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are the Lead Architect. Synthesize the artifact following the Zero-Failure Protocol. Ensure the final prompt is robust, covers edge cases, and provides absolute code integrity."
        }
      });

      return response.text || "";
    } catch (error) {
      console.error("Artifact Synthesis Failure:", error);
      throw new Error("Synthesis protocol interrupted. Logic density exceeded safe parameters.");
    }
  },

  /**
   * Generates a custom visual identity/icon.
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

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No visual payload received.");
    } catch (error) {
      console.error("Visual Materialization Failure:", error);
      throw error;
    }
  }
};
