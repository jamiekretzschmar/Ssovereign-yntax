
import React, { useState, useMemo, useEffect } from 'react';

interface ResultPhaseProps {
  finalPrompt: string;
  onReset: () => void;
  onFeedback: (rating: number, comments: string) => void;
  feedbackSubmitted: boolean;
}

const CommitTerminal: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [log, setLog] = useState<string[]>([]);
  const steps = [
    "Initializing local vault...",
    "Staging architectural artifact...",
    "Computing SHA-256 logic hash...",
    "Encrypting prompt parameters...",
    "Pushing to Sovereign GitHub Archive...",
    "COMMIT SUCCESS: origin/master [a7f3d2]"
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setLog(prev => [...prev, `> ${steps[current]}`]);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/90 p-4 rounded-xl font-mono text-[10px] text-teal border border-teal/20 shadow-2xl">
      {log.map((line, i) => (
        <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">{line}</div>
      ))}
    </div>
  );
};

const RichContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const renderedElements = useMemo(() => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4 border-b border-teal/20 pb-2">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold mt-6 mb-3 text-teal">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-accent uppercase tracking-wider">{line.replace('### ', '')}</h3>;
      if (line.startsWith('* ') || line.startsWith('- ')) return <li key={idx} className="ml-6 mb-1 list-disc">{line.substring(2)}</li>;
      
      // Simple code block detection for the actual prompt
      if (line.trim().startsWith('```')) return null;

      return <p key={idx} className="mb-4 leading-relaxed opacity-90">{line}</p>;
    });
  }, [content]);

  return <div className="markdown-content text-forest/90 dark:text-parchment/90">{renderedElements}</div>;
};

export const ResultPhase: React.FC<ResultPhaseProps> = ({ finalPrompt, onReset, onFeedback, feedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);
  const [hasCommitted, setHasCommitted] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalPrompt);
  };

  const handleCommit = () => {
    setIsCommitting(true);
  };

  const downloadAsMd = () => {
    const element = document.createElement("a");
    const file = new Blob([finalPrompt], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `README-${new Date().getTime()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-forest dark:text-parchment tracking-tight font-serif">Sovereign Artifact</h2>
            <p className="text-teal font-medium opacity-80">Architectural README generated and ready for deployment.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button 
              onClick={copyToClipboard}
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-5 py-3 bg-white dark:bg-moss/20 hover:bg-teal/5 text-teal text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border-2 border-teal/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Copy Raw
            </button>
            <button 
              onClick={handleCommit}
              disabled={hasCommitted}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${hasCommitted ? 'bg-teal/20 text-teal/40 cursor-default' : 'bg-forest dark:bg-teal text-white hover:opacity-90 shadow-teal/20'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              {hasCommitted ? 'Vault Synchronized' : 'Commit to Vault'}
            </button>
            <button 
              onClick={downloadAsMd}
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-5 py-3 bg-teal text-white hover:bg-teal/90 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-teal/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              README.md
            </button>
          </div>
        </div>
        
        {isCommitting && (
          <div className="animate-in slide-in-from-top-4 duration-500">
            <CommitTerminal onComplete={() => { setIsCommitting(false); setHasCommitted(true); }} />
          </div>
        )}

        <div className="relative group">
          <div className="absolute -inset-1 bg-teal/10 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-white dark:bg-moss/10 border-2 border-teal/10 rounded-2xl p-8 shadow-sm">
            <RichContentRenderer content={finalPrompt} />
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-moss/5 border-2 border-teal/5 rounded-2xl p-10 text-center space-y-8 shadow-sm">
        {feedbackSubmitted ? (
          <div className="py-6 animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-forest dark:text-parchment font-serif">Evaluation Recorded</h3>
            <p className="text-teal font-medium mt-2">Your insight helps refine the Archive.</p>
            <button 
              onClick={onReset}
              className="mt-8 text-teal hover:text-teal/70 text-xs font-bold uppercase tracking-[0.3em] underline underline-offset-8 decoration-teal/20"
            >
              Architect a new task
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-forest dark:text-parchment font-serif">Rate this Construction</h3>
              <p className="text-teal font-medium">How effective is this research output?</p>
            </div>
            
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-all duration-300 transform hover:scale-125"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <svg 
                    className={`w-12 h-12 ${star <= (hover || rating) ? 'text-teal drop-shadow-lg' : 'text-teal/10'}`} 
                    viewBox="0 0 24 24"
                    fill={star <= (hover || rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-parchment/50 dark:bg-onyx/30 border-2 border-teal/5 rounded-2xl p-5 text-sm text-forest dark:text-parchment focus:outline-none focus:border-teal transition-all min-h-[120px] resize-none"
              placeholder="Provide qualitative feedback on the reasoning strategies used..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={() => onFeedback(rating, comment)}
              disabled={rating === 0}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                rating > 0 
                ? 'bg-teal text-white shadow-teal/20 hover:scale-[1.01]' 
                : 'bg-teal/5 text-teal/20 cursor-not-allowed shadow-none'
              }`}
            >
              SUBMIT EVALUATION
            </button>
          </>
        )}
      </section>
    </div>
  );
};
