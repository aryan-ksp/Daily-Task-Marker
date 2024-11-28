// Initialize Theme from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    const taskSound = document.getElementById("taskSound");

    // Check for saved theme in localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        themeToggle.textContent = "Switch to Light Mode";
    }

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");

        if (isDarkMode) {
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "Switch to Light Mode";
        } else {
            localStorage.removeItem("theme");
            themeToggle.textContent = "Switch to Dark Mode";
        }
    });

    // Task functionality
    const addTaskButton = document.getElementById("addTaskButton");
    const taskInput = document.getElementById("taskInput");
    const taskItems = document.getElementById("taskItems");
    let taskList = [];

    // Clear old, invalid localStorage data
    if (!localStorage.getItem("tasks")) {
        localStorage.setItem("tasks", JSON.stringify([]));
    }

    // Load tasks from localStorage
    function loadTasksFromLocalStorage() {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            taskList = JSON.parse(storedTasks);
            taskList = taskList.filter(task => task.task !== "undefined" && task.task.trim() !== "");
            renderTasks();
        }
    }

    // Save tasks to localStorage
    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    // Add task
    addTaskButton.addEventListener("click", () => {
        if (taskInput.value.trim() !== "") {
            const newTask = {
                id: Date.now(),
                task: taskInput.value,
                completed: false,
                subtasks: []
            };

            taskList.push(newTask);
            taskInput.value = "";
            renderTasks();
            saveTasksToLocalStorage();
        }
    });

    // Render tasks
    function renderTasks() {
        taskItems.innerHTML = "";
        taskList.forEach((task, index) => {
            const taskItem = document.createElement("li");
            taskItem.classList.toggle("completed", task.completed);
            taskItem.innerHTML = `
                <span>${task.task}</span>
                <div>
                    <button class="completeBtn">${task.completed ? "Uncomplete" : "Complete"}</button>
                    <button class="subtaskBtn">Subtasks</button>
                    <button class="deleteBtn">Del</button>
                </div>
            `;
            taskItems.appendChild(taskItem);

            // Task completion toggle
            taskItem.querySelector(".completeBtn").addEventListener("click", () => {
                task.completed = !task.completed;
                renderTasks();
                saveTasksToLocalStorage();
                taskSound.play();
            });

            // Subtasks modal
            taskItem.querySelector(".subtaskBtn").addEventListener("click", () => {
                openSubtaskModal(task, index);
            });

            // Delete task
            taskItem.querySelector(".deleteBtn").addEventListener("click", () => {
                taskList.splice(index, 1); // Remove the task from the array
                renderTasks();
                saveTasksToLocalStorage();
            });
        });

        updateStats();
    }

    // Subtasks Modal
    const subtaskInput = document.getElementById("subtaskInput");
    const subtaskList = document.getElementById("subtaskList");
    const closeModal = document.getElementById("closeModal");
    let currentTaskIndex;

    function openSubtaskModal(task, index) {
        currentTaskIndex = index;
        subtaskInput.value = "";
        subtaskList.innerHTML = "";
        task.subtasks.forEach(subtask => {
            const subtaskItem = document.createElement("li");
            subtaskItem.textContent = subtask;
            subtaskList.appendChild(subtaskItem);
        });

        document.getElementById("taskModal").style.display = "flex";
    }

    closeModal.addEventListener("click", () => {
        document.getElementById("taskModal").style.display = "none";
    });

    // Add subtask
    document.getElementById("addSubtask").addEventListener("click", () => {
        const subtaskText = subtaskInput.value.trim();
        if (subtaskText) {
            taskList[currentTaskIndex].subtasks.push(subtaskText);
            renderTasks();
            saveTasksToLocalStorage();
            document.getElementById("taskModal").style.display = "none";
        }
    });

    // Update stats
    function updateStats() {
        const totalTasks = taskList.length;
        const completedTasks = taskList.filter(task => task.completed).length;
        const incompleteTasks = totalTasks - completedTasks;

        document.getElementById("totalTasks").textContent = `Total Tasks: ${totalTasks}`;
        document.getElementById("completedTasks").textContent = `Completed: ${completedTasks}`;
        document.getElementById("incompleteTasks").textContent = `Incomplete: ${incompleteTasks}`;
    }

    // Initial Load
    loadTasksFromLocalStorage();
});
function openSubtaskModal(task, index) {
    currentTaskIndex = index;
    subtaskInput.value = "";
    subtaskList.innerHTML = "";
    task.subtasks.forEach(subtask => {
        const subtaskItem = document.createElement("li");
        subtaskItem.textContent = subtask;
        subtaskList.appendChild(subtaskItem);
    });

    document.getElementById("taskModal").classList.add("show");
}
particlesJS("particles-js", {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.5
      },
      size: {
        value: 3,
        random: true
      }
    }
  });
  