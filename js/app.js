/*
==================================================
SHOHIN ENGLISH
APP CONTROLLER
==================================================

Guest-first application.

No mandatory:
- Login
- Registration
- Firebase Auth

Progress:
- localStorage
- js/storage.js

==================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================
     ELEMENTS
  ================================================== */

  const splash =
    document.getElementById("splash");

  const app =
    document.getElementById("app");

  const menu =
    document.getElementById("menu");

  const openMenu =
    document.getElementById("openMenu");

  const closeMenu =
    document.getElementById("closeMenu");

  const progressPercent =
    document.getElementById("progressPercent");

  const progressFill =
    document.getElementById("progressFill");


  /* ==================================================
     START APP
  ================================================== */

  startApplication();


  function startApplication() {

    initializeStorage();

    loadUserProgress();

    setupMenu();

    setupLevels();

    setupDailyButton();

    setupNavigation();

    hideSplash();

  }


  /* ==================================================
     STORAGE
  ================================================== */

  function initializeStorage() {

    if (
      typeof window.SHOHINStorage ===
      "undefined"
    ) {

      console.warn(
        "SHOHINStorage is not loaded."
      );

      return;

    }

    SHOHINStorage.get();

  }


  /* ==================================================
     SPLASH
  ================================================== */

  function hideSplash() {

    setTimeout(() => {

      if (splash) {

        splash.classList.add("hide");

      }

      if (app) {

        app.style.display = "block";

      }

    }, 1000);

  }


  /* ==================================================
     LOAD USER PROGRESS
  ================================================== */

  function loadUserProgress() {

    if (
      typeof window.SHOHINStorage ===
      "undefined"
    ) {

      return;

    }


    const data =
      SHOHINStorage.get();


    const completedLessons =
      data.completedLessons.length;


    /*
      Current planned course:

      A1 = 20
      A2 = 25
      B1 = 30
      B2 = 30
      C1 = 35
      C2 = 40

      Total = 180 lessons
    */

    const totalLessons = 180;


    const percent =
      Math.min(
        100,
        Math.round(
          (
            completedLessons /
            totalLessons
          ) * 100
        )
      );


    if (progressPercent) {

      progressPercent.textContent =
        percent + "%";

    }


    if (progressFill) {

      progressFill.style.width =
        percent + "%";

    }

  }


  /* ==================================================
     MENU
  ================================================== */

  function setupMenu() {

    if (
      !menu ||
      !openMenu ||
      !closeMenu
    ) {

      return;

    }


    openMenu.addEventListener(
      "click",
      () => {

        menu.classList.add("show");

      }
    );


    closeMenu.addEventListener(
      "click",
      () => {

        menu.classList.remove("show");

      }
    );


    menu.addEventListener(
      "click",
      (event) => {

        if (
          event.target === menu
        ) {

          menu.classList.remove(
            "show"
          );

        }

      }
    );

  }


  /* ==================================================
     LEVELS
  ================================================== */

  function setupLevels() {

    const levelButtons =
      document.querySelectorAll(
        ".level"
      );


    levelButtons.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const level =
              button.dataset.level;


            selectLevel(level);

          }
        );

      }
    );

  }


  function selectLevel(level) {

    if (
      typeof window.SHOHINStorage !==
      "undefined"
    ) {

      SHOHINStorage.setLevel(
        level
      );

    }


    /*
      Temporary message.

      Later this will open:
      Levels → Lessons → Lesson 1
    */

    showMessage(
      `${level} selected.`
    );


    loadUserProgress();

  }


  /* ==================================================
     DAILY BUTTON
  ================================================== */

  function setupDailyButton() {

    const button =
      document.getElementById(
        "startLearning"
      );


    if (!button) {

      return;

    }


    button.addEventListener(
      "click",
      () => {

        const level =
          getSelectedLevel();


        if (!level) {

          showMessage(
            "Choose your English level first."
          );

          return;

        }


        openLessons(level);

      }
    );

  }


  /* ==================================================
     GET LEVEL
  ================================================== */

  function getSelectedLevel() {

    if (
      typeof window.SHOHINStorage ===
      "undefined"
    ) {

      return null;

    }


    return SHOHINStorage.getLevel();

  }


  /* ==================================================
     OPEN LESSONS
  ================================================== */

  function openLessons(level) {

    /*
      Temporary.

      Next development step:
      create the real Lessons screen.
    */

    showMessage(
      `Opening ${level} lessons...`
    );

  }


  /* ==================================================
     NAVIGATION
  ================================================== */

  function setupNavigation() {

    const homeNav =
      document.getElementById(
        "homeNav"
      );

    const lessonsNav =
      document.getElementById(
        "lessonsNav"
      );

    const progressNav =
      document.getElementById(
        "progressNav"
      );

    const profileNav =
      document.getElementById(
        "profileNav"
      );


    if (homeNav) {

      homeNav.addEventListener(
        "click",
        () => {

          setActiveNavigation(
            homeNav
          );

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }
      );

    }


    if (lessonsNav) {

      lessonsNav.addEventListener(
        "click",
        () => {

          setActiveNavigation(
            lessonsNav
          );

          const level =
            getSelectedLevel();


          if (!level) {

            showMessage(
              "Choose a level first."
            );

            return;

          }


          openLessons(level);

        }
      );

    }


    if (progressNav) {

      progressNav.addEventListener(
        "click",
        () => {

          setActiveNavigation(
            progressNav
          );

          showProgress();

        }
      );

    }


    if (profileNav) {

      profileNav.addEventListener(
        "click",
        () => {

          setActiveNavigation(
            profileNav
          );

          showProfile();

        }
      );

    }

  }


  /* ==================================================
     ACTIVE NAVIGATION
  ================================================== */

  function setActiveNavigation(
    activeButton
  ) {

    document
      .querySelectorAll(
        ".nav-btn"
      )
      .forEach(
        button => {

          button.classList.remove(
            "active"
          );

        }
      );


    if (activeButton) {

      activeButton.classList.add(
        "active"
      );

    }

  }


  /* ==================================================
     PROGRESS SCREEN
  ================================================== */

  function showProgress() {

    if (
      typeof window.SHOHINStorage ===
      "undefined"
    ) {

      return;

    }


    const data =
      SHOHINStorage.get();


    const lessons =
      data.statistics.lessonsCompleted;


    const words =
      data.statistics.wordsLearned;


    const tests =
      data.statistics.testsCompleted;


    const streak =
      data.streak.current;


    showMessage(
      `Progress

Lessons: ${lessons}
Words: ${words}
Tests: ${tests}
Streak: ${streak} days`
    );

  }


  /* ==================================================
     PROFILE
  ================================================== */

  function showProfile() {

    const data =
      SHOHINStorage
        ? SHOHINStorage.get()
        : null;


    if (!data) {

      return;

    }


    const level =
      data.selectedLevel ||
      "Not selected";


    showMessage(
      `Guest Profile

Level: ${level}

Your progress is saved
on this device.`
    );

  }


  /* ==================================================
     MESSAGE
  ================================================== */

  function showMessage(
    message
  ) {

    /*
      For now we use a simple
      browser dialog.

      Later we will replace this
      with a professional SHOHIN
      notification/toast system.
    */

    alert(message);

  }

});