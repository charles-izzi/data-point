<template>
  <div class="container">
    <q-btn @click="handleClick" color="primary" label="Data Point"> </q-btn>
    <q-list bordered class="q-mt-md">
      <q-item v-for="item in items" :key="item" clickable>
        <q-item-section>{{ item }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QBtn, QList, QItem, QItemSection } from 'quasar'

const items = ref<string[]>([])
let itemCount = 1

function handleClick() {
  items.value.push(`Item ${itemCount}`)
  itemCount++
  console.log('clicked Data Point')
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
