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

    let editingTask = null;
    let draggedTask = null;

    function openModal(task = null) {
        if (task) {
            taskTitle.value = task.querySelector("h3").textContent;
            taskDescription.value = task.querySelector("p:nth-of-type(1)").textContent;
            taskAssigned.value = task.querySelector("p:nth-of-type(2)").textContent.replace("Asignado a: ", "");
            taskPriority.value = task.querySelector("p:nth-of-type(3)").textContent.replace("Prioridad: ", "");
            taskDueDate.value = task.querySelector("p:nth-of-type(4)").textContent.replace("Fecha límite: ", "");
            taskState.value = task.closest(".column").getAttribute("data-state");
            editingTask = task;
        } else {
            taskTitle.value = "";
            taskDescription.value = "";
            taskAssigned.value = "";
            taskPriority.value = "Low"; // Asignar un valor predeterminado
            taskDueDate.value = "";
            taskState.value = "Backlog"; // Asignar un valor predeterminado
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

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Verificar que todos los campos requeridos tienen valor
        if (!taskTitle.value || !taskDueDate.value || !taskState.value) {
            alert("Please fill out all required fields.");
            return;
        }

        const state = taskState.value.toLowerCase();
        const column = document.querySelector(`#${state}`);

        if (!column) {
            console.error(`Column with ID ${state} not found.`);
            return;
        }

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

        addDragAndDropListeners(newTask);

        if (editingTask) {
            editingTask.replaceWith(newTask);
            editingTask = null;
        } else {
            column.appendChild(newTask);
        }

        modal.classList.remove("is-active");
        taskForm.reset(); // Limpiar el formulario después de agregar/editar tarea
    });

    function addDragAndDropListeners(task) {
        task.addEventListener("dragstart", () => {
            draggedTask = task;
            setTimeout(() => {
                task.classList.add("dragging");
            }, 0);
        });

        task.addEventListener("dragend", () => {
            setTimeout(() => {
                if (draggedTask) {
                    draggedTask.classList.remove("dragging");
                    draggedTask = null;
                }
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
                if (draggedTask) {
                    column.appendChild(draggedTask);
                    draggedTask.classList.remove("dragging");
                    draggedTask = null;
                }
            });
        });
    }

    document.querySelectorAll(".box").forEach(task => addDragAndDropListeners(task));
    setupColumns();
});
