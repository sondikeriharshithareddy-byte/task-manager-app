let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

document.getElementById("addTask").addEventListener("click", () => {
  const text = document.getElementById("taskText").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (!text) return alert("Enter a task");

  const task = {
    id: Date.now(),
    text,
    dueDate,
    priority,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  document.getElementById("taskText").value = "";
});


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    li.setAttribute("data-id", task.id);

    li.innerHTML = `
      <div class="info">
        <strong>${task.text}</strong><br>
        <small>Due: ${task.dueDate || "No date"}</small><br>
        <span class="priority ${task.priority}">${task.priority}</span>
      </div>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="editTask(${task.id})">✏</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    list.appendChild(li);
  });
}


function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const element = document.querySelector(`[data-id="${id}"]`);
  
  if (element) {
    element.style.opacity = "0";
    element.style.transform = "translateX(50px)";
    
    setTimeout(() => {
      tasks = tasks.filter(task => task.id !== id);
      saveTasks();
      renderTasks();
    }, 300);
  }
}

function editTask(id) {
  const newText = prompt("Edit task:");
  if (!newText) return;

  tasks = tasks.map(task =>
    task.id === id ? { ...task, text: newText } : task
  );

  saveTasks();
  renderTasks();
}


document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});


const themeBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeIcon.textContent = "☀️";
  } else {
    themeIcon.textContent = "🌙";
  }
});

tasks.sort((a, b) => {
  const order = { High: 3, Medium: 2, Low: 1 };
  return order[b.priority] - order[a.priority];
});

renderTasks();