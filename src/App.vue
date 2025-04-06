<template>
  <router-view />
</template>

<script setup lang="ts">
import {
  getAuth,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  getRedirectResult,
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user-store'
import { getUser, setUser, type User } from './backend/db/users'
import { onMounted } from 'vue'
import { setupDeepLinkHandling } from './boot/firebase'

onMounted(async () => {
  const auth = getAuth()
  const userStore = useUserStore()
  const router = useRouter()

  // Set up persistence
  setPersistence(auth, browserLocalPersistence)

  // Setup deep link handling with our dedicated function
  setupDeepLinkHandling(router)

  // Check for redirect result on app startup
  try {
    const result = await getRedirectResult(auth)
    if (result && result.user) {
      console.log('Redirect result detected on app startup')
      const signedInUser: User = {
        id: result.user.uid,
        name: result.user.displayName || 'New User',
      }
      userStore.setUser(signedInUser)
      if (router.currentRoute.value.path === '/login') {
        router.push('/')
      }
    }
  } catch (error) {
    console.error('Error processing redirect result:', error)
  }

  // Listen for auth state changes
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      console.log('Auth state changed: user is signed in')
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
      console.log('Auth state changed: user is signed out')
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
  })
})
</script>
