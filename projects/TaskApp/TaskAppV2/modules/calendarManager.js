import { getState, setState } from './stateManager.js';
import { renderAll } from './uiRenderer.js';

function renderCalendar() {
  const calendarContainer = document.getElementById('calendar-view');
  if (!calendarContainer) return;

  calendarContainer.innerHTML = '';

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDay = startDate.getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-7 gap-px bg-gray-300';

  for (let i = 0; i < startDay + daysInMonth; i++) {
    const cell = document.createElement('div');
    cell.className = 'bg-white min-h-[100px] p-1 flex flex-col border border-gray-200';

    if (i >= startDay) {
      const dateNum = i - startDay + 1;
      const cellDate = new Date(now.getFullYear(), now.getMonth(), dateNum);
      const isoDate = cellDate.toISOString().split('T')[0];

      const dateLabel = document.createElement('div');
      dateLabel.className = 'text-xs font-semibold mb-1';
      dateLabel.textContent = dateNum;
      cell.appendChild(dateLabel);

      const state = getState();
      const dayTasks = state.tasks.filter(t => t.dueDate && t.dueDate.startsWith(isoDate));
      dayTasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task-item calendar-task p-1 mb-1 rounded text-xs text-white cursor-pointer';
        taskEl.textContent = task.title;
        taskEl.draggable = true;
        taskEl.dataset.id = task.id;

        taskEl.addEventListener('dragstart', e => {
          e.dataTransfer.setData('task-id', task.id);
        });

        cell.appendChild(taskEl);
      });

      cell.addEventListener('click', () => handleCalendarClick(cellDate));

      cell.addEventListener('dragover', e => e.preventDefault());
      cell.addEventListener('drop', e => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('task-id');
        handleCalendarDragDrop(taskId, cellDate);
      });
    }

    grid.appendChild(cell);
  }

  calendarContainer.appendChild(grid);
}

function handleCalendarClick(date) {
  const title = prompt('Task title for ' + date.toDateString() + ':');
  if (!title) return;

  const state = getState();
  const newTask = {
    id: '_' + Math.random().toString(36).substr(2, 9),
    title,
    description: '',
    dueDate: date.toISOString(),
    completed: false,
    subtasks: [],
    bucket: 'Future',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.tasks.push(newTask);
  setState({ tasks: state.tasks });
  renderCalendar();
  renderAll();
}

function handleCalendarDragDrop(taskId, newDate) {
  const state = getState();
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.dueDate = newDate.toISOString();
  task.updatedAt = new Date().toISOString();
  setState({ tasks: state.tasks });
  renderCalendar();
  renderAll();
}

export { renderCalendar, handleCalendarClick, handleCalendarDragDrop };