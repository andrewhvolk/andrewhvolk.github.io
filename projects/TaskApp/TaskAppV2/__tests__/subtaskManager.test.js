/**
 * @jest-environment jsdom
 */

import { addSubtask, deleteSubtask, toggleSubtaskCompletion } from '../modules/subtaskManager.js';

describe('Subtask Management', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    };
  });

  test('should add a subtask to a task', () => {
    // Arrange: mock state with one task
    const taskId = 'task-1';
    const subtaskData = { title: 'Subtask A', completed: false };
    // Act
    const updatedTask = addSubtask(taskId, subtaskData);
    // Assert
    expect(updatedTask.subtasks).toContainEqual(expect.objectContaining(subtaskData));
    // Persistence
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  test('should delete a subtask from a task', () => {
    // Arrange: mock state with one task and one subtask
    const taskId = 'task-1';
    const subtaskId = 'sub-1';
    // Act
    const updatedTask = deleteSubtask(taskId, subtaskId);
    // Assert
    expect(updatedTask.subtasks.find(st => st.id === subtaskId)).toBeUndefined();
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  test('should toggle subtask completion status', () => {
    const taskId = 'task-1';
    const subtaskId = 'sub-1';
    // Act
    const updatedTask = toggleSubtaskCompletion(taskId, subtaskId);
    // Assert
    const toggled = updatedTask.subtasks.find(st => st.id === subtaskId);
    expect(toggled.completed).toBe(true); // or false, depending on initial
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  test('should handle adding subtask to non-existent task gracefully', () => {
    const invalidTaskId = 'non-existent';
    const subtaskData = { title: 'Ghost Subtask' };
    expect(() => addSubtask(invalidTaskId, subtaskData)).toThrow();
  });

  test('should handle deleting non-existent subtask gracefully', () => {
    const taskId = 'task-1';
    const invalidSubtaskId = 'ghost-subtask';
    expect(() => deleteSubtask(taskId, invalidSubtaskId)).toThrow();
  });

  test('should handle toggling non-existent subtask gracefully', () => {
    const taskId = 'task-1';
    const invalidSubtaskId = 'ghost-subtask';
    expect(() => toggleSubtaskCompletion(taskId, invalidSubtaskId)).toThrow();
  });
});