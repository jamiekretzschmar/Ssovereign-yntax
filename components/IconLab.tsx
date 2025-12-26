
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService.ts';

export const IconLab: React.FC = () => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState('Blueprint');
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setIsLoading(true);
    setProgress(10);
    const interval = setInterval(() => setProgress(p => Math.min(p + 5, 90)), 200);
    try {
      const url = await geminiService.generateAppIcon("Sovereign Syntax AI Workspace App Icon", style);
      setIconUrl(url);
      setProgress(100);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-left">
        <h2 className="text-4xl font-bold text-forest dark:text-parchment tracking-tight font-serif">Brand Identity</h2>
        <p className="text-blueprint/60 dark:text-accent/60 text-lg font-sketch">Materializing the visual vessel for your architectural engine.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="bg-white/50 dark:bg-blueprint/5 border-2 border-blueprint/10 rounded-2xl p-8 space-y-6 sketch-shadow text-left">
            <h3 className="text-[11px] font-sketch font-black text-blueprint uppercase tracking-[0.3em]">Architectural Style</h3>
            <div className="flex gap-4">
              {['Blueprint', 'Wireframe', 'Digital Render'].map(s => (
                <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 sketch-border text-[10px] font-black uppercase transition-all ${style === s ? 'bg-blueprint text-white' : 'bg-white text-blueprint'}`}>{s}</button>
              ))}
            </div>
            <p className="text-sm text-blueprint/70 italic font-sketch">"Utilizing {style} perspectives to synthesize the brand vessel."</p>
          </div>

          <button onClick={handleGenerate} disabled={isLoading} className={`w-full py-5 sketch-border font-sketch font-bold text-lg transition-all ${isLoading ? 'opacity-30' : 'bg-blueprint text-white'}`}>
            {isLoading ? `SYNTHESIZING (${progress}%)...` : 'MATERIALIZE BRAND ICON'}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 bg-onyx rounded-[3rem] shadow-2xl flex items-center justify-center border-4 border-white/5 overflow-hidden">
            {iconUrl ? (
              <img src={iconUrl} alt="App Icon" className="w-full h-full object-cover animate-in zoom-in-50" />
            ) : (
              <div className="text-[10px] font-sketch font-bold text-blueprint/30 uppercase">Vault Empty</div>
            )}
          </div>
          {isLoading && (
            <div className="mt-4 w-64 h-1 bg-blueprint/10 rounded-full overflow-hidden">
              <div className="h-full bg-teal transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
