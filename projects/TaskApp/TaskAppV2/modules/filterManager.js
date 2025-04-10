import { getState } from './stateManager.js';

function applyFilter({ status = 'all', priority = 'all', bucket = 'all' }) {
  const state = getState();
  return state.tasks.filter(task => {
    const statusMatch = status === 'all' || (status === 'completed' ? task.completed : !task.completed);
    const priorityMatch = priority === 'all' || task.priority === priority;
    const bucketMatch = bucket === 'all' || task.bucket === bucket;
    return statusMatch && priorityMatch && bucketMatch;
  });
}

function searchTasks(query) {
  const state = getState();
  const q = query.toLowerCase();
  return state.tasks.filter(task =>
    task.title.toLowerCase().includes(q) ||
    (task.description && task.description.toLowerCase().includes(q)) ||
    (task.subtasks && task.subtasks.some(st => st.title.toLowerCase().includes(q)))
  );
}

export { applyFilter, searchTasks };