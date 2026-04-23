// Importamos las funciones necesarias del SDK de Firebase (versión 9+)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


//variables de entorno deben de Firebase.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Si ya hay app inicializada, la usamos; si no, creamos una nueva para evitar errores de "duplicate app" en Next.js durante el desarrollo (Hot Reload).
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Servicios a usar:
const auth = getAuth(app); // Servicio de Autenticación
const db = getFirestore(app); // Servicio de Base de Datos (Cloud Firestore)
const googleProvider = new GoogleAuthProvider(); // Configuración para entrar con Google

// Servicios exportados para usarlos en otras partes de la app
export { app, auth, db, googleProvider };