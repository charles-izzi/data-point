<template>
  <q-page>
    <q-list bordered class="q-mt-md">
      <q-item v-for="project in projects" :key="project.id" clickable>
        <q-item-section>{{ project.name }}</q-item-section>
      </q-item>
      <q-item clickable @click="createProject">
        <q-item-section>
          <q-btn label="Create New Project" color="primary" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from 'src/stores/user-store'
import { getProjects, type Project, setProject } from 'src/backend/db/projects'

const projects = ref<Project[]>([])
const userStore = useUserStore()

onMounted(async () => {
  if (userStore.user) {
    const userProjects = await getProjects(userStore.user.id)
    projects.value = userProjects ? Object.values(userProjects) : []
  }
})

async function createProject() {
  if (userStore.user) {
    const newProjectId = `project-${Date.now()}`
    await setProject(userStore.user.id, newProjectId, `New Project ${projects.value.length + 1}`)
    const userProjects = await getProjects(userStore.user.id)
    projects.value = userProjects ? Object.values(userProjects) : []
  }
}
</script>

<style scoped></style>
