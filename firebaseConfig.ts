
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// IMPORTANT: Replace the following with your app's Firebase project configuration.
// You can get this from the Firebase Console:
// Project Settings > General > Your apps > Web app > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJsCrjru40rvrL9Js6XOL72R60v9yLyGk",
  authDomain: "minka-6e6c9.firebaseapp.com",
  projectId: "minka-6e6c9",
  storageBucket: "minka-6e6c9.appspot.com",
  messagingSenderId: "556446582196",
  appId: "1:556446582196:web:a6a915d3271aa7042b5ee1",
  measurementId: "G-2MLYCEPR04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

const analytics = getAnalytics(app);