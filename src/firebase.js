// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 1. Aquí pegas el objeto que copiaste de la consola de Firebase (¡Borra el código de ejemplo!)
const firebaseConfig = {
  apiKey: "AIzaSyAnmD_B-MJFWp1odI_CZOooxMupk8DRn-U",
  authDomain: "sapientia-b0f6b.firebaseapp.com",
  projectId: "sapientia-b0f6b",
  storageBucket: "sapientia-b0f6b.firebasestorage.app",
  messagingSenderId: "118969500965",
  appId: "1:118969500965:web:02bd8f518f2445fa6e86cc",
  measurementId: "G-12DX0QY3CM"
};

// 2. Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// 3. Exportamos la autenticación y el proveedor de Google
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();