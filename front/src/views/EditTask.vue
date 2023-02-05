<template>
  <div class="notes notes-edit">
    <div class="note">
      <router-link :to="`/boards/${boardId}`">
        <div class="title-new-note">
          <span class="title-note-text">Назад</span>
        </div>
      </router-link>
    </div>

    <form action="/tasks" method="POST" @submit.prevent="$emit('taskText', taskText)">
      <div class="new-note">
        <input type="hidden" id="taskListId" name="taskListId" value="{{ taskListId }}">
        <input type="hidden" id="taskId" name="taskId" value="{{ taskId }}">
        <ol class="tasks">
          <li class="tasks__task" for="task-list">
                        <textarea v-model="taskText" class="input" rows="1" id="taskText" name="taskText">
                          {{ taskText }}
                        </textarea>
            <button v-on:click="onEditTask" class="button button-edit">✓</button>
          </li>
        </ol>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {createTasks, editTask, getTask, getTaskList} from "../api.js";

const router = useRouter();

const route = useRoute();

let boardId = route.params.boardId;

let taskListId = route.params.taskListId;

let taskId = route.params.id;

const task = ref(null);

const taskText = ref('');

if (taskId) {
  const response = getTask(taskId)
      .then(response => response.json())
      .then(json => {
        task.value = json.data.task;
        taskText.value = task.value.text;
        taskListId =json.data.taskListId;
        boardId =json.data.boardId;
      })
}

async function onEditTask() {
  if (taskId) {
    await editTask(taskId, taskText.value);
  } else {
    await createTasks(taskListId, taskText.value);
  }
  await router.push(`/boards/${boardId}`);
}

</script>

<style scoped>

</style>
