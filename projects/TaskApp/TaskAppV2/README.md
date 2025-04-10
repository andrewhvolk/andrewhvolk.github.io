# TaskAppV2 Documentation

A modular, maintainable task management app with support for subtasks, calendar integration, filtering, and data export/import.

---

## Overview

TaskAppV2 is a JavaScript-based task management tool designed with modular architecture for easy feature extension and maintainability. It allows users to:

- Add, edit, and delete tasks and subtasks
- View tasks in a calendar
- Filter tasks by status, priority, or date
- Export and import task data (JSON)
- Enjoy a responsive UI with drag-and-drop support
- Run automated tests with Jest

---

## Modular Architecture

TaskAppV2 is split into focused modules:

| Module                   | Purpose                                                      |
|--------------------------|--------------------------------------------------------------|
| `taskManager.js`         | Core task CRUD operations                                   |
| `subtaskManager.js`      | Manage subtasks linked to tasks                             |
| `calendarManager.js`     | Calendar view and date handling                             |
| `filterManager.js`       | Filtering logic by status, priority, date                   |
| `exportImportManager.js` | Exporting/importing task data                               |
| `stateManager.js`        | Centralized app state management                            |
| `uiRenderer.js`          | Rendering UI components                                     |
| `eventHandlers.js`       | User interaction event listeners                            |

This separation improves readability, testing, and future feature additions.

---

## Features & Usage

### Adding & Editing Tasks

- **Add Task:**  
  Use the "Add Task" button or form. Enter title, description, due date, priority, and status.

- **Edit Task:**  
  Click the edit icon on a task card. Modify fields and save.

- **Delete Task:**  
  Click the delete icon on a task card.

- **Example:**

```json
{
  "id": "task-123",
  "title": "Finish report",
  "description": "Complete the quarterly report",
  "dueDate": "2025-04-15",
  "priority": "High",
  "status": "In Progress",
  "subtasks": []
}
```

---

### Managing Subtasks

- **Add Subtask:**  
  Within a task, click "Add Subtask". Enter subtask details.

- **Edit/Delete Subtask:**  
  Use edit/delete icons next to each subtask.

- **Subtasks are nested inside their parent task** and update dynamically.

---

### Calendar View

- **Access Calendar:**  
  Switch to the calendar tab or view.

- **View Tasks by Date:**  
  Tasks with due dates appear on the calendar.

- **Drag-and-Drop:**  
  Move tasks to change due dates directly on the calendar.

---

### Filters

- **Filter Options:**  
  - Status (To Do, In Progress, Done)  
  - Priority (Low, Medium, High)  
  - Due Date (Today, This Week, Overdue)

- **Apply Filters:**  
  Use the filter panel or dropdowns to refine visible tasks.

- **Combine Filters:**  
  Multiple filters can be active simultaneously.

---

### Export & Import

- **Export Tasks:**  
  Save all tasks and subtasks as a JSON file.

- **Import Tasks:**  
  Load a JSON file to restore or merge task data.

- **Usage:**

  - Click **Export** to download `tasks.json`.
  - Click **Import** and select a JSON file to upload.

- **Data Format:**

```json
[
  {
    "id": "task-123",
    "title": "Finish report",
    "subtasks": [
      {
        "id": "subtask-1",
        "title": "Draft intro"
      }
    ]
  }
]
```

---

## Running Tests

TaskAppV2 uses **Jest** for unit testing.

### Run all tests:

```bash
npx jest
```

or

```bash
npm test
```

### Test files:

- Located in `TaskAppV2/__tests__/`
- Cover modules like `stateManager`, `subtaskManager`, `exportImportManager`, `calendarView`, `dragAndDrop`, and `search`

---

## Refactor Summary

Key improvements from the refactor:

- **Modularized codebase:**  
  Split monolithic scripts into focused modules.

- **Centralized state management:**  
  Via `stateManager.js` for consistent data flow.

- **Improved test coverage:**  
  Added Jest tests for core modules.

- **Enhanced UI separation:**  
  `uiRenderer.js` handles rendering, decoupled from logic.

- **Simplified event handling:**  
  `eventHandlers.js` centralizes user interactions.

- **Better import/export:**  
  More robust JSON handling with validation.

- **Calendar integration:**  
  Modular calendar management with drag-and-drop support.

---

## Developer Notes

- **Follow modular design:**  
  Add new features as separate modules when possible.

- **State updates:**  
  Use `stateManager` methods to modify app state, then trigger UI updates.

- **UI rendering:**  
  Avoid direct DOM manipulation outside `uiRenderer.js`.

- **Testing:**  
  Write Jest tests for new modules in `__tests__/`.

- **Naming conventions:**  
  Use clear, descriptive names for functions and variables.

- **Error handling:**  
  Validate user input and handle edge cases gracefully.

- **Performance:**  
  Minimize DOM reflows and avoid redundant state updates.

- **Extensibility:**  
  The architecture supports adding features like notifications, user accounts, or API sync with minimal coupling.

---

## Summary

TaskAppV2 is a modular, testable, and maintainable task management app. Its architecture supports easy feature extension, robust data handling, and a responsive UI. Follow the module boundaries and developer notes to ensure consistent, high-quality contributions.