// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  initializeFirestore,
  persistentMultipleTabManager,
  persistentLocalCache
} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAMHx1ym-chZ02sGuyiIpe00U8wwp9oJoI',
  authDomain: 'antidepressant-c2601.firebaseapp.com',
  databaseURL: 'https://antidepressant-c2601-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'antidepressant-c2601',
  storageBucket: 'antidepressant-c2601.firebasestorage.app',
  messagingSenderId: '425147394264',
  appId: '1:425147394264:web:5300cf77c138f99aa94fad'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth()
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
})

export { db }
export default app
