
import React, { useState, useMemo } from 'react';

interface ResultPhaseProps {
  finalPrompt: string;
  thoughtTrace: string;
  onReset: () => void;
  onDeploy: () => void;
  onFeedback: (rating: number, comments: string) => void;
  feedbackSubmitted: boolean;
  isLoading?: boolean;
}

const GitCommandSuite: React.FC<{ repoName: string }> = ({ repoName }) => {
  const safeName = repoName.toLowerCase().replace(/\s+/g, '-');
  const code = `mkdir ${safeName}\ncd ${safeName}\ngit init\necho "# ${repoName}" > README.md\ngit add .\ngit commit -m "Initialize Sovereign Artifact: origin/production"\ngit branch -M main`;
  return (
    <div className="mt-8 space-y-4 text-left">
      <h4 className="text-[10px] font-black text-blueprint/40 uppercase tracking-[0.3em]">GitHub Repo Command Suite</h4>
      <pre className="bg-onyx p-6 rounded-xl font-mono text-[11px] text-teal/80 sketch-border border-teal/20 overflow-x-auto relative group">
        <code>{code}</code>
        <button onClick={() => navigator.clipboard.writeText(code)} className="absolute top-4 right-4 text-teal opacity-0 group-hover:opacity-100 transition-opacity">COPY</button>
      </pre>
    </div>
  );
};

export const ResultPhase: React.FC<ResultPhaseProps> = ({ finalPrompt, thoughtTrace, onReset, onDeploy, isLoading }) => {
  const [showTrace, setShowTrace] = useState(false);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-4xl font-bold text-forest dark:text-parchment tracking-tight font-serif">Synthesized Artifact</h2>
          <p className="text-teal font-medium opacity-80 uppercase text-[10px] tracking-widest mt-2">Zero-Failure Protocol Complete</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowTrace(!showTrace)} className="px-5 py-3 sketch-border text-[10px] font-black uppercase tracking-widest transition-all bg-white dark:bg-blueprint/10 text-blueprint">
            {showTrace ? 'Hide Trace' : 'Show Trace'}
          </button>
          <button onClick={onDeploy} disabled={isLoading} className={`px-5 py-3 bg-teal text-white sketch-border text-[10px] font-black uppercase tracking-widest ${isLoading ? 'opacity-30' : ''}`}>
            {isLoading ? 'Synthesizing Code...' : 'Deploy To Python'}
          </button>
        </div>
      </div>

      {showTrace && (
        <div className="bg-blueprint/5 p-8 sketch-border border-dashed animate-in slide-in-from-top-4 text-left">
          <h4 className="text-[10px] font-black text-blueprint uppercase tracking-[0.3em] mb-4">Architect's Thought Trace</h4>
          <p className="font-sketch text-blueprint/70 leading-relaxed italic">{thoughtTrace}</p>
        </div>
      )}

      <div className="relative group text-left">
        <div className="absolute -inset-1 bg-teal/10 rounded-2xl blur opacity-10"></div>
        <div className="relative bg-white dark:bg-moss/10 border-2 border-teal/10 rounded-2xl p-10 shadow-sm font-sans whitespace-pre-wrap leading-relaxed">
          {finalPrompt}
        </div>
      </div>

      <GitCommandSuite repoName="Sovereign Workspace" />

      <button onClick={onReset} className="text-blueprint/40 hover:text-blueprint text-[10px] font-black uppercase tracking-[0.4em] transition-all">Architect New Objective &rarr;</button>
    </div>
  );
};
