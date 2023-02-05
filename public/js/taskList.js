//редактирование заголовка доски

document.querySelectorAll('.js-task-list-edit')
    .forEach(button => {
        button.addEventListener('click', createTaskListTitleText)
    });

// создаем кнопку редактирования

function createTaskListEditButton() {
    let editButton = document.createElement('button');
    editButton.className = 'button button-edit js-task-list-edit';
    editButton.innerText = '✎';

    return editButton;
}

// для работы с заголовком

function createEditTaskListButton() {
    let button = createTaskListEditButton();
    button.addEventListener('click', createTaskListTitleText);

    return button;
}

function createTaskListTitleText(event) {
    event.stopPropagation();
    let note = event.target.parentElement;
    replaceTaskListTitleWithInput(note);
}

// заменяем текущий заголовок заметки полем ввода

function replaceTaskListTitleWithInput(title) {
    let titleText = title.querySelector('.title-note-text');
    let styles = window.getComputedStyle(titleText);
    let rows = (titleText.getBoundingClientRect().height / parseInt(styles.lineHeight));
    const oldTitle = titleText.innerText;
    const taskLists = title.closest('.note');
    const id = taskLists.dataset.taskListId;
    let input = createTaskListTitleInput(oldTitle, rows, (newTitle) => {
        api.editTaskList(id, newTitle)
            .then((response) => {
                console.log(response);
            })
            .catch((reason) => {
                console.error(reason);
                const titleText = title.querySelector('.title-note-text');
                titleText.innerHTML = oldTitle;
            });
    });
    title.innerHTML = '';
    title.appendChild(input);
    input.focus();
}

// создаем новый текст заголовка

function createTaskListTitleInput(text, rows, handler) {
    let input = createInput(text, rows);
    input.onblur = () => {
        handler(input.value);
        replaceTaskListTitleWithInputText(input);
    };

    return input;
}

function createTaskListText(text) {
    let titleText = document.createElement('span');
    titleText.className = 'title-note-text';
    titleText.innerText = text.trim();

    return titleText;
}

function replaceTaskListTitleWithInputText(input) {
    let newText = input.value;
    let title = input.parentElement;
    if (newText.trim() === '') {
        title.closest('.note').remove();
    } else {
        title.innerHTML = '';
        title.appendChild(createTaskListText(newText));
        title.appendChild(createEditTaskListButton());
    }
}

//добавление нового списка задач

function createNewTaskList() {
    let newTaskList = document.querySelector('.new-note');
    let divNote = document.createElement('div');
    // let color = replaceNoteColor();

    divNote.classList.add('note');
    // divNote.classList.toggle(color);

    newTaskList.after(divNote);

    divNote.append(createNewTaskButton());
    divNote.append(createTaskListButtonRemove());

// добавляем заголовок списка задач

    let titleNote = document.createElement('div');
    titleNote.classList.add('title-note');

    let board = divNote.closest('.notes');
    const boardId = board.dataset.boardId;

    let titleInput = createTaskListTitleInput('', 1, (title) => {
        api.createTaskList(Number(boardId), title)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                board.dataset.boardId = boardId;
                divNote.dataset.taskListId = data.data.taskListId;
            })
            .catch((reason) => {
                console.log(reason);
            });
    });

    titleNote.appendChild(titleInput);
    divNote.appendChild(titleNote);

    titleInput.focus();

// задачи

    let olNote = document.createElement('ol');
    olNote.classList.add('tasks');
    divNote.append(olNote);
}

// добавление нового списка задач

function createTaskListButton() {
    let newTaskListButton = document.querySelector('.new-note');
    newTaskListButton.onclick = function (event) {
        let note = event.target.parentElement;
        createNewTaskList(note);
    }

    return newTaskListButton;
}

createTaskListButton();

// цвет списка задач

// function replaceNoteColor() {
//     let colors = [
//         'board--indianred',
//         'board--lavender',
//         'board--antiquewhite',
//         'board--teal',
//     ];
//
//     let randomIndex = Math.floor(Math.random() * colors.length);
//
//     return colors[randomIndex];
// }

function createTaskListButtonRemove() {
    let createButtonRemove = document.createElement('button');
    createButtonRemove.className = 'button button-task-del js-note-remove';
    createButtonRemove.innerText = '🞫';
    createButtonRemove.addEventListener('click', onTaskListRemove);

    return createButtonRemove;
}

//удаление списка задач

document.querySelectorAll('.js-note-remove')
    .forEach(button => {
        button.addEventListener('click', onTaskListRemove)
    });

function onTaskListRemove(event) {
    const button = event.target;
    const taskList = button.closest('.note');
    const board = taskList.parentNode;
    const id = taskList.dataset.taskListId;
    window.api
        .removeTaskList(id)
        .then(response => {
            if (!response.ok) {
                board.appendChild(taskList);
            }
        })
        .catch(reason => {
            console.error(reason);
        });
    taskList.remove();
}
