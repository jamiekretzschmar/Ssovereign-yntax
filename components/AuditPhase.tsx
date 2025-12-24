
import React, { useState, useEffect, useRef } from 'react';

interface AuditPhaseProps {
  onComplete: () => void;
  isLoading: boolean;
}

const AUDIT_LOGS = [
  { text: "Dependency Tree Pruning: Isolating orphaned features...", type: 'info' },
  { text: "Interface-Logic Decoupling Audit: Verifying UI integrity...", type: 'info' },
  { text: "PHASE 1 COMPLIANCE: ZERO-WARNING DETECTED.", type: 'success' },
  { text: "Recursive Execution Tracing: Simulating branch logic...", type: 'info' },
  { text: "State Mutability Analysis: Checking race conditions...", type: 'info' },
  { text: "Explicit Error Boundary Enforcement: Wrapping failure points...", type: 'info' },
  { text: "PHASE 2 COMPLIANCE: STATE INTEGRITY VERIFIED.", type: 'success' },
  { text: "The Naive User Emulation: Auditing UX friction...", type: 'info' },
  { text: "The Ruthless QA Engineer: Stress-testing edge cases...", type: 'info' },
  { text: "PHASE 3 COMPLIANCE: HEURISTIC OPTIMAL.", type: 'success' },
  { text: "ZERO-FAILURE PROTOCOL ACHIEVED. SYNTESIZING ARTIFACT...", type: 'success' },
];

export const AuditPhase: React.FC<AuditPhaseProps> = ({ onComplete, isLoading }) => {
  const [logs, setLogs] = useState<{ text: string; type: string }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStep < AUDIT_LOGS.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, AUDIT_LOGS[currentStep]]);
        setCurrentStep(prev => prev + 1);
      }, currentStep % 3 === 2 ? 1200 : 600);
      return () => clearTimeout(timer);
    } else if (!isFinished) {
      setIsFinished(true);
      setTimeout(onComplete, 1000);
    }
  }, [currentStep, isFinished, onComplete]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-left">
        <h2 className="text-5xl font-sketch font-bold text-blueprint dark:text-parchment tracking-tight">Zero-Failure Audit</h2>
        <p className="text-blueprint/60 dark:text-accent/60 text-xl font-sketch">Recursive self-analysis initiated. Testing architectural integrity.</p>
      </div>

      <div className="bg-onyx p-8 sketch-border sketch-shadow min-h-[400px] flex flex-col font-mono text-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-blueprint/30 pb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-[10px] text-blueprint font-black uppercase tracking-widest">Protocol Terminal v1.0.0</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse"></span>
            <span className="text-[10px] text-teal/80">AUDIT_ACTIVE</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] scrollbar-hide">
          {logs.map((log, i) => (
            <div key={i} className={`flex gap-4 animate-in slide-in-from-left-2 duration-300 ${log.type === 'success' ? 'text-teal' : 'text-accent/70'}`}>
              <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <span className={log.type === 'success' ? 'font-black' : ''}>
                {log.type === 'success' ? '✓ ' : '> '}{log.text}
              </span>
            </div>
          ))}
          {currentStep < AUDIT_LOGS.length && (
            <div className="flex gap-4 text-accent/70">
              <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <span className="flex items-center">
                <span className="animate-blink mr-2">_</span>
                Analyzing logical branches...
              </span>
            </div>
          )}
          <div ref={logEndRef} />
        </div>

        <div className="mt-8 pt-6 border-t border-blueprint/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-blueprint uppercase font-black">Overall Protocol Integrity</span>
            <span className="text-[10px] text-teal font-black">{Math.round((currentStep / AUDIT_LOGS.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-blueprint/10 overflow-hidden">
            <div 
              className="h-full bg-teal transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / AUDIT_LOGS.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-8 sketch-border bg-blueprint/5 dark:bg-blueprint/10 flex items-start gap-6">
        <div className="w-12 h-12 flex-shrink-0 bg-blueprint text-white rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <div className="space-y-2 text-left">
          <h4 className="font-sketch font-bold text-lg text-blueprint dark:text-parchment">Lead Architect Note</h4>
          <p className="text-sm text-blueprint/70 dark:text-accent/70 leading-relaxed italic font-sketch">
            "The Zero-Failure Protocol is not just a safety measure; it is a declaration of excellence. We scan for logical dead-ends so your prompts never fail in production."
          </p>
        </div>
      </div>
    </div>
  );
};
