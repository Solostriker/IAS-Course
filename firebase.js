// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUB1K4upe1s28wy2Y_VyzomFgv9XbL0Yk",
  authDomain: "curriculumbuilder-238dc.firebaseapp.com",
  projectId: "curriculumbuilder-238dc",
  storageBucket: "curriculumbuilder-238dc.appspot.com",
  messagingSenderId: "657929228658",
  appId: "1:657929228658:web:bea1b5c7330744de764deb",
  measurementId: "G-P4XMHE03LE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app)