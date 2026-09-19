/* =========================================================
   SHOHIN ENGLISH — LESSONS
   =========================================================
   Универсальная система уроков.

   ВАЖНО:
   - Не храним весь контент уроков здесь.
   - Сейчас создаём структуру.
   - В будущем данные будут приходить из lessons.json / API.
   - Admin Panel сможет создавать и редактировать уроки.
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       CONFIG
       ===================================================== */

    const LESSONS_VERSION = 1;


    /* =====================================================
       LESSON STATUS
       ===================================================== */

    const LESSON_STATUS = {
        DRAFT: "draft",
        PUBLISHED: "published"
    };


    /* =====================================================
       CREATE EMPTY LESSON
       ===================================================== */

    function createEmptyLesson(levelId, lessonNumber) {

        const level = ShohinLevels.getLevel(levelId);

        if (!level) {
            return null;
        }

        const number = Number(lessonNumber);

        if (
            !Number.isInteger(number) ||
            number < 1 ||
            number > level.lessons
        ) {
            return null;
        }


        return {

            id: ShohinLevels.getLessonId(
                level.id,
                number
            ),

            levelId: level.id,

            lessonNumber: number,

            title: `Lesson ${number}`,

            subtitle: "",

            description: "",

            status: LESSON_STATUS.DRAFT,

            published: false,

            duration: 0,

            cover: "",

            introduction: "",


            /* =============================================
               LESSON SECTIONS
               ============================================= */

            cards: [],

            vocabulary: [],

            exercises: [],

            test: null,


            /* =============================================
               MEDIA
               ============================================= */

            audio: [],

            images: [],

            videos: [],


            /* =============================================
               SETTINGS
               ============================================= */

            settings: {

                allowRepeat: true,

                showVocabulary: true,

                showExercises: true,

                showTest: true

            },


            /* =============================================
               META
               ============================================= */

            meta: {

                version: LESSONS_VERSION,

                createdAt: null,

                updatedAt: null

            }

        };
    }


    /* =====================================================
       CREATE ALL LESSONS FOR A LEVEL
       ===================================================== */

    function createLevelLessons(levelId) {

        const level = ShohinLevels.getLevel(levelId);

        if (!level) {
            return [];
        }

        const lessons = [];

        for (let i = 1; i <= level.lessons; i++) {

            const lesson = createEmptyLesson(
                level.id,
                i
            );

            if (lesson) {
                lessons.push(lesson);
            }
        }

        return lessons;
    }


    /* =====================================================
       CREATE ALL COURSE LESSONS
       ===================================================== */

    function createAllLessons() {

        const levels = ShohinLevels.getLevels();

        const allLessons = [];

        levels.forEach(function (level) {

            const lessons = createLevelLessons(
                level.id
            );

            allLessons.push(...lessons);

        });

        return allLessons;
    }


    /* =====================================================
       DEFAULT LESSON DATA
       ===================================================== */

    const DEFAULT_LESSONS = createAllLessons();


    /* =====================================================
       GET LESSON
       ===================================================== */

    function getLesson(levelId, lessonNumber) {

        const lessonId =
            ShohinLevels.getLessonId(
                levelId,
                lessonNumber
            );

        if (!lessonId) {
            return null;
        }

        const lesson = DEFAULT_LESSONS.find(
            function (item) {
                return item.id === lessonId;
            }
        );

        if (!lesson) {
            return null;
        }

        return clone(lesson);
    }


    /* =====================================================
       GET LESSON BY ID
       ===================================================== */

    function getLessonById(lessonId) {

        if (!lessonId) {
            return null;
        }

        const lesson = DEFAULT_LESSONS.find(
            function (item) {
                return item.id === lessonId;
            }
        );

        return lesson ? clone(lesson) : null;
    }


    /* =====================================================
       GET LEVEL LESSONS
       ===================================================== */

    function getLevelLessons(levelId) {

        const level = ShohinLevels.getLevel(levelId);

        if (!level) {
            return [];
        }

        return DEFAULT_LESSONS
            .filter(function (lesson) {
                return lesson.levelId === level.id;
            })
            .map(function (lesson) {
                return clone(lesson);
            });
    }


    /* =====================================================
       GET PUBLISHED LESSONS
       ===================================================== */

    function getPublishedLessons(levelId) {

        return getLevelLessons(levelId)
            .filter(function (lesson) {
                return lesson.published === true &&
                       lesson.status === LESSON_STATUS.PUBLISHED;
            });
    }


    /* =====================================================
       GET ALL LESSONS
       ===================================================== */

    function getAllLessons() {

        return DEFAULT_LESSONS.map(
            function (lesson) {
                return clone(lesson);
            }
        );
    }


    /* =====================================================
       CHECK LESSON EXISTS
       ===================================================== */

    function lessonExists(levelId, lessonNumber) {

        return Boolean(
            getLesson(levelId, lessonNumber)
        );
    }


    /* =====================================================
       GET NEXT LESSON
       ===================================================== */

    function getNextLesson(levelId, lessonNumber) {

        const level =
            ShohinLevels.getLevel(levelId);

        if (!level) {
            return null;
        }

        const current = Number(lessonNumber);

        if (
            !Number.isInteger(current) ||
            current < 1
        ) {
            return null;
        }


        /* Next lesson in same level */

        if (current < level.lessons) {

            return getLesson(
                level.id,
                current + 1
            );

        }


        /* =============================================
           Last lesson of level
           Move to next level
           ============================================= */

        const nextLevel =
            ShohinLevels.getNextLevel(level.id);

        if (!nextLevel) {
            return null;
        }

        return getLesson(
            nextLevel.id,
            1
        );
    }


    /* =====================================================
       GET PREVIOUS LESSON
       ===================================================== */

    function getPreviousLesson(levelId, lessonNumber) {

        const level =
            ShohinLevels.getLevel(levelId);

        if (!level) {
            return null;
        }

        const current = Number(lessonNumber);


        /* Previous lesson in same level */

        if (current > 1) {

            return getLesson(
                level.id,
                current - 1
            );

        }


        /* =============================================
           First lesson of level
           Move to previous level
           ============================================= */

        const previousLevel =
            ShohinLevels.getPreviousLevel(
                level.id
            );

        if (!previousLevel) {
            return null;
        }

        return getLesson(
            previousLevel.id,
            previousLevel.lessons
        );
    }


    /* =====================================================
       GET LESSON STATUS
       ===================================================== */

    function getLessonStatus(levelId, lessonNumber) {

        const lesson =
            getLesson(
                levelId,
                lessonNumber
            );

        if (!lesson) {
            return "unknown";
        }


        /* ---------------------------------------------
           Check local progress
           --------------------------------------------- */

        if (
            typeof ShohinStorage !== "undefined" &&
            typeof ShohinStorage.isLessonCompleted === "function"
        ) {

            if (
                ShohinStorage.isLessonCompleted(
                    lesson.id
                )
            ) {
                return "completed";
            }

        }


        /* ---------------------------------------------
           First lesson
           --------------------------------------------- */

        if (
            levelId === "A1" &&
            Number(lessonNumber) === 1
        ) {
            return "available";
        }


        /* ---------------------------------------------
           Check previous lesson
           --------------------------------------------- */

        const previous =
            getPreviousLesson(
                levelId,
                lessonNumber
            );

        if (!previous) {
            return "available";
        }


        if (
            typeof ShohinStorage !== "undefined" &&
            typeof ShohinStorage.isLessonCompleted === "function"
        ) {

            if (
                ShohinStorage.isLessonCompleted(
                    previous.id
                )
            ) {
                return "available";
            }

        }


        return "locked";
    }


    /* =====================================================
       CHECK LESSON ACCESS
       ===================================================== */

    function isLessonUnlocked(levelId, lessonNumber) {

        const status =
            getLessonStatus(
                levelId,
                lessonNumber
            );

        return (
            status === "available" ||
            status === "completed"
        );
    }


    /* =====================================================
       GET LESSON INFO
       ===================================================== */

    function getLessonInfo(levelId, lessonNumber) {

        const lesson =
            getLesson(
                levelId,
                lessonNumber
            );

        if (!lesson) {
            return null;
        }

        return {

            ...lesson,

            status:
                getLessonStatus(
                    levelId,
                    lessonNumber
                ),

            unlocked:
                isLessonUnlocked(
                    levelId,
                    lessonNumber
                )

        };
    }


    /* =====================================================
       GET LEVEL LESSON INFO
       ===================================================== */

    function getLevelLessonInfo(levelId) {

        const lessons =
            getLevelLessons(levelId);

        return lessons.map(
            function (lesson) {

                return getLessonInfo(
                    lesson.levelId,
                    lesson.lessonNumber
                );

            }
        );
    }


    /* =====================================================
       COUNT LESSONS
       ===================================================== */

    function getLessonCount(levelId) {

        const level =
            ShohinLevels.getLevel(levelId);

        return level
            ? level.lessons
            : 0;
    }


    /* =====================================================
       COUNT COMPLETED LESSONS
       ===================================================== */

    function getCompletedLessonCount(levelId) {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.getCompletedLessons !== "function"
        ) {
            return 0;
        }

        const completed =
            ShohinStorage.getCompletedLessons();

        return completed.filter(
            function (lessonId) {

                return String(lessonId)
                    .startsWith(
                        `${String(levelId).toUpperCase()}_LESSON_`
                    );

            }
        ).length;
    }


    /* =====================================================
       GET LESSON PROGRESS
       ===================================================== */

    function getLessonProgress(levelId) {

        const total =
            getLessonCount(levelId);

        const completed =
            getCompletedLessonCount(levelId);

        const percent =
            total > 0
                ? Math.round(
                    (completed / total) * 100
                )
                : 0;

        return {

            levelId:
                String(levelId).toUpperCase(),

            completed,

            total,

            percent:
                Math.min(percent, 100)

        };
    }


    /* =====================================================
       CLONE OBJECT
       ===================================================== */

    function clone(object) {

        return JSON.parse(
            JSON.stringify(object)
        );

    }


    /* =====================================================
       EXPORT
       ===================================================== */

    window.ShohinLessons = {

        // Constants
        LESSON_STATUS:
            { ...LESSON_STATUS },

        // Create
        createEmptyLesson:
            createEmptyLesson,

        createLevelLessons:
            createLevelLessons,

        createAllLessons:
            createAllLessons,

        // Get
        getLesson:
            getLesson,

        getLessonById:
            getLessonById,

        getLevelLessons:
            getLevelLessons,

        getPublishedLessons:
            getPublishedLessons,

        getAllLessons:
            getAllLessons,

        // Navigation
        getNextLesson:
            getNextLesson,

        getPreviousLesson:
            getPreviousLesson,

        // Status
        lessonExists:
            lessonExists,

        getLessonStatus:
            getLessonStatus,

        isLessonUnlocked:
            isLessonUnlocked,

        getLessonInfo:
            getLessonInfo,

        getLevelLessonInfo:
            getLevelLessonInfo,

        // Progress
        getLessonCount:
            getLessonCount,

        getCompletedLessonCount:
            getCompletedLessonCount,

        getLessonProgress:
            getLessonProgress

    };


    /* =====================================================
       DEBUG
       ===================================================== */

    console.log(
        "SHOHIN ENGLISH:",
        DEFAULT_LESSONS.length,
        "lesson structures created"
    );

})();