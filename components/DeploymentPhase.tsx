
import React, { useState, useEffect } from 'react';

interface DeploymentPhaseProps {
  code: string;
  repoName: string;
}

export const DeploymentPhase: React.FC<DeploymentPhaseProps> = ({ code: initialCode, repoName }) => {
  const [isBuilding, setIsBuilding] = useState(true);
  const [currentCode, setCurrentCode] = useState(initialCode);

  useEffect(() => {
    const timer = setTimeout(() => setIsBuilding(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  const downloadApp = () => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'app.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-left">
        <h2 className="text-5xl font-sketch font-bold text-blueprint dark:text-parchment tracking-tight">Sovereign Deployment</h2>
        <p className="text-blueprint/60 dark:text-accent/60 text-xl font-sketch">Materializing logic into production-ready Python modules.</p>
      </div>

      {isBuilding ? (
        <div className="bg-onyx p-8 sketch-border font-mono text-[10px] text-teal/80 space-y-3 shadow-2xl overflow-hidden min-h-[300px]">
          <div className="animate-pulse">BUILDING ARCHITECTURAL RUNTIME...</div>
          <div className="opacity-40">> Injecting logic gates...</div>
          <div className="opacity-40">> Synthesizing Streamlit UI...</div>
          <div className="opacity-40">> Linking GCP/Vertex AI endpoints...</div>
          <div className="animate-blink">_</div>
        </div>
      ) : (
        <div className="space-y-8 animate-in zoom-in-95 duration-700">
          <div className="flex justify-between items-center bg-blueprint/5 p-6 sketch-border">
            <h3 className="text-xl font-sketch font-black text-blueprint">App: {repoName || 'Sovereign-Artifact'}</h3>
            <div className="flex gap-4">
              <button onClick={() => navigator.clipboard.writeText(currentCode)} className="px-6 py-3 sketch-border bg-white text-blueprint font-sketch font-black text-xs uppercase">Copy</button>
              <button onClick={downloadApp} className="px-6 py-3 sketch-border bg-blueprint text-white font-sketch font-black text-xs uppercase">Download app.py</button>
            </div>
          </div>

          <div className="relative group text-left">
            <div className="absolute -inset-1 bg-teal/20 rounded-2xl blur opacity-10"></div>
            <textarea 
              className="relative w-full bg-onyx p-8 rounded-2xl shadow-2xl border-2 border-white/5 font-mono text-[13px] leading-relaxed text-parchment/80 min-h-[500px] outline-none focus:border-teal/30 transition-all resize-none"
              value={currentCode}
              onChange={e => setCurrentCode(e.target.value)}
              spellCheck={false}
            />
            <div className="absolute top-4 right-8 text-[10px] font-black text-teal/40 uppercase tracking-widest">Architectural Override Enabled</div>
          </div>

          <div className="bg-blueprint/5 p-8 sketch-border grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blueprint/40 uppercase">1. Prepare Environment</span>
                <div className="bg-onyx p-3 rounded font-mono text-[10px] text-teal/80">pip install streamlit google-generativeai</div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blueprint/40 uppercase">2. Launch Artifact</span>
                <div className="bg-onyx p-3 rounded font-mono text-[10px] text-teal/80">streamlit run app.py</div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
