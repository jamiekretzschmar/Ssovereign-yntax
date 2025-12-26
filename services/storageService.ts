
import { SavedBlueprint, Strategy, Attachment } from '../types';

const KEYS = {
  BLUEPRINTS: 'pa_vault_v3_ext',
  THEME: 'pa_settings_theme'
};

export const storageService = {
  getBlueprints: (): SavedBlueprint[] => {
    try {
      const saved = localStorage.getItem(KEYS.BLUEPRINTS);
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  saveBlueprint: (
    task: string, 
    strategies: Strategy[], 
    selectedIds: string[], 
    customName?: string,
    repoName?: string,
    repoDesc?: string,
    attachments: Attachment[] = [],
    thoughtTrace?: string
  ): SavedBlueprint[] => {
    const current = storageService.getBlueprints();
    const existingIndex = current.findIndex(b => b.task === task);
    
    const metadata = {
      strategyCount: selectedIds.length,
      charCount: task.length,
      attachmentCount: attachments.length
    };

    if (existingIndex > -1) {
      const existing = { ...current[existingIndex] };
      existing.version += 1;
      existing.timestamp = new Date().toISOString();
      existing.strategies = strategies;
      existing.selectedStrategyIds = selectedIds;
      existing.attachments = attachments;
      existing.metadata = metadata;
      existing.repositoryName = repoName || existing.repositoryName;
      existing.thoughtTrace = thoughtTrace || existing.thoughtTrace;
      if (customName) existing.customName = customName;
      current.splice(existingIndex, 1);
      current.unshift(existing);
    } else {
      current.unshift({
        id: Math.random().toString(36).substr(2, 9),
        task,
        repositoryName: repoName || '',
        repositoryDescription: repoDesc || '',
        customName,
        strategies,
        selectedStrategyIds: selectedIds,
        attachments,
        timestamp: new Date().toISOString(),
        version: 1,
        metadata,
        thoughtTrace
      });
    }

    const sorted = [...current].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    const limited = sorted.slice(0, 50);
    localStorage.setItem(KEYS.BLUEPRINTS, JSON.stringify(limited));
    return limited;
  },

  togglePin: (id: string): SavedBlueprint[] => {
    const current = storageService.getBlueprints();
    const idx = current.findIndex(b => b.id === id);
    if (idx > -1) {
      current[idx].isPinned = !current[idx].isPinned;
      const sorted = [...current].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
      localStorage.setItem(KEYS.BLUEPRINTS, JSON.stringify(sorted));
      return sorted;
    }
    return current;
  },

  deleteBlueprint: (id: string): SavedBlueprint[] => {
    const updated = storageService.getBlueprints().filter(b => b.id !== id);
    localStorage.setItem(KEYS.BLUEPRINTS, JSON.stringify(updated));
    return updated;
  },

  updateBlueprintName: (id: string, name: string): SavedBlueprint[] => {
    const current = storageService.getBlueprints();
    const idx = current.findIndex(b => b.id === id);
    if (idx > -1) {
      current[idx].customName = name;
      localStorage.setItem(KEYS.BLUEPRINTS, JSON.stringify(current));
    }
    return current;
  },

  exportVault: () => {
    const blob = new Blob([JSON.stringify(storageService.getBlueprints(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },

  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(KEYS.THEME, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },

  getTheme: (): 'light' | 'dark' => (localStorage.getItem(KEYS.THEME) as 'light' | 'dark') || 'light'
};
