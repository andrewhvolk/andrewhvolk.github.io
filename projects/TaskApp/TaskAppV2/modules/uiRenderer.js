import { getState } from './stateManager.js';

function renderAll() {
  renderBucket('Today');
  renderBucket('Future');
}

function renderBucket(bucketName) {
  const state = getState();
  const listEl = document.getElementById(bucketName.toLowerCase() + '-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  let bucketTasks = state.tasks.filter(t => t.bucket === bucketName);

  // Sort incomplete first, completed last
  const incompleteTasks = bucketTasks.filter(t => !t.completed);
  const completedTasks = bucketTasks.filter(t => t.completed);

  if (window.sortTasksByMode) {
    const sortMode = state.currentSort || 'none';
    window.sortTasksByMode(incompleteTasks, sortMode);
    window.sortTasksByMode(completedTasks, sortMode);
  }

  bucketTasks = incompleteTasks.concat(completedTasks);

  if (bucketTasks.length === 0) {
    const placeholder = document.createElement('li');
    placeholder.className = 'flex flex-col items-center justify-center p-4 text-gray-400';
    placeholder.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-label="No tasks" title="No tasks found">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="italic">No tasks found. Try adding one!</span>
    `;
    listEl.appendChild(placeholder);
    return;
  }

  bucketTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task';
    if (task.completed) li.classList.add('task--completed');
    li.dataset.id = task.id;

    const topRow = document.createElement('div');
    topRow.className = 'task-header';

    const span = document.createElement('span');
    span.textContent = task.title;
    if (task.completed) span.classList.add('line-through', 'text-gray-400');
    topRow.appendChild(span);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'flex items-center';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? 'Undo' : 'Done';
    toggleBtn.onclick = () => {
      import('./taskManager.js').then(mod => mod.toggleTaskCompletion(task.id));
    };
    btnGroup.appendChild(toggleBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
      import('./eventHandlers.js').then(mod => mod.openEditModal(task));
    };
    btnGroup.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      import('./taskManager.js').then(mod => mod.deleteTask(task.id));
    };
    btnGroup.appendChild(delBtn);

    topRow.appendChild(btnGroup);
    li.appendChild(topRow);

    // Subtasks
    if (task.subtasks && task.subtasks.length > 0) {
      const subList = document.createElement('ul');
      subList.className = 'ml-4 mt-2 space-y-1';
      task.subtasks.forEach(subtask => {
        const subLi = document.createElement('li');
        subLi.className = 'subtask-item p-1 border rounded';
        subLi.textContent = subtask.title;
        subList.appendChild(subLi);
      });
      li.appendChild(subList);
    }

    listEl.appendChild(li);
  });
}

function renderModal(taskData) {
  document.getElementById('modal-title').value = taskData.title || '';
  document.getElementById('modal-description').value = taskData.description || '';
  document.getElementById('modal-due-date').value = taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : '';
  document.getElementById('modal-priority').value = taskData.priority || 'Medium';
  document.getElementById('edit-modal').classList.remove('hidden');
}

function renderCalendarView() {
  // Placeholder, to be implemented in calendarManager
}

export { renderAll, renderBucket, renderModal, renderCalendarView };