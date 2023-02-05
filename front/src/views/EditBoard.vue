<template>
  <div class="boards">
    <div class="board">
      <router-link to="/boards">
        <div class="board-new-title">
          <span class="board-title-text">К списку досок</span>
        </div>
      </router-link>
    </div>

    <form action="/boards" method="POST" @submit.prevent="$emit('boardTitle', boardTitle)">
      <div class="board">
        <input type="hidden" id="boardId" name="boardId" value="{{ boardId }}">
        <label class="board-title" for="boards">
                    <textarea v-model="boardTitle" class="input" rows="1" id="title" name="boardTitle">
                      {{ boardTitle }}
                    </textarea>
          <button v-on:click="onEditBoard" class="button button-edit">✓</button>
        </label>
      </div>
    </form>
  </div>
</template>

<script setup>

import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {createBoard, editBoard, getBoard} from "../api.js"

const router = useRouter();

const route = useRoute();

const boardId = route.params.id;

const boardTitle = ref('');

if (boardId) {
  getBoard(boardId)
      .then(response => response.json())
      .then(json => {
        boardTitle.value = json.data.title;
      })
}

async function onEditBoard() {
  if (boardId) {
    await editBoard(boardId, boardTitle.value);
  } else {
    await createBoard(boardTitle.value);
  }
  await router.push("/boards");
}

</script>

<style scoped>

</style>
