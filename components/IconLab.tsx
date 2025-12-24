
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

export const IconLab: React.FC = () => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ICON_PROMPT = `Design a professional and artistic mobile app icon for an Android application.
    App Name: Sovereign Syntax
    App Description: A sophisticated AI-powered workspace designed to help you engineer perfect, high-performance prompts using professional architectural strategies.
    Visual Style: Hand Drawn Sketch
    Color Palette: #314d61
    Detail Level: high
    CREATIVE REIMAGINING MODE: Break away from standard interpretations. Provide a completely fresh and novel visual composition of this concept while strictly adhering to the style and color palette. Avoid repeating common tropes; surprise the user with a unique layout or perspective.
    CRITICAL DESIGN CONSTRAINTS: EXTREME HIGH CONTRAST. ACCESSIBILITY & READABILITY. 1:1 Aspect Ratio.`;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const aistudio = (window as any).aistudio;
      const hasKey = await aistudio.hasSelectedApiKey();
      
      if (!hasKey) {
        // Trigger selection and proceed (Assume Success Pattern)
        await aistudio.openSelectKey();
      }

      const url = await geminiService.generateAppIcon(ICON_PROMPT);
      setIconUrl(url);
    } catch (err: any) {
      console.error(err);
      const aistudio = (window as any).aistudio;
      
      // If request fails with entity not found, it's usually an invalid/missing key selection
      if (err.message?.includes("entity was not found") || err.message?.includes("API_KEY")) {
        setError("API Key verification failed. Please select a valid paid project key.");
        await aistudio.openSelectKey();
      } else {
        setError("Visual materialization failed. Ensure billing is enabled on your selected project.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3">
        <h2 className="text-4xl font-bold text-forest dark:text-parchment tracking-tight font-serif">Branding Identity</h2>
        <p className="text-blueprint/60 dark:text-accent/60 text-lg font-sketch">Materializing the visual vessel for your architectural engine.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="bg-white/50 dark:bg-blueprint/5 border-2 border-blueprint/10 rounded-2xl p-8 space-y-6 sketch-shadow">
            <h3 className="text-[11px] font-sketch font-black text-blueprint uppercase tracking-[0.3em]">Blueprint Parameters</h3>
            <div className="space-y-4 font-mono text-[11px] text-blueprint/70">
              <div className="flex justify-between border-b border-blueprint/5 pb-2">
                <span>STYLE</span>
                <span className="text-blueprint font-black uppercase">Sketch</span>
              </div>
              <div className="flex justify-between border-b border-blueprint/5 pb-2">
                <span>PALETTE</span>
                <span className="text-blueprint font-black uppercase">#314D61</span>
              </div>
              <div className="flex justify-between">
                <span>TARGET</span>
                <span className="text-blueprint font-black uppercase">Production</span>
              </div>
            </div>
            
            <p className="text-sm text-blueprint/70 dark:text-accent/60 italic leading-relaxed font-sketch">
              "A reimagined visual composition utilizing novel perspectives to avoid standard prompt-engineering tropes."
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-5 sketch-border font-sketch font-bold text-lg transition-all flex items-center justify-center gap-4 shadow-xl ${
                isLoading 
                ? 'bg-blueprint/10 text-blueprint/40 cursor-not-allowed' 
                : 'bg-blueprint text-white hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  DRAFTING...
                </>
              ) : (
                'SYNTHESIZE BRAND ICON'
              )}
            </button>
            <p className="text-[10px] text-center text-blueprint/40 uppercase tracking-widest font-sketch">
              Requires Paid API Key Selection via <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-blueprint transition-colors">GCP Billing</a>
            </p>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-xs font-medium rounded-lg animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="relative group">
            <div className="absolute -inset-8 bg-blueprint/5 rounded-[4rem] blur-3xl opacity-50"></div>
            <div className="relative w-64 h-64 bg-onyx rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] flex items-center justify-center border-4 border-white/5 overflow-hidden">
              {iconUrl ? (
                <img src={iconUrl} alt="App Icon" className="w-full h-full object-cover transition-all duration-1000 animate-in zoom-in-50" />
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 border-2 border-dashed border-blueprint/20 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-blueprint/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-[10px] font-sketch font-bold text-blueprint/30 uppercase tracking-[0.2em]">Pending Materialization</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex items-center gap-4 px-4 py-2 bg-blueprint/5 dark:bg-parchment/5 rounded-full border border-blueprint/10">
              <svg className="w-4 h-4 text-blueprint" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.31-.639V2.453c0-.233.08-.456.309-.639zm15.176 9.471l-3.32-1.9L14.77 10.1l3.52 2.01c.42.24.42.63 0 .87l-3.52 2.01-1.305 1.305 3.32-1.9c1.07-.61 1.07-1.6 0-2.21zM13.12 11.328L2.94 1.148A1.002 1.002 0 0 1 3.3 1c.23 0 .46.06.66.18l11.41 6.52-2.25 2.628zm0 1.344l2.25 2.628-11.41 6.52a1.002 1.002 0 0 1-.66.18 1.002 1.002 0 0 1-.36-.148L13.12 12.672z"/></svg>
              <span className="text-[10px] font-black text-blueprint dark:text-accent uppercase tracking-widest font-sketch">Sovereign Artifact V1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
