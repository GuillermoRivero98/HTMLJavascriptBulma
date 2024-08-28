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
            taskPriority.value = "Low";
            taskDueDate.value = "";
            taskState.value = "Backlog";
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

        if (!taskTitle.value || !taskDueDate.value || !taskState.value) {
            alert("Please fill out all required fields.");
            return;
        }

        if(!isDateValid(taskDueDate.value)){
            alert("Fecha invalida. La fecha ingresada es de un dia anterior al actual");
            return;
        }

        const state = taskState.value.toLowerCase().replace(" ", "-");
        const column = document.querySelector(`#${state}`);

        if (!column) {
            console.error(`Column with ID ${state} not found.`);
            return;
        }
        
        function isDateValid(date){
            const fechaActual = new Date();
            const [añoA, mesA, diaA] = [parseInt(fechaActual.getFullYear()),parseInt(fechaActual.getMonth())+1,parseInt(fechaActual.getDate())];
            const separado = date.split("-");
            const [añoD, mesD, diaD] = [parseInt(separado[0]),parseInt(separado[1]),parseInt(separado[2])];
            if(añoD === añoA || añoD > añoA){
                if(mesD === mesA || mesD > mesA){
                    if (diaD === diaA || diaD > diaA){
                        return true;
                    }else{
                        return false;
                    }
                } else{
                    return false;
                }
            }else{
                return false;
            }
        }

        const newTask = document.createElement("div");
        newTask.className = "box";
        newTask.draggable = true;

        newTask.innerHTML = `
            <h3 class="title is-5">${taskTitle.value}</h3>
            <p>${taskDescription.value || "Sin descripción"}</p>
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
        taskForm.reset();
    });

    function addDragAndDropListeners(task) {
        const handleDragStart = (e) => {
            draggedTask = task;
            task.classList.add("dragging");
        };

        const handleDragEnd = (e) => {
            task.classList.remove("dragging");
            draggedTask = null;
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        };

        const handleDrop = (e) => {
            e.preventDefault();
            if (draggedTask) {
                const column = e.target.closest(".column");
                if (column) {
                    column.appendChild(draggedTask);
                    draggedTask.classList.remove("dragging");
                    draggedTask = null;
                }
            }
        };

        task.addEventListener("dragstart", handleDragStart);
        task.addEventListener("dragend", handleDragEnd);

        const columns = document.querySelectorAll(".column");
        columns.forEach((column) => {
            column.addEventListener("dragover", handleDragOver);
            column.addEventListener("drop", handleDrop);
        });

        // Event listeners for touch devices
        task.addEventListener("touchstart", (e) => {
            e.preventDefault();
            draggedTask = task;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            offsetX = draggedTask.offsetLeft;
            offsetY = draggedTask.offsetTop;
        });

        task.addEventListener("touchmove", (e) => {
            e.preventDefault();
            if (draggedTask) {
                const touch = e.touches[0];
                const x = touch.clientX - startX;
                const y = touch.clientY - startY;
                draggedTask.style.position = "absolute";
                draggedTask.style.left = `${offsetX + x}px`;
                draggedTask.style.top = `${offsetY + y}px`;
            }
        });

        task.addEventListener("touchend", (e) => {
            e.preventDefault();
            if (draggedTask) {
                draggedTask.style.position = "relative";
                draggedTask.style.left = "auto";
                draggedTask.style.top = "auto";

                const column = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                if (column && column.classList.contains("column")) {
                    column.appendChild(draggedTask);
                }
                draggedTask = null;
            }
        });
    }

    function setupColumns() {
        const columns = document.querySelectorAll(".column");
        columns.forEach((column) => {
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
