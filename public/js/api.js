function request(url, method, data) {

    url = 'http://127.0.0.1:8000' + url;

    const params = {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    if (data) {
        params.body = JSON.stringify(data);
    }

    return fetch(url, params);
}

//добавить для логина и регистрации

export function auth(username, password) {
    return request('/login', 'POST', {username, password})
}

export function signup(login, email, password) {
    return request('/signup', 'POST', {login, email, password})
}

export function me() {
    return request('/me', 'GET')
}

export function getBoards() {
    return request('/boards', 'GET')
}

export function getBoard(id) {
    return request(`/boards/${id}`, 'GET')
}

export function createBoard(title) {
    return request('/boards', 'POST', {title});
}

export function editBoard(boardId, title) {
    return request(`/boards/${boardId}`, 'PUT', {title});
}

export function removeBoard(boardId) {
    return request(`/boards/${boardId}`, 'DELETE');
}


export function getTaskList(id) {
    return request(`/task-lists/${id}`, 'GET')
}

export function createTaskList(boardId, title) {
    return request(`/task-lists`, 'POST', {boardId, title});
}

export function editTaskList(taskListId, title) {
    return request(`/task-lists/${taskListId}`, 'PUT', {title});
}

export function removeTaskList(taskListId) {
    return request(`/task-lists/${taskListId}`, 'DELETE');
}


export function getTask(id) {
    return request(`/tasks/${id}`, 'GET')
}

export function createTasks(taskListId, text) {
    return request(`/tasks`, 'POST', {taskListId, text});
}

export function editTask(id, text) {
    return request(`/tasks/${id}`, 'PUT', {text});
}

export function taskDone(taskId, isDone) {
    return request(`/tasks/${taskId}`, 'PUT', {isDone});
}

export function removeTask(id) {
    return request(`/tasks/${id}`, 'DELETE');
}
