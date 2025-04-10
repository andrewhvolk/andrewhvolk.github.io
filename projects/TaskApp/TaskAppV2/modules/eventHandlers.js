import { addTask, editTask } from './taskManager.js';
import { renderModal, renderAll } from './uiRenderer.js';

let currentEditTaskId = null;

function openEditModal(taskData) {
  currentEditTaskId = taskData.id;
  renderModal(taskData);
}

function closeEditModal() {
  currentEditTaskId = null;
  document.getElementById('edit-modal').classList.add('hidden');
}

function initEventListeners() {
  // Add task button
  const addBtn = document.getElementById('add-task-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const input = document.getElementById('task-input');
      const text = input.value.trim();
      if (!text) return;
      addTask({ title: text });
      input.value = '';
    };
  }

  // Enter key to add task
  const input = document.getElementById('task-input');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addBtn.click();
      }
    });
  }

  // Modal cancel
  const cancelBtn = document.getElementById('modal-cancel');
  if (cancelBtn) {
    cancelBtn.onclick = closeEditModal;
  }

  // Modal save
  const saveBtn = document.getElementById('modal-save');
  if (saveBtn) {
    saveBtn.onclick = () => {
      if (!currentEditTaskId) return;
      const updatedData = {
        title: document.getElementById('modal-title').value.trim(),
        description: document.getElementById('modal-description').value.trim(),
        dueDate: document.getElementById('modal-due-date').value ? new Date(document.getElementById('modal-due-date').value).toISOString() : null,
        priority: document.getElementById('modal-priority').value,
      };
      editTask(currentEditTaskId, updatedData);
      closeEditModal();
    };
  }
}

export { initEventListeners, openEditModal, closeEditModal };