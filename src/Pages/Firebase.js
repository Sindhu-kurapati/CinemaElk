import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyBfkZcaBxRwtkGi9osdBlvCscjPtQqM-FI",
    authDomain: "cinemaelk-8c75c.firebaseapp.com",
    projectId: "cinemaelk-8c75c",
    storageBucket: "cinemaelk-8c75c.appspot.com",
    messagingSenderId: "452686090043",
    appId: "1:452686090043:web:d0f9e83e0a86915a80f11e",
    measurementId: "G-MCVPF2K0XN",

    }

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;