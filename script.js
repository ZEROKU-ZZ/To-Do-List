document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    checkControls();
});

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const deleteAllTasksBtn = document.getElementById('deleteAllTasksBtn');
const saveTasksBtn = document.getElementById('saveTasksBtn');
const activeTaskList = document.getElementById('activeTaskList');
const expiredTaskList = document.getElementById('expiredTaskList');
const savedTasksContainer = document.getElementById('savedTasksContainer');

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = { text: taskText, completed: false };
        addTaskToList(task);
        saveTasks();
        taskInput.value = '';
        checkControls();
    }
});

function addTaskToList(task) {
    const li = createTaskElement(task);
    if (task.completed) {
        moveToExpiredList(li);
    } else {
        activeTaskList.appendChild(li);
    }
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;

    const label = document.createElement('label');
    label.textContent = task.text;

    const status = document.createElement('span');
    status.classList.add('task-status');
    status.textContent = task.completed ? '✔️' : '❌';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        status.textContent = task.completed ? '✔️' : '❌'; // Update status text
        if (task.completed) {
            moveToExpiredList(li);
        } else {
            moveToActiveList(li);
        }
        saveTasks();
        checkControls();
    });

    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
        checkControls();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(status); // Add status (True/False) next to task name
    li.appendChild(deleteBtn);

    return li;
}

function moveToExpiredList(li) {
    expiredTaskList.appendChild(li);
    li.classList.add('completed');
}

function moveToActiveList(li) {
    activeTaskList.appendChild(li);
    li.classList.remove('completed');
}

function saveTasks() {
    localStorage.setItem('activeTasks', JSON.stringify([...activeTaskList.children].map(task => ({
        text: task.querySelector('label').textContent,
        completed: false
    }))));

    localStorage.setItem('expiredTasks', JSON.stringify([...expiredTaskList.children].map(task => ({
        text: task.querySelector('label').textContent,
        completed: true
    }))));
}

deleteAllTasksBtn.addEventListener('click', () => {
    // Clear only active and expired tasks
    activeTaskList.innerHTML = '';
    expiredTaskList.innerHTML = '';
    localStorage.setItem('activeTasks', '[]');
    localStorage.setItem('expiredTasks', '[]');
    checkControls();
});

saveTasksBtn.addEventListener('click', () => {
    const saveDate = new Date().toLocaleString();
    
    const savedGroup = document.createElement('div');
    savedGroup.classList.add('saved-group');

    const groupHeader = document.createElement('div');
    groupHeader.classList.add('saved-group-header');
    groupHeader.textContent = `Saved on: ${saveDate}`;

    const deleteGroupBtn = document.createElement('button');
    deleteGroupBtn.textContent = 'Delete Group';

    deleteGroupBtn.addEventListener('click', () => {
        savedGroup.remove();
        checkControls();
    });

    groupHeader.appendChild(deleteGroupBtn);
    savedGroup.appendChild(groupHeader);

    const tasksCopy = createTaskGroupCopy();
    savedGroup.appendChild(tasksCopy);

    savedTasksContainer.insertBefore(savedGroup, savedTasksContainer.firstChild);
    checkControls();
});

function createTaskGroupCopy() {
    const tasksGroup = document.createElement('div');

    const activeTasksCopy = [...activeTaskList.children].map(task => {
        return createSavedTaskElement(task);
    });

    const expiredTasksCopy = [...expiredTaskList.children].map(task => {
        return createSavedTaskElement(task);
    });

    tasksGroup.append(...activeTasksCopy, ...expiredTasksCopy);
    return tasksGroup;
}

function createSavedTaskElement(task) {
    const savedTask = document.createElement('div');
    savedTask.classList.add('saved-task');
    savedTask.style.display = 'flex'; // Make them look like a list with flexbox
    savedTask.style.alignItems = 'center'; // Vertically center the items
    savedTask.style.justifyContent = 'space-between'; // Vertically center the items

    const label = document.createElement('label');
    label.textContent = task.querySelector('label').textContent;

    const status = document.createElement('span');
    status.classList.add('task-status');
    const isCompleted = task.querySelector('.task-checkbox').checked;
    status.textContent = isCompleted ? '✔️ True' : '❌ False';
    status.style.color = 'white';
    status.style.marginRight = '10px';

    // Add space between the label and the status
    label.style.marginRight = '10px'; // Adjust the space here

    savedTask.appendChild(label);
    savedTask.appendChild(status);

    return savedTask;
}


function checkControls() {
    const hasTasks = activeTaskList.children.length > 0 || expiredTaskList.children.length > 0;
    deleteAllTasksBtn.style.display = hasTasks ? 'block' : 'none';
    saveTasksBtn.style.display = hasTasks ? 'block' : 'none';
}
