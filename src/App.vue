<template>
  <router-view />
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user-store'
import { getUser, setUser, type User } from './backend/db/users'
import { onMounted } from 'vue'

onMounted(() => {
  const auth = getAuth()
  const userStore = useUserStore()
  const router = useRouter()
  setPersistence(auth, browserLocalPersistence)
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Check if user exists in Firestore
      const firestoreUser = await getUser(firebaseUser.uid)

      // If user doesn't exist, create a new one
      if (!firestoreUser) {
        const signedInUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'New User',
        }
        await setUser(signedInUser.id, signedInUser.name)
        userStore.setUser(signedInUser)
      } else {
        // If it does exist, set the user store
        userStore.setUser(firestoreUser)
      }

      if (router.currentRoute.value.path === '/login') {
        router.push('/')
      }
    } else {
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
  })
})
</script>
