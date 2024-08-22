// Variables para manejar el modal
const taskModal = document.getElementById('taskModal');
const newTaskButton = document.querySelector('.new-task-button');
const cancelTaskButton = document.getElementById('cancelTask');
const taskForm = document.getElementById('taskForm');
const taskColumns = document.getElementById('taskColumns');

// Función para abrir el modal
newTaskButton.addEventListener('click', () => {
    taskModal.classList.add('is-active');
});

// Función para cerrar el modal
cancelTaskButton.addEventListener('click', () => {
    taskModal.classList.remove('is-active');
});

// Función para manejar el envío del formulario
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener valores del formulario
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const assigned = document.getElementById('taskAssigned').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const state = document.getElementById('taskState').value;

    // Crear una nueva tarea
    const newTask = document.createElement('div');
    newTask.classList.add('box');
    newTask.draggable = true;
    newTask.innerHTML = `
        <h3 class="title is-5">${title}</h3>
        <p>${description}</p>
        <p><strong>Asignado a:</strong> ${assigned}</p>
        <p><strong>Prioridad:</strong> ${priority}</p>
        <p><strong>Fecha límite:</strong> ${dueDate}</p>
    `;

    // Añadir la nueva tarea a la columna correspondiente
    const targetColumn = document.getElementById(state.toLowerCase().replace(' ', '-'));
    targetColumn.appendChild(newTask);

    // Cerrar el modal
    taskModal.classList.remove('is-active');
    taskForm.reset();
});

// Funciones para manejar el arrastre y soltar tareas
document.addEventListener('dragstart', (event) => {
    if (event.target.classList.contains('box')) {
        event.dataTransfer.setData('text/plain', event.target.innerHTML);
        event.dataTransfer.setData('text/plain', event.target.parentElement.id);
        event.target.classList.add('dragging');
    }
});

document.addEventListener('dragend', (event) => {
    if (event.target.classList.contains('box')) {
        event.target.classList.remove('dragging');
    }
});

document.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (event.target.classList.contains('column')) {
        event.target.classList.add('over');
    }
});

document.addEventListener('dragleave', (event) => {
    if (event.target.classList.contains('column')) {
        event.target.classList.remove('over');
    }
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    if (event.target.classList.contains('column')) {
        const columnId = event.target.id;
        const taskHtml = event.dataTransfer.getData('text/plain');
        const originColumnId = event.dataTransfer.getData('text/plain').split('<')[0].trim();

        if (columnId !== originColumnId) {
            const newTask = document.createElement('div');
            newTask.classList.add('box');
            newTask.draggable = true;
            newTask.innerHTML = taskHtml;
            event.target.appendChild(newTask);

            // Remove task from original column
            const originColumn = document.getElementById(originColumnId);
            const taskToRemove = originColumn.querySelector('.dragging');
            if (taskToRemove) {
                originColumn.removeChild(taskToRemove);
            }
        }
        event.target.classList.remove('over');
    }
});
