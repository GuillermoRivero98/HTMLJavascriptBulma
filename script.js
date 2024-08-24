document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector("#taskModal");
    const newTaskButton = document.querySelector(".new-task-button");
    const cancelTaskButton = document.querySelector("#cancelTask");
    const darkModeToggle = document.querySelector("#darkModeToggle");
    const taskForm = document.querySelector("#taskForm");

    // Modal handling
    newTaskButton.addEventListener("click", () => {
        modal.classList.add("is-active");
    });

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
        modal.classList.remove("is-active");
    });

    // Drag and drop 
    let draggedTask = null;

    document.querySelectorAll(".box").forEach(task => {
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
    });

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
});

newTaskButton.addEventListener("click", () => {
    modal.classList.add("is-active");
});

