//редактирования текста задачи

document.querySelectorAll('.js-task-edit')
    .forEach(button=> {
        button.addEventListener('click', createTaskText)
    });

// создаем кнопку редактирования

function createTaskEditButton() {
    let editButton = document.createElement('button');
    editButton.className = 'button button-edit js-task-edit';
    editButton.innerText = '✎';

    return editButton;
}

// для работы с задачами

function createEditTaskButton() {
    let button = createTaskEditButton();
    button.addEventListener('click', createTaskText);

    return button;
}

function createTaskText(event) {
    event.stopPropagation();
    let task = event.target.parentElement;
    replaceTaskWithInput(task);
}

//заменяем текущую задачу полем ввода

function replaceTaskWithInput(text) {
    let taskText = text.querySelector('.tasks__task-text');
    let styles = window.getComputedStyle(taskText);
    let rows = (taskText.getBoundingClientRect().height / parseInt(styles.lineHeight));
    const oldText = taskText.innerText;
    const task = text.closest('.tasks__task')
    const id = task.dataset.taskId;
    let input = createTaskInput(oldText, rows, (newText) => {
        api.editTask(id, newText)
            .then((response) => {
                console.log(response);
            })
            .catch((reason) => {
                console.error(reason);
                const taskText = text.querySelector('.tasks__task-text');
                taskText.innerHTML = oldText;
            });
    });
    text.innerHTML = '';
    text.appendChild(input);
    input.focus();
}

// создаем новый текст

function createTaskInput(text, rows, handler) {
    let input = createInput(text, rows);
    input.onblur = () => {
        handler(input.value);
        replaceInputWithTask(input);
    };

    return input;
}

// создаем новый текст задачи

function createEditNewTaskText(text) {
    let taskText = document.createElement('span');
    taskText.classList.add('tasks__task-text');
    taskText.innerText = text.trim();
    // taskText.onclick = taskDone;

    return taskText;
}
// заменяем поле ввода на новый текст, если текста нет, то удаляем. Добавляем конпку редактирования.
function replaceInputWithTask(input) {
    let newText = input.value;
    let task = input.parentElement;
    if (newText.trim() === '') {
        task.remove();
    } else {
        task.innerHTML = '';
        task.appendChild(createEditNewTaskText(newText));
        task.appendChild(createEditTaskButton());
    }
}

// // подтверждаем выполнения задачи
//
// function taskDone(event) {
//     let task = event.target.parentElement;
//     task.classList.toggle('done');
// }

// создаем разметку новой задачи c полем ввода
function createNewTask(text) {
    let li = document.createElement('li');
    let taskText = document.createElement('tasks__task-text');
    li.classList.add('tasks__task');
    taskText.append(createTaskEditButton());
    taskText.append(createTaskButtonRemove());
    let taskInput = createTaskInput('', 1, (text) => {
        api.createTasks(text)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                li.dataset.id = data.data.id;
            })
            .catch((reason) => {
                console.log(reason);
            });
    });

    li.appendChild(taskInput);
    text.appendChild(li);

    taskInput.focus();
}

// создаем кнопку новой задачи

function createNewTaskButton() {
    let newTaskButton = document.createElement('button');
    newTaskButton.className = 'button button-task-new js-task-create';
    newTaskButton.innerText = '+';

    newTaskButton.onclick = function (event) {
        let task = event.target.parentElement.querySelector('.tasks');
        createNewTask(task);
    };

    return newTaskButton;
}


// добавляем кнопку создания новой задачи

let notes = document.querySelectorAll(".note");

for (let button of notes) {
    button.appendChild(createNewTaskButton());
    button.appendChild(createTaskListButtonRemove());
}

//удаление задачи

//отрисовка кнопки удаления доски и удаление доски сразу после создания

function createTaskButtonRemove() {
    let createButtonRemove = document.createElement('button');
    createButtonRemove.className = 'button button-tasks-remove js-task-remove';
    createButtonRemove.innerText = '🞫';
    createButtonRemove.addEventListener('click', onTaskRemove);

    return createButtonRemove;
}


document.querySelectorAll('.js-task-remove')
    .forEach(button => {
        button.addEventListener('click', onTaskRemove)
    });

function onTaskRemove(event) {
    const button = event.target;
    const task = button.closest('.tasks__task');
    const taskList = task.parentNode;
    const id = task.dataset.taskId;
    window.api
        .removeTask(id)
        .then(response => {
            if (!response.ok) {
                taskList.appendChild(task);
            }
        })
        .catch(reason => {
            console.error(reason);
        });
    task.remove();
}

