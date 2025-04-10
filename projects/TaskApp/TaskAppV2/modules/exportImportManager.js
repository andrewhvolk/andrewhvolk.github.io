import { getState, setState } from './stateManager.js';
import { renderAll } from './uiRenderer.js';

function exportData() {
  const state = getState();
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'taskappv2_export.json';
  a.click();

  URL.revokeObjectURL(url);
}

function importData(jsonData) {
  try {
    const parsed = JSON.parse(jsonData);
    if (parsed && typeof parsed === 'object') {
      setState(parsed);
      renderAll();
    }
  } catch (e) {
    console.error('Failed to import data:', e);
  }
}

export { exportData, importData };