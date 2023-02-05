<template>
  <div>
    <slot v-if="isReady"></slot>
    <slot v-else name="fallback">Loading...</slot>
  </div>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps(["dataPromise"]);

const data = ref(null);

const isReady = ref(false);

props.dataPromise
    .then(response => response.json())
    .then(json => {
      data.value = json.data;
      isReady.value = true;
    })

</script>

<style>

</style>