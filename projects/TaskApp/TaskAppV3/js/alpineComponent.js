// @ts-nocheck
import { loadTasks, saveTasks } from './localStorageStore.js';
import { isToday, isThisWeek, isThisMonth, isThisYear, isFutureBeyondYear, resetOverdueTasks, isWithinRange, isTodayOrFuture } from './dateUtils.js';

window.isWithinRange = isWithinRange;
window.isTodayOrFuture = isTodayOrFuture;

const taskApp = {
  tasks: [],
  currentView: 'inbox',
  newTaskTitle: '',
  showEditModal: false,
  editTaskData: {
    id: null,
    title: '',
    description: '',
    dueDate: '',
    timeEstimate: ''
  },
// Count getters ignoring search filter
  get inboxCount() {
    return this.tasks.filter(t => !t.dueDate && !t.isCompleted).length;
  },

  get todayCount() {
    return this.tasks.filter(t => t.dueDate && isToday(t.dueDate) && !t.isCompleted).length;
  },

  get weekCount() {
    return this.tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      const today = dayjs().startOf('day');
      const endOfWeek = dayjs().endOf('week');
      return isWithinRange(t.dueDate, today, endOfWeek);
    }).length;
  },

  get monthCount() {
    return this.tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      const today = dayjs().startOf('day');
      const endOfMonth = dayjs().endOf('month');
      return isWithinRange(t.dueDate, today, endOfMonth);
    }).length;
  },

  get yearCount() {
    return this.tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      const today = dayjs().startOf('day');
      const endOfYear = dayjs().endOf('year');
      return isWithinRange(t.dueDate, today, endOfYear);
    }).length;
  },

  get futureCount() {
    return this.tasks.filter(t => t.dueDate && isFutureBeyondYear(t.dueDate) && !t.isCompleted).length;
  },

  get completedCount() {
    return this.tasks.filter(t => t.isCompleted).length;
  },

  get allIncompleteCount() {
    return this.tasks.filter(t => !t.isCompleted).length;
  },

  get inboxTasks() {
    return this.tasks.filter(t => !t.dueDate && !t.isCompleted);
  },

  get todayTasks() {
    return this.tasks.filter(t =>
      t.dueDate &&
      isToday(t.dueDate) &&
      !t.isCompleted
    );
  },

  get weekTasks() {
    return this.tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      const today = dayjs().startOf('day');
      const endOfWeek = dayjs().endOf('week');
      return isWithinRange(t.dueDate, today, endOfWeek);
    });
  },

  get completedTasks() {
    return this.tasks.filter(t => t.isCompleted);
  },

  get monthTasks() {
    return this.tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      const today = dayjs().startOf('day');
      const endOfMonth = dayjs().endOf('month');
      return isWithinRange(t.dueDate, today, endOfMonth);
    });
  },

  get yearTasks() {
    return this.tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      const today = dayjs().startOf('day');
      const endOfYear = dayjs().endOf('year');
      return isWithinRange(t.dueDate, today, endOfYear);
    });
  },

  get futureTasks() {
    return this.tasks.filter(t =>
      t.dueDate &&
      isFutureBeyondYear(t.dueDate) &&
      !t.isCompleted
    );
  },

  get allIncompleteTasks() {
    return this.tasks.filter(t => !t.isCompleted);
  },

  init() {
    this.tasks = loadTasks();
    if (resetOverdueTasks(this.tasks)) {
      saveTasks(this.tasks);
    }
  },

  addTask(title) {
    const newTask = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title,
      description: '',
      isCompleted: false,
      dueDate: null,
      timeEstimate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    saveTasks(this.tasks);
    this.tasks = [...this.tasks];
    this.newTaskTitle = '';
  },

  editTask(task) {
    this.editTaskData = { ...task };
    this.showEditModal = true;
  },

  saveEdit() {
    const idx = this.tasks.findIndex(t => t.id === this.editTaskData.id);
    if (idx !== -1) {
      const updatedTask = {
        ...this.tasks[idx],
        ...this.editTaskData,
        dueDate: this.editTaskData.dueDate || null,
        timeEstimate: this.editTaskData.timeEstimate || null,
        updatedAt: new Date().toISOString()
      };
      if (!this.tasks[idx].dueDate && (!updatedTask.dueDate || !updatedTask.timeEstimate)) {
        alert('Please assign both Due Date and Time Estimate to process this task.');
        return;
      }
      this.tasks[idx] = updatedTask;
      saveTasks(this.tasks);
    }
    this.showEditModal = false;
  },

  toggleComplete(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.isCompleted = !task.isCompleted;
      task.updatedAt = new Date().toISOString();
      saveTasks(this.tasks);
      this.tasks = [...this.tasks];
    }
  },

  confirmDelete(taskId) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.deleteTask(taskId);
    }
  },

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    saveTasks(this.tasks);
  },

  confirmBulkDelete() {
    if (window.confirm('Are you sure you want to delete all completed tasks?')) {
      this.bulkDeleteCompleted();
    }
  },

  bulkDeleteCompleted() {
    this.tasks = this.tasks.filter(t => !t.isCompleted);
    saveTasks(this.tasks);
  },


  exportTasks() {
    const dataStr = JSON.stringify(this.tasks, null, 2); // Pretty print JSON
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = event => {
        try {
          const importedTasks = JSON.parse(event.target.result);
          // Basic validation: check if it's an array
          if (Array.isArray(importedTasks)) {
            // Optional: Add more robust validation here (check task structure)
            if (window.confirm('This will replace your current tasks. Are you sure?')) {
              this.tasks = importedTasks;
              saveTasks(this.tasks);
              this.tasks = [...this.tasks]; // Trigger reactivity
              alert('Tasks imported successfully!');
            }
          } else {
            alert('Invalid file format. Please select a valid JSON file exported from this app.');
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Error reading or parsing the file. Please ensure it is a valid JSON file.');
        }
      };
      reader.onerror = error => {
        console.error('Error reading file:', error);
        alert('Error reading the file.');
      };
      reader.readAsText(file);
    };
    input.click();
  },
};

export default taskApp;
window.taskApp = taskApp;