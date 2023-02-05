<template>
  <div class="form">
    <form class="inner-form" action="/login" method="post" @submit.prevent="$emit('login', login, password)">
      <div>
        <label class="label-text" for="login">
          <input type="text" id="login" name="username" v-model="login" placeholder="Логин">
        </label>
      </div>
      <div>
        <label class="label-text" for="password">
          <input type="password" id="password" name="password" v-model="password" placeholder="Пароль">
        </label>
      </div>
      <div class="a-signup">
        <router-link to="/signup">Регистрация</router-link>
      </div>
      <div>
        <button class="button-auth button-signin" type="submit">Войти</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref} from "vue";

const login = ref('');
const password = ref('');
</script>

<style scoped>

</style>