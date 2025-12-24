
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SavedBlueprint } from '../types';

interface InputPhaseProps {
  onDraft: (task: string, repoName: string, repoDesc: string) => void;
  onLoadBlueprint: (blueprint: SavedBlueprint) => void;
  isLoading: boolean;
  error: string | null;
  blueprints: SavedBlueprint[];
  onDeleteBlueprint: (id: string) => void;
  onUpdateBlueprintName: (id: string, name: string) => void;
  onExport: () => void;
}

export const InputPhase: React.FC<InputPhaseProps> = ({ 
  onDraft, onLoadBlueprint, isLoading, error, blueprints, onDeleteBlueprint, onUpdateBlueprintName, onExport 
}) => {
  const [task, setTask] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 2000;

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const filteredBlueprints = useMemo(() => {
    if (!searchQuery.trim()) return blueprints;
    const query = searchQuery.toLowerCase();
    return blueprints.filter(bp => 
      (bp.customName?.toLowerCase() || '').includes(query) || 
      bp.task.toLowerCase().includes(query) ||
      (bp.repositoryName?.toLowerCase() || '').includes(query)
    );
  }, [blueprints, searchQuery]);

  const handleStartEdit = (e: React.MouseEvent, bp: SavedBlueprint) => {
    e.stopPropagation();
    setEditingId(bp.id);
    setEditValue(bp.customName || bp.task.substring(0, 40));
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onUpdateBlueprintName(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') handleSaveEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onDraft(task.trim(), repoName.trim() || "Sovereign Artifact", repoDesc.trim());
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 text-left">
          <h2 className="text-5xl font-sketch font-bold text-blueprint dark:text-parchment tracking-tight">The Sovereign Workspace</h2>
          <p className="text-blueprint/60 dark:text-accent/60 text-xl font-sketch">Forge high-fidelity blueprints with surgical precision.</p>
        </div>
        <button onClick={onExport} className="text-[10px] font-sketch font-black text-blueprint/40 hover:text-blueprint border-b border-blueprint/10 uppercase tracking-widest transition-all">
          Export Vault Archive
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/30 dark:bg-blueprint/5 p-8 sketch-border sketch-shadow">
        <div className="grid md:grid-cols-2 gap-8">
           <div className="space-y-3 text-left">
              <label className="text-[10px] font-sketch font-black text-blueprint/50 uppercase tracking-[0.2em]">Project Name</label>
              <input 
                type="text" 
                placeholder="e.g. Sovereign-Syntax-V3" 
                className="w-full bg-white dark:bg-blueprint/20 sketch-border px-5 py-3 font-sketch text-forest dark:text-parchment focus:border-blueprint outline-none transition-all"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
           </div>
           <div className="space-y-3 text-left">
              <label className="text-[10px] font-sketch font-black text-blueprint/50 uppercase tracking-[0.2em]">Brief Context</label>
              <input 
                type="text" 
                placeholder="e.g. Production-grade Prompt IDE" 
                className="w-full bg-white dark:bg-blueprint/20 sketch-border px-5 py-3 font-sketch text-forest dark:text-parchment focus:border-blueprint outline-none transition-all"
                value={repoDesc}
                onChange={(e) => setRepoDesc(e.target.value)}
              />
           </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sketch font-bold text-blueprint uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-6 h-[2px] bg-blueprint opacity-30"></span>
              Main Architectural Objective
            </label>
            <span className={`text-[10px] font-sketch font-black ${task.length > MAX_CHARS ? 'text-red-500' : 'text-blueprint/30'}`}>
              {task.length} / {MAX_CHARS}
            </span>
          </div>
          <textarea
            autoFocus
            className="w-full bg-white dark:bg-blueprint/20 sketch-border p-8 text-xl font-sketch text-forest dark:text-parchment placeholder:text-blueprint/20 focus:border-blueprint outline-none transition-all min-h-[280px] leading-relaxed"
            placeholder="Describe your vision (e.g., 'A Python script to automate cloud-native deployments with terraform integration')..."
            value={task}
            onChange={(e) => setTask(e.target.value.slice(0, MAX_CHARS + 100))}
          />
        </div>

        <button
          disabled={isLoading || !task.trim() || task.length > MAX_CHARS}
          className={`w-full py-6 sketch-border font-sketch font-black text-xl transition-all sketch-shadow ${
            isLoading || !task.trim() ? 'bg-blueprint/10 text-blueprint/40 cursor-not-allowed' : 'bg-blueprint text-white hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isLoading ? 'INITIALIZING RESEARCH...' : 'START ARCHITECTURAL PROTOCOL'}
        </button>
      </form>

      {blueprints.length > 0 && (
        <section className="pt-16 border-t-2 border-dashed border-blueprint/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <div className="flex items-center gap-4">
               <h3 className="text-[12px] font-sketch font-bold text-blueprint uppercase tracking-[0.4em]">Vault Archive</h3>
               <span className="px-3 py-0.5 sketch-border text-[9px] font-black bg-blueprint/5 text-blueprint/50 uppercase">
                 {blueprints.length} Artifacts
               </span>
            </div>
            
            <div className="relative w-full sm:w-80 group">
              <input 
                type="text" 
                placeholder="Search blueprints or repository names..." 
                className="w-full bg-white dark:bg-blueprint/10 sketch-border px-10 py-3 font-sketch text-sm text-forest dark:text-parchment outline-none focus:border-blueprint transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blueprint/40 group-focus-within:text-blueprint transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlueprints.map((bp) => (
              <div 
                key={bp.id} 
                className="group relative p-6 bg-white/50 dark:bg-blueprint/5 sketch-border hover:bg-white dark:hover:bg-blueprint/10 transition-all cursor-pointer sketch-shadow text-left flex flex-col justify-between overflow-hidden"
                onClick={() => onLoadBlueprint(bp)}
              >
                <div className="absolute -right-4 -top-4 text-[60px] font-black text-blueprint/5 select-none font-sketch pointer-events-none transition-all group-hover:text-blueprint/10">
                  {bp.version.toString().padStart(2, '0')}
                </div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex-1 min-w-0 pr-4">
                    {editingId === bp.id ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input 
                          ref={editInputRef}
                          type="text"
                          className="w-full bg-white dark:bg-blueprint/20 sketch-border px-3 py-1 font-sketch text-lg text-forest dark:text-parchment outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleSaveEdit(bp.id)}
                          onKeyDown={(e) => handleKeyDown(e, bp.id)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 group/title">
                          <p className="font-sketch text-xl text-forest dark:text-parchment font-black truncate">
                            {bp.customName || (bp.repositoryName || bp.task.substring(0, 30))}
                          </p>
                          <button onClick={(e) => handleStartEdit(e, bp)} className="opacity-0 group-hover/title:opacity-100 text-blueprint/30 hover:text-blueprint transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                        </div>
                        {bp.repositoryName && (
                          <p className="text-[10px] font-sketch font-bold text-blueprint/40 uppercase tracking-widest">{bp.repositoryName}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button onClick={(e) => { e.stopPropagation(); onDeleteBlueprint(bp.id); }} className="text-blueprint/10 hover:text-red-500 transition-colors p-1 relative z-20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4 text-[10px] font-sketch uppercase tracking-wider text-blueprint/50">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span className="font-black text-blueprint/70">{bp.metadata.strategyCount} STRAT</span>
                    </div>
                    <div className="w-1 h-1 bg-blueprint/10 rounded-full"></div>
                    <span className="font-black px-2 py-0.5 bg-blueprint/5 text-blueprint/60 sketch-border border-[1px]">REV_{bp.version.toString().padStart(2, '0')}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-blueprint/30 font-sketch uppercase tracking-widest pt-2 border-t border-dashed border-blueprint/5">
                    <span>{new Date(bp.timestamp).toLocaleDateString()}</span>
                    <span className="group-hover:text-blueprint transition-colors font-black">Open Artifact &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
