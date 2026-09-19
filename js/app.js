// ======================================================
// SHOHIN ENGLISH — APP CONTROLLER
// Каркас приложения
// Контент уроков добавляется позже через Admin Panel
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

  startApplication();

});


// ======================================================
// START APPLICATION
// ======================================================

function startApplication() {

  initializeStorage();

  setupMenu();

  setupLevels();

  setupDailyButton();

  setupNavigation();

  setupMenuActions();

  loadUserProgress();

  hideSplash();

}


// ======================================================
// STORAGE
// ======================================================

function initializeStorage() {

  if (!window.SHOHINStorage) {
    console.error("SHOHIN Storage not found");
    return;
  }

  window.SHOHINStorage.get();

}


// ======================================================
// LOAD PROGRESS
// ======================================================

function loadUserProgress() {

  if (!window.SHOHINStorage) {
    return;
  }

  const data = window.SHOHINStorage.get();

  if (!data) {
    return;
  }

  const totalLessons = 180;

  const completed =
    Array.isArray(data.completedLessons)
      ? data.completedLessons.length
      : 0;

  const percent = Math.min(
    100,
    Math.round((completed / totalLessons) * 100)
  );


  const progressText =
    document.getElementById("overallProgress");

  const progressBar =
    document.getElementById("overallProgressBar");


  if (progressText) {
    progressText.textContent =
      `${percent}%`;
  }


  if (progressBar) {
    progressBar.style.width =
      `${percent}%`;
  }

}


// ======================================================
// LEVELS
// ======================================================

function setupLevels() {

  const levelButtons =
    document.querySelectorAll(".level");


  levelButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const level =
        button.dataset.level;

      if (!level) {
        return;
      }

      selectLevel(level);

    });

  });

}


// ======================================================
// SELECT LEVEL
// ======================================================

function selectLevel(level) {

  if (!window.SHOHINStorage) {
    return;
  }


  window.SHOHINStorage.setLevel(level);


  if (
    window.SHOHINLessonScreen &&
    typeof window.SHOHINLessonScreen.open === "function"
  ) {

    window.SHOHINLessonScreen.open(level);

  }

}


// ======================================================
// DAILY BUTTON
// ======================================================

function setupDailyButton() {

  const button =
    document.getElementById("dailyButton");


  if (!button) {
    return;
  }


  button.addEventListener("click", function () {

    const data =
      window.SHOHINStorage?.get();


    const level =
      data?.selectedLevel || "A1";


    if (
      window.SHOHINLessonScreen &&
      typeof window.SHOHINLessonScreen.open === "function"
    ) {

      window.SHOHINLessonScreen.open(level);

    }

  });

}


// ======================================================
// BOTTOM NAVIGATION
// ======================================================

function setupNavigation() {

  const navItems =
    document.querySelectorAll(".nav-item");


  navItems.forEach(function (item) {

    item.addEventListener("click", function () {

      const action =
        item.dataset.nav;


      navItems.forEach(function (nav) {

        nav.classList.remove("active");

      });


      item.classList.add("active");


      if (action === "home") {

        showHome();

      }


      if (action === "lessons") {

        openSelectedLessons();

      }


      if (action === "progress") {

        showProgress();

      }


      if (action === "profile") {

        showProfile();

      }

    });

  });

}


// ======================================================
// SHOW HOME
// ======================================================

function showHome() {

  closeAllScreens();

  const home =
    document.getElementById("homeScreen");


  if (home) {
    home.style.display = "block";
  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ======================================================
// OPEN SELECTED LESSONS
// ======================================================

function openSelectedLessons() {

  const data =
    window.SHOHINStorage?.get();


  const level =
    data?.selectedLevel || "A1";


  if (
    window.SHOHINLessonScreen &&
    typeof window.SHOHINLessonScreen.open === "function"
  ) {

    window.SHOHINLessonScreen.open(level);

  }

}


// ======================================================
// PROGRESS
// ======================================================

function showProgress() {

  const data =
    window.SHOHINStorage?.get();


  if (!data) {
    return;
  }


  const completedLessons =
    data.completedLessons?.length || 0;


  const completedTests =
    data.completedTests?.length || 0;


  alert(
    "SHOHIN ENGLISH\n\n" +

    "Lessons completed: " +
    completedLessons +

    "\nTests completed: " +
    completedTests
  );

}


// ======================================================
// PROFILE
// ======================================================

function showProfile() {

  const data =
    window.SHOHINStorage?.get();


  if (!data) {
    return;
  }


  alert(
    "SHOHIN ENGLISH\n\n" +
    "Guest Mode\n\n" +
    "Your progress is saved on this device."
  );

}


// ======================================================
// MENU
// ======================================================

function setupMenu() {

  const menu =
    document.getElementById("menu");

  const openButton =
    document.getElementById("menuButton");

  const closeButton =
    document.getElementById("menuClose");

  const overlay =
    document.getElementById("menuOverlay");


  if (openButton) {

    openButton.addEventListener(
      "click",
      function () {

        openMenu();

      }
    );

  }


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function () {

        closeMenu();

      }
    );

  }


  if (overlay) {

    overlay.addEventListener(
      "click",
      function () {

        closeMenu();

      }
    );

  }

}


// ======================================================
// OPEN MENU
// ======================================================

function openMenu() {

  const menu =
    document.getElementById("menu");


  if (menu) {
    menu.classList.add("open");
  }

}


// ======================================================
// CLOSE MENU
// ======================================================

function closeMenu() {

  const menu =
    document.getElementById("menu");


  if (menu) {
    menu.classList.remove("open");
  }

}


// ======================================================
// MENU ACTIONS
// ======================================================

function setupMenuActions() {

  const items =
    document.querySelectorAll(
      ".menu-item"
    );


  items.forEach(function (item) {

    item.addEventListener(
      "click",
      function () {

        const action =
          item.dataset.menuAction;


        closeMenu();


        if (action === "lessons") {

          openSelectedLessons();

        }


        if (action === "progress") {

          showProgress();

        }


        if (action === "achievements") {

          alert(
            "Achievements\n\nComing later."
          );

        }


        if (action === "streak") {

          const data =
            window.SHOHINStorage?.get();


          const streak =
            data?.streak?.current || 0;


          alert(
            "Current streak: " +
            streak +
            " days"
          );

        }


        if (action === "save") {

          saveProgress();

        }


        if (action === "settings") {

          alert(
            "Settings\n\nComing later."
          );

        }

      }
    );

  });

}


// ======================================================
// SAVE PROGRESS
// ======================================================

function saveProgress() {

  if (!window.SHOHINStorage) {
    return;
  }


  const data =
    window.SHOHINStorage.get();


  window.SHOHINStorage.save(data);


  alert(
    "Progress saved on this device."
  );

}


// ======================================================
// CLOSE ALL SCREENS
// ======================================================

function closeAllScreens() {

  const home =
    document.getElementById("homeScreen");

  const lessons =
    document.getElementById("lessonsScreen");

  const player =
    document.getElementById("lessonPlayerScreen");


  if (home) {
    home.style.display = "none";
  }


  if (lessons) {
    lessons.style.display = "none";
  }


  if (player) {
    player.style.display = "none";
  }

}


// ======================================================
// SPLASH
// ======================================================

function hideSplash() {

  const splash =
    document.getElementById("splash");


  if (!splash) {
    return;
  }


  setTimeout(function () {

    splash.classList.add("hide");

  }, 900);

}