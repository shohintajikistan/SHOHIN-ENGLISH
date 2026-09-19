/* =========================================================
   SHOHIN ENGLISH — ADMIN PANEL
   ADMIN.JS
   SHOHIN BRAND COLORS — НЕ МЕНЯТЬ
   ========================================================= */

"use strict";

/* =========================================================
   ADMIN STATE
   ========================================================= */

const AdminState = {
    currentSection: "dashboard",
    sidebarOpen: false,

    data: {
        levels: [],
        lessons: [],
        videos: [],
        vocabulary: [],
        exercises: [],
        tests: [],
        users: []
    }
};

/* =========================================================
   LEVEL CONFIG
   ========================================================= */

const LEVELS = [
    {
        id: "A1",
        title: "A1 Beginner",
        lessons: 20,
        description: "Beginner English"
    },
    {
        id: "A2",
        title: "A2 Elementary",
        lessons: 25,
        description: "Elementary English"
    },
    {
        id: "B1",
        title: "B1 Intermediate",
        lessons: 30,
        description: "Intermediate English"
    },
    {
        id: "B2",
        title: "B2 Upper-Intermediate",
        lessons: 30,
        description: "Upper-Intermediate English"
    },
    {
        id: "C1",
        title: "C1 Advanced",
        lessons: 35,
        description: "Advanced English"
    },
    {
        id: "C2",
        title: "C2 Proficiency",
        lessons: 40,
        description: "Proficiency English"
    }
];

/* =========================================================
   HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getElement(selector) {
    return document.querySelector(selector);
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(message, type = "success") {
    let toast = document.querySelector(".admin-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "admin-toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.className = `admin-toast show ${type}`;

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

/* =========================================================
   SIDEBAR
   ========================================================= */

function openSidebar() {
    const sidebar = document.querySelector(".admin-sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    if (sidebar) {
        sidebar.classList.add("open");
    }

    if (overlay) {
        overlay.classList.add("active");
    }

    AdminState.sidebarOpen = true;
}

function closeSidebar() {
    const sidebar = document.querySelector(".admin-sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    AdminState.sidebarOpen = false;
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {
    if (!sectionId) return;

    const sections = document.querySelectorAll(".admin-section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(`${sectionId}-section`);

    if (target) {
        target.classList.add("active");
    }

    const links = document.querySelectorAll("[data-section]");

    links.forEach(link => {
        link.classList.remove("active");
    });

    const activeLink = document.querySelector(
        `[data-section="${sectionId}"]`
    );

    if (activeLink) {
        activeLink.classList.add("active");
    }

    AdminState.currentSection = sectionId;

    updatePageTitle(sectionId);

    if (window.innerWidth <= 760) {
        closeSidebar();
    }

    renderSection(sectionId);
}

function updatePageTitle(sectionId) {

    const titles = {
        dashboard: {
            title: "Dashboard",
            subtitle: "SHOHIN ENGLISH administration"
        },

        levels: {
            title: "Levels",
            subtitle: "Manage English learning levels"
        },

        lessons: {
            title: "Lessons",
            subtitle: "Manage all course lessons"
        },

        videos: {
            title: "Videos",
            subtitle: "Manage learning videos"
        },

        vocabulary: {
            title: "Vocabulary",
            subtitle: "Manage vocabulary content"
        },

        exercises: {
            title: "Exercises",
            subtitle: "Manage lesson exercises"
        },

        tests: {
            title: "Tests",
            subtitle: "Manage assessments"
        },

        users: {
            title: "Users",
            subtitle: "User management"
        },

        settings: {
            title: "Settings",
            subtitle: "Application settings"
        }
    };

    const info = titles[sectionId] || titles.dashboard;

    const title = document.querySelector("[data-admin-title]");
    const subtitle = document.querySelector("[data-admin-subtitle]");

    if (title) {
        title.textContent = info.title;
    }

    if (subtitle) {
        subtitle.textContent = info.subtitle;
    }
}

/* =========================================================
   RENDER SECTION
   ========================================================= */

function renderSection(sectionId) {

    switch (sectionId) {

        case "dashboard":
            renderDashboard();
            break;

        case "levels":
            renderLevels();
            break;

        case "lessons":
            renderLessons();
            break;

        case "videos":
            renderVideos();
            break;

        case "vocabulary":
            renderVocabulary();
            break;

        case "exercises":
            renderExercises();
            break;

        case "tests":
            renderTests();
            break;

        case "users":
            renderUsers();
            break;

        case "settings":
            renderSettings();
            break;

        default:
            break;
    }
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {

    const levelsCount = LEVELS.length;

    const lessonsCount =
        AdminState.data.lessons.length;

    const videosCount =
        AdminState.data.videos.length;

    const vocabularyCount =
        AdminState.data.vocabulary.length;

    const levelsElement =
        document.querySelector("[data-stat-levels]");

    const lessonsElement =
        document.querySelector("[data-stat-lessons]");

    const videosElement =
        document.querySelector("[data-stat-videos]");

    const vocabularyElement =
        document.querySelector("[data-stat-vocabulary]");

    if (levelsElement) {
        levelsElement.textContent = levelsCount;
    }

    if (lessonsElement) {
        lessonsElement.textContent = lessonsCount;
    }

    if (videosElement) {
        videosElement.textContent = videosCount;
    }

    if (vocabularyElement) {
        vocabularyElement.textContent = vocabularyCount;
    }
}

/* =========================================================
   LEVELS
   ========================================================= */

function renderLevels() {

    const container =
        document.querySelector("[data-levels-list]");

    if (!container) return;

    container.innerHTML = LEVELS.map(level => {

        const lessonCount =
            AdminState.data.lessons.filter(
                lesson => lesson.levelId === level.id
            ).length;

        const publishedCount =
            AdminState.data.lessons.filter(
                lesson =>
                    lesson.levelId === level.id &&
                    lesson.published === true
            ).length;

        return `
            <article class="level-admin-card">

                <div class="level-admin-top">

                    <div class="level-code">
                        ${escapeHTML(level.id)}
                    </div>

                    <span class="badge badge-green">
                        Active
                    </span>

                </div>

                <h3 class="level-admin-title">
                    ${escapeHTML(level.title)}
                </h3>

                <p class="level-admin-description">
                    ${escapeHTML(level.description)}
                </p>

                <div class="level-admin-stats">

                    <div class="level-stat">
                        <div class="level-stat-value">
                            ${lessonCount}/${level.lessons}
                        </div>

                        <div class="level-stat-label">
                            Lessons
                        </div>
                    </div>

                    <div class="level-stat">
                        <div class="level-stat-value">
                            ${publishedCount}
                        </div>

                        <div class="level-stat-label">
                            Published
                        </div>
                    </div>

                </div>

            </article>
        `;

    }).join("");
}

/* =========================================================
   LESSONS
   ========================================================= */

function renderLessons() {

    const container =
        document.querySelector("[data-lessons-table]");

    if (!container) return;

    if (!AdminState.data.lessons.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📚
                </div>

                <div class="empty-title">
                    No lessons yet
                </div>

                <div class="empty-description">
                    Lessons will be created and managed
                    through the Admin Panel.
                </div>

                <button
                    class="btn btn-primary"
                    data-action="add-lesson"
                >
                    + Add Lesson
                </button>

            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="table-wrap">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Lesson</th>
                        <th>Level</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    ${AdminState.data.lessons.map(lesson => `

                        <tr>

                            <td>
                                <div class="table-title">
                                    ${escapeHTML(lesson.title)}
                                </div>

                                <div class="table-muted">
                                    ${escapeHTML(lesson.id)}
                                </div>
                            </td>

                            <td>
                                <span class="badge badge-green">
                                    ${escapeHTML(lesson.levelId)}
                                </span>
                            </td>

                            <td>
                                ${
                                    lesson.published
                                        ? `<span class="badge badge-green">Published</span>`
                                        : `<span class="badge badge-gray">Draft</span>`
                                }
                            </td>

                            <td>
                                ${escapeHTML(
                                    lesson.meta?.updatedAt || "—"
                                )}
                            </td>

                            <td>

                                <button
                                    class="btn btn-small btn-secondary"
                                    data-action="edit-lesson"
                                    data-id="${escapeHTML(lesson.id)}"
                                >
                                    Edit
                                </button>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}

/* =========================================================
   VIDEOS
   ========================================================= */

function renderVideos() {

    const container =
        document.querySelector("[data-videos-table]");

    if (!container) return;

    if (!AdminState.data.videos.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🎬
                </div>

                <div class="empty-title">
                    No videos yet
                </div>

                <div class="empty-description">
                    Add videos from the Admin Panel.
                    Videos will be connected to levels
                    and lessons.
                </div>

                <button
                    class="btn btn-primary"
                    data-action="add-video"
                >
                    + Add Video
                </button>

            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="table-wrap">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Video</th>
                        <th>Level</th>
                        <th>Lesson</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    ${AdminState.data.videos.map(video => `

                        <tr>

                            <td>
                                <div class="table-title">
                                    ${escapeHTML(video.title)}
                                </div>

                                <div class="table-muted">
                                    ${escapeHTML(video.id)}
                                </div>
                            </td>

                            <td>
                                <span class="badge badge-green">
                                    ${escapeHTML(video.levelId)}
                                </span>
                            </td>

                            <td>
                                ${escapeHTML(
                                    video.lessonId || "—"
                                )}
                            </td>

                            <td>
                                ${
                                    video.published
                                        ? `<span class="badge badge-green">Published</span>`
                                        : `<span class="badge badge-gray">Draft</span>`
                                }
                            </td>

                            <td>
                                <button
                                    class="btn btn-small btn-secondary"
                                    data-action="edit-video"
                                    data-id="${escapeHTML(video.id)}"
                                >
                                    Edit
                                </button>
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}

/* =========================================================
   VOCABULARY
   ========================================================= */

function renderVocabulary() {

    const container =
        document.querySelector("[data-vocabulary-table]");

    if (!container) return;

    if (!AdminState.data.vocabulary.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🔤
                </div>

                <div class="empty-title">
                    No vocabulary yet
                </div>

                <div class="empty-description">
                    Vocabulary will be added later
                    through the Admin Panel.
                </div>

                <button
                    class="btn btn-primary"
                    data-action="add-vocabulary"
                >
                    + Add Word
                </button>

            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="table-wrap">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Level</th>
                        <th>Translation</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    ${AdminState.data.vocabulary.map(word => `

                        <tr>

                            <td>
                                <div class="table-title">
                                    ${escapeHTML(word.word)}
                                </div>
                            </td>

                            <td>
                                <span class="badge badge-green">
                                    ${escapeHTML(word.levelId || "—")}
                                </span>
                            </td>

                            <td>
                                ${escapeHTML(
                                    word.translation || "—"
                                )}
                            </td>

                            <td>
                                <span class="badge badge-green">
                                    Active
                                </span>
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}

/* =========================================================
   EXERCISES
   ========================================================= */

function renderExercises() {

    const container =
        document.querySelector("[data-exercises-table]");

    if (!container) return;

    if (!AdminState.data.exercises.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ✏️
                </div>

                <div class="empty-title">
                    No exercises yet
                </div>

                <div class="empty-description">
                    Exercise types such as multiple choice,
                    matching and fill-in-the-blank will be
                    managed here.
                </div>

                <button
                    class="btn btn-primary"
                    data-action="add-exercise"
                >
                    + Add Exercise
                </button>

            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="table-wrap">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Exercise</th>
                        <th>Type</th>
                        <th>Lesson</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    ${AdminState.data.exercises.map(exercise => `

                        <tr>

                            <td>
                                <div class="table-title">
                                    ${escapeHTML(
                                        exercise.title ||
                                        exercise.id
                                    )}
                                </div>
                            </td>

                            <td>
                                <span class="badge badge-gray">
                                    ${escapeHTML(
                                        exercise.type || "—"
                                    )}
                                </span>
                            </td>

                            <td>
                                ${escapeHTML(
                                    exercise.lessonId || "—"
                                )}
                            </td>

                            <td>
                                <span class="badge badge-green">
                                    Active
                                </span>
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}

/* =========================================================
   TESTS
   ========================================================= */

function renderTests() {

    const container =
        document.querySelector("[data-tests-table]");

    if (!container) return;

    if (!AdminState.data.tests.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📝
                </div>

                <div class="empty-title">
                    No tests yet
                </div>

                <div class="empty-description">
                    Level assessments and lesson tests
                    will be managed here.
                </div>

                <button
                    class="btn btn-primary"
                    data-action="add-test"
                >
                    + Add Test
                </button>

            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="table-wrap">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Level</th>
                        <th>Questions</th>
                        <th>Pass %</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    ${AdminState.data.tests.map(test => `

                        <tr>

                            <td>
                                <div class="table-title">
                                    ${escapeHTML(
                                        test.title ||
                                        test.id
                                    )}
                                </div>
                            </td>

                            <td>
                                <span class="badge badge-green">
                                    ${escapeHTML(
                                        test.levelId || "—"
                                    )}
                                </span>
                            </td>

                            <td>
                                ${Number(test.questions?.length || 0)}
                            </td>

                            <td>
                                ${Number(test.passPercent || 70)}%
                            </td>

                            <td>
                                <span class="badge badge-green">
                                    Active
                                </span>
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}

/* =========================================================
   USERS
   ========================================================= */

function renderUsers() {

    const container =
        document.querySelector("[data-users-table]");

    if (!container) return;

    if (!AdminState.data.users.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    👥
                </div>

                <div class="empty-title">
                    Users are not connected yet
                </div>

                <div class="empty-description">
                    User accounts will be connected after
                    the backend and authentication system
                    are added.
                </div>

            </div>
        `;

        return;
    }
}

/* =========================================================
   SETTINGS
   ========================================================= */

function renderSettings() {

    const container =
        document.querySelector("[data-settings-container]");

    if (!container) return;

    container.innerHTML = `
        <div class="admin-card">

            <div class="card-header">
                <div>
                    <div class="card-title">
                        Application Settings
                    </div>

                    <div class="card-subtitle">
                        Basic SHOHIN ENGLISH configuration
                    </div>
                </div>
            </div>

            <div class="card-body">

                <div class="form-grid">

                    <div class="form-group">

                        <label class="form-label">
                            Application Name
                        </label>

                        <input
                            class="form-input"
                            type="text"
                            value="SHOHIN ENGLISH"
                        >

                    </div>

                    <div class="form-group">

                        <label class="form-label">
                            Default Language
                        </label>

                        <select class="form-select">

                            <option selected>
                                English
                            </option>

                        </select>

                    </div>

                    <div class="form-group full">

                        <label class="form-label">
                            Description
                        </label>

                        <textarea class="form-textarea">Professional English learning platform by SHOHIN.</textarea>

                    </div>

                </div>

                <div style="margin-top:20px">

                    <button
                        class="btn btn-primary"
                        data-action="save-settings"
                    >
                        Save Settings
                    </button>

                </div>

            </div>

        </div>
    `;
}

/* =========================================================
   LOAD FOUNDATION DATA
   ========================================================= */

async function loadFoundationData() {

    try {

        const response =
            await fetch("../data/lessons.json");

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        AdminState.data.lessons =
            Array.isArray(data.lessons)
                ? data.lessons
                : [];

        AdminState.data.videos =
            Array.isArray(data.videos)
                ? data.videos
                : [];

        AdminState.data.vocabulary =
            Array.isArray(data.vocabulary)
                ? data.vocabulary
                : [];

        AdminState.data.tests =
            Array.isArray(data.tests)
                ? data.tests
                : [];

        AdminState.data.exercises =
            [];

        AdminState.data.levels =
            Array.isArray(data.course?.levels)
                ? data.course.levels
                : LEVELS;

        renderSection(
            AdminState.currentSection
        );

        showToast(
            "Course data loaded",
            "success"
        );

    } catch (error) {

        console.warn(
            "SHOHIN ADMIN: Could not load course data.",
            error
        );

        showToast(
            "Course data is not connected yet",
            "error"
        );
    }
}

/* =========================================================
   ACTIONS
   ========================================================= */

function handleAction(action, element) {

    switch (action) {

        case "add-lesson":
            openAddLesson();
            break;

        case "edit-lesson":
            editLesson(
                element.dataset.id
            );
            break;

        case "add-video":
            openAddVideo();
            break;

        case "edit-video":
            editVideo(
                element.dataset.id
            );
            break;

        case "add-vocabulary":
            openAddVocabulary();
            break;

        case "add-exercise":
            openAddExercise();
            break;

        case "add-test":
            openAddTest();
            break;

        case "save-settings":
            showToast(
                "Settings saved locally",
                "success"
            );
            break;

        default:
            console.log(
                "Unknown admin action:",
                action
            );
    }
}

/* =========================================================
   FUTURE CONTENT ACTIONS
   ========================================================= */

function openAddLesson() {
    showToast(
        "Lesson editor will be connected next",
        "success"
    );
}

function editLesson(id) {
    showToast(
        `Lesson editor: ${id}`,
        "success"
    );
}

function openAddVideo() {
    showToast(
        "Video editor will be connected next",
        "success"
    );
}

function editVideo(id) {
    showToast(
        `Video editor: ${id}`,
        "success"
    );
}

function openAddVocabulary() {
    showToast(
        "Vocabulary editor will be connected next",
        "success"
    );
}

function openAddExercise() {
    showToast(
        "Exercise editor will be connected next",
        "success"
    );
}

function openAddTest() {
    showToast(
        "Test editor will be connected next",
        "success"
    );
}

/* =========================================================
   EVENT DELEGATION
   ========================================================= */

document.addEventListener("click", event => {

    const sectionButton =
        event.target.closest("[data-section]");

    if (sectionButton) {

        event.preventDefault();

        showSection(
            sectionButton.dataset.section
        );

        return;
    }

    const actionElement =
        event.target.closest("[data-action]");

    if (actionElement) {

        event.preventDefault();

        handleAction(
            actionElement.dataset.action,
            actionElement
        );

        return;
    }

    const mobileButton =
        event.target.closest(
            "[data-mobile-menu]"
        );

    if (mobileButton) {

        if (AdminState.sidebarOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }

        return;
    }

    const overlay =
        event.target.closest(
            ".sidebar-overlay"
        );

    if (overlay) {
        closeSidebar();
    }
});

/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        AdminState.sidebarOpen
    ) {
        closeSidebar();
    }
});

/* =========================================================
   INITIALIZATION
   ========================================================= */

async function initAdmin() {

    console.log(
        "SHOHIN ENGLISH ADMIN PANEL"
    );

    console.log(
        "Admin foundation initialized."
    );

    showSection("dashboard");

    await loadFoundationData();
}

/* =========================================================
   START
   ========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initAdmin
    );

} else {

    initAdmin();

}

/* =========================================================
   GLOBAL API
   ========================================================= */

window.ShohinAdmin = {

    state: AdminState,

    showSection,

    renderSection,

    loadFoundationData,

    showToast,

    openSidebar,

    closeSidebar

};