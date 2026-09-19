/* =========================================================
   SHOHIN ENGLISH
   js/app.js

   Main application controller.
   No login required.
   Guest progress is stored locally.
   Content will later come from Admin Panel / API.

   SHOHIN BRAND COLORS — НЕ МЕНЯТЬ
========================================================= */

(function () {
  "use strict";

  /* =======================================================
     APP STATE
  ======================================================= */

  const App = {
    state: {
      currentView: "home",
      currentLevel: "A1",
      currentLesson: 1,
      currentVideo: null,
      currentTab: "lessons",
      videos: [],
      vocabulary: [],
      dataLoaded: false
    },

    elements: {},

    /* =====================================================
       INIT
    ===================================================== */

    init() {
      this.cacheElements();
      this.bindEvents();

      this.loadExternalData()
        .finally(() => {
          this.renderHome();
          this.renderLevels();
          this.renderProgress();
          this.hideSplash();
          this.showView("home");
        });
    },

    /* =====================================================
       CACHE DOM ELEMENTS
    ===================================================== */

    cacheElements() {
      this.elements = {
        splash: document.getElementById("splash-screen"),
        main: document.getElementById("main-screen"),

        home: document.getElementById("home-view"),
        level: document.getElementById("level-view"),
        lesson: document.getElementById("lesson-view"),
        video: document.getElementById("video-view"),
        progress: document.getElementById("progress-view"),

        levelsContainer: document.getElementById("levels-container"),
        levelTitle: document.getElementById("level-title"),
        levelSubtitle: document.getElementById("level-subtitle"),
        levelProgress: document.getElementById("level-progress"),

        lessonsContainer: document.getElementById("lessons-container"),
        videosContainer: document.getElementById("videos-container"),
        vocabularyContainer: document.getElementById("vocabulary-container"),

        lessonPlayer: document.getElementById("lesson-player-container"),

        videoPlayer: document.getElementById("video-player-container"),
        videoName: document.getElementById("video-name"),
        videoDescription: document.getElementById("video-description"),

        overallProgress: document.getElementById("overall-progress"),
        completedLessons: document.getElementById("completed-lessons"),
        totalLessons: document.getElementById("total-lessons"),

        continueLevel: document.getElementById("continue-level"),
        continueLesson: document.getElementById("continue-lesson"),

        sideMenu: document.getElementById("side-menu"),
        menuOverlay: document.getElementById("menu-overlay"),

        menuButton: document.getElementById("menu-button"),
        closeMenuButton: document.getElementById("close-menu"),

        bottomHome: document.getElementById("nav-home"),
        bottomLevels: document.getElementById("nav-levels"),
        bottomProgress: document.getElementById("nav-progress"),
        bottomMenu: document.getElementById("nav-menu")
      };
    },

    /* =====================================================
       EVENTS
    ===================================================== */

    bindEvents() {
      document.addEventListener("click", (event) => {
        const target = event.target.closest("[data-action]");

        if (!target) return;

        const action = target.dataset.action;

        switch (action) {
          case "open-level":
            this.openLevel(target.dataset.level);
            break;

          case "open-lesson":
            this.openLesson(
              target.dataset.level,
              Number(target.dataset.lesson)
            );
            break;

          case "open-video":
            this.openVideo(target.dataset.video);
            break;

          case "close-lesson":
            this.showView("level");
            break;

          case "close-video":
            this.showView("level");
            break;

          case "continue":
            this.continueLearning();
            break;

          case "open-home":
            this.showView("home");
            break;

          case "open-levels":
            this.openLevels();
            break;

          case "open-progress":
            this.showView("progress");
            this.renderProgress();
            break;

          case "open-menu":
            this.openMenu();
            break;

          case "close-menu":
            this.closeMenu();
            break;

          case "switch-tab":
            this.switchLevelTab(target.dataset.tab);
            break;

          case "reset-progress":
            this.resetProgress();
            break;
        }
      });

      if (this.elements.menuOverlay) {
        this.elements.menuOverlay.addEventListener("click", () => {
          this.closeMenu();
        });
      }

      document.addEventListener(
        "shohin:lesson-completed",
        () => {
          this.renderProgress();
          this.renderLevels();

          if (this.state.currentLevel) {
            this.renderLevelLessons(this.state.currentLevel);
          }

          this.renderHome();
        }
      );

      document.addEventListener(
        "shohin:progress-updated",
        () => {
          this.renderProgress();
          this.renderLevels();
          this.renderHome();
        }
      );

      document.addEventListener(
        "shohin:lesson-close",
        () => {
          this.showView("level");
        }
      );

      document.addEventListener(
        "shohin:lesson-locked",
        () => {
          this.showToast("This lesson is locked.");
        }
      );

      document.addEventListener(
        "shohin:test-completed",
        () => {
          this.renderProgress();
          this.renderLevels();
          this.renderHome();
        }
      );

      window.addEventListener("popstate", () => {
        this.showView("home");
      });
    },

    /* =====================================================
       LOAD DATA
    ===================================================== */

    async loadExternalData() {
      try {
        const response = await fetch("data/lessons.json", {
          cache: "no-cache"
        });

        if (!response.ok) {
          throw new Error("Could not load lessons.json");
        }

        const data = await response.json();

        this.state.videos = Array.isArray(data.videos)
          ? data.videos
          : [];

        this.state.vocabulary = Array.isArray(data.vocabulary)
          ? data.vocabulary
          : [];

        this.state.dataLoaded = true;

        console.log("SHOHIN ENGLISH data loaded.");
      } catch (error) {
        console.warn("SHOHIN ENGLISH data file is not available yet.", error);

        this.state.videos = [];
        this.state.vocabulary = [];
        this.state.dataLoaded = false;
      }
    },

    /* =====================================================
       SPLASH
    ===================================================== */

    hideSplash() {
      setTimeout(() => {
        if (this.elements.splash) {
          this.elements.splash.classList.remove("active");
          this.elements.splash.hidden = true;
        }

        if (this.elements.main) {
          this.elements.main.classList.add("active");
          this.elements.main.hidden = false;
        }
      }, 700);
    },

    /* =====================================================
       VIEW CONTROL
    ===================================================== */

    showView(viewName) {
      const views = {
        home: this.elements.home,
        level: this.elements.level,
        lesson: this.elements.lesson,
        video: this.elements.video,
        progress: this.elements.progress
      };

      Object.keys(views).forEach((key) => {
        const view = views[key];

        if (!view) return;

        const active = key === viewName;

        view.classList.toggle("active", active);
        view.hidden = !active;
      });

      this.state.currentView = viewName;

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      this.closeMenu();
    },

    /* =====================================================
       HOME
    ===================================================== */

    renderHome() {
      const stats = this.getStatistics();

      if (this.elements.overallProgress) {
        this.elements.overallProgress.textContent =
          `${stats.coursePercent}%`;
      }

      if (this.elements.completedLessons) {
        this.elements.completedLessons.textContent =
          stats.completedLessons;
      }

      if (this.elements.totalLessons) {
        this.elements.totalLessons.textContent =
          stats.totalLessons;
      }

      if (this.elements.continueLevel) {
        this.elements.continueLevel.textContent =
          stats.currentLevel;
      }

      if (this.elements.continueLesson) {
        this.elements.continueLesson.textContent =
          `Lesson ${stats.currentLesson}`;
      }
    },

    /* =====================================================
       LEVELS
    ===================================================== */

    renderLevels() {
      const container = this.elements.levelsContainer;

      if (!container || !window.ShohinLevels) return;

      const levels = ShohinLevels.getAllLevelInfo();

      if (!levels.length) {
        container.innerHTML = this.emptyState(
          "No levels available yet."
        );
        return;
      }

      container.innerHTML = levels
        .map((level) => {
          const percent = Number(level.progress || 0);

          let statusClass = "locked";
          let statusText = "Locked";

          if (level.status === "active") {
            statusClass = "active";
            statusText = "Start";
          }

          if (level.status === "completed") {
            statusClass = "completed";
            statusText = "Completed";
          }

          if (level.status === "available") {
            statusClass = "available";
            statusText = "Start";
          }

          return `
            <article
              class="level-card ${statusClass}"
              data-action="open-level"
              data-level="${this.escape(level.id)}"
              role="button"
              tabindex="0"
            >
              <div class="level-card-top">
                <span class="level-code">
                  ${this.escape(level.id)}
                </span>

                <span class="level-status">
                  ${statusText}
                </span>
              </div>

              <h3>
                ${this.escape(level.title || level.name || level.id)}
              </h3>

              <p>
                ${this.escape(
                  level.description ||
                  `${level.lessons || 0} lessons`
                )}
              </p>

              <div class="level-mini-progress">
                <div class="progress-track">
                  <span
                    class="progress-fill"
                    style="width:${percent}%"
                  ></span>
                </div>

                <strong>${percent}%</strong>
              </div>
            </article>
          `;
        })
        .join("");
    },

    /* =====================================================
       OPEN LEVEL
    ===================================================== */

    openLevel(levelId) {
      if (!window.ShohinLevels) return;

      const level = ShohinLevels.getLevelInfo(levelId);

      if (!level) {
        this.showToast("Level not found.");
        return;
      }

      if (!ShohinLevels.isLevelUnlocked(levelId)) {
        this.showToast(
          "Complete the previous level first."
        );
        return;
      }

      this.state.currentLevel = levelId;
      this.state.currentTab = "lessons";

      if (window.ShohinProgress) {
        ShohinProgress.setCurrentPosition(
          levelId,
          ShohinStorage.getCurrentLesson(levelId)
        );
      } else {
        ShohinStorage.setCurrentLevel(levelId);
      }

      this.renderLevelHeader(levelId);
      this.switchLevelTab("lessons", false);
      this.showView("level");
    },

    openLevels() {
      this.renderLevels();
      this.showView("home");

      const levels = document.getElementById("levels-section");

      if (levels) {
        setTimeout(() => {
          levels.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }
    },

    renderLevelHeader(levelId) {
      const level = ShohinLevels.getLevelInfo(levelId);

      if (!level) return;

      if (this.elements.levelTitle) {
        this.elements.levelTitle.textContent =
          level.title || level.id;
      }

      if (this.elements.levelSubtitle) {
        this.elements.levelSubtitle.textContent =
          `${level.lessons || 0} lessons`;
      }

      if (this.elements.levelProgress) {
        this.elements.levelProgress.textContent =
          `${Number(level.progress || 0)}%`;
      }
    },

    /* =====================================================
       LEVEL TABS
    ===================================================== */

    switchLevelTab(tab, render = true) {
      this.state.currentTab = tab;

      document
        .querySelectorAll("[data-tab]")
        .forEach((button) => {
          button.classList.toggle(
            "active",
            button.dataset.tab === tab
          );
        });

      const containers = {
        lessons: this.elements.lessonsContainer,
        videos: this.elements.videosContainer,
        vocabulary: this.elements.vocabularyContainer
      };

      Object.keys(containers).forEach((key) => {
        const element = containers[key];

        if (!element) return;

        element.hidden = key !== tab;
      });

      if (!render) return;

      if (tab === "lessons") {
        this.renderLevelLessons(this.state.currentLevel);
      }

      if (tab === "videos") {
        this.renderVideos(this.state.currentLevel);
      }

      if (tab === "vocabulary") {
        this.renderVocabulary(this.state.currentLevel);
      }
    },

    /* =====================================================
       LESSON LIST
    ===================================================== */

    renderLevelLessons(levelId) {
      const container = this.elements.lessonsContainer;

      if (!container || !window.ShohinLessons) return;

      const lessons = ShohinLessons.getLevelLessons(levelId);

      if (!lessons.length) {
        container.innerHTML = this.emptyState(
          "No lessons available."
        );
        return;
      }

      container.innerHTML = lessons
        .map((lesson) => {
          const completed = ShohinStorage.isLessonCompleted(
            levelId,
            lesson.lessonNumber
          );

          const unlocked = ShohinLessons.isLessonUnlocked(
            levelId,
            lesson.lessonNumber
          );

          const published = lesson.published === true;

          let stateClass = "locked";
          let status = "Locked";

          if (completed) {
            stateClass = "completed";
            status = "Completed";
          } else if (unlocked) {
            stateClass = "available";
            status = published
              ? "Start"
              : "Coming soon";
          }

          return `
            <article
              class="lesson-card ${stateClass}"
              ${unlocked ? `
                data-action="open-lesson"
                data-level="${this.escape(levelId)}"
                data-lesson="${lesson.lessonNumber}"
                role="button"
                tabindex="0"
              ` : ""}
            >
              <div class="lesson-number">
                ${lesson.lessonNumber}
              </div>

              <div class="lesson-card-content">
                <h3>
                  ${this.escape(
                    lesson.title ||
                    `Lesson ${lesson.lessonNumber}`
                  )}
                </h3>

                <p>
                  ${this.escape(
                    lesson.subtitle ||
                    lesson.description ||
                    "English lesson"
                  )}
                </p>
              </div>

              <span class="lesson-status">
                ${status}
              </span>
            </article>
          `;
        })
        .join("");
    },

    /* =====================================================
       OPEN LESSON
    ===================================================== */

    openLesson(levelId, lessonNumber) {
      if (!window.ShohinLessons) return;

      const lesson = ShohinLessons.getLesson(
        levelId,
        lessonNumber
      );

      if (!lesson) {
        this.showToast("Lesson not found.");
        return;
      }

      if (
        !ShohinLessons.isLessonUnlocked(
          levelId,
          lessonNumber
        )
      ) {
        this.showToast(
          "This lesson is locked."
        );
        return;
      }

      this.state.currentLevel = levelId;
      this.state.currentLesson = lessonNumber;

      if (window.ShohinProgress) {
        ShohinProgress.setCurrentPosition(
          levelId,
          lessonNumber
        );
      }

      this.showView("lesson");

      if (window.ShohinLessonPlayer) {
        ShohinLessonPlayer.start(
          levelId,
          lessonNumber
        );
      }
    },

    /* =====================================================
       CONTINUE LEARNING
    ===================================================== */

    continueLearning() {
      const level =
        ShohinStorage.getCurrentLevel() || "A1";

      const lesson =
        ShohinStorage.getCurrentLesson(level) || 1;

      if (
        window.ShohinLessons &&
        !ShohinLessons.isLessonUnlocked(level, lesson)
      ) {
        this.openLevel(level);
        return;
      }

      this.openLesson(level, lesson);
    },

    /* =====================================================
       VIDEOS
    ===================================================== */

    renderVideos(levelId) {
      const container = this.elements.videosContainer;

      if (!container) return;

      const videos = this.state.videos.filter((video) => {
        if (!video) return false;

        const videoLevel =
          video.levelId ||
          video.level ||
          "";

        return videoLevel === levelId;
      });

      if (!videos.length) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">▶</div>
            <h3>Videos coming soon</h3>
            <p>
              Videos for ${this.escape(levelId)}
              will be added from the Admin Panel.
            </p>
          </div>
        `;
        return;
      }

      container.innerHTML = videos
        .sort((a, b) => {
          return Number(a.order || 0) -
                 Number(b.order || 0);
        })
        .map((video) => {
          const watched =
            ShohinStorage.isVideoWatched(
              levelId,
              video.id
            );

          return `
            <article
              class="video-card"
              data-action="open-video"
              data-video="${this.escape(video.id)}"
              role="button"
              tabindex="0"
            >
              <div class="video-cover">
                ${
                  video.cover
                    ? `
                      <img
                        src="${this.escapeAttribute(video.cover)}"
                        alt=""
                        loading="lazy"
                      >
                    `
                    : `
                      <div class="video-cover-placeholder">
                        ▶
                      </div>
                    `
                }

                <span class="video-play">▶</span>
              </div>

              <div class="video-card-content">
                <h3>
                  ${this.escape(
                    video.title || "Video"
                  )}
                </h3>

                <p>
                  ${this.escape(
                    video.description || ""
                  )}
                </p>

                ${
                  watched
                    ? `<span class="video-watched">
                        Watched
                       </span>`
                    : ""
                }
              </div>
            </article>
          `;
        })
        .join("");
    },

    openVideo(videoId) {
      const video = this.state.videos.find(
        (item) => String(item.id) === String(videoId)
      );

      if (!video) {
        this.showToast("Video not found.");
        return;
      }

      this.state.currentVideo = video;

      if (this.elements.videoName) {
        this.elements.videoName.textContent =
          video.title || "Video";
      }

      if (this.elements.videoDescription) {
        this.elements.videoDescription.textContent =
          video.description || "";
      }

      if (this.elements.videoPlayer) {
        const url = video.url || video.videoUrl || "";

        if (!url) {
          this.elements.videoPlayer.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon">▶</div>
              <h3>Video not available</h3>
              <p>
                The video URL will be added from
                the Admin Panel.
              </p>
            </div>
          `;
        } else {
          this.elements.videoPlayer.innerHTML = `
            <div class="video-frame-wrapper">
              <iframe
                src="${this.escapeAttribute(url)}"
                title="${this.escapeAttribute(
                  video.title || "SHOHIN ENGLISH Video"
                )}"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write;
                encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
          `;
        }
      }

      const levelId =
        video.levelId ||
        video.level ||
        this.state.currentLevel;

      if (levelId) {
        ShohinStorage.markVideoWatched(
          levelId,
          video.id
        );
      }

      this.showView("video");
    },

    /* =====================================================
       VOCABULARY
    ===================================================== */

    renderVocabulary(levelId) {
      const container = this.elements.vocabularyContainer;

      if (!container) return;

      const words = this.state.vocabulary.filter((word) => {
        const wordLevel =
          word.levelId ||
          word.level ||
          "";

        return wordLevel === levelId;
      });

      if (!words.length) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">A</div>
            <h3>Vocabulary coming soon</h3>
            <p>
              Vocabulary for ${this.escape(levelId)}
              will be added from the Admin Panel.
            </p>
          </div>
        `;
        return;
      }

      container.innerHTML = words
        .map((word) => {
          const learned =
            ShohinStorage.isWordLearned(
              levelId,
              word.id
            );

          return `
            <article
              class="word-card ${learned ? "learned" : ""}"
            >
              <div>
                <strong>
                  ${this.escape(
                    word.word || word.term || ""
                  )}
                </strong>

                <span>
                  ${this.escape(
                    word.translation || ""
                  )}
                </span>
              </div>

              ${
                word.example
                  ? `
                    <p>
                      ${this.escape(word.example)}
                    </p>
                  `
                  : ""
              }
            </article>
          `;
        })
        .join("");
    },

    /* =====================================================
       PROGRESS
    ===================================================== */

    renderProgress() {
      const stats = this.getStatistics();

      if (this.elements.overallProgress) {
        this.elements.overallProgress.textContent =
          `${stats.coursePercent}%`;
      }

      if (this.elements.completedLessons) {
        this.elements.completedLessons.textContent =
          stats.completedLessons;
      }

      if (this.elements.totalLessons) {
        this.elements.totalLessons.textContent =
          stats.totalLessons;
      }
    },

    getStatistics() {
      if (window.ShohinProgress) {
        const data =
          ShohinProgress.getDashboardData();

        return {
          coursePercent:
            Number(data.coursePercent || 0),

          completedLessons:
            Number(data.completedLessons || 0),

          totalLessons:
            Number(data.totalLessons || 180),

          currentLevel:
            data.currentLevel ||
            ShohinStorage.getCurrentLevel() ||
            "A1",

          currentLesson:
            Number(
              data.currentLesson ||
              ShohinStorage.getCurrentLesson() ||
              1
            )
        };
      }

      const completed =
        ShohinStorage.getCompletedLessons();

      return {
        coursePercent: 0,
        completedLessons: completed.length,
        totalLessons: 180,
        currentLevel:
          ShohinStorage.getCurrentLevel() || "A1",
        currentLesson:
          ShohinStorage.getCurrentLesson() || 1
      };
    },

    /* =====================================================
       MENU
    ===================================================== */

    openMenu() {
      const menu = this.elements.sideMenu;
      const overlay = this.elements.menuOverlay;

      if (menu) {
        menu.classList.add("open");
        menu.setAttribute("aria-hidden", "false");
      }

      if (overlay) {
        overlay.hidden = false;
        requestAnimationFrame(() => {
          overlay.classList.add("active");
        });
      }
    },

    closeMenu() {
      const menu = this.elements.sideMenu;
      const overlay = this.elements.menuOverlay;

      if (menu) {
        menu.classList.remove("open");
        menu.setAttribute("aria-hidden", "true");
      }

      if (overlay) {
        overlay.classList.remove("active");

        setTimeout(() => {
          overlay.hidden = true;
        }, 200);
      }
    },

    /* =====================================================
       RESET
    ===================================================== */

    resetProgress() {
      const confirmed = window.confirm(
        "Reset all local learning progress?"
      );

      if (!confirmed) return;

      ShohinStorage.reset();

      this.state.currentLevel = "A1";
      this.state.currentLesson = 1;

      this.renderHome();
      this.renderLevels();
      this.renderProgress();

      if (this.state.currentView === "level") {
        this.renderLevelLessons(
          this.state.currentLevel
        );
      }

      this.showToast("Progress reset.");
    },

    /* =====================================================
       TOAST
    ===================================================== */

    showToast(message) {
      let toast =
        document.getElementById("shohin-toast");

      if (!toast) {
        toast = document.createElement("div");
        toast.id = "shohin-toast";
        toast.className = "toast";
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.classList.add("show");

      clearTimeout(this._toastTimer);

      this._toastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 2500);
    },

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    emptyState(message) {
      return `
        <div class="empty-state">
          <div class="empty-icon">—</div>
          <h3>Nothing here yet</h3>
          <p>${this.escape(message)}</p>
        </div>
      `;
    },

    /* =====================================================
       SECURITY HELPERS
    ===================================================== */

    escape(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    escapeAttribute(value) {
      return this.escape(value);
    }
  };

  /* =======================================================
     KEYBOARD SUPPORT
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    App.closeMenu();
  });

  /* =======================================================
     START APPLICATION
  ======================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });

  /* =======================================================
     GLOBAL EXPORT
  ======================================================= */

  window.ShohinApp = App;

})();