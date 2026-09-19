/*
========================================
SHOHIN ENGLISH — LESSON DATA CONTRACT
========================================

Этот файл НЕ содержит уроки и карточки.

Он определяет структуру урока,
которую в будущем будет заполнять Admin Panel.

SHOHIN BRAND COLORS — НЕ МЕНЯТЬ
========================================
*/

const SHOHIN_EMPTY_LESSON = {
  id: null,

  level: null,

  lessonNumber: null,

  title: "",

  description: "",

  coverImage: "",

  cards: [],

  exercises: [],

  test: {
    passingScore: 70,
    questions: []
  },

  published: false,

  order: 0,

  createdAt: null,

  updatedAt: null
};


/*
========================================
CREATE EMPTY LESSON
========================================
*/

function createEmptySHOHINLesson(level, lessonNumber) {

  return {
    ...SHOHIN_EMPTY_LESSON,

    id: `${String(level).toLowerCase()}-lesson-${String(lessonNumber).padStart(3, "0")}`,

    level: level,

    lessonNumber: lessonNumber,

    order: lessonNumber
  };
}


/*
========================================
GET LESSON CONTENT
========================================

Пока контента нет.

Позже здесь будет получение данных
из Firebase / Supabase / другого backend.

Сейчас приложение получает пустой
каркас урока.
========================================
*/

function getSHOHINLessonContent(level, lessonNumber) {

  return createEmptySHOHINLesson(level, lessonNumber);
}


/*
========================================
CHECK LESSON CONTENT
========================================
*/

function hasSHOHINLessonContent(lesson) {

  if (!lesson) {
    return false;
  }

  return (
    lesson.title ||
    lesson.description ||
    lesson.cards.length > 0 ||
    lesson.exercises.length > 0 ||
    lesson.test.questions.length > 0
  );
}


/*
========================================
GLOBAL API
========================================
*/

window.SHOHINLessonData = {

  empty: SHOHIN_EMPTY_LESSON,

  create: createEmptySHOHINLesson,

  get: getSHOHINLessonContent,

  hasContent: hasSHOHINLessonContent

};