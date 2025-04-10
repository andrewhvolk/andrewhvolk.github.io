/**
 * @jest-environment jsdom
 */

import { exportData, importData } from '../modules/exportImportManager.js';

describe('Export/Import Manager', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    };
  });

  test('should export current app state as JSON string', () => {
    const json = exportData();
    expect(typeof json).toBe('string');
    expect(() => JSON.parse(json)).not.toThrow();
  });

  test('should import valid JSON data and update app state', () => {
    const mockData = JSON.stringify({ tasks: [{ id: '1', title: 'Imported Task' }] });
    importData(mockData);
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  test('should throw error when importing invalid JSON', () => {
    const invalidJson = "{ bad json }";
    expect(() => importData(invalidJson)).toThrow();
  });

  test('should overwrite existing state on import', () => {
    const initialData = JSON.stringify({ tasks: [{ id: '1', title: 'Old Task' }] });
    const newData = JSON.stringify({ tasks: [{ id: '2', title: 'New Task' }] });
    importData(initialData);
    importData(newData);
    expect(global.localStorage.setItem).toHaveBeenCalledTimes(2);
  });

  test('should handle empty export gracefully', () => {
    // Simulate empty state
    global.localStorage.getItem.mockReturnValueOnce(null);
    const json = exportData();
    expect(typeof json).toBe('string');
    expect(() => JSON.parse(json)).not.toThrow();
  });

  test('should handle large data export/import', () => {
    const largeTasks = Array.from({ length: 1000 }, (_, i) => ({ id: `${i}`, title: `Task ${i}` }));
    const largeData = JSON.stringify({ tasks: largeTasks });
    importData(largeData);
    const exported = exportData();
    expect(() => JSON.parse(exported)).not.toThrow();
  });
});