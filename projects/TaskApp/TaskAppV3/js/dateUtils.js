// @ts-nocheck
export function isToday(dateStr) {
  if (!dateStr) return false;
  const today = dayjs();
  return dayjs(dateStr).isSame(today, 'day');
}

export function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const date = dayjs(dateStr);
  const startOfWeek = dayjs().startOf('week');
  const endOfWeek = dayjs().endOf('week');
  return date.isAfter(startOfWeek.subtract(1, 'day')) && date.isBefore(endOfWeek.add(1, 'day'));
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  return dayjs(dateStr).isBefore(dayjs(), 'day');
}

export function resetOverdueTasks(tasks) {
  let updated = false;
  tasks.forEach(task => {
    if (
      task.dueDate &&
      !task.isCompleted &&
      isOverdue(task.dueDate)
    ) {
      task.dueDate = null;
      updated = true;
    }
  });
  return updated;
}

export function isThisMonth(dateStr) {
  if (!dateStr) return false;
  const today = dayjs();
  return dayjs(dateStr).isSame(today, 'month');
}

export function isThisYear(dateStr) {
  if (!dateStr) return false;
  const date = dayjs(dateStr);
  const today = dayjs();
  return dayjs(date).isSame(today, 'year');
}

export function isFutureBeyondYear(dateStr) {
  if (!dateStr) return false;
  const date = dayjs(dateStr);
  const endOfYear = dayjs().endOf('year');
  return date.isAfter(endOfYear);
}

export function isWithinRange(dateStr, start, end) {
  if (!dateStr) return false;
  const date = dayjs(dateStr);
  return date.isSame(start) || date.isSame(end) || (date.isAfter(start) && date.isBefore(end));
}

export function isTodayOrFuture(dateStr) {
  if (!dateStr) return false;
  const date = dayjs(dateStr);
  const today = dayjs().startOf('day');
  return date.isSame(today, 'day') || date.isAfter(today);
}