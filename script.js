// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Tasks array - stores all tasks
let tasks = [];

// Current filter: 'all', 'active', 'completed'
let currentFilter = 'all';

// ============================================
// LOAD TASKS FROM LOCAL STORAGE
// ============================================
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  renderTasks();
}

// ============================================
// SAVE TASKS TO LOCAL STORAGE
// ============================================
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ============================================
// ADD A NEW TASK
// ============================================
function addTask() {
  const text = taskInput.value.trim();
  
  if (text === '') {
    alert('Please enter a task!');
    return;
  }
  
  const newTask = {
    id: Date.now(), // Unique ID using timestamp
    text: text,
    completed: false
  };
  
  tasks.push(newTask);
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

// ============================================
// DELETE A TASK
// ============================================
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ============================================
// TOGGLE TASK COMPLETION
// ============================================
function toggleTask(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// ============================================
// CLEAR ALL COMPLETED TASKS
// ============================================
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

// ============================================
// UPDATE TASK COUNT (how many active tasks)
// ============================================
function updateTaskCount() {
  const activeTasks = tasks.filter(task => !task.completed);
  const count = activeTasks.length;
  taskCount.textContent = `${count} task${count !== 1 ? 's' : ''} left`;
}

// ============================================
// FILTER TASKS BASED ON CURRENT FILTER
// ============================================
function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    return tasks.filter(task => task.completed);
  }
  return tasks; // 'all' filter
}

// ============================================
// RENDER TASKS TO THE DOM
// ============================================
function renderTasks() {
  const filteredTasks = getFilteredTasks();
  
  if (filteredTasks.length === 0) {
    // Show empty state
    taskList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-check-circle"></i>
        <p>No tasks here!</p>
        <small>Add a new task to get started</small>
      </div>
    `;
    updateTaskCount();
    return;
  }
  
  // Generate HTML for each task
  taskList.innerHTML = filteredTasks.map(task => `
    <li class="task-item" data-id="${task.id}">
      <input 
        type="checkbox" 
        class="task-checkbox" 
        ${task.completed ? 'checked' : ''}
        onchange="toggleTask(${task.id})"
      >
      <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})">
        <i class="fas fa-trash-alt"></i>
      </button>
    </li>
  `).join('');
  
  updateTaskCount();
}

// ============================================
// ESCAPE HTML TO PREVENT XSS ATTACKS
// ============================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// SET ACTIVE FILTER BUTTON STYLE
// ============================================
function setActiveFilterBtn() {
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === currentFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// ============================================
// CHANGE FILTER AND RE-RENDER
// ============================================
function setFilter(filter) {
  currentFilter = filter;
  setActiveFilterBtn();
  renderTasks();
}

// ============================================
// EVENT LISTENERS
// ============================================
addBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompleted);

// Enter key to add task
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Filter button listeners
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    setFilter(filter);
  });
});

// ============================================
// INITIALIZE APP
// ============================================
loadTasks();