
import React, { useState, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { storageService } from './services/storageService';
import { AppState, AppPhase, Strategy, SavedBlueprint, ToastMessage, Attachment } from './types';
import { InputPhase } from './components/InputPhase';
import { StrategyPhase } from './components/StrategyPhase';
import { ResultPhase } from './components/ResultPhase';
import { AuditPhase } from './components/AuditPhase';
import { TutorialPhase } from './components/TutorialPhase';
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
    phase: AppPhase.INPUT,
    isLoading: false,
    error: null,
    feedbackSubmitted: false,
    blueprints: storageService.getBlueprints(),
    theme: storageService.getTheme(),
    customName: ''
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    storageService.setTheme(state.theme);
  }, [state.theme]);

  const handleStartDrafting = async (task: string, repoName: string, repoDesc: string, attachments: Attachment[]) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      task, 
      repositoryName: repoName, 
      repositoryDescription: repoDesc,
      attachments
    }));
    try {
      const strategies = await geminiService.draftStrategies(task, attachments);
      const updatedBlueprints = storageService.saveBlueprint(task, strategies, [], state.customName, repoName, repoDesc, attachments);
      setState(prev => ({
        ...prev,
        strategies,
        phase: AppPhase.STRATEGIES,
        isLoading: false,
        blueprints: updatedBlueprints,
        selectedStrategyIds: []
      }));
      addToast("Architecture Drafted", "success");
    } catch (err) {
      setState(prev => ({ ...prev, error: "Research engine connection failure.", isLoading: false }));
      addToast("Drafting Failed", "error");
    }
  };

  const handleProceedToAudit = (selectedIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedStrategyIds: selectedIds,
      phase: AppPhase.AUDIT
    }));
  };

  const handleGeneratePrompt = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    const selected = state.strategies.filter(s => state.selectedStrategyIds.includes(s.id));
    try {
      const finalPrompt = await geminiService.generateFinalPrompt(
        state.task, 
        selected, 
        state.repositoryName, 
        state.repositoryDescription
      );
      const updatedBlueprints = storageService.saveBlueprint(
        state.task, 
        state.strategies, 
        state.selectedStrategyIds, 
        state.customName, 
        state.repositoryName, 
        state.repositoryDescription,
        state.attachments
      );
      setState(prev => ({ 
        ...prev, 
        finalPrompt, 
        phase: AppPhase.RESULT, 
        isLoading: false,
        blueprints: updatedBlueprints
      }));
      addToast("Artifact Synthesized", "success");
    } catch (err) {
      setState(prev => ({ ...prev, error: "Synthesis protocol interrupted.", isLoading: false }));
      addToast("Synthesis Failed", "error");
    }
  };

  const handleLoadBlueprint = (bp: SavedBlueprint) => {
    setState(prev => ({
      ...prev,
      task: bp.task,
      repositoryName: bp.repositoryName || '',
      repositoryDescription: bp.repositoryDescription || '',
      strategies: bp.strategies,
      selectedStrategyIds: bp.selectedStrategyIds,
      attachments: bp.attachments || [],
      customName: bp.customName || '',
      currentBlueprintId: bp.id,
      phase: AppPhase.STRATEGIES
    }));
    addToast("Artifact Restored", "info");
  };

  const handleSaveToVault = (ids: string[], name?: string) => {
    const updated = storageService.saveBlueprint(
      state.task, 
      state.strategies, 
      ids, 
      name, 
      state.repositoryName, 
      state.repositoryDescription,
      state.attachments
    );
    setState(prev => ({ 
      ...prev, 
      blueprints: updated, 
      customName: name || prev.customName,
      selectedStrategyIds: ids 
    }));
    addToast("Vault Synchronized", "success");
  };

  const handleUpdateBlueprintName = (id: string, name: string) => {
    const updated = storageService.updateBlueprintName(id, name);
    setState(prev => ({ ...prev, blueprints: updated }));
    if (state.currentBlueprintId === id) {
      setState(prev => ({ ...prev, customName: name }));
    }
    addToast("Alias Updated", "success");
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      task: '',
      repositoryName: '',
      repositoryDescription: '',
      strategies: [],
      selectedStrategyIds: [],
      attachments: [],
      finalPrompt: '',
      phase: AppPhase.INPUT,
      isLoading: false,
      error: null,
      feedbackSubmitted: false,
      customName: '',
      currentBlueprintId: undefined
    }));
  };

  const handleBack = () => {
    if (state.phase === AppPhase.RESULT) {
      setState(prev => ({ ...prev, phase: AppPhase.AUDIT }));
    } else if (state.phase === AppPhase.AUDIT) {
      setState(prev => ({ ...prev, phase: AppPhase.STRATEGIES }));
    } else if (state.phase === AppPhase.STRATEGIES || state.phase === AppPhase.ICON_LAB || state.phase === AppPhase.TUTORIAL) {
      setState(prev => ({ ...prev, phase: AppPhase.INPUT }));
    }
  };

  return (
    <Layout 
      phase={state.phase} 
      onReset={handleReset}
      onBack={state.phase !== AppPhase.INPUT ? handleBack : undefined}
      theme={state.theme}
      onToggleTheme={() => setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))}
      onIconLab={() => setState(s => ({ ...s, phase: AppPhase.ICON_LAB }))}
      onTutorial={() => setState(s => ({ ...s, phase: AppPhase.TUTORIAL }))}
    >
      {state.phase === AppPhase.INPUT && (
        <InputPhase 
          onDraft={handleStartDrafting} 
          onLoadBlueprint={handleLoadBlueprint}
          isLoading={state.isLoading} 
          error={state.error}
          blueprints={state.blueprints}
          onDeleteBlueprint={(id) => setState(p => ({ ...p, blueprints: storageService.deleteBlueprint(id) }))}
          onUpdateBlueprintName={handleUpdateBlueprintName}
          onExport={storageService.exportVault}
        />
      )}
      {state.phase === AppPhase.STRATEGIES && (
        <StrategyPhase 
          strategies={state.strategies} 
          onProceed={handleProceedToAudit}
          onSave={handleSaveToVault}
          isLoading={state.isLoading}
          error={state.error}
          selectedIds={state.selectedStrategyIds}
          initialName={state.customName}
        />
      )}
      {state.phase === AppPhase.AUDIT && (
        <AuditPhase 
          onComplete={handleGeneratePrompt}
          isLoading={state.isLoading}
        />
      )}
      {state.phase === AppPhase.RESULT && (
        <ResultPhase 
          finalPrompt={state.finalPrompt} 
          onReset={handleReset}
          onFeedback={(r, c) => {
             setState(p => ({ ...p, feedbackSubmitted: true }));
             addToast("Evaluation Recorded", "success");
          }}
          feedbackSubmitted={state.feedbackSubmitted}
        />
      )}
      {state.phase === AppPhase.ICON_LAB && <IconLab />}
      {state.phase === AppPhase.TUTORIAL && <TutorialPhase />}
      
      <Toast messages={toasts} onRemove={removeToast} />
    </Layout>
  );
};

export default App;
