
export interface Strategy {
  id: string;
  name: string;
  description: string;
  category: 'Logic' | 'Narrative' | 'Structure' | 'Constraint' | 'Persona';
  relevance: number; // 0-100
}

export enum AppPhase {
  INPUT = 'INPUT',
  STRATEGIES = 'STRATEGIES',
  AUDIT = 'AUDIT',
  RESULT = 'RESULT',
  DEPLOY = 'DEPLOY',
  ICON_LAB = 'ICON_LAB',
  TUTORIAL = 'TUTORIAL'
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64
  size: number;
}

export interface SavedBlueprintMetadata {
  strategyCount: number;
  charCount: number;
  attachmentCount: number;
  buildTimeMs?: number;
}

export interface SavedBlueprint {
  id: string;
  task: string;
  repositoryName?: string;
  repositoryDescription?: string;
  customName?: string;
  strategies: Strategy[];
  selectedStrategyIds: string[];
  attachments: Attachment[];
  timestamp: string;
  version: number;
  metadata: SavedBlueprintMetadata;
  isPinned?: boolean;
  thoughtTrace?: string;
}

export interface AppState {
  task: string;
  repositoryName: string;
  repositoryDescription: string;
  strategies: Strategy[];
  selectedStrategyIds: string[];
  attachments: Attachment[];
  finalPrompt: string;
  thoughtTrace: string;
  deploymentCode: string;
  phase: AppPhase;
  isLoading: boolean;
  error: string | null;
  feedbackSubmitted: boolean;
  blueprints: SavedBlueprint[];
  theme: 'light' | 'dark';
  isKeySelected: boolean;
}

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}
