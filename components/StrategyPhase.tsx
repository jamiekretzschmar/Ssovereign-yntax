
import React, { useState, useEffect } from 'react';
import { Strategy } from '../types';

interface StrategyPhaseProps {
  strategies: Strategy[];
  onProceed: (selectedIds: string[]) => void;
  onSave: (selectedIds: string[], name?: string) => void;
  isLoading: boolean;
  error: string | null;
  selectedIds: string[];
  initialName?: string;
}

const ResearchTerminal: React.FC = () => {
  const messages = [
    "Exploring Tree-of-Thought branches...",
    "Validating Semantic-to-Acoustic mappings...",
    "Applying Zero-Failure logic synthesis...",
    "Simulating Adversarial Edge-Cases...",
    "Finalizing Architectural Blueprint...",
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-onyx/90 backdrop-blur-md sketch-border p-6 font-mono text-[11px] text-accent/80 space-y-3 shadow-2xl">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 bg-accent rounded-full animate-pulse"></span>
        <span className="uppercase font-sketch font-bold tracking-[0.2em] text-accent">Strategic Terminal</span>
      </div>
      <div className="overflow-hidden h-5">
        <div key={msgIdx} className="animate-in slide-in-from-bottom-2 duration-500">
          {`> ${messages[msgIdx]}`}
        </div>
      </div>
    </div>
  );
};

export const StrategyPhase: React.FC<StrategyPhaseProps> = ({ 
  strategies, onProceed, onSave, isLoading, error, selectedIds, initialName 
}) => {
  const [internalSelected, setInternalSelected] = useState<string[]>(selectedIds);
  const [blueprintName, setBlueprintName] = useState(initialName || '');

  useEffect(() => {
    setInternalSelected(selectedIds);
  }, [selectedIds]);

  const toggleStrategy = (id: string) => {
    setInternalSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-left">
        <h2 className="text-5xl font-sketch font-bold text-blueprint dark:text-parchment tracking-tight">Architecture Design</h2>
        <p className="text-blueprint/60 dark:text-accent/60 text-xl font-sketch">Select design pillars to govern the Zero-Failure artifact logic.</p>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-onyx/40 backdrop-blur-sm pointer-events-none">
          <div className="w-full max-w-sm px-8">
            <ResearchTerminal />
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {strategies.map((strategy) => (
          <div 
            key={strategy.id}
            onClick={() => toggleStrategy(strategy.id)}
            className={`group relative p-8 sketch-border transition-all cursor-pointer sketch-shadow ${
              internalSelected.includes(strategy.id)
              ? 'bg-blueprint/5 border-blueprint scale-[1.01]'
              : 'bg-white dark:bg-blueprint/10 border-blueprint/10'
            }`}
          >
            <div className="flex items-start gap-6">
              <div className={`mt-1 flex-shrink-0 w-8 h-8 sketch-border flex items-center justify-center transition-all ${
                internalSelected.includes(strategy.id) ? 'bg-blueprint text-white scale-110' : 'bg-white'
              }`}>
                {internalSelected.includes(strategy.id) && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="font-sketch text-left">
                <div className="flex items-center gap-4">
                  <h4 className="text-xl font-bold text-forest dark:text-parchment group-hover:text-blueprint transition-colors">{strategy.name}</h4>
                  <span className="text-[10px] font-black px-3 py-1 sketch-border bg-blueprint/5 text-blueprint uppercase tracking-widest">{strategy.category}</span>
                </div>
                <p className="text-blueprint/70 dark:text-accent/70 text-base mt-3 leading-relaxed font-medium">{strategy.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-10 pt-8 space-y-6 bg-parchment/90 dark:bg-forest/90 backdrop-blur-md p-8 sketch-border sketch-shadow">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Assign a vault alias (e.g. 'Project Phoenix V2')..." 
            className="w-full bg-white dark:bg-blueprint/20 sketch-border px-6 py-4 font-sketch text-lg text-forest dark:text-parchment focus:border-blueprint outline-none transition-all pr-14"
            value={blueprintName}
            onChange={(e) => setBlueprintName(e.target.value)}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-blueprint/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => onSave(internalSelected, blueprintName.trim())}
            disabled={isLoading}
            className="flex-1 py-6 sketch-border font-sketch font-black text-lg bg-white dark:bg-blueprint/20 text-blueprint hover:bg-blueprint/5 transition-all flex items-center justify-center gap-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            SAVE DRAFT
          </button>
          <button
            onClick={() => onProceed(internalSelected)}
            disabled={isLoading || internalSelected.length === 0}
            className={`flex-[2] py-6 sketch-border font-sketch font-black text-xl transition-all flex items-center justify-center gap-4 sketch-shadow ${
              isLoading || internalSelected.length === 0 
              ? 'bg-blueprint/10 text-blueprint/40 cursor-not-allowed opacity-50' 
              : 'bg-blueprint text-white hover:scale-[1.01]'
            }`}
          >
            {isLoading ? (
              'RESEARCHING SYNTHESIS...'
            ) : (
              `INITIATE AUDIT (${internalSelected.length} ELEMENTS)`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
