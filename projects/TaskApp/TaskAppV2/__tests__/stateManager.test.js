/**
 * @jest-environment jsdom
 */

import { loadState, saveState, setState } from '../modules/stateManager.js';

describe('State Manager', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    };
  });

  test('should load state from localStorage', () => {
    const mockState = { tasks: [{ id: '1', title: 'Test Task' }] };
    global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockState));
    const state = loadState();
    expect(state).toEqual(mockState);
  });

  test('should return default state if localStorage is empty', () => {
    global.localStorage.getItem.mockReturnValueOnce(null);
    const state = loadState();
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  });

  test('should throw error if stored state is corrupted', () => {
    global.localStorage.getItem.mockReturnValueOnce("{ bad json }");
    expect(() => loadState()).toThrow();
  });

  test('should save state to localStorage', () => {
    const state = { tasks: [{ id: '1', title: 'Save Task' }] };
    saveState(state);
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  test('should update state immutably with setState', () => {
    const initialState = { tasks: [{ id: '1', title: 'Initial' }] };
    global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(initialState));
    const newState = { tasks: [{ id: '2', title: 'New' }] };
    setState(newState);
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  test('should handle partial state updates gracefully', () => {
    const initialState = { tasks: [{ id: '1', title: 'Initial' }], filters: {} };
    global.localStorage.getItem.mockReturnValueOnce(JSON.stringify(initialState));
    const partialUpdate = { filters: { status: 'completed' } };
    setState(partialUpdate);
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });
});