<template>
  <div class="notes notes-edit">
    <div class="note">
      <router-link :to="`/boards/${boardId}`">
        <div class="title-new-note">
          <span class="title-note-text">Назад</span>
        </div>
      </router-link>
    </div>

    <form action="/task-lists" method="POST" @submit.prevent="$emit('title', title)">
        <div class="new-note">
          <input type="hidden" id="boardId" name="boardId" value="{{ boardId }}">
          <input type="hidden" id="taskListId" name="taskListId" value="{{ taskListId }}">
          <label class="title-note" for="task-list">
            <textarea v-model="title" class="input" rows="1" id="title" name="title">{{ title }}</textarea>
            <button v-on:click="onEditTaskList" class="button button-edit">✓</button>
          </label>
        </div>
    </form>
    
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {createTaskList, editTaskList, getTaskList} from "../api.js";

const router = useRouter();

const route = useRoute();

const taskListId = route.params.id;

let boardId = route.params.boardId;

const taskList = ref(null);

const title = ref('');

if (taskListId) {
  const response = getTaskList(taskListId)
      .then(response => response.json())
      .then(json => {
        taskList.value = json.data.taskList;
        title.value = taskList.value.title;
        boardId = taskList.value.board.id;
      })
}

async function onEditTaskList() {
  if (taskListId) {
    await editTaskList(taskListId, title.value);
  } else {
    await createTaskList(boardId, title.value);
  }
  await router.push(`/boards/${boardId}`);
}

</script>

<style scoped>

</style>
