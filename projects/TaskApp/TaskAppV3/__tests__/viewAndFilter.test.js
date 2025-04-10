import taskApp from '../js/alpineComponent.js';

describe('TaskAppV3 - Month, Year, Far Future Views & Search/Filter', () => {
  beforeEach(() => {
    taskApp.tasks = [];
    taskApp.searchQuery = '';
  });

  const makeTask = (overrides = {}) => ({
    id: Math.random().toString(36).substring(2),
    title: 'Test Task',
    description: 'Description',
    isCompleted: false,
    dueDate: null,
    timeEstimate: null,
    reminderDate: null,
    priority: null,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  test('Month view includes tasks due this month excluding today and this week', () => {
    const today = new Date();
    const isoToday = today.toISOString().split('T')[0];
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const isoNextWeek = nextWeek.toISOString().split('T')[0];
    const laterThisMonth = new Date(today);
    laterThisMonth.setDate(today.getDate() + 15);
    const isoLaterThisMonth = laterThisMonth.toISOString().split('T')[0];

    taskApp.tasks = [
      makeTask({ dueDate: isoToday }), // today, should be excluded
      makeTask({ dueDate: isoNextWeek }), // this week, should be excluded
      makeTask({ dueDate: isoLaterThisMonth }), // this month, should be included
      makeTask({ dueDate: isoLaterThisMonth, isCompleted: true }), // completed, excluded
    ];

    const monthTasks = taskApp.monthTasks;
    expect(monthTasks).toHaveLength(1);
    expect(monthTasks[0].dueDate).toBe(isoLaterThisMonth);
  });

  test('Year view includes tasks due this year excluding completed', () => {
    const today = new Date();
    const laterThisYear = new Date(today.getFullYear(), 11, 15); // December 15
    const isoLaterThisYear = laterThisYear.toISOString().split('T')[0];

    taskApp.tasks = [
      makeTask({ dueDate: isoLaterThisYear }),
      makeTask({ dueDate: isoLaterThisYear, isCompleted: true }),
    ];

    const yearTasks = taskApp.yearTasks;
    expect(yearTasks).toHaveLength(1);
    expect(yearTasks[0].dueDate).toBe(isoLaterThisYear);
  });

  test('Far Future view includes tasks beyond this year excluding completed', () => {
    const nextYear = new Date(new Date().getFullYear() + 1, 5, 1); // June next year
    const isoNextYear = nextYear.toISOString().split('T')[0];

    taskApp.tasks = [
      makeTask({ dueDate: isoNextYear }),
      makeTask({ dueDate: isoNextYear, isCompleted: true }),
    ];

    const futureTasks = taskApp.futureTasks;
    expect(futureTasks).toHaveLength(1);
    expect(futureTasks[0].dueDate).toBe(isoNextYear);
  });



  test('Edge case: no tasks results in empty views', () => {
    taskApp.tasks = [];
    expect(taskApp.monthTasks).toHaveLength(0);
    expect(taskApp.yearTasks).toHaveLength(0);
    expect(taskApp.futureTasks).toHaveLength(0);
  });

  test('Edge case: all tasks completed results in empty active views', () => {
    const futureDate = new Date(new Date().getFullYear() + 2, 0, 1).toISOString().split('T')[0];
    taskApp.tasks = [
      makeTask({ dueDate: futureDate, isCompleted: true }),
    ];
    expect(taskApp.futureTasks).toHaveLength(0);
  });
});