// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
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
