// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDITJSSjsqiij5L4tnyylBx2acAv5N3FP0",
  authDomain: "agro-app-6c9f2.firebaseapp.com",
  databaseURL: "https://agro-app-6c9f2-default-rtdb.firebaseio.com",
  projectId: "agro-app-6c9f2",
  storageBucket: "agro-app-6c9f2.firebasestorage.app",
  messagingSenderId: "276806938112",
  appId: "1:276806938112:web:aab9c8e00a05445b15b2e5",
  measurementId: "G-197WSQP60Z"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
