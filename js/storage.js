/*
==================================================
SHOHIN ENGLISH
LOCAL STORAGE SYSTEM
==================================================

Guest mode:
- No login
- No registration
- No Firebase Auth required

All basic progress is saved on the device.

==================================================
*/

const SHOHIN_STORAGE_KEY = "shohinEnglishData";


/* ================================================
   DEFAULT USER DATA
================================================ */

const DEFAULT_DATA = {

  version: 1,

  mode: "guest",

  selectedLevel: null,

  currentLesson: {
    level: null,
    lesson: 1
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


/* ================================================
   GET DATA
================================================ */

function getSHOHINData() {

  try {

    const saved =
      localStorage.getItem(SHOHIN_STORAGE_KEY);

    if (!saved) {

      saveSHOHINData(DEFAULT_DATA);

      return structuredClone(DEFAULT_DATA);
    }

    const data = JSON.parse(saved);

    return {
      ...structuredClone(DEFAULT_DATA),
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
      "SHOHIN storage error:",
      error
    );

    return structuredClone(DEFAULT_DATA);
  }

}


/* ================================================
   SAVE DATA
================================================ */

function saveSHOHINData(data) {

  try {

    localStorage.setItem(
      SHOHIN_STORAGE_KEY,
      JSON.stringify(data)
    );

    return true;

  } catch (error) {

    console.error(
      "SHOHIN save error:",
      error
    );

    return false;
  }

}


/* ================================================
   UPDATE DATA
================================================ */

function updateSHOHINData(changes) {

  const current =
    getSHOHINData();

  const updated = {
    ...current,
    ...changes
  };

  saveSHOHINData(updated);

  return updated;

}


/* ================================================
   SELECT LEVEL
================================================ */

function setSelectedLevel(level) {

  const data =
    getSHOHINData();

  data.selectedLevel = level;

  data.currentLesson = {
    level: level,
    lesson: 1
  };

  saveSHOHINData(data);

  return data;

}


/* ================================================
   GET SELECTED LEVEL
================================================ */

function getSelectedLevel() {

  const data =
    getSHOHINData();

  return data.selectedLevel;

}


/* ================================================
   COMPLETE LESSON
================================================ */

function completeLesson(level, lessonNumber) {

  const data =
    getSHOHINData();

  const lessonId =
    `${level}-${lessonNumber}`;

  if (
    !data.completedLessons.includes(
      lessonId
    )
  ) {

    data.completedLessons.push(
      lessonId
    );

    data.statistics.lessonsCompleted++;

  }

  data.currentLesson = {
    level: level,
    lesson: lessonNumber + 1
  };

  updateStreak(data);

  updateDailyGoal(data);

  saveSHOHINData(data);

  return data;

}


/* ================================================
   COMPLETE TEST
================================================ */

function completeTest(level, score) {

  const data =
    getSHOHINData();

  const testId =
    `${level}-test`;

  const existing =
    data.completedTests.find(
      item => item.id === testId
    );

  if (!existing) {

    data.completedTests.push({
      id: testId,
      level: level,
      score: score,
      date: new Date().toISOString()
    });

    data.statistics.testsCompleted++;

  } else {

    existing.score = score;
    existing.date =
      new Date().toISOString();

  }

  saveSHOHINData(data);

  return data;

}


/* ================================================
   ADD LEARNED WORD
================================================ */

function addLearnedWord(word) {

  const data =
    getSHOHINData();

  const normalized =
    String(word)
      .trim()
      .toLowerCase();

  if (
    normalized &&
    !data.learnedWords.includes(
      normalized
    )
  ) {

    data.learnedWords.push(
      normalized
    );

    data.statistics.wordsLearned =
      data.learnedWords.length;

  }

  saveSHOHINData(data);

  return data;

}


/* ================================================
   STREAK
================================================ */

function updateStreak(data) {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const lastDate =
    data.streak.lastDate;


  if (!lastDate) {

    data.streak.current = 1;

  } else if (lastDate !== today) {

    const last =
      new Date(lastDate);

    const current =
      new Date(today);

    const difference =
      Math.floor(
        (
          current - last
        ) /
        (
          1000 * 60 * 60 * 24
        )
      );

    if (difference === 1) {

      data.streak.current++;

    } else {

      data.streak.current = 1;

    }

  }


  if (
    data.streak.current >
    data.streak.best
  ) {

    data.streak.best =
      data.streak.current;

  }


  data.streak.lastDate =
    today;

}


/* ================================================
   DAILY GOAL
================================================ */

function updateDailyGoal(data) {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  if (
    data.dailyGoal.date !== today
  ) {

    data.dailyGoal.date =
      today;

    data.dailyGoal.completed = 0;

  }


  if (
    data.dailyGoal.completed <
    data.dailyGoal.target
  ) {

    data.dailyGoal.completed++;

  }

}


/* ================================================
   ADD STUDY MINUTES
================================================ */

function addStudyMinutes(minutes) {

  const data =
    getSHOHINData();

  const value =
    Number(minutes) || 0;

  data.statistics.totalMinutes +=
    Math.max(0, value);

  saveSHOHINData(data);

  return data;

}


/* ================================================
   ACHIEVEMENTS
================================================ */

function unlockAchievement(id) {

  const data =
    getSHOHINData();

  if (
    !data.achievements.includes(id)
  ) {

    data.achievements.push(id);

  }

  saveSHOHINData(data);

  return data;

}


/* ================================================
   RESET PROGRESS
================================================ */

function resetSHOHINProgress() {

  const confirmed =
    confirm(
      "Reset all SHOHIN ENGLISH progress?"
    );

  if (!confirmed) {
    return false;
  }

  localStorage.removeItem(
    SHOHIN_STORAGE_KEY
  );

  location.reload();

  return true;

}


/* ================================================
   EXPORT PROGRESS
================================================ */

function exportSHOHINProgress() {

  const data =
    getSHOHINData();

  return JSON.stringify(
    data,
    null,
    2
  );

}


/* ================================================
   IMPORT PROGRESS
================================================ */

function importSHOHINProgress(json) {

  try {

    const data =
      JSON.parse(json);

    if (
      typeof data !== "object" ||
      data === null
    ) {

      throw new Error(
        "Invalid progress data"
      );

    }

    saveSHOHINData({
      ...structuredClone(DEFAULT_DATA),
      ...data
    });

    location.reload();

    return true;

  } catch (error) {

    console.error(
      "Import error:",
      error
    );

    alert(
      "Could not import progress."
    );

    return false;

  }

}


/* ================================================
   GLOBAL ACCESS
================================================ */

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