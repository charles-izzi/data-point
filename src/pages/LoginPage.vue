<template>
  <div class="login-container">
    <div class="card-container">
      <q-card class="login-card">
        <q-card-section class="text-center">
          <h5 class="q-my-md">Sign in to Data Point</h5>
        </q-card-section>

        <q-card-section>
          <q-btn
            class="google-signin-btn"
            color="white"
            text-color="black"
            label="Sign in with Google"
            @click="signInWithGoogle"
            icon="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            no-caps
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  type User,
} from 'firebase/auth'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const signInWithGoogle = async () => {
  loading.value = true
  try {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    // Check if we're running on Capacitor (mobile app)
    const isCapacitor =
      typeof window !== 'undefined' &&
      (window.location.protocol === 'capacitor:' ||
        window.location.protocol === 'izzi.charles.datapoint:')

    // Check if we're running on localhost
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '192.168.1.151'

    if (isLocalhost && !isCapacitor) {
      // Use popup for local development (works with HTTP)
      const result = await signInWithPopup(auth, provider)
      if (result) {
        handleAuthSuccess(result.user)
      }
    } else {
      // For Capacitor (mobile) or production, configure the provider better
      if (isCapacitor) {
        // For Android/iOS, set custom parameters for proper mobile redirects
        provider.setCustomParameters({
          // This ensures Firebase can redirect back to your app
          app_package_name: 'izzi.charles.datapoint',
          // Custom redirect URI that will be handled by Capacitor's deep linking
          redirect_uri: 'https://data-point-40a83.firebaseapp.com/__/auth/handler',
        })
      }

      // Use redirect for production or mobile apps
      await signInWithRedirect(auth, provider)
    }
  } catch (error) {
    console.error('Error initiating sign in with Google:', error)
    loading.value = false
  }
}

// Handle successful authentication
const handleAuthSuccess = (user: User) => {
  if (user) {
    // Update user store with basic user info
    userStore.setUser({
      id: user.uid,
      name: user.displayName || 'User',
    })

    // Redirect to home page after successful login
    router.push('/')
  }
  loading.value = false
}

onMounted(async () => {
  // Check if user is already logged in
  const auth = getAuth()

  // Handle redirect result when user comes back from authentication
  try {
    loading.value = true
    console.log('Checking for redirect result...')

    const result = await getRedirectResult(auth)
    if (result) {
      console.log('Successfully got redirect result')
      handleAuthSuccess(result.user)
    } else {
      console.log('No redirect result found')
    }
  } catch (error) {
    console.error('Error completing sign-in with redirect:', error)
    loading.value = false
  }

  // Check if user is already authenticated
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is already authenticated:', user.uid)
      handleAuthSuccess(user)
    } else {
      loading.value = false
    }
  })
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.card-container {
  width: 100%;
  max-width: 400px;
  padding: 16px;
}

.login-card {
  width: 100%;
}

.google-signin-btn {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 48px;
}
</style>
