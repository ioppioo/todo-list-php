<template>
  <div class="form">
    <form class="inner-form" action="/signup" method="post" @submit.prevent="$emit('signup', login, email, password)">
      <div>
        <label class="label-text" for="login">
          <input type="text" id="login" name="login" v-model="login" placeholder="Логин">
        </label>
      </div>
      <div>
        <label class="label-text" for="email">
          <input type="text" id="email" name="email"  v-model="email" placeholder="Адрес электронной почты">
        </label>
      </div>
      <div>
        <label class="label-text" for="password">
          <input  type="password" id="password" name="password" v-model="password" placeholder="Пароль">
        </label>
      </div>
      <div>
        <router-link to="/login">Войти</router-link>
      </div>
      <div>
        <button class="button-auth button-signup" type="submit">Регистрация</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref} from "vue";

const login = ref('');
const email = ref('');
const password = ref('');
</script>

<style scoped>

</style>