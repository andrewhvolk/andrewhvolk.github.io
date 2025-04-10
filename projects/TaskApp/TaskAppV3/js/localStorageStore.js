const STORAGE_KEY = 'personalTasksApp_tasks';

const sampleTasks = [
  {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    title: 'Sample Inbox Task',
    description: 'This task needs processing',
    isCompleted: false,
    dueDate: null,
    timeEstimate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: (Date.now()+1).toString(36) + Math.random().toString(36).substr(2),
    title: 'Sample Today Task',
    description: 'Due today, already processed',
    isCompleted: false,
    dueDate: new Date().toISOString().split('T')[0],
    timeEstimate: '20m',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: (Date.now()+2).toString(36) + Math.random().toString(36).substr(2),
    title: 'Completed Sample Task',
    description: 'This task is done',
    isCompleted: true,
    dueDate: new Date().toISOString().split('T')[0],
    timeEstimate: '1h',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
      return sampleTasks;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading tasks:', e);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
}