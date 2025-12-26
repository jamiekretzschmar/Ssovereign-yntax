
import React, { useState, useMemo, useRef } from 'react';
import { SavedBlueprint, Attachment } from '../types.ts';

interface InputPhaseProps {
  onDraft: (task: string, repoName: string, repoDesc: string, attachments: Attachment[]) => void;
  onLoadBlueprint: (blueprint: SavedBlueprint) => void;
  isLoading: boolean;
  error: string | null;
  blueprints: SavedBlueprint[];
  onDeleteBlueprint: (id: string) => void;
  onUpdateBlueprintName: (id: string, name: string) => void;
  onExport: () => void;
  onTogglePin: (id: string) => void;
}

const FileVault: React.FC<{ attachments: Attachment[]; setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>> }> = ({ attachments, setAttachments }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Attachment | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    for (const file of files) {
      if (file.size > 4 * 1024 * 1024) continue;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setAttachments(prev => [...prev, {
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data: base64,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-onyx/80 backdrop-blur-md p-6" onClick={() => setPreview(null)}>
          <div className="bg-white dark:bg-moss p-4 sketch-border max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-sketch font-bold text-blueprint">{preview.name}</span>
              <button onClick={() => setPreview(null)} className="text-blueprint/40">CLOSE</button>
            </div>
            {preview.mimeType.startsWith('image/') ? (
              <img src={`data:${preview.mimeType};base64,${preview.data}`} className="w-full h-auto sketch-border" alt="Preview" />
            ) : (
              <pre className="font-mono text-xs p-4 bg-blueprint/5 whitespace-pre-wrap">{atob(preview.data).slice(0, 5000)}</pre>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-sketch font-bold text-blueprint uppercase tracking-[0.3em]">Multimodal Lens Vault</label>
        <span className="text-[10px] font-sketch font-black text-blueprint/30">{attachments.length} / 5</span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {attachments.map((att, idx) => (
          <div key={idx} className="relative group sketch-border aspect-square overflow-hidden cursor-pointer bg-white dark:bg-blueprint/20" onClick={() => setPreview(att)}>
            {att.mimeType.startsWith('image/') ? (
              <img src={`data:${att.mimeType};base64,${att.data}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" alt={att.name} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[8px] font-black uppercase text-blueprint/40 px-1 text-center truncate">{att.name}</div>
            )}
            <button onClick={(e) => { e.stopPropagation(); setAttachments(prev => prev.filter((_, i) => i !== idx)); }} className="absolute top-0 right-0 p-1 bg-red-500 text-white scale-50 opacity-0 group-hover:opacity-100">X</button>
          </div>
        ))}
        {attachments.length < 5 && (
          <button type="button" onClick={() => fileInputRef.current?.click()} className="sketch-border border-dashed aspect-square flex items-center justify-center text-blueprint/20 hover:text-blueprint/40 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export const InputPhase: React.FC<InputPhaseProps> = ({ 
  onDraft, onLoadBlueprint, isLoading, blueprints, onDeleteBlueprint, onUpdateBlueprintName, onExport, onTogglePin 
}) => {
  const [task, setTask] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return blueprints.filter(b => 
      b.task.toLowerCase().includes(query.toLowerCase()) || (b.customName || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [blueprints, query]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-5xl font-sketch font-bold text-blueprint dark:text-parchment tracking-tight">The Workspace</h2>
          <p className="text-blueprint/60 dark:text-accent/60 text-xl font-sketch">Forge high-fidelity artifacts with surgical precision.</p>
        </div>
        <button onClick={onExport} className="text-[10px] font-sketch font-black text-blueprint/40 hover:text-blueprint border-b border-blueprint/10 tracking-widest transition-all">Export Archive</button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onDraft(task, repoName, repoDesc, attachments); }} className="space-y-8 bg-white/30 dark:bg-blueprint/5 p-8 sketch-border sketch-shadow">
        <div className="grid md:grid-cols-2 gap-8">
           <input type="text" placeholder="Artifact Title" className="bg-white dark:bg-blueprint/20 sketch-border px-5 py-3 font-sketch text-forest dark:text-parchment outline-none" value={repoName} onChange={e => setRepoName(e.target.value)} />
           <input type="text" placeholder="Brief Context" className="bg-white dark:bg-blueprint/20 sketch-border px-5 py-3 font-sketch text-forest dark:text-parchment outline-none" value={repoDesc} onChange={e => setRepoDesc(e.target.value)} />
        </div>
        <textarea className="w-full bg-white dark:bg-blueprint/20 sketch-border p-8 text-xl font-sketch text-forest dark:text-parchment outline-none min-h-[200px]" placeholder="Define the architectural objective..." value={task} onChange={e => setTask(e.target.value)} />
        <FileVault attachments={attachments} setAttachments={setAttachments} />
        <button disabled={isLoading || !task.trim()} className={`w-full py-6 sketch-border font-sketch font-black text-xl transition-all ${isLoading || !task.trim() ? 'opacity-30' : 'bg-blueprint text-white'}`}>{isLoading ? 'INITIATING...' : 'START PROTOCOL'}</button>
      </form>

      <section className="pt-16 border-t-2 border-dashed border-blueprint/10">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-[12px] font-sketch font-bold text-blueprint uppercase tracking-[0.4em]">Vault Archive</h3>
          <input type="text" placeholder="Search Vault..." className="bg-white dark:bg-blueprint/10 sketch-border px-8 py-2 font-sketch text-sm outline-none" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(bp => (
            <div key={bp.id} className={`group relative p-6 bg-white/50 dark:bg-blueprint/5 sketch-border hover:bg-white dark:hover:bg-blueprint/10 transition-all cursor-pointer ${bp.isPinned ? 'border-teal/50 bg-teal/5' : ''}`} onClick={() => onLoadBlueprint(bp)}>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-sketch text-xl text-forest dark:text-parchment font-black truncate">{bp.customName || bp.repositoryName || bp.task.substring(0, 30)}</p>
                  <p className="text-[10px] font-sketch text-blueprint/40 uppercase tracking-widest">{new Date(bp.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onTogglePin(bp.id); }} className={`p-1 transition-colors ${bp.isPinned ? 'text-teal' : 'text-blueprint/10 hover:text-teal'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 9V4l1 1V2H7v2l1-1v5L6 11v2h5v7l1 1 1-1v-7h5v-2l-2-2z" /></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteBlueprint(bp.id); }} className="p-1 text-blueprint/10 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
