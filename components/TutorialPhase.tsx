
import React from 'react';

const TutorialSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="space-y-6 text-left">
    <div className="flex items-center gap-4 border-b border-blueprint/10 pb-4">
      <div className="w-10 h-10 bg-blueprint/5 text-blueprint flex items-center justify-center sketch-border">
        {icon}
      </div>
      <h3 className="text-xl font-sketch font-black text-blueprint dark:text-parchment uppercase tracking-widest">{title}</h3>
    </div>
    <div className="space-y-4 text-blueprint/70 dark:text-accent/70 font-medium leading-relaxed">
      {children}
    </div>
  </div>
);

const CodeSnippet: React.FC<{ code: string }> = ({ code }) => (
  <div className="relative group">
    <pre className="bg-onyx text-accent/80 p-6 font-mono text-xs overflow-x-auto sketch-border sketch-shadow">
      <code>{code}</code>
    </pre>
    <button 
      onClick={() => navigator.clipboard.writeText(code)}
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-blueprint/20 hover:bg-blueprint/40 p-2 rounded text-teal"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    </button>
  </div>
);

export const TutorialPhase: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-left">
        <h2 className="text-5xl font-sketch font-bold text-blueprint dark:text-parchment tracking-tight">Deployment Guides</h2>
        <p className="text-blueprint/60 dark:text-accent/60 text-xl font-sketch">Mastering the Sovereign pipeline for high-fidelity research.</p>
      </div>

      <div className="grid gap-16">
        <TutorialSection 
          title="Google AI Security Protocol" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
        >
          <p>The Sovereign Archive utilizes Google's advanced security infrastructure to vet every prompt artifact before it reaches production environments.</p>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Sovereign Vault:</strong> All prompt iterations are stored in an encrypted local database (IndexedDB) to ensure zero external leakage.</li>
            <li><strong>Zero-Failure Linting:</strong> Before synthesis, your input objectives are scanned for logical dead-ends and orphaned logic branches.</li>
            <li><strong>Paid API Gateway:</strong> High-fidelity visual synthesis (Icon Lab) requires a paid project to ensure reliability and priority rendering.</li>
          </ul>
        </TutorialSection>

        <TutorialSection 
          title="GitHub Integration Protocol" 
          icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>}
        >
          <p>Export your architectural artifacts seamlessly. Use these copy-paste commands to initialize your new Sovereign Repository:</p>
          <CodeSnippet code={`git init
git add .
git commit -m "Initial commit: Sovereign Architectural Artifact"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main`} />
          <p className="text-xs italic text-blueprint/50 mt-4">Note: Ensure your GitHub Token is correctly configured in your local environment variables.</p>
        </TutorialSection>
      </div>

      <div className="bg-blueprint/5 p-10 sketch-border text-center space-y-6">
        <h4 className="text-2xl font-sketch font-bold text-blueprint">Ready to Architect?</h4>
        <p className="text-blueprint/60 font-medium max-w-lg mx-auto">Apply these security and deployment protocols to your next high-fidelity project.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-10 py-4 bg-blueprint text-white font-sketch font-bold uppercase tracking-widest hover:scale-105 transition-transform sketch-shadow"
        >
          Begin Vault Entry
        </button>
      </div>
    </div>
  );
};
