document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => renderTask(task));

  addTaskButton.addEventListener("click", () => {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    todoInput.value = "";
  });

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    // initial visual state
    updateClasses(li, task);

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="dropdown">
        <button class="dropdown-toggle">⋮</button>
        <div class="dropdown-menu">
          <button class="dropdown-item complete-btn">Completed</button>
          <button class="dropdown-item progress-btn">In Progress</button>
          <button class="dropdown-item delete-btn">Delete</button>
        </div>
      </div>
    `;

    // COMPLETED
    li.querySelector(".complete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      task.completed = true;
      updateClasses(li, task);
      saveTasks();
    });

    // IN PROGRESS
    li.querySelector(".progress-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      task.completed = false;
      updateClasses(li, task);
      saveTasks();
    });

    // DELETE
    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      saveTasks();
    });

    todoList.appendChild(li);
  }

  function updateClasses(li, task) {
    li.classList.toggle("completed", task.completed);
    li.classList.toggle("in-progress", !task.completed);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

// Handle dropdown open/close
document.addEventListener("click", function (e) {
  document.querySelectorAll(".dropdown").forEach((d) =>
    d.classList.remove("show")
  );

  if (e.target.classList.contains("dropdown-toggle")) {
    e.stopPropagation();
    e.target.parentElement.classList.toggle("show");
  }
});
