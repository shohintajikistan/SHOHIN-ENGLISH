// ======================================================
// SHOHIN ENGLISH — LOCAL STORAGE
// Контент уроков НЕ хранится здесь.
// ======================================================

// SHOHIN BRAND COLORS — НЕ МЕНЯТЬ

const SHOHIN_STORAGE_KEY = "shohinEnglishData";

const DEFAULT_DATA = {
  version: 2,

  mode: "guest",

  selectedLevel: null,

  currentLesson: {
    level: null,
    lesson: null
  },

  completedLessons: [],

  completedTests: [],

  learnedWords: [],

  achievements: [],

  streak: {
    current: 0,
    best: 0,
    lastDate: null
  },

  dailyGoal: {
    target: 10,
    completed: 0,
    date: null
  },

  statistics: {
    lessonsCompleted: 0,
    testsCompleted: 0,
    wordsLearned: 0,
    totalMinutes: 0
  },

  settings: {
    sound: true,
    notifications: true,
    language: "en"
  }
};


// ======================================================
// GET DATA
// ======================================================

function getSHOHINData() {

  try {

    const saved =
      localStorage.getItem(SHOHIN_STORAGE_KEY);

    if (!saved) {

      const fresh =
        JSON.parse(
          JSON.stringify(DEFAULT_DATA)
        );

      localStorage.setItem(
        SHOHIN_STORAGE_KEY,
        JSON.stringify(fresh)
      );

      return fresh;
    }


    const data = JSON.parse(saved);


    return {
      ...DEFAULT_DATA,
      ...data,

      currentLesson: {
        ...DEFAULT_DATA.currentLesson,
        ...(data.currentLesson || {})
      },

      streak: {
        ...DEFAULT_DATA.streak,
        ...(data.streak || {})
      },

      dailyGoal: {
        ...DEFAULT_DATA.dailyGoal,
        ...(data.dailyGoal || {})
      },

      statistics: {
        ...DEFAULT_DATA.statistics,
        ...(data.statistics || {})
      },

      settings: {
        ...DEFAULT_DATA.settings,
        ...(data.settings || {})
      }
    };

  } catch (error) {

    console.error(
      "SHOHIN Storage error:",
      error
    );

    return JSON.parse(
      JSON.stringify(DEFAULT_DATA)
    );
  }
}


// ======================================================
// SAVE DATA
// ======================================================

function saveSHOHINData(data) {

  localStorage.setItem(
    SHOHIN_STORAGE_KEY,
    JSON.stringify(data)
  );

  return data;
}


// ======================================================
// UPDATE DATA
// ======================================================

function updateSHOHINData(changes) {

  const data =
    getSHOHINData();

  const updated = {
    ...data,
    ...changes
  };

  return saveSHOHINData(updated);
}


// ======================================================
// SELECT LEVEL
// ======================================================

function setSelectedLevel(level) {

  const data =
    getSHOHINData();


  data.selectedLevel = level;


  // Если уровень выбран впервые,
  // начинаем с первого урока.

  if (
    !data.currentLesson.level ||
    data.currentLesson.level !== level
  ) {

    data.currentLesson = {
      level: level,
      lesson: 1
    };

  }


  saveSHOHINData(data);

  return data;
}


// ======================================================
// GET SELECTED LEVEL
// ======================================================

function getSelectedLevel() {

  return getSHOHINData().selectedLevel;
}


// ======================================================
// COMPLETE LESSON
// ======================================================

function completeLesson(
  level,
  lessonNumber
) {

  const data =
    getSHOHINData();


  const exists =
    data.completedLessons.some(
      item =>
        item.level === level &&
        item.lesson === lessonNumber
    );


  if (!exists) {

    data.completedLessons.push({
      level: level,
      lesson: lessonNumber,
      completedAt: new Date().toISOString()
    });

  }


  data.statistics.lessonsCompleted =
    data.completedLessons.length;


  // Следующий урок

  data.currentLesson = {
    level: level,
    lesson: lessonNumber + 1
  };


  saveSHOHINData(data);

  return data;
}


// ======================================================
// COMPLETE TEST
// ======================================================

function completeTest(
  level,
  score
) {

  const data =
    getSHOHINData();


  data.completedTests.push({
    level: level,
    score: score,
    completedAt:
      new Date().toISOString()
  });


  data.statistics.testsCompleted =
    data.completedTests.length;


  saveSHOHINData(data);

  return data;
}


// ======================================================
// ADD WORD
// ======================================================

function addLearnedWord(word) {

  const data =
    getSHOHINData();


  if (!data.learnedWords.includes(word)) {

    data.learnedWords.push(word);

  }


  data.statistics.wordsLearned =
    data.learnedWords.length;


  saveSHOHINData(data);

  return data;
}


// ======================================================
// ADD STUDY MINUTES
// ======================================================

function addStudyMinutes(minutes) {

  const data =
    getSHOHINData();


  data.statistics.totalMinutes +=
    Number(minutes) || 0;


  saveSHOHINData(data);

  return data;
}


// ======================================================
// ACHIEVEMENT
// ======================================================

function unlockAchievement(id) {

  const data =
    getSHOHINData();


  if (!data.achievements.includes(id)) {

    data.achievements.push(id);

  }


  saveSHOHINData(data);

  return data;
}


// ======================================================
// RESET
// ======================================================

function resetSHOHINProgress() {

  const fresh =
    JSON.parse(
      JSON.stringify(DEFAULT_DATA)
    );


  localStorage.setItem(
    SHOHIN_STORAGE_KEY,
    JSON.stringify(fresh)
  );


  return fresh;
}


// ======================================================
// EXPORT
// ======================================================

function exportSHOHINProgress() {

  const data =
    getSHOHINData();

  return JSON.stringify(
    data,
    null,
    2
  );
}


// ======================================================
// IMPORT
// ======================================================

function importSHOHINProgress(json) {

  try {

    const data =
      typeof json === "string"
        ? JSON.parse(json)
        : json;


    if (!data || typeof data !== "object") {
      return false;
    }


    saveSHOHINData(data);

    return true;

  } catch (error) {

    console.error(
      "Import error:",
      error
    );

    return false;
  }
}


// ======================================================
// GLOBAL API
// ======================================================

window.SHOHINStorage = {

  get: getSHOHINData,

  save: saveSHOHINData,

  update: updateSHOHINData,

  setLevel: setSelectedLevel,

  getLevel: getSelectedLevel,

  completeLesson: completeLesson,

  completeTest: completeTest,

  addWord: addLearnedWord,

  addMinutes: addStudyMinutes,

  achievement: unlockAchievement,

  reset: resetSHOHINProgress,

  export: exportSHOHINProgress,

  import: importSHOHINProgress

};