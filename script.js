document.addEventListener("DOMContentLoaded", () => {
    const newTaskButton = document.querySelector('.new-task-button');
    const taskModal = document.querySelector('#taskModal');
    const modalClose = document.querySelector('.modal-close');
    const cancelTaskButton = document.querySelector('#cancelTask');
    const taskForm = document.querySelector('#taskForm');

    let currentTask = null;

    // Abrir el modal para nueva tarea
    newTaskButton.addEventListener('click', () => {
        currentTask = null;
        taskForm.reset();
        taskModal.classList.add('is-active');
    });

    // Cerrar el modal
    const closeModal = () => {
        taskModal.classList.remove('is-active');
    };

    modalClose.addEventListener('click', closeModal);
    cancelTaskButton.addEventListener('click', closeModal);

    // Guardar la tarea y cerrar el modal
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.querySelector('#taskTitle').value;
        const description = document.querySelector('#taskDescription').value;
        const assignedTo = document.querySelector('#taskAssigned').value;
        const priority = document.querySelector('#taskPriority').value;
        const dueDate = document.querySelector('#taskDueDate').value;

        const taskData = {
            title,
            description,
            assignedTo,
            priority,
            dueDate
        };

        if (currentTask) {
            // Editar tarea existente
            updateTask(currentTask, taskData);
        } else {
            // Crear nueva tarea
            createTask(taskData);
        }

        closeModal();
    });

    // Crear una nueva tarea
    function createTask(taskData) {
        const state = document.querySelector('#taskState').value;
        const column = document.querySelector(`.column h2:contains(${state})`).parentElement;

        const taskHTML = `
            <div class="box" draggable="true">
                <h3 class="title is-5">${taskData.title}</h3>
                <p>${taskData.description}</p>
                <p><strong>Asignado a:</strong> ${taskData.assignedTo}</p>
                <p><strong>Prioridad:</strong> ${taskData.priority}</p>
                <p><strong>Fecha límite:</strong> ${taskData.dueDate}</p>
            </div>
        `;

        column.innerHTML += taskHTML;

        initDragAndDrop();
    }

    // Editar una tarea existente
    function updateTask(taskElement, taskData) {
        taskElement.querySelector('h3').textContent = taskData.title;
        taskElement.querySelector('p:nth-of-type(1)').textContent = taskData.description;
        taskElement.querySelector('p:nth-of-type(2)').textContent = `Asignado a: ${taskData.assignedTo}`;
        taskElement.querySelector('p:nth-of-type(3)').textContent = `Prioridad: ${taskData.priority}`;
        taskElement.querySelector('p:nth-of-type(4)').textContent = `Fecha límite: ${taskData.dueDate}`;
    }

    // Drag and Drop
    function initDragAndDrop() {
        const draggables = document.querySelectorAll('.box');
        const columns = document.querySelectorAll('.column');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
            });
        });

        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(column, e.clientY);
                const dragging = document.querySelector('.dragging');
                if (afterElement == null) {
                    column.appendChild(dragging);
                } else {
                    column.insertBefore(dragging, afterElement);
                }
            });
        });
    }

    function getDragAfterElement(column, y) {
        const draggableElements = [...column.querySelectorAll('.box:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    initDragAndDrop();
});
