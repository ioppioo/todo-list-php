<template>

  <div class="boards" v-if="boards">

    <div class="board">
      <router-link to="/logout">
        <div class="board-new-title">
          <span class="board-title-text">Выход</span>
        </div>
      </router-link>
    </div>

    <div class="boards-board-new">
      <router-link to="/boards/create">
        <div class="board-new-title">
          <span class="board-title-text">Новая доска</span>
        </div>
      </router-link>
    </div>

    <div v-for="board in boards" :key="board.id"
         class="board"
         :data-board-id="`${board.id}`">
      <button v-on:click="onRemoveBoard(board.id)" class="button button-task-del js-board-remove">🞫</button>
      <div class="board-title">
        <router-link :to="`/boards/${board.id}`">
                                <span class="board-title-text"
                                      :data-board-title="board.title">
                                    {{ board.title }}
                                </span>
        </router-link>
        <router-link :to="`/boards/${board.id}/edit`" class="button button-edit js-board-edit">✎</router-link>
      </div>

    </div>

  </div>

</template>

<script setup>

import {getBoards} from "../api.js"
import {removeBoard} from "../api.js"
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const boards = ref(null);

const response = getBoards()
    .then(response => response.json())
    .then(json=>{
      boards.value = json.data.boards;
    });

async function onRemoveBoard(boardId) {
  await removeBoard(boardId);
  boards.value = boards.value.filter(board => board.id !== boardId);
}

</script>

<style>

</style>
