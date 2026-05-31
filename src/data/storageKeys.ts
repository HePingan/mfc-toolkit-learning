export const storageKeys = {
  progress: 'mfc-toolkit-progress-v2',
  notes: 'mfc-toolkit-notes-v1',
  buildChecklist: 'mfc-toolkit-build-checklist-v1',
  demoScript: 'mfc-toolkit-demo-script-v1',
  planner: 'mfc-toolkit-planner-v1',
  review: 'mfc-toolkit-review-v2',
  deliveryPackage: 'mfc-toolkit-delivery-package-v1',
  evidenceLibrary: 'mfc-toolkit-evidence-library-v1',
  portfolio: 'mfc-toolkit-portfolio-v1',
  submitRehearsal: 'mfc-toolkit-submit-rehearsal-v1',
  exam: 'mfc-toolkit-exam-v1',
  localIntegrationChecklist: 'mfc-local-integration-checklist-v1',
} as const;

export type StorageKeyName = keyof typeof storageKeys;
export type StorageKey = (typeof storageKeys)[StorageKeyName];

export const allStorageKeys = Object.values(storageKeys) as StorageKey[];
export const legacyStorageKeys = {
  progress: ['mfc-toolkit-progress-v1'],
} as const;
