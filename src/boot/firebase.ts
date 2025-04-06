// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth, getRedirectResult } from 'firebase/auth'
import { App } from '@capacitor/app'
import { useUserStore } from 'src/stores/user-store'
import type { useRouter } from 'vue-router'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBuWN6HiBXguMQgrcB0x-0bPPt8sQL4_oE',
  authDomain: 'data-point-40a83.firebaseapp.com',
  databaseURL: 'https://data-point-40a83-default-rtdb.firebaseio.com',
  projectId: 'data-point-40a83',
  storageBucket: 'data-point-40a83.firebasestorage.app',
  messagingSenderId: '474323415905',
  appId: '1:474323415905:web:94206e566bb073957d4b20',
  measurementId: 'G-44Y82DFK8B',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//const analytics = getAnalytics(app);
getAnalytics(app)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Setup deep link handling for Capacitor
export function setupDeepLinkHandling(router: ReturnType<typeof useRouter>) {
  const isCapacitor =
    typeof window !== 'undefined' &&
    (window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'izzi.charles.datapoint:')

  if (isCapacitor) {
    // Listen for deep link events from Capacitor
    App.addListener('appUrlOpen', async (data: { url: string }) => {
      console.log('App opened with URL:', data.url)

      // Check if this is a Firebase authentication redirect
      if (data.url.includes('data-point-40a83.firebaseapp.com/__/auth/handler')) {
        try {
          console.log('Handling Firebase auth redirect')
          const result = await getRedirectResult(auth)

          if (result && result.user) {
            const userStore = useUserStore()
            userStore.setUser({
              id: result.user.uid,
              name: result.user.displayName || 'User',
            })

            // Navigate to home screen after successful login
            router.push('/')
          }
        } catch (error) {
          console.error('Error handling deep link auth redirect:', error)
        }
      }
    })
  }
}
