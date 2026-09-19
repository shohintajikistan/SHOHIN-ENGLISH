// ======================================================
// SHOHIN ENGLISH — LESSON SCREEN
// Каркас без учебного контента
// Контент будет приходить из Admin Panel
// ======================================================

(function () {
  "use strict";

  let currentLevel = null;

  // ----------------------------------------------------
  // OPEN LESSONS SCREEN
  // ----------------------------------------------------

  function openLessonsScreen(level) {
    currentLevel = level;

    const homeScreen = document.getElementById("homeScreen");
    const lessonsScreen = document.getElementById("lessonsScreen");

    if (!lessonsScreen) return;

    if (homeScreen) {
      homeScreen.style.display = "none";
    }

    lessonsScreen.style.display = "block";

    renderLessons(level);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // ----------------------------------------------------
  // CLOSE LESSONS SCREEN
  // ----------------------------------------------------

  function closeLessonsScreen() {
    const homeScreen = document.getElementById("homeScreen");
    const lessonsScreen = document.getElementById("lessonsScreen");

    if (lessonsScreen) {
      lessonsScreen.style.display = "none";
    }

    if (homeScreen) {
      homeScreen.style.display = "block";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // ----------------------------------------------------
  // RENDER LESSONS
  // ----------------------------------------------------

  function renderLessons(level) {

    const container = document.getElementById("lessonsList");

    if (!container) return;

    const levelInfo = window.SHOHINLessons?.getLevel(level);

    if (!levelInfo) {
      container.innerHTML = "";
      return;
    }

    const totalLessons = levelInfo.lessons;

    container.innerHTML = "";

    for (let i = 1; i <= totalLessons; i++) {

      const status =
        window.SHOHINLessons?.getStatus(level, i) || "locked";

      const card = document.createElement("button");

      card.type = "button";
      card.className = "lesson-card";
      card.dataset.level = level;
      card.dataset.lesson = i;
      card.dataset.status = status;

      let icon = "🔒";

      if (status === "completed") {
        icon = "✓";
      }

      if (status === "current") {
        icon = "→";
      }

      card.innerHTML = `
        <div class="lesson-number">
          ${i}
        </div>

        <div class="lesson-content">

          <div class="lesson-title">
            Lesson ${i}
          </div>

          <div class="lesson-subtitle">
            Content will be added from Admin Panel
          </div>

        </div>

        <div class="lesson-status">
          ${icon}
        </div>
      `;

      card.addEventListener("click", function () {

        if (status === "locked") {
          return;
        }

        window.SHOHINLessons.open(level, i);
      });

      container.appendChild(card);
    }
  }


  // ----------------------------------------------------
  // OPEN SELECTED LESSON
  // ----------------------------------------------------

  window.addEventListener(
    "shohin:openLesson",
    function (event) {

      const data = event.detail;

      if (!data) return;

      openLessonPlayer(
        data.level,
        data.lesson
      );
    }
  );


  // ----------------------------------------------------
  // LESSON PLAYER PLACEHOLDER
  // ----------------------------------------------------

  function openLessonPlayer(level, lesson) {

    const lessonsScreen =
      document.getElementById("lessonsScreen");

    const lessonPlayer =
      document.getElementById("lessonPlayerScreen");

    if (!lessonPlayer) return;

    if (lessonsScreen) {
      lessonsScreen.style.display = "none";
    }

    lessonPlayer.style.display = "block";

    const levelElement =
      document.getElementById("playerLevel");

    const lessonElement =
      document.getElementById("playerLesson");

    if (levelElement) {
      levelElement.textContent = level;
    }

    if (lessonElement) {
      lessonElement.textContent =
        `Lesson ${lesson}`;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // ----------------------------------------------------
  // CLOSE LESSON PLAYER
  // ----------------------------------------------------

  function closeLessonPlayer() {

    const lessonPlayer =
      document.getElementById("lessonPlayerScreen");

    if (lessonPlayer) {
      lessonPlayer.style.display = "none";
    }

    if (currentLevel) {
      openLessonsScreen(currentLevel);
    }
  }


  // ----------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------

  window.SHOHINLessonScreen = {

    open: openLessonsScreen,

    close: closeLessonsScreen,

    openPlayer: openLessonPlayer,

    closePlayer: closeLessonPlayer,

    render: renderLessons
  };

})();