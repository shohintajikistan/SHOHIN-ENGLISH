// ============================================================
// SHOHIN ENGLISH — AUTHENTICATION
// SHOHIN BRAND COLORS — НЕ МЕНЯТЬ
// ============================================================

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


// ============================================================
// REGISTER
// ============================================================

async function registerUser(name, email, password) {

    if (!name || !email || !password) {
        throw new Error("Заполните все поля.");
    }

    if (password.length < 6) {
        throw new Error("Пароль должен содержать минимум 6 символов.");
    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;


        // Сохраняем имя в Firebase Authentication
        await updateProfile(user, {
            displayName: name
        });


        // Создаём профиль пользователя в Firestore
        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                name: name,
                email: user.email,

                level: "A1",
                progress: 0,
                completedLessons: 0,
                streak: 0,

                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }
        );


        console.log("✅ User registered:", user.uid);

        return user;

    } catch (error) {

        console.error("❌ Registration error:", error);

        throw error;
    }
}


// ============================================================
// LOGIN
// ============================================================

async function loginUser(email, password) {

    if (!email || !password) {
        throw new Error("Введите email и пароль.");
    }

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        console.log(
            "✅ User logged in:",
            userCredential.user.uid
        );

        return userCredential.user;

    } catch (error) {

        console.error("❌ Login error:", error);

        throw error;
    }
}


// ============================================================
// LOGOUT
// ============================================================

async function logoutUser() {

    try {

        await signOut(auth);

        console.log("👋 User logged out");

    } catch (error) {

        console.error("❌ Logout error:", error);

        throw error;
    }
}


// ============================================================
// AUTH STATE
// ============================================================

function watchAuthState(callback) {

    return onAuthStateChanged(auth, (user) => {

        callback(user);

    });
}


// ============================================================
// FIREBASE ERROR MESSAGES
// ============================================================

function getAuthErrorMessage(errorCode) {

    const messages = {

        "auth/email-already-in-use":
            "Этот email уже зарегистрирован.",

        "auth/invalid-email":
            "Неверный email.",

        "auth/weak-password":
            "Пароль слишком слабый.",

        "auth/user-not-found":
            "Пользователь с таким email не найден.",

        "auth/wrong-password":
            "Неверный пароль.",

        "auth/invalid-credential":
            "Неверный email или пароль.",

        "auth/too-many-requests":
            "Слишком много попыток. Попробуйте позже.",

        "auth/network-request-failed":
            "Ошибка сети. Проверьте интернет.",

        "auth/user-disabled":
            "Этот аккаунт отключён."
    };


    return messages[errorCode] ||
        "Произошла ошибка. Попробуйте ещё раз.";
}


// ============================================================
// EXPORT
// ============================================================

export {
    registerUser,
    loginUser,
    logoutUser,
    watchAuthState,
    getAuthErrorMessage
};