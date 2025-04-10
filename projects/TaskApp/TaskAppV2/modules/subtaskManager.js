import { getState, setState } from './stateManager.js';
import { renderAll } from './uiRenderer.js';

function addSubtask(taskId, subtaskData) {
  const state = getState();
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  const newSubtask = {
    id: '_' + Math.random().toString(36).substr(2, 9),
    title: subtaskData.title,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  task.subtasks.push(newSubtask);
  task.updatedAt = new Date().toISOString();
  setState({ tasks: state.tasks });
  renderAll();
}

function deleteSubtask(taskId, subtaskId) {
  const state = getState();
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
  task.updatedAt = new Date().toISOString();
  setState({ tasks: state.tasks });
  renderAll();
}

function toggleSubtaskCompletion(taskId, subtaskId) {
  const state = getState();
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  const subtask = task.subtasks.find(st => st.id === subtaskId);
  if (!subtask) return;
  subtask.completed = !subtask.completed;
  subtask.updatedAt = new Date().toISOString();
  task.updatedAt = new Date().toISOString();
  setState({ tasks: state.tasks });
  renderAll();
}

export { addSubtask, deleteSubtask, toggleSubtaskCompletion };