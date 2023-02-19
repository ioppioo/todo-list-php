//редактирование заголовка доски

import * as api from "./api.js";

document.querySelectorAll('.js-board-edit')
    .forEach(button => {
        button.addEventListener('click', createBoardTitleText)
    });

// создаем кнопку редактирования

function createBoardEditButton() {
    const editButton = document.createElement('button');
    editButton.className = 'button button-edit js-board-edit';
    editButton.innerText = '✎';

    return editButton;
}

// для работы с заголовком

function createEditBoardTitleButton() {
    let button = createBoardEditButton();
    button.addEventListener('click', createBoardTitleText);

    return button;
}

export function createBoardTitleText(event) {
    event.stopPropagation();
    let note = event.target.parentElement;
    replaceBoardTitleWithInput(note);
}

// заменяем текущий заголовок заметки полем ввода

function replaceBoardTitleWithInput(title) {
    let titleText = title.querySelector('.board-title-text');
    let styles = window.getComputedStyle(titleText);
    let rows = (titleText.getBoundingClientRect().height / parseInt(styles.lineHeight));
    const oldTitle = titleText.innerText;
    const board = title.closest('.board');
    const id = board.dataset.boardId;
    let input = createBoardTitleInput(oldTitle, rows, (newTitle) => {
        api.editBoard(id, newTitle)
            .then((response) => {
                console.log(response);
            })
            .catch((reason) => {
                console.error(reason);
                const titleText = title.querySelector('.board-title-text');
                titleText.innerHTML = oldTitle;
            });
    });
    title.innerHTML = '';
    title.appendChild(input);
    input.focus();
}

// создаем новый текст заголовка

function createBoardTitleInput(text, rows, handler) {
    let input = createInput(text, rows);
    input.onblur = () => {
        handler(input.value);
        replaceBoardTitleWithInputText(input);
    };

    return input;
}

function createBoardText(text) {
    let link = document.createElement('a');
    link.setAttribute('href', '/boards/{{ board.id }}');
    let titleText = document.createElement('span');
    titleText.className = 'board-title-text';
    titleText.innerText = text.trim();

    link.appendChild(titleText);

    return link;
}

function replaceBoardTitleWithInputText(input) {
    let newText = input.value;
    let title = input.parentElement;
    if (newText.trim() === '') {
        title.closest('.board').remove();
    } else {
        title.innerHTML = '';
        title.appendChild(createBoardText(newText));
        title.appendChild(createEditBoardTitleButton());
    }
}

//создаем поле ввода

function createInput(text, rows) {
    let input = document.createElement('textarea');
    input.value = text;
    input.rows = rows;
    input.classList.add('input');

    return input;
}

//добавление новой доски
function createNewBoard() {
    let newNote = document.querySelector('.boards-board-new');
    let divNote = document.createElement('div');
    // let color = replaceNoteColor();

    divNote.classList.add('board');
    // divNote.classList.toggle(color);

    newNote.after(divNote);
    divNote.append(createBoardButtonRemove());

// добавляем заголовок доски

    let titleNote = document.createElement('div');
    titleNote.classList.add('board-title');

    let titleInput = createBoardTitleInput('', 1, (title) => {
        api.createBoard(title)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                divNote.dataset.boardId = data.data.boardId;
            })
            .catch((reason) => {
                console.log(reason);
            });
    });

    titleNote.appendChild(titleInput);
    divNote.appendChild(titleNote);

    titleInput.focus();
}

// добавление новой доски

function createBoardButton(event) {
    let newBoardButton = document.querySelector('.boards-board-new');
    newBoardButton.addEventListener('click', createNewBoard)
}

createBoardButton();

// // цвет новой доски
//
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

//отрисовка кнопки удаления доски и удаление доски сразу после создания

function createBoardButtonRemove() {
    let createButtonRemove = document.createElement('button');
    createButtonRemove.className = 'button button-task-del js-board-remove';
    createButtonRemove.innerText = '🞫';
    createButtonRemove.addEventListener('click', onBoardRemove);

    return createButtonRemove;
}

//удаление доски

document.querySelectorAll('.js-board-remove')
    .forEach(button => {
        button.addEventListener('click', onBoardRemove)
    });

function onBoardRemove(event) {
    const button = event.target;
    const board = button.closest('.board');
    const id = board.dataset.boardId;
    window.api
        .removeBoard(id)
        .then(response => {
            if (!response.ok) {
            }
        })
        .catch(reason => {
            console.error(reason);
        });
    board.remove();
}
