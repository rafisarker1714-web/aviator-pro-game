import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCer2IXZZjJI8ZlpVc8_6oRhmAQBDDLvM",
  authDomain: "aviator-pro-8fffe.firebaseapp.com",
  databaseURL: "https://aviator-pro-8fffe-default-rtdb.firebaseio.com",
  projectId: "aviator-pro-8fffe",
  storageBucket: "aviator-pro-8fffe.firebasestorage.app",
  messagingSenderId: "992638529142",
  appId: "1:992638529142:web:96d7d6baee5cc333827957",
  measurementId: "G-YPH1MBVTES"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
