import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyCc4-s-zKa74iTauana6Y5uG3DPsdnjJN4",
  authDomain: "elibraryll.firebaseapp.com",
  projectId: "elibraryll",
  storageBucket: "elibraryll.firebasestorage.app",
  messagingSenderId: "250468753439",
  appId: "1:250468753439:web:3e6e2c49cb25c636b6352a",
  measurementId: "G-EPGN45LL4W",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export const db = getFirestore(app);

export default app;
