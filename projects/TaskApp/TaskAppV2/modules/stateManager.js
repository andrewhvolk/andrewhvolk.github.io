const AppState = {
  tasks: [],
  currentSort: 'none',
  currentFilter: 'all',
  currentView: 'list',
  theme: 'light',
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('taskappv2_state'));
    if (saved && typeof saved === 'object') {
      Object.assign(AppState, saved);
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem('taskappv2_state', JSON.stringify(AppState));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

function getState() {
  return AppState;
}

function setState(newState) {
  Object.assign(AppState, newState);
  saveState();
}

export { AppState, loadState, saveState, getState, setState };