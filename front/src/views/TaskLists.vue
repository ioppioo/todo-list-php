<template>
  <div class="notes" v-if="taskLists">
    <div>
      <div class="note">
        <div class="title-new-note">
          <router-link to="/boards" class="title-note-text">К списку досок</router-link>
        </div>
      </div>

      <div class="new-note">
        <router-link :to="`/boards/${id}/task-lists/create`">
          <div class="title-new-note">
            <span class="title-note-text">Новый список</span>
          </div>
        </router-link>
      </div>
    </div>

    <div class="note"
         v-for="taskList in taskLists"
         :key="taskList.id"
         :data-task-list-id="`${taskList.id}`">
      <router-link :to="`/boards/${id}/task-lists/${taskList.id}/tasks/create`"
                   class="button button-task-new">+
      </router-link>
      <button v-on:click="onRemoveTaskList(taskList.id)" class="button button-task-del">🞫</button>
      <div class="title-note">
                    <span class="title-note-text"
                          :data-task-list-title="taskList.title">
                        {{ taskList.title }}</span>
        <router-link :to="`/task-lists/${taskList.id}/edit`" class="button button-edit">✎
        </router-link>
      </div>

      <ol class="tasks"
          v-for="task in taskList.tasks"
          :key="task.id"
          :data-task-id="`${task.id}`">
        <li class="tasks__task" v-bind:class="{ done: task.isDone }">
          <button v-on:click="onTaskDone(task.id, task.isDone)" class="button button-done">✓</button>
          <span class="tasks__task-text"
                :data-task-text="task.text">
            {{ task.text }}
          </span>
          <router-link :to="`/task-lists/${taskList.id}/tasks/${task.id}/edit`"
                       class="button button-edit js-task-edit"
                       v-bind:class="{ 'button-hidden': task.isDone }">✎
          </router-link>
          <button v-on:click="onRemoveTask(task.id)" class="button button-tasks-remove"> 🞫</button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {getBoard, removeTask, removeTaskList, taskDone} from "../api.js"
import {useRoute, useRouter} from "vue-router";

const router = useRouter();

const route = useRoute();

const id = route.params.id;

const taskLists = ref(null);

const task = ref(null);

const response = await getBoard(id)
    .then(response => response.json())
    .then(json => {
      taskLists.value = json.data.taskLists;
      task.value = json.data.taskLists;
    });

async function onRemoveTaskList(taskListId) {
  await removeTaskList(taskListId);
  taskLists.value = taskLists.value.filter(taskList => taskList.id !== taskListId);
}

async function onRemoveTask(id) {
  await removeTask(id);
  task.value = task.value.filter(task => task.id !== id);
}

async function onTaskDone(id, isDone) {
  await taskDone(id, !isDone)
      .then(response => {
        if (response.ok) {
          isDone = true;
        }
      })
}

</script>

<style>

</style>
