
import React, { useState, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { storageService } from './services/storageService';
import { AppState, AppPhase, SavedBlueprint, ToastMessage, Attachment } from './types';
import { InputPhase } from './components/InputPhase';
import { StrategyPhase } from './components/StrategyPhase';
import { ResultPhase } from './components/ResultPhase';
import { AuditPhase } from './components/AuditPhase';
import { TutorialPhase } from './components/TutorialPhase';
import { DeploymentPhase } from './components/DeploymentPhase';
import { IconLab } from './components/IconLab';
import { Layout } from './components/Layout';
import { Toast } from './components/Toast';

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
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setState(prev => ({ ...prev, isKeySelected: hasKey }));
      }
    };
    checkKey();
  }, []);

  const handleManageKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setState(prev => ({ ...prev, isKeySelected: true }));
      addToast("Vault Keys Active", "success");
    }
  };

  const handleStartDrafting = async (task: string, repoName: string, repoDesc: string, attachments: Attachment[]) => {
    setState(prev => ({ ...prev, isLoading: true, task, repositoryName: repoName, repositoryDescription: repoDesc, attachments }));
    try {
      const strategies = await geminiService.draftStrategies(task, attachments);
      setState(prev => ({ ...prev, strategies, phase: AppPhase.STRATEGIES, isLoading: false }));
      addToast("Architecture Drafted", "success");
    } catch (err) {
      setState(prev => ({ ...prev, error: "Research failed.", isLoading: false }));
      addToast("Drafting Failed", "error");
    }
  };

  const handleGeneratePrompt = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    const selected = state.strategies.filter(s => state.selectedStrategyIds.includes(s.id));
    try {
      const { prompt, trace } = await geminiService.generateFinalPrompt(state.task, selected, state.repositoryName, state.repositoryDescription);
      const updated = storageService.saveBlueprint(state.task, state.strategies, state.selectedStrategyIds, state.customName, state.repositoryName, state.repositoryDescription, state.attachments, trace);
      setState(prev => ({ ...prev, finalPrompt: prompt, thoughtTrace: trace, phase: AppPhase.RESULT, isLoading: false, blueprints: updated }));
      addToast("Artifact Synthesized", "success");
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      addToast("Synthesis Failed", "error");
    }
  };

  const handleDeploy = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const code = await geminiService.generateDeploymentCode(state.task, state.finalPrompt, state.repositoryName);
      setState(prev => ({ ...prev, deploymentCode: code, phase: AppPhase.DEPLOY, isLoading: false }));
      addToast("Code Ready", "success");
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
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
      onReset={() => setState(s => ({ ...s, phase: AppPhase.INPUT, task: '', strategies: [], selectedStrategyIds: [], attachments: [], finalPrompt: '', thoughtTrace: '', deploymentCode: '' }))}
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
      {state.phase === AppPhase.INPUT && (
        <InputPhase 
          onDraft={handleStartDrafting} 
          onLoadBlueprint={(bp) => setState(p => ({ ...p, ...bp, phase: AppPhase.STRATEGIES }))}
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
