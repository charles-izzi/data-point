<template>
  <router-view />
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user-store'
import { getUser, setUser, type User } from './backend/db/users'
import { onMounted } from 'vue'
import { App as CapApp } from '@capacitor/app'

onMounted(() => {
  const auth = getAuth()
  const userStore = useUserStore()
  const router = useRouter()

  // Set up persistence
  setPersistence(auth, browserLocalPersistence)

  // Handle URL opens (for deep linking)
  try {
    // This will work only in a Capacitor app
    CapApp.addListener('appUrlOpen', (event) => {
      console.log('App opened with URL:', event.url)

      // Handle the app open URL - this is crucial for authentication redirects
      const slug = event.url.split('/__/auth/handler').pop()

      if (slug) {
        // We received a redirect from Firebase auth
        console.log('Authentication redirect detected')
        // The auth state will be captured by the onAuthStateChanged listener
      }
    })
  } catch (e) {
    console.log('Not running in Capacitor environment, URL open listener not added', e)
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
