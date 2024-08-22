document.addEventListener("DOMContentLoaded", () => {
    const newTaskButton = document.querySelector('.new-task-button');
    const taskModal = document.querySelector('#taskModal');
    const modalClose = document.querySelector('.modal-close');
    const cancelTaskButton = document.querySelector('#cancelTask');
    const taskForm = document.querySelector('#taskForm');
    const taskColumns = document.querySelector('#taskColumns');

    let currentTask = null;
    let draggedTask = null;

    newTaskButton.addEventListener('click', () => {
        currentTask = null;
        taskForm.reset();
        document.querySelector('#taskState').value = 'Backlog';
        taskModal.classList.add('is-active');
    });

    const closeModal = () => {
        taskModal.classList.remove('is-active');
    };

    modalClose.addEventListener('click', closeModal);
    cancelTaskButton.addEventListener('click', closeModal);

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.querySelector('#taskTitle').value;
        const description = document.querySelector('#taskDescription').value;
        const assignedTo = document.querySelector('#taskAssigned').value;
        const priority = document.querySelector('#taskPriority').value;
        const dueDate = document.querySelector('#taskDueDate').value;
        const state = document.querySelector('#taskState').value;

        const taskData = {
            title,
            description,
            assignedTo,
            priority,
            dueDate
        };

        if (currentTask) {
            updateTask(currentTask, taskData, state);
        } else {
            createTask(taskData, state);
        }

        closeModal();
    });

    function createTask(taskData, state) {
        const column = document.querySelector(`#${state.toLowerCase().replace(' ', '-')}`);
        const taskElement = document.createElement('div');
        taskElement.className = 'box';
        taskElement.draggable = true;
        taskElement.innerHTML = `
            <h3 class="title is-5">${taskData.title}</h3>
            <p>${taskData.description}</p>
            <p><strong>Assigned to:</strong> ${taskData.assignedTo}</p>
            <p><strong>Priority:</strong> ${taskData.priority}</p>
            <p><strong>Due Date:</strong> ${taskData.dueDate}</p>
            <button class="button is-small is-danger delete-task">Delete</button>
        `;

        taskElement.addEventListener('dragstart', (event) => {
            draggedTask = event.target;
            event.dataTransfer.effectAllowed = 'move';
        });

        taskElement.addEventListener('dragend', () => {
            draggedTask = null;
        });

        taskElement.querySelector('.delete-task').addEventListener('click', () => {
            column.removeChild(taskElement);
        });

        column.appendChild(taskElement);
    }

    function updateTask(taskElement, taskData, newState) {
        const taskColumn = document.querySelector(`#${newState.toLowerCase().replace(' ', '-')}`);
        taskColumn.appendChild(taskElement);

        taskElement.innerHTML = `
            <h3 class="title is-5">${taskData.title}</h3>
            <p>${taskData.description}</p>
            <p><strong>Assigned to:</strong> ${taskData.assignedTo}</p>
            <p><strong>Priority:</strong> ${taskData.priority}</p>
            <p><strong>Due Date:</strong> ${taskData.dueDate}</p>
            <button class="button is-small is-danger delete-task">Delete</button>
        `;

        taskElement.querySelector('.delete-task').addEventListener('click', () => {
            taskColumn.removeChild(taskElement);
        });
    }

    taskColumns.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    });

    taskColumns.addEventListener('drop', (event) => {
        event.preventDefault();
        if (draggedTask) {
            const targetColumn = event.target.closest('.column');
            if (targetColumn && targetColumn !== draggedTask.parentElement) {
                const state = targetColumn.dataset.state;
                updateTask(draggedTask, {
                    title: draggedTask.querySelector('h3').textContent,
                    description: draggedTask.querySelector('p').textContent,
                    assignedTo: draggedTask.querySelector('p:nth-of-type(2)').textContent.split(': ')[1],
                    priority: draggedTask.querySelector('p:nth-of-type(3)').textContent.split(': ')[1],
                    dueDate: draggedTask.querySelector('p:nth-of-type(4)').textContent.split(': ')[1],
                }, state);
            }
        }
    });
});
