document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector("#taskModal");
    const newTaskButton = document.querySelector(".new-task-button");
    const cancelTaskButton = document.querySelector("#cancelTask");
    const darkModeToggle = document.querySelector("#darkModeToggle");
    const taskForm = document.querySelector("#taskForm");
    const taskTitle = document.querySelector("#taskTitle");
    const taskDescription = document.querySelector("#taskDescription");
    const taskAssigned = document.querySelector("#taskAssigned");
    const taskPriority = document.querySelector("#taskPriority");
    const taskDueDate = document.querySelector("#taskDueDate");
    const taskState = document.querySelector("#taskState");
    
    let editingTask = null; // Track which task is being edited
    let draggedTask = null; // Track the currently dragged task

    // Modal handling
    function openModal(task = null) {
        if (task) {
            // Load task data into form fields
            taskTitle.value = task.querySelector("h3").textContent;
            taskDescription.value = task.querySelector("p:nth-of-type(1)").textContent;
            taskAssigned.value = task.querySelector("p:nth-of-type(2)").textContent.replace("Asignado a: ", "");
            taskPriority.value = task.querySelector("p:nth-of-type(3)").textContent.replace("Prioridad: ", "");
            taskDueDate.value = task.querySelector("p:nth-of-type(4)").textContent.replace("Fecha límite: ", "");
            taskState.value = task.closest(".column").getAttribute("data-state");
            editingTask = task;
        } else {
            // Clear form fields
            taskTitle.value = "";
            taskDescription.value = "";
            taskAssigned.value = "";
            taskPriority.value = "";
            taskDueDate.value = "";
            taskState.value = "";
            editingTask = null;
        }
        modal.classList.add("is-active");
    }

    newTaskButton.addEventListener("click", () => openModal());

    cancelTaskButton.addEventListener("click", () => {
        modal.classList.remove("is-active");
    });

    document.querySelector(".modal-close").addEventListener("click", () => {
        modal.classList.remove("is-active");
    });

    // Dark mode toggle
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const state = taskState.value;
        const newTask = document.createElement("div");
        newTask.className = "box";
        newTask.draggable = true;
        newTask.innerHTML = `
            <h3 class="title is-5">${taskTitle.value}</h3>
            <p>${taskDescription.value}</p>
            <p><strong>Asignado a:</strong> ${taskAssigned.value}</p>
            <p><strong>Prioridad:</strong> ${taskPriority.value}</p>
            <p><strong>Fecha límite:</strong> ${taskDueDate.value}</p>
        `;
        
        // Add event listeners to the new task
        addDragAndDropListeners(newTask);

        if (editingTask) {
            // Replace existing task
            editingTask.replaceWith(newTask);
        } else {
            // Add new task to column
            document.querySelector(`#${state.toLowerCase()}`).appendChild(newTask);
        }
        
        modal.classList.remove("is-active");
    });

    function addDragAndDropListeners(task) {
        task.addEventListener("dragstart", (e) => {
            draggedTask = task;
            setTimeout(() => {
                task.classList.add("dragging");
            }, 0);
        });

        task.addEventListener("dragend", () => {
            setTimeout(() => {
                draggedTask.classList.remove("dragging");
                draggedTask = null;
            }, 0);
        });
    }

    function setupColumns() {
        document.querySelectorAll(".column").forEach(column => {
            column.addEventListener("dragover", (e) => {
                e.preventDefault();
                column.classList.add("over");
            });

            column.addEventListener("dragleave", () => {
                column.classList.remove("over");
            });

            column.addEventListener("drop", () => {
                column.classList.remove("over");
                column.appendChild(draggedTask);
            });
        });
    }

    // Initialize drag and drop listeners for existing tasks and columns
    document.querySelectorAll(".box").forEach(task => addDragAndDropListeners(task));
    setupColumns();
});
