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
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const router = useRouter()
const loading = ref(false)

const signInWithGoogle = async () => {
  loading.value = true
  try {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  } catch (error) {
    console.error('Error signing in with Google:', error)
    loading.value = false
  }
}

onMounted(async () => {
  // Check if user is already logged in
  const auth = getAuth()

  // Check if user is already authenticated
  auth.onAuthStateChanged((user) => {
    if (user) {
      router.push('/')
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
