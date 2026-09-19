// ======================================================
// SHOHIN ENGLISH — LESSON STRUCTURE
// Контент уроков НЕ добавляем здесь.
// Контент в будущем будет приходить из Admin Panel.
// ======================================================

const SHOHIN_LEVELS = {
  A1: {
    code: "A1",
    name: "Beginner",
    lessons: 20
  },

  A2: {
    code: "A2",
    name: "Elementary",
    lessons: 25
  },

  B1: {
    code: "B1",
    name: "Intermediate",
    lessons: 30
  },

  B2: {
    code: "B2",
    name: "Upper-Intermediate",
    lessons: 30
  },

  C1: {
    code: "C1",
    name: "Advanced",
    lessons: 35
  },

  C2: {
    code: "C2",
    name: "Proficiency",
    lessons: 40
  }
};


// ======================================================
// GET LEVEL
// ======================================================

function getSHOHINLevel(level) {
  return SHOHIN_LEVELS[level] || null;
}


// ======================================================
// GET ALL LEVELS
// ======================================================

function getSHOHINLevels() {
  return Object.values(SHOHIN_LEVELS);
}


// ======================================================
// LESSON STATUS
// ======================================================

function isSHOHINLessonCompleted(level, lessonNumber) {
  const data = window.SHOHINStorage?.get();

  if (!data || !Array.isArray(data.completedLessons)) {
    return false;
  }

  return data.completedLessons.some(item =>
    item.level === level &&
    item.lesson === lessonNumber
  );
}


function getSHOHINLessonStatus(level, lessonNumber) {

  const data = window.SHOHINStorage?.get();

  if (!data) {
    return "locked";
  }

  if (isSHOHINLessonCompleted(level, lessonNumber)) {
    return "completed";
  }

  if (
    data.currentLesson &&
    data.currentLesson.level === level &&
    data.currentLesson.lesson === lessonNumber
  ) {
    return "current";
  }

  return "locked";
}


// ======================================================
// OPEN LESSON
// ======================================================

function openSHOHINLesson(level, lessonNumber) {

  const status = getSHOHINLessonStatus(level, lessonNumber);

  if (status === "locked") {
    return false;
  }

  window.dispatchEvent(
    new CustomEvent("shohin:openLesson", {
      detail: {
        level,
        lesson: lessonNumber
      }
    })
  );

  return true;
}


// ======================================================
// FUTURE ADMIN PANEL DATA
// ======================================================
//
// Позже Admin Panel будет передавать:
//
// {
//   id: "...",
//   level: "A1",
//   lesson: 1,
//   title: "...",
//   cards: [],
//   exercises: [],
//   test: []
// }
//
// Здесь пока НИЧЕГО не добавляем.
// ======================================================


window.SHOHINLessons = {
  levels: SHOHIN_LEVELS,

  getLevel: getSHOHINLevel,
  getLevels: getSHOHINLevels,

  getStatus: getSHOHINLessonStatus,

  isCompleted: isSHOHINLessonCompleted,

  open: openSHOHINLesson
};