
import React, { useState, useEffect } from 'react';
import { geminiService } from './services/geminiService.ts';
import { storageService } from './services/storageService.ts';
import { AppState, AppPhase, SavedBlueprint, ToastMessage, Attachment } from './types.ts';
import { InputPhase } from './components/InputPhase.tsx';
import { StrategyPhase } from './components/StrategyPhase.tsx';
import { ResultPhase } from './components/ResultPhase.tsx';
import { AuditPhase } from './components/AuditPhase.tsx';
import { TutorialPhase } from './components/TutorialPhase.tsx';
import { DeploymentPhase } from './components/DeploymentPhase.tsx';
import { IconLab } from './components/IconLab.tsx';
import { Layout } from './components/Layout.tsx';
import { Toast } from './components/Toast.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { currentBlueprintId?: string, customName?: string }>({
    task: '',
    repositoryName: '',
    repositoryDescription: '',
    strategies: [],
    selectedStrategyIds: [],
    attachments: [],
    finalPrompt: '',
    thoughtTrace: '',
    deploymentCode: '',
    phase: AppPhase.INPUT,
    isLoading: false,
    error: null,
    feedbackSubmitted: false,
    blueprints: storageService.getBlueprints(),
    theme: storageService.getTheme(),
    customName: '',
    isKeySelected: false
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
  };

  useEffect(() => storageService.setTheme(state.theme), [state.theme]);
  
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setState(prev => ({ ...prev, isKeySelected: hasKey }));
        }
      } catch (e) {
        console.warn("AI Studio key check failed", e);
      }
    };
    checkKey();
  }, []);

  const handleManageKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setState(prev => ({ ...prev, isKeySelected: true }));
        addToast("Vault Keys Active", "success");
      } catch (e) {
        addToast("Vault Access Denied", "error");
      }
    }
  };

  const handleStartDrafting = async (task: string, repoName: string, repoDesc: string, attachments: Attachment[]) => {
    setState(prev => ({ ...prev, isLoading: true, task, repositoryName: repoName, repositoryDescription: repoDesc, attachments, error: null }));
    try {
      const strategies = await geminiService.draftStrategies(task, attachments);
      setState(prev => ({ ...prev, strategies, phase: AppPhase.STRATEGIES, isLoading: false }));
      addToast("Architecture Drafted", "success");
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || "Research failed.", isLoading: false }));
      addToast("Drafting Failed", "error");
    }
  };

  const handleGeneratePrompt = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    const selected = state.strategies.filter(s => state.selectedStrategyIds.includes(s.id));
    try {
      const { prompt, trace } = await geminiService.generateFinalPrompt(state.task, selected, state.repositoryName, state.repositoryDescription);
      const updated = storageService.saveBlueprint(state.task, state.strategies, state.selectedStrategyIds, state.customName, state.repositoryName, state.repositoryDescription, state.attachments, trace);
      setState(prev => ({ ...prev, finalPrompt: prompt, thoughtTrace: trace, phase: AppPhase.RESULT, isLoading: false, blueprints: updated }));
      addToast("Artifact Synthesized", "success");
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message || "Synthesis failed." }));
      addToast("Synthesis Failed", "error");
    }
  };

  const handleDeploy = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const code = await geminiService.generateDeploymentCode(state.task, state.finalPrompt, state.repositoryName);
      setState(prev => ({ ...prev, deploymentCode: code, phase: AppPhase.DEPLOY, isLoading: false }));
      addToast("Code Ready", "success");
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message || "Deployment failed." }));
      addToast("Deployment Failed", "error");
    }
  };

  const handleTogglePin = (id: string) => {
    const updated = storageService.togglePin(id);
    setState(prev => ({ ...prev, blueprints: updated }));
    addToast("Vault Order Updated", "info");
  };

  return (
    <Layout 
      phase={state.phase} 
      onReset={() => setState(s => ({ ...s, phase: AppPhase.INPUT, task: '', strategies: [], selectedStrategyIds: [], attachments: [], finalPrompt: '', thoughtTrace: '', deploymentCode: '', error: null }))}
      onBack={() => {
        if (state.phase === AppPhase.RESULT) setState(p => ({ ...p, phase: AppPhase.AUDIT }));
        else if (state.phase === AppPhase.DEPLOY) setState(p => ({ ...p, phase: AppPhase.RESULT }));
        else if (state.phase === AppPhase.AUDIT) setState(p => ({ ...p, phase: AppPhase.STRATEGIES }));
        else setState(p => ({ ...p, phase: AppPhase.INPUT }));
      }}
      theme={state.theme}
      isKeySelected={state.isKeySelected}
      onToggleTheme={() => setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))}
      onManageKey={handleManageKey}
      onIconLab={() => setState(s => ({ ...s, phase: AppPhase.ICON_LAB }))}
      onTutorial={() => setState(s => ({ ...s, phase: AppPhase.TUTORIAL }))}
    >
      {state.error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-mono animate-in fade-in slide-in-from-top-2">
          [ERROR] {state.error}
        </div>
      )}

      {state.phase === AppPhase.INPUT && (
        <InputPhase 
          onDraft={handleStartDrafting} 
          onLoadBlueprint={(bp) => setState(p => ({ ...p, ...bp, phase: AppPhase.STRATEGIES, error: null }))}
          isLoading={state.isLoading} 
          error={state.error}
          blueprints={state.blueprints}
          onDeleteBlueprint={(id) => setState(p => ({ ...p, blueprints: storageService.deleteBlueprint(id) }))}
          onUpdateBlueprintName={(id, name) => setState(p => ({ ...p, blueprints: storageService.updateBlueprintName(id, name) }))}
          onExport={storageService.exportVault}
          onTogglePin={handleTogglePin}
        />
      )}
      {state.phase === AppPhase.STRATEGIES && (
        <StrategyPhase 
          strategies={state.strategies} 
          onProceed={(ids) => setState(p => ({ ...p, selectedStrategyIds: ids, phase: AppPhase.AUDIT }))}
          onSave={(ids, name) => setState(p => ({ ...p, blueprints: storageService.saveBlueprint(p.task, p.strategies, ids, name, p.repositoryName, p.repositoryDescription, p.attachments, p.thoughtTrace) }))}
          isLoading={state.isLoading}
          error={state.error}
          selectedIds={state.selectedStrategyIds}
          initialName={state.customName}
        />
      )}
      {state.phase === AppPhase.AUDIT && <AuditPhase onComplete={handleGeneratePrompt} isLoading={state.isLoading} />}
      {state.phase === AppPhase.RESULT && <ResultPhase finalPrompt={state.finalPrompt} thoughtTrace={state.thoughtTrace} onReset={() => setState(p => ({ ...p, phase: AppPhase.INPUT }))} onDeploy={handleDeploy} onFeedback={() => setState(p => ({ ...p, feedbackSubmitted: true }))} feedbackSubmitted={state.feedbackSubmitted} isLoading={state.isLoading} />}
      {state.phase === AppPhase.DEPLOY && <DeploymentPhase code={state.deploymentCode} repoName={state.repositoryName} />}
      {state.phase === AppPhase.ICON_LAB && <IconLab />}
      {state.phase === AppPhase.TUTORIAL && <TutorialPhase />}
      <Toast messages={toasts} onRemove={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </Layout>
  );
};

export default App;
