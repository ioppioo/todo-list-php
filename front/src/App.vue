<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {me} from "./api.js";
import {auth} from "./api.js";
import {signup} from "./api.js";

const router = useRouter();

const isAuthenticated = ref(null);

router.beforeEach(async (to, from) => {
  if (isAuthenticated.value === null) {
    await checkAuth();
  }
  if (
      !isAuthenticated.value &&
      !["Login", "SignUp"].includes(to.name)
  ) {
    return {name: 'Login'}
  }
})

async function checkAuth() {
  const user = (await (await me()).json()).data.user;

  isAuthenticated.value = user !== null;

}

async function tryLogin(username, password) {

  const response = await auth(username, password);

  console.log(await me());

  isAuthenticated.value = response.status === 200;

  if (isAuthenticated.value) {
    await router.push('/boards');
  } else {
    console.log('неверный пользователь или пароль');
  }
}

async function trySignup(login, email, password) {

  const response = await signup(login, email, password);

  isAuthenticated.value = response.status === 200;

  if (isAuthenticated.value) {
    await router.push('/login');
  } else {
    console.log('ошибка регистрации');
  }
}

</script>

<template>
  <RouterView v-slot="{ Component }" @login="tryLogin" @signup="trySignup">
    <template v-if="Component">
      <Transition mode="out-in">
        <Suspense>
          <component :is="Component"></component>
        </Suspense>
      </Transition>
    </template>
  </RouterView>
</template>

