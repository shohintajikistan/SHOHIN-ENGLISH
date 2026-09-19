// ============================================================
// SHOHIN ENGLISH — FIREBASE
// SHOHIN BRAND COLORS — НЕ МЕНЯТЬ
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCQjNDe3zIlH5fukUGbRcY5fV86DzJwLs",
    authDomain: "shohin-english.firebaseapp.com",
    projectId: "shohin-english",
    storageBucket: "shohin-english.firebasestorage.app",
    messagingSenderId: "986169234606",
    appId: "1:986169234606:web:2e8159c45de33f5d9dc93f",
    measurementId: "G-EP2P3E8TEP"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const firebaseApp = initializeApp(firebaseConfig);


// ============================================================
// FIREBASE SERVICES
// ============================================================

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);


// ============================================================
// CONNECTION CHECK
// ============================================================

console.log("🔥 SHOHIN ENGLISH Firebase connected");


// ============================================================
// EXPORT
// ============================================================

export {
    firebaseApp,
    auth,
    db,
    storage
};