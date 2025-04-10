import { getState, setState } from './stateManager.js';
import { renderAll } from './uiRenderer.js';

function addTask({ title, bucket = 'Today', completed = false }) {
  const state = getState();
  const newTask = {
    id: '_' + Math.random().toString(36).substr(2, 9),
    title,
    description: '',
    dueDate: null,
    completed,
    subtasks: [],
    bucket,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.tasks.push(newTask);
  setState({ tasks: state.tasks });
  renderAll();
}

function deleteTask(taskId) {
  const state = getState();
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  setState({ tasks: state.tasks });
  renderAll();
}

function editTask(taskId, updatedData) {
  const state = getState();
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  Object.assign(task, updatedData, { updatedAt: new Date().toISOString() });
  setState({ tasks: state.tasks });
  renderAll();
}

function toggleTaskCompletion(taskId) {
  const state = getState();
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.completed = !task.completed;
  task.updatedAt = new Date().toISOString();
  setState({ tasks: state.tasks });
  renderAll();
}

export { addTask, deleteTask, editTask, toggleTaskCompletion };