// ============================================================
// SHOHIN ENGLISH — MAIN APP
// SHOHIN BRAND COLORS — НЕ МЕНЯТЬ
// ============================================================

import {
    registerUser,
    loginUser,
    logoutUser,
    watchAuthState,
    getAuthErrorMessage
} from "./auth.js";


// ============================================================
// APP STATE
// ============================================================

const state = {
    currentPage: "home",
    user: null,
    menuOpen: false,
    progress: 0,
    completedLessons: 0,
    streak: 0,
    currentLevel: "A1"
};


// ============================================================
// DOM HELPERS
// ============================================================

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    initApp();

});


// ============================================================
// INITIALIZE APP
// ============================================================

function initApp() {

    setupSplash();
    setupNavigation();
    setupMenu();
    setupAuthForms();
    setupAuthState();
    setupHomeActions();
    setupSettings();
    setupVocabulary();
    setupLogout();

    loadLocalProgress();

    renderCourses();
    renderVocabulary();
    renderTests();
    renderAchievements();

}


// ============================================================
// SPLASH
// ============================================================

function setupSplash() {

    const splash = $("#splashScreen");

    if (!splash) return;

    setTimeout(() => {

        splash.classList.add("hidden");

        setTimeout(() => {
            splash.style.display = "none";
        }, 400);

    }, 1600);

}


// ============================================================
// FIREBASE AUTH STATE
// ============================================================

function setupAuthState() {

    watchAuthState((user) => {

        state.user = user;

        if (user) {

            showApp();

            updateUserInterface();

        } else {

            showAuth();

        }

    });

}


// ============================================================
// SHOW AUTH
// ============================================================

function showAuth() {

    const authScreen = $("#authScreen");
    const appScreen = $("#appScreen");

    if (authScreen) {
        authScreen.classList.remove("hidden");
    }

    if (appScreen) {
        appScreen.classList.add("hidden");
    }

}


// ============================================================
// SHOW APP
// ============================================================

function showApp() {

    const authScreen = $("#authScreen");
    const appScreen = $("#appScreen");

    if (authScreen) {
        authScreen.classList.add("hidden");
    }

    if (appScreen) {
        appScreen.classList.remove("hidden");
    }

    showPage("home");

}


// ============================================================
// AUTH FORMS
// ============================================================

function setupAuthForms() {

    const loginForm = $("#loginForm");
    const registerForm = $("#registerForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const email = $("#loginEmail")?.value.trim();
            const password = $("#loginPassword")?.value;

            setLoading(true);

            try {

                await loginUser(email, password);

                showToast("Добро пожаловать!");

                loginForm.reset();

            } catch (error) {

                showToast(
                    getAuthErrorMessage(error.code) ||
                    error.message
                );

            } finally {

                setLoading(false);

            }

        });

    }


    if (registerForm) {

        registerForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const name = $("#registerName")?.value.trim();
            const email = $("#registerEmail")?.value.trim();
            const password = $("#registerPassword")?.value;

            setLoading(true);

            try {

                await registerUser(
                    name,
                    email,
                    password
                );

                showToast("Аккаунт успешно создан!");

                registerForm.reset();

            } catch (error) {

                showToast(
                    getAuthErrorMessage(error.code) ||
                    error.message
                );

            } finally {

                setLoading(false);

            }

        });

    }


    // Login / Register switch

    $$("[data-auth]").forEach((button) => {

        button.addEventListener("click", () => {

            const target = button.dataset.auth;

            switchAuthForm(target);

        });

    });

}


// ============================================================
// SWITCH AUTH FORM
// ============================================================

function switchAuthForm(type) {

    const loginBox = $("#loginBox");
    const registerBox = $("#registerBox");

    if (!loginBox || !registerBox) return;

    if (type === "register") {

        loginBox.classList.add("hidden");
        registerBox.classList.remove("hidden");

    } else {

        registerBox.classList.add("hidden");
        loginBox.classList.remove("hidden");

    }

}


// ============================================================
// NAVIGATION
// ============================================================

function setupNavigation() {

    $$("[data-page]").forEach((button) => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            showPage(page);

            closeMenu();

        });

    });

}


// ============================================================
// SHOW PAGE
// ============================================================

function showPage(pageName) {

    const pages = $$(".page");

    pages.forEach((page) => {

        page.classList.remove("active");

    });


    const selectedPage = $(`#${pageName}Page`);

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    state.currentPage = pageName;


    // Update navigation buttons

    $$("[data-page]").forEach((button) => {

        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ============================================================
// SIDE MENU
// ============================================================

function setupMenu() {

    const menuButton = $("#menuButton");
    const closeButton = $("#closeMenu");
    const overlay = $("#menuOverlay");

    if (menuButton) {

        menuButton.addEventListener("click", openMenu);

    }

    if (closeButton) {

        closeButton.addEventListener("click", closeMenu);

    }

    if (overlay) {

        overlay.addEventListener("click", closeMenu);

    }

}


// ============================================================
// OPEN MENU
// ============================================================

function openMenu() {

    const menu = $("#sideMenu");
    const overlay = $("#menuOverlay");

    if (menu) {
        menu.classList.add("open");
    }

    if (overlay) {
        overlay.classList.add("active");
    }

    state.menuOpen = true;

}


// ============================================================
// CLOSE MENU
// ============================================================

function closeMenu() {

    const menu = $("#sideMenu");
    const overlay = $("#menuOverlay");

    if (menu) {
        menu.classList.remove("open");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    state.menuOpen = false;

}


// ============================================================
// HOME ACTIONS
// ============================================================

function setupHomeActions() {

    $$("[data-action='start-learning']").forEach((button) => {

        button.addEventListener("click", () => {

            showPage("courses");

        });

    });


    $$("[data-action='continue-learning']").forEach((button) => {

        button.addEventListener("click", () => {

            showPage("courses");

        });

    });

}


// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

    $$("[data-action='logout']").forEach((button) => {

        button.addEventListener("click", async () => {

            setLoading(true);

            try {

                await logoutUser();

                closeMenu();

                showToast("Вы вышли из аккаунта.");

            } catch (error) {

                showToast("Не удалось выйти.");

            } finally {

                setLoading(false);

            }

        });

    });

}


// ============================================================
// COURSES
// ============================================================

function renderCourses() {

    const container = $("#coursesList");

    if (!container) return;


    const levels = [
        {
            id: "A1",
            name: "Beginner",
            lessons: 20,
            description: "Основы английского языка"
        },
        {
            id: "A2",
            name: "Elementary",
            lessons: 25,
            description: "Повседневный английский"
        },
        {
            id: "B1",
            name: "Intermediate",
            lessons: 30,
            description: "Уверенное общение"
        },
        {
            id: "B2",
            name: "Upper-Intermediate",
            lessons: 30,
            description: "Продвинутый разговорный английский"
        },
        {
            id: "C1",
            name: "Advanced",
            lessons: 35,
            description: "Сложный английский"
        },
        {
            id: "C2",
            name: "Proficiency",
            lessons: 40,
            description: "Высший уровень"
        }
    ];


    container.innerHTML = levels.map((level, index) => {

        const unlocked = index === 0;

        return `
            <div class="level-card ${unlocked ? "" : "locked"}"
                 data-level="${level.id}">

                <div class="level-badge">
                    ${level.id}
                </div>

                <div class="level-content">

                    <h3>${level.name}</h3>

                    <p>${level.description}</p>

                    <div class="level-progress">

                        <span>
                            ${level.lessons} уроков
                        </span>

                        <span>
                            ${unlocked ? "Доступен" : "Закрыт"}
                        </span>

                    </div>

                </div>

                <div class="lock-icon">

                    <i class="fa-solid ${
                        unlocked
                            ? "fa-chevron-right"
                            : "fa-lock"
                    }"></i>

                </div>

            </div>
        `;

    }).join("");


    $$(".level-card").forEach((card) => {

        card.addEventListener("click", () => {

            const level = card.dataset.level;

            if (level !== "A1") {

                showToast(
                    "Сначала завершите предыдущий уровень."
                );

                return;

            }

            showToast("Уроки A1 скоро будут доступны.");

        });

    });

}


// ============================================================
// VOCABULARY
// ============================================================

function setupVocabulary() {

    const search = $("#vocabularySearch");

    if (!search) return;

    search.addEventListener("input", () => {

        const query = search.value
            .trim()
            .toLowerCase();

        $$(".vocabulary-card").forEach((card) => {

            const text =
                card.textContent.toLowerCase();

            card.style.display =
                !query || text.includes(query)
                    ? ""
                    : "none";

        });

    });

}


// ============================================================
// VOCABULARY DATA
// ============================================================

function renderVocabulary() {

    const container = $("#vocabularyList");

    if (!container) return;


    const words = [
        {
            word: "Hello",
            translation: "Привет",
            example: "Hello! How are you?"
        },
        {
            word: "Book",
            translation: "Книга",
            example: "This is my book."
        },
        {
            word: "Water",
            translation: "Вода",
            example: "I drink water."
        },
        {
            word: "Friend",
            translation: "Друг",
            example: "He is my friend."
        },
        {
            word: "Learn",
            translation: "Учить",
            example: "I learn English."
        },
        {
            word: "Future",
            translation: "Будущее",
            example: "Build your future."
        }
    ];


    container.innerHTML = words.map((item) => {

        return `
            <div class="vocabulary-card">

                <div class="vocabulary-icon">
                    <i class="fa-solid fa-language"></i>
                </div>

                <div class="vocabulary-content">

                    <h3>${escapeHTML(item.word)}</h3>

                    <strong>
                        ${escapeHTML(item.translation)}
                    </strong>

                    <p>
                        ${escapeHTML(item.example)}
                    </p>

                </div>

            </div>
        `;

    }).join("");

}


// ============================================================
// TESTS
// ============================================================

function renderTests() {

    const container = $("#testsList");

    if (!container) return;


    const tests = [
        {
            title: "A1 Vocabulary Test",
            description: "Проверьте базовые слова",
            questions: 10
        },
        {
            title: "A1 Grammar Test",
            description: "Основная грамматика",
            questions: 10
        },
        {
            title: "A1 Final Assessment",
            description: "Итоговая проверка уровня A1",
            questions: 20
        }
    ];


    container.innerHTML = tests.map((test) => {

        return `
            <div class="test-card">

                <div class="test-icon">
                    <i class="fa-solid fa-clipboard-check"></i>
                </div>

                <div class="test-content">

                    <h3>
                        ${escapeHTML(test.title)}
                    </h3>

                    <p>
                        ${escapeHTML(test.description)}
                    </p>

                    <span>
                        ${test.questions} вопросов
                    </span>

                </div>

                <button
                    class="btn btn-small"
                    type="button"
                    onclick="window.startTest()">

                    Начать

                </button>

            </div>
        `;

    }).join("");

}


// ============================================================
// TEST START
// ============================================================

window.startTest = function () {

    showToast("Тест скоро будет доступен.");

};


// ============================================================
// ACHIEVEMENTS
// ============================================================

function renderAchievements() {

    const container = $("#achievementsList");

    if (!container) return;


    const achievements = [
        {
            icon: "fa-flag",
            title: "First Step",
            description: "Начните изучение английского"
        },
        {
            icon: "fa-book-open",
            title: "First Lesson",
            description: "Завершите первый урок"
        },
        {
            icon: "fa-fire",
            title: "7 Day Streak",
            description: "Учитесь 7 дней подряд"
        },
        {
            icon: "fa-trophy",
            title: "A1 Complete",
            description: "Завершите уровень A1"
        }
    ];


    container.innerHTML = achievements.map((item) => {

        return `
            <div class="achievement-card">

                <div class="achievement-icon">

                    <i class="fa-solid ${item.icon}"></i>

                </div>

                <div>

                    <h3>
                        ${escapeHTML(item.title)}
                    </h3>

                    <p>
                        ${escapeHTML(item.description)}
                    </p>

                </div>

            </div>
        `;

    }).join("");

}


// ============================================================
// PROFILE
// ============================================================

function updateUserInterface() {

    if (!state.user) return;


    const name =
        state.user.displayName ||
        "Student";

    const email =
        state.user.email ||
        "";


    setText("#profileName", name);
    setText("#profileEmail", email);
    setText("#profileLessons", state.completedLessons);
    setText("#profileStreak", state.streak);
    setText("#profileLevel", state.currentLevel);


    updateProgressUI();

}


// ============================================================
// PROGRESS UI
// ============================================================

function updateProgressUI() {

    setText(
        "#progressPercent",
        `${state.progress}%`
    );

    setText(
        "#completedLessons",
        state.completedLessons
    );

    setText(
        "#streakDays",
        state.streak
    );


    const progressBar = $("#progressBar");

    if (progressBar) {

        progressBar.style.width =
            `${state.progress}%`;

    }

}


// ============================================================
// SETTINGS
// ============================================================

function setupSettings() {

    const notifications = $("#notificationsToggle");
    const sound = $("#soundToggle");


    if (notifications) {

        notifications.addEventListener("change", () => {

            localStorage.setItem(
                "shohin_notifications",
                notifications.checked
            );

        });

        notifications.checked =
            localStorage.getItem(
                "shohin_notifications"
            ) !== "false";

    }


    if (sound) {

        sound.addEventListener("change", () => {

            localStorage.setItem(
                "shohin_sound",
                sound.checked
            );

        });

        sound.checked =
            localStorage.getItem(
                "shohin_sound"
            ) !== "false";

    }

}


// ============================================================
// LOCAL PROGRESS
// ============================================================

function loadLocalProgress() {

    const saved =
        localStorage.getItem(
            "shohin_english_progress"
        );


    if (!saved) return;


    try {

        const data = JSON.parse(saved);

        state.progress =
            Number(data.progress) || 0;

        state.completedLessons =
            Number(data.completedLessons) || 0;

        state.streak =
            Number(data.streak) || 0;

        state.currentLevel =
            data.currentLevel || "A1";


    } catch (error) {

        console.warn(
            "Progress data could not be loaded."
        );

    }

}


// ============================================================
// SAVE LOCAL PROGRESS
// ============================================================

function saveLocalProgress() {

    localStorage.setItem(
        "shohin_english_progress",
        JSON.stringify({
            progress: state.progress,
            completedLessons: state.completedLessons,
            streak: state.streak,
            currentLevel: state.currentLevel
        })
    );

}


// ============================================================
// TEXT HELPER
// ============================================================

function setText(selector, value) {

    const element = $(selector);

    if (element) {

        element.textContent = value;

    }

}


// ============================================================
// LOADING
// ============================================================

function setLoading(show) {

    const loading = $("#globalLoading");

    if (!loading) return;

    if (show) {

        loading.classList.add("active");

    } else {

        loading.classList.remove("active");

    }

}


// ============================================================
// TOAST
// ============================================================

function showToast(message) {

    const toast = $("#toast");

    if (!toast) return;


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(window.__shohinToastTimer);


    window.__shohinToastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// ESC KEY
// ============================================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeMenu();

    }

});


// ============================================================
// AUTO SAVE
// ============================================================

window.addEventListener("beforeunload", () => {

    saveLocalProgress();

});


// ============================================================
// SHOHIN ENGLISH READY
// ============================================================

console.log("🚀 SHOHIN ENGLISH app loaded");