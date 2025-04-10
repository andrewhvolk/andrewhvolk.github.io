/**
 * Drag-and-Drop Module for Task App V2
 * Handles task and subtask reordering, moving, accessibility, and persistence
 */

const DragAndDrop = (() => {
  let draggedElement = null;
  let liveRegion = null;

  function initDragAndDrop() {
    createLiveRegion();
    addDnDHandlersToAll();
    addDnDHandlersToBuckets();
    addKeyboardSupport();
  }

  function createLiveRegion() {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('role', 'status');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  function announce(message) {
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 10);
    }
  }
  function addDnDHandlersToBuckets() {
    const bucketIds = ['today-list', 'future-list'];
    bucketIds.forEach(id => {
      const bucket = document.getElementById(id);
      if (bucket) {
        bucket.addEventListener('dragover', e => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          bucket.classList.add('drag-over');
        });
        bucket.addEventListener('dragleave', () => {
          bucket.classList.remove('drag-over');
        });
        bucket.addEventListener('drop', e => {
          e.preventDefault();
          bucket.classList.remove('drag-over');
          if (!draggedElement) return;
          if (!bucket.contains(draggedElement)) {
            bucket.appendChild(draggedElement);
            announce('Moved ' + draggedElement.textContent.trim() + ' to new list');
            persistOrder();
            resetAriaGrabbed();
            draggedElement = null;
          }
        });
      }
    });
  }


  function addDnDHandlersToAll() {
    const draggables = document.querySelectorAll('[draggable="true"]');
    draggables.forEach(el => {
      el.addEventListener('dragstart', handleDragStart);
      el.addEventListener('dragover', handleDragOver);
      el.addEventListener('drop', handleDrop);
      el.addEventListener('dragend', handleDragEnd);
    });
  }

  function handleDragStart(e) {
    draggedElement = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    draggedElement.setAttribute('aria-grabbed', 'true');
    announce('Picked up ' + draggedElement.textContent.trim());
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e) {
    e.preventDefault();
    if (!draggedElement) return;

    const dropTarget = e.target.closest('[draggable="true"]');
    const dropList = e.target.closest('[role="list"]');

    if (dropTarget && dropTarget !== draggedElement) {
      dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
      announce('Moved ' + draggedElement.textContent.trim());
    } else if (dropList && !dropList.contains(draggedElement)) {
      dropList.appendChild(draggedElement);
      announce('Moved ' + draggedElement.textContent.trim() + ' to new list');
    }

    persistOrder();
    resetAriaGrabbed();
    draggedElement = null;
  }

  function handleDragEnd() {
    resetAriaGrabbed();
    draggedElement = null;
  }

  function resetAriaGrabbed() {
    document.querySelectorAll('[aria-grabbed]').forEach(el => {
      el.setAttribute('aria-grabbed', 'false');
    });
  }

  function persistOrder() {
    // Collect new order from DOM
    const todayList = document.getElementById('today-list');
    const futureList = document.getElementById('future-list');

    const newTasks = [];

    [todayList, futureList].forEach(list => {
      list.querySelectorAll('.task-item').forEach(li => {
        const taskId = li.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          task.bucket = list.id === 'today-list' ? 'Today' : 'Future';
          newTasks.push(task);
          // Handle subtasks if any
          const subtaskEls = li.querySelectorAll('.subtask-item');
          task.subtasks = [];
          subtaskEls.forEach(subEl => {
            const subId = subEl.dataset.id;
            const subtask = task.subtasks.find(st => st.id === subId);
            if (subtask) task.subtasks.push(subtask);
          });
        }
      });
    });

    tasks.length = 0;
    newTasks.forEach(t => tasks.push(t));
    saveTasks(tasks);
    renderAll();
  }

  function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      if (!active || !active.hasAttribute('draggable')) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!draggedElement) {
          draggedElement = active;
          active.setAttribute('aria-grabbed', 'true');
          announce('Picked up ' + active.textContent.trim());
        } else {
          draggedElement.setAttribute('aria-grabbed', 'false');
          draggedElement = null;
          announce('Dropped');
          persistOrder();
        }
      }

      if (!draggedElement) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = draggedElement.previousElementSibling;
        if (prev) {
          prev.parentNode.insertBefore(draggedElement, prev);
          announce('Moved up');
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = draggedElement.nextElementSibling;
        if (next) {
          next.parentNode.insertBefore(next, draggedElement);
          announce('Moved down');
        }
      }
    });
  }

  return { initDragAndDrop };
})();

window.DragAndDrop = DragAndDrop;