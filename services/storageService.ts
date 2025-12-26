
import { SavedBlueprint, Strategy, Attachment } from '../types';

const KEYS = {
  BLUEPRINTS: 'pa_vault_v3',
  FEEDBACK: 'pa_feedback_v1',
  THEME: 'pa_settings_theme'
};

export const storageService = {
  getBlueprints: (): SavedBlueprint[] => {
    try {
      const saved = localStorage.getItem(KEYS.BLUEPRINTS);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.map(bp => ({
        id: bp.id || Math.random().toString(36).substr(2, 9),
        task: bp.task || '',
        repositoryName: bp.repositoryName || '',
        repositoryDescription: bp.repositoryDescription || '',
        customName: bp.customName,
        strategies: bp.strategies || [],
        selectedStrategyIds: bp.selectedStrategyIds || [],
        attachments: bp.attachments || [],
        timestamp: bp.timestamp || new Date().toISOString(),
        version: typeof bp.version === 'number' ? bp.version : 1,
        metadata: bp.metadata || {
          strategyCount: (bp.selectedStrategyIds || []).length,
          charCount: (bp.task || '').length,
          attachmentCount: (bp.attachments || []).length
        }
      }));
    } catch (e) {
      console.error("Zero-Failure Protocol: Vault retrieval failed.", e);
      return [];
    }
  },

  saveBlueprint: (
    task: string, 
    strategies: Strategy[] = [], 
    selectedStrategyIds: string[] = [], 
    customName?: string,
    repositoryName?: string,
    repositoryDescription?: string,
    attachments: Attachment[] = []
  ): SavedBlueprint[] => {
    const current = storageService.getBlueprints();
    const existingIndex = current.findIndex(b => b.task === task);
    
    const metadata = {
      strategyCount: selectedStrategyIds.length,
      charCount: task.length,
      attachmentCount: attachments.length
    };

    if (existingIndex > -1) {
      const existing = { ...current[existingIndex] };
      
      const selectionChanged = JSON.stringify(existing.selectedStrategyIds) !== JSON.stringify(selectedStrategyIds);
      const attachmentsChanged = (existing.attachments?.length || 0) !== attachments.length;
      const nameChanged = customName && existing.customName !== customName;
      
      if (selectionChanged || nameChanged || attachmentsChanged) {
        existing.version += 1;
      }

      existing.timestamp = new Date().toISOString();
      existing.strategies = strategies;
      existing.selectedStrategyIds = selectedStrategyIds;
      existing.attachments = attachments;
      existing.metadata = metadata;
      existing.repositoryName = repositoryName || existing.repositoryName;
      existing.repositoryDescription = repositoryDescription || existing.repositoryDescription;
      
      if (customName && customName.trim()) {
        existing.customName = customName.trim();
      }
      
      current.splice(existingIndex, 1);
      current.unshift(existing);
    } else {
      current.unshift({
        id: Math.random().toString(36).substr(2, 9),
        task,
        repositoryName: repositoryName || '',
        repositoryDescription: repositoryDescription || '',
        customName: customName?.trim() || undefined,
        strategies,
        selectedStrategyIds,
        attachments,
        timestamp: new Date().toISOString(),
        version: 1,
        metadata
      });
    }

    // Increase limit slightly for small base64 assets, though 50 is safe for metadata
    const limitedVault = current.slice(0, 30);
    try {
      localStorage.setItem(KEYS.BLUEPRINTS, JSON.stringify(limitedVault));
    } catch (e) {
      console.warn("Vault quota reached. Purging older artifacts.");
      localStorage.setItem(KEYS.BLUEPRINTS, JSON.stringify(current.slice(0, 5)));
    }
    return limitedVault;
  },

  updateBlueprintName: (id: string, customName: string): SavedBlueprint[] => {
    const current = storageService.getBlueprints();
    const index = current.findIndex(b => b.id === id);
    if (index > -1) {
      current[index].customName = customName.trim();
      current[index].timestamp = new Date().toISOString();
      localStorage.setItem(KEYS.BLUEPRINTS, JSON.stringify(current));
    }
    return current;
  },

  deleteBlueprint: (id: string): SavedBlueprint[] => {
    const updated = storageService.getBlueprints().filter(b => b.id !== id);
    localStorage.setItem(KEYS.BLUEPRINTS, JSON.stringify(updated));
    return updated;
  },

  exportVault: () => {
    const data = storageService.getBlueprints();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sovereign-vault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },

  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(KEYS.THEME, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },

  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(KEYS.THEME) as 'light' | 'dark') || 'light';
  }
};
