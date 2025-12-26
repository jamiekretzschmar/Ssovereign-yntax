
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

export const StrategyPhase: React.FC<StrategyPhaseProps> = ({ 
  strategies, onProceed, onSave, isLoading, selectedIds, initialName 
}) => {
  const [internalSelected, setInternalSelected] = useState<string[]>(selectedIds);
  const [blueprintName, setBlueprintName] = useState(initialName || '');

  const toggleStrategy = (id: string) => {
    setInternalSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-left">
        <h2 className="text-5xl font-sketch font-bold text-blueprint dark:text-parchment tracking-tight">Logic Design</h2>
        <p className="text-blueprint/60 dark:text-accent/60 text-xl font-sketch">Select design pillars to govern the Zero-Failure artifact logic.</p>
      </div>

      <div className="grid gap-6">
        {strategies.map((strategy) => (
          <div key={strategy.id} onClick={() => toggleStrategy(strategy.id)} className={`group p-8 sketch-border transition-all cursor-pointer sketch-shadow ${internalSelected.includes(strategy.id) ? 'bg-blueprint/5 border-blueprint scale-[1.01]' : 'bg-white dark:bg-blueprint/10 border-blueprint/10'}`}>
            <div className="flex items-start gap-6">
              <div className={`w-8 h-8 sketch-border flex items-center justify-center transition-all ${internalSelected.includes(strategy.id) ? 'bg-blueprint text-white' : 'bg-white'}`}>
                {internalSelected.includes(strategy.id) && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <div className="font-sketch text-left flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h4 className="text-xl font-bold text-forest dark:text-parchment">{strategy.name}</h4>
                    <span className="text-[9px] font-black px-2 py-0.5 bg-blueprint/5 text-blueprint uppercase tracking-widest">{strategy.category}</span>
                  </div>
                  <div className="text-[10px] font-black text-blueprint/40 uppercase">Relevance: {strategy.relevance}%</div>
                </div>
                <p className="text-blueprint/70 dark:text-accent/70 text-base mt-3 leading-relaxed">{strategy.description}</p>
                <div className="mt-4 w-full h-1 bg-blueprint/5 overflow-hidden">
                  <div className="h-full bg-teal/40" style={{ width: `${strategy.relevance}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-10 pt-8 space-y-6 bg-parchment/90 dark:bg-forest/90 backdrop-blur-md p-8 sketch-border sketch-shadow">
        <input type="text" placeholder="Vault Alias..." className="w-full bg-white dark:bg-blueprint/20 sketch-border px-6 py-4 font-sketch text-lg outline-none" value={blueprintName} onChange={e => setBlueprintName(e.target.value)} />
        <div className="flex gap-6">
          <button onClick={() => onSave(internalSelected, blueprintName)} className="flex-1 py-6 sketch-border font-sketch font-black text-lg bg-white dark:bg-blueprint/20 text-blueprint">SAVE DRAFT</button>
          <button onClick={() => onProceed(internalSelected)} disabled={isLoading || internalSelected.length === 0} className={`flex-[2] py-6 sketch-border font-sketch font-black text-xl transition-all ${isLoading || internalSelected.length === 0 ? 'opacity-30' : 'bg-blueprint text-white'}`}>{isLoading ? 'RESEARCHING...' : `INITIATE AUDIT (${internalSelected.length})`}</button>
        </div>
      </div>
    </div>
  );
};
