
import React, { useEffect } from 'react';
import { AppPhase } from '../types';
import { Logo } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  phase: AppPhase;
  onReset: () => void;
  onBack?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onIconLab: () => void;
}

const StepIndicator: React.FC<{ active: boolean; label: string; step: number; completed: boolean; onClick?: () => void }> = ({ active, label, step, completed, onClick }) => (
    <div 
      className={`flex flex-col sm:flex-row items-center gap-2 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40'} ${onClick ? 'cursor-pointer hover:opacity-100' : ''}`}
      onClick={onClick}
    >
        <div className={`w-9 h-9 sketch-border flex items-center justify-center text-xs font-black transition-all ${
            completed ? 'bg-blueprint text-white' : active ? 'bg-blueprint text-white scale-110' : 'bg-white dark:bg-blueprint/20 text-blueprint dark:text-accent'
        }`}>
            {completed ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : step}
        </div>
        <span className="hidden sm:block text-[11px] font-sketch font-bold uppercase tracking-[0.2em] text-blueprint dark:text-parchment">{label}</span>
    </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, phase, onReset, onBack, theme, onToggleTheme, onIconLab }) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onBack) onBack();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [onBack]);

  return (
    <div className="min-h-screen bg-parchment dark:bg-forest transition-colors flex flex-col items-center selection:bg-blueprint/20">
      <header className="w-full max-w-6xl px-6 py-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={onReset}>
          <Logo className="w-14 h-14 group-hover:rotate-6 transition-transform" />
          <div className="hidden sm:block">
            <h1 className="text-2xl font-sketch font-bold tracking-tight text-blueprint dark:text-parchment foil-text uppercase">SOVEREIGN SYNTAX</h1>
            <p className="text-[10px] text-blueprint/60 dark:text-accent/60 mt-0.5 uppercase tracking-[0.3em] font-black">SOVEREIGN RESEARCH ENGINE</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
            <button onClick={onToggleTheme} className="p-3 sketch-border bg-white dark:bg-blueprint/10 text-blueprint dark:text-accent hover:bg-blueprint/5 transition-colors">
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
                )}
            </button>
            <div className="hidden lg:flex gap-6">
                <button onClick={onIconLab} className={`text-[11px] font-sketch font-black uppercase tracking-widest transition-all ${phase === AppPhase.ICON_LAB ? 'text-blueprint underline underline-offset-4' : 'text-blueprint/40 hover:text-blueprint'}`}>Icon Lab</button>
                {onBack && <button onClick={onBack} className="text-[11px] font-sketch font-black text-blueprint/40 hover:text-blueprint uppercase tracking-widest transition-all">Previous [ESC]</button>}
                <button onClick={onReset} className="text-[11px] font-sketch font-black text-blueprint/40 hover:text-blueprint uppercase tracking-widest transition-all">Vault New</button>
            </div>
        </div>
      </header>

      <main className="w-full max-w-4xl px-6 pb-32">
        <nav className="mb-12 flex justify-center items-center border-b-2 border-dashed border-blueprint/10 dark:border-blueprint/5 pb-8">
            <div className="flex gap-12 sm:gap-20">
                <StepIndicator active={phase === AppPhase.INPUT} label="Vault Entry" step={1} completed={phase !== AppPhase.INPUT} onClick={onReset} />
                <StepIndicator active={phase === AppPhase.STRATEGIES} label="Architecture" step={2} completed={phase === AppPhase.RESULT || phase === AppPhase.ICON_LAB} />
                <StepIndicator active={phase === AppPhase.RESULT} label="Artifact" step={3} completed={phase === AppPhase.ICON_LAB} />
                <StepIndicator active={phase === AppPhase.ICON_LAB} label="Branding" step={4} completed={false} onClick={onIconLab} />
            </div>
        </nav>
        {children}
      </main>

      <footer className="mt-auto py-8 text-blueprint/40 dark:text-accent/30 text-[10px] font-sketch text-center w-full uppercase tracking-[0.4em] font-black border-t-2 border-dashed border-blueprint/5">
        &copy; 2025 Sovereign Archive &bull; High-Fidelity Hand-Drawn Construction
      </footer>
    </div>
  );
};
