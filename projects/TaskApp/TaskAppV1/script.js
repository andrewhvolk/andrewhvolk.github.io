document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
  });
  
  const newTaskInput = document.getElementById("newTaskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  
  // Add task on button click
  addTaskBtn.addEventListener("click", () => {
    addTask();
  });
  
  // Add task on Enter key press
  newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });
  
  function addTask() {
    const taskTitle = newTaskInput.value.trim();
    if (taskTitle) {
      const tasks = getTasksFromStorage();
      tasks.push({ title: taskTitle, subtasks: [] });
      saveTasksToStorage(tasks);
      newTaskInput.value = "";
      renderTasks(tasks);
    }
  }
  
  function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }
  
  function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  function loadTasks() {
    const tasks = getTasksFromStorage();
    renderTasks(tasks);
  }
  
  function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const taskEl = createTaskItem(task, index, tasks);
      taskList.appendChild(taskEl);
    });
  }
  
  function createTaskItem(task, index, tasks) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
  
    const taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");
  
    const taskTitleSpan = document.createElement("span");
    taskTitleSpan.textContent = task.title;
  
    const addSubtaskBtn = document.createElement("button");
    addSubtaskBtn.textContent = "Add Subtask";
    addSubtaskBtn.addEventListener("click", () => {
      const subtaskTitle = prompt("Enter subtask title:");
      if (subtaskTitle) {
        task.subtasks.push({ title: subtaskTitle, done: false });
        saveTasksToStorage(tasks);
        renderTasks(tasks);
      }
    });
  
    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.textContent = "Delete";
    deleteTaskBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasksToStorage(tasks);
      renderTasks(tasks);
    });
  
    taskHeader.appendChild(taskTitleSpan);
    taskHeader.appendChild(addSubtaskBtn);
    taskHeader.appendChild(deleteTaskBtn);
    taskItem.appendChild(taskHeader);
  
    const subtaskUl = document.createElement("ul");
    subtaskUl.classList.add("subtask-list");
  
    task.subtasks.forEach((subtask, subIndex) => {
      const subtaskLi = document.createElement("li");
      subtaskLi.classList.add("subtask-item");
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = subtask.done;
      checkbox.addEventListener("change", () => {
        task.subtasks[subIndex].done = checkbox.checked;
        saveTasksToStorage(tasks);
      });
  
      const subtaskTitle = document.createElement("span");
      subtaskTitle.textContent = subtask.title;
  
      const deleteSubtaskBtn = document.createElement("button");
      deleteSubtaskBtn.textContent = "Delete";
      deleteSubtaskBtn.addEventListener("click", () => {
        task.subtasks.splice(subIndex, 1);
        saveTasksToStorage(tasks);
        renderTasks(tasks);
      });
  
      subtaskLi.appendChild(checkbox);
      subtaskLi.appendChild(subtaskTitle);
      subtaskLi.appendChild(deleteSubtaskBtn);
      subtaskUl.appendChild(subtaskLi);
    });
  
    taskItem.appendChild(subtaskUl);
    return taskItem;
  }
  