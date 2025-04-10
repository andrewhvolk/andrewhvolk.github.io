/* UI Enhancements Module for Task App V2 */

document.addEventListener('DOMContentLoaded', () => {
  enhanceTaskList();
  setupSearchFilterSort();
  improveAccessibility();
});

/* Inline Editing, Subtask UI, Due Date Quick Controls */
function enhanceTaskList() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.task-item').forEach(taskEl => {
      const taskId = taskEl.dataset.id;
      if (!taskId) return;

      // Inline editing
      const titleSpan = taskEl.querySelector('.task-header span');
      if (titleSpan && !titleSpan.dataset.inlineEditable) {
        titleSpan.dataset.inlineEditable = 'true';
        titleSpan.style.cursor = 'pointer';
        titleSpan.addEventListener('click', () => {
          const input = document.createElement('input');
          input.type = 'text';
          input.value = titleSpan.textContent;
          input.className = 'border rounded p-1 w-full';
          titleSpan.replaceWith(input);
          input.focus();

          input.addEventListener('blur', () => saveInlineEdit(input, taskId));
          input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              saveInlineEdit(input, taskId);
            }
            if (e.key === 'Escape') {
              input.replaceWith(titleSpan);
            }
          });
        });
      }

      // Subtask add UI
      const taskData = Array.isArray(window.tasks) ? window.tasks.find(t => t.id === taskId) : undefined;
      if (taskData && taskData.subtasks && taskData.subtasks.length > 0) {
        if (!taskEl.querySelector('.add-subtask-container')) {
          const subtaskContainer = document.createElement('div');
          subtaskContainer.className = 'add-subtask-container mt-2 flex gap-1';

          const subInput = document.createElement('input');
          subInput.type = 'text';
          subInput.placeholder = 'Add subtask...';
          subInput.className = 'flex-grow border rounded p-1 text-xs';

          const addBtn = document.createElement('button');
          addBtn.textContent = '+';
          addBtn.className = 'px-2 py-1 bg-primary text-white rounded text-xs hover:bg-indigo-700';

          addBtn.onclick = () => {
            const text = subInput.value.trim();
            if (!text) return;
            try {
              const task = window.tasks.find(t => t.id === taskId);
              if (!task.subtasks) task.subtasks = [];
              task.subtasks.push({ id: generateId(), title: text, completed: false });
              saveTasks(window.tasks);
              window.renderAll();
            } catch {
              announce('Error adding subtask.');
            }
          };

          subtaskContainer.appendChild(subInput);
          subtaskContainer.appendChild(addBtn);
          taskEl.appendChild(subtaskContainer);
        }
      }

      // Due date quick control
      if (!taskEl.querySelector('.due-date-btn')) {
        const btnGroup = taskEl.querySelector('.task-header .flex');
        const dueBtn = document.createElement('button');
        dueBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>';
        dueBtn.title = 'Set Due Date';
        dueBtn.className = 'due-date-btn ml-1';
        dueBtn.onclick = () => {
          const date = prompt('Enter due date (YYYY-MM-DD):');
          if (date) {
            try {
              const task = window.tasks.find(t => t.id === taskId);
              task.dueDate = new Date(date).toISOString();
              saveTasks(window.tasks);
              window.renderAll();
            } catch {
              announce('Invalid date.');
            }
          }
        };
        btnGroup.appendChild(dueBtn);
      }
    });
  });

  observer.observe(document.getElementById('today-list'), { childList: true, subtree: true });
  observer.observe(document.getElementById('future-list'), { childList: true, subtree: true });
}

function saveInlineEdit(input, taskId) {
  const newTitle = input.value.trim();
  const task = window.tasks.find(t => t.id === taskId);
  if (task && newTitle) {
    task.title = newTitle;
    task.updatedAt = new Date();
    saveTasks(window.tasks);
    window.renderAll();
  } else {
    announce('Error updating task title.');
  }
}

/* Search, Filter, Sort */
function setupSearchFilterSort() {
  // Add search bar if missing
  if (!document.getElementById('search-input')) {
    const searchInput = document.createElement('input');
    searchInput.id = 'search-input';
    searchInput.placeholder = 'Search tasks...';
    searchInput.className = 'border border-gray-300 rounded p-1 focus:ring-2 focus:ring-primary transition ml-2';

    const controls = document.querySelector('.topbar__controls');
    if (controls) {
      controls.appendChild(searchInput);
    }
    
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase();
      document.querySelectorAll('.task-item').forEach(item => {
        const text = item.querySelector('.task-header span')?.textContent.toLowerCase() || '';
        if (text.includes(term)) {
          item.style.display = '';
          highlightMatch(item.querySelector('.task-header span'), term);
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Filter logic
  const filterSelect = document.getElementById('filter-select');
  filterSelect.addEventListener('change', () => {
    const val = filterSelect.value;
    document.querySelectorAll('.task-item').forEach(item => {
      const taskId = item.dataset.id;
      const task = window.tasks.find(t => t.id === taskId);
      if (!task) return;
      let show = true;
      if (val === 'completed') show = task.completed;
      else if (val === 'incomplete') show = !task.completed;
      else if (val !== 'all') show = true;
      item.style.display = show ? '' : 'none';
    });
  });

  // Sort logic
  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    if (val === 'none') {
      window.tasks.sort((a, b) => a.createdAt - b.createdAt);
    } else if (val === 'dueDate') {
      window.tasks.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
    } else if (val === 'priority') {
      const order = { 'High': 1, 'Medium': 2, 'Low': 3 };
      window.tasks.sort((a, b) => (order[a.priority] || 4) - (order[b.priority] || 4));
    } else if (val === 'createdAt') {
      window.tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    saveTasks(window.tasks);
    window.renderAll();
  });
}

function highlightMatch(element, term) {
  if (!element || !term) return;

/**
 * Sorts an array of tasks in place based on the given mode.
 * @param {Array} tasksArray - Array of task objects.
 * @param {string} mode - Sort mode: 'none', 'dueDate', 'priority', 'createdAt'.
 */
window.sortTasksByMode = function(tasksArray, mode) {
  if (!Array.isArray(tasksArray)) return;
  if (mode === 'none') {
    tasksArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (mode === 'dueDate') {
    tasksArray.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
  } else if (mode === 'priority') {
    const order = { 'High': 1, 'Medium': 2, 'Low': 3 };
    tasksArray.sort((a, b) => (order[a.priority] || 4) - (order[b.priority] || 4));
  } else if (mode === 'createdAt') {
    tasksArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
};

  const text = element.textContent;
  const index = text.toLowerCase().indexOf(term);
  if (index === -1) return;
  const before = text.slice(0, index);
  const match = text.slice(index, index + term.length);
  const after = text.slice(index + term.length);
  element.innerHTML = `${before}<mark class="bg-yellow-200">${match}</mark>${after}`;
}

/* Accessibility improvements */
function improveAccessibility() {
  document.querySelectorAll('button, select, input').forEach(el => {
    el.classList.add('focus:outline-none', 'focus:ring-2', 'focus:ring-primary');
  });
}

/* Error feedback */
function announce(message) {
  const region = document.getElementById('aria-live-region');
  if (region) {
    region.textContent = message;
  } else {
    alert(message);
  }
}