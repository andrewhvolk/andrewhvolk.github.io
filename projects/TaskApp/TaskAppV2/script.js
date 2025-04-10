import { loadState } from './modules/stateManager.js';
import { initEventListeners } from './modules/eventHandlers.js';
import { renderAll } from './modules/uiRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  initEventListeners();
});