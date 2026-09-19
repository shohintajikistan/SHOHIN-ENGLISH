/* =========================================================
   SHOHIN ENGLISH — LEVELS
   =========================================================
   Система уровней:
   A1 → A2 → B1 → B2 → C1 → C2

   ВАЖНО:
   - Здесь НЕТ содержания уроков.
   - Уроки и видео будут загружаться отдельно.
   - Количество уроков можно менять через Admin Panel в будущем.
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       LEVEL DATA
       ===================================================== */

    const LEVELS = [
        {
            id: "A1",
            code: "A1",
            name: "Beginner",
            title: "A1 Beginner",
            description: "Начальный уровень английского языка.",
            lessons: 20,
            order: 1,
            colorType: "beginner"
        },

        {
            id: "A2",
            code: "A2",
            name: "Elementary",
            title: "A2 Elementary",
            description: "Базовый уровень для повседневного английского.",
            lessons: 25,
            order: 2,
            colorType: "elementary"
        },

        {
            id: "B1",
            code: "B1",
            name: "Intermediate",
            title: "B1 Intermediate",
            description: "Средний уровень английского языка.",
            lessons: 30,
            order: 3,
            colorType: "intermediate"
        },

        {
            id: "B2",
            code: "B2",
            name: "Upper-Intermediate",
            title: "B2 Upper-Intermediate",
            description: "Уверенное владение английским языком.",
            lessons: 30,
            order: 4,
            colorType: "upper-intermediate"
        },

        {
            id: "C1",
            code: "C1",
            name: "Advanced",
            title: "C1 Advanced",
            description: "Продвинутый уровень английского языка.",
            lessons: 35,
            order: 5,
            colorType: "advanced"
        },

        {
            id: "C2",
            code: "C2",
            name: "Proficiency",
            title: "C2 Proficiency",
            description: "Высший уровень владения английским языком.",
            lessons: 40,
            order: 6,
            colorType: "proficiency"
        }
    ];


    /* =====================================================
       TOTAL LESSONS
       ===================================================== */

    const TOTAL_LESSONS = LEVELS.reduce(function (total, level) {
        return total + level.lessons;
    }, 0);


    /* =====================================================
       GET ALL LEVELS
       ===================================================== */

    function getLevels() {
        return LEVELS.map(function (level) {
            return { ...level };
        });
    }


    /* =====================================================
       GET ONE LEVEL
       ===================================================== */

    function getLevel(levelId) {
        if (!levelId) return null;

        const id = String(levelId).toUpperCase();

        const level = LEVELS.find(function (item) {
            return item.id === id;
        });

        return level ? { ...level } : null;
    }


    /* =====================================================
       GET NEXT LEVEL
       ===================================================== */

    function getNextLevel(levelId) {
        const current = getLevel(levelId);

        if (!current) return null;

        const next = LEVELS.find(function (level) {
            return level.order === current.order + 1;
        });

        return next ? { ...next } : null;
    }


    /* =====================================================
       GET PREVIOUS LEVEL
       ===================================================== */

    function getPreviousLevel(levelId) {
        const current = getLevel(levelId);

        if (!current) return null;

        const previous = LEVELS.find(function (level) {
            return level.order === current.order - 1;
        });

        return previous ? { ...previous } : null;
    }


    /* =====================================================
       FIRST LEVEL
       ===================================================== */

    function getFirstLevel() {
        return { ...LEVELS[0] };
    }


    /* =====================================================
       LAST LEVEL
       ===================================================== */

    function getLastLevel() {
        return { ...LEVELS[LEVELS.length - 1] };
    }


    /* =====================================================
       CHECK LEVEL EXISTS
       ===================================================== */

    function levelExists(levelId) {
        return Boolean(getLevel(levelId));
    }


    /* =====================================================
       LESSON IDS
       ===================================================== */

    function getLessonId(levelId, lessonNumber) {
        const level = getLevel(levelId);

        if (!level) return null;

        const number = Number(lessonNumber);

        if (!Number.isInteger(number)) return null;

        if (number < 1 || number > level.lessons) {
            return null;
        }

        return `${level.id}_LESSON_${number}`;
    }


    /* =====================================================
       VIDEO ID
       ===================================================== */

    function getVideoId(levelId, videoId) {
        const level = getLevel(levelId);

        if (!level || !videoId) return null;

        return `${level.id}_VIDEO_${videoId}`;
    }


    /* =====================================================
       TEST ID
       ===================================================== */

    function getTestId(levelId) {
        const level = getLevel(levelId);

        if (!level) return null;

        return `${level.id}_TEST_final`;
    }


    /* =====================================================
       LESSON NUMBERS
       ===================================================== */

    function getLessonNumbers(levelId) {
        const level = getLevel(levelId);

        if (!level) return [];

        return Array.from(
            { length: level.lessons },
            function (_, index) {
                return index + 1;
            }
        );
    }


    /* =====================================================
       PROGRESS
       ===================================================== */

    function getLevelProgress(levelId) {
        const level = getLevel(levelId);

        if (!level) {
            return {
                levelId: null,
                completed: 0,
                total: 0,
                percent: 0,
                completedFully: false
            };
        }

        let completed = 0;

        if (
            typeof ShohinStorage !== "undefined" &&
            typeof ShohinStorage.getCompletedLessons === "function"
        ) {
            const completedLessons =
                ShohinStorage.getCompletedLessons();

            completed = completedLessons.filter(function (lessonId) {
                return String(lessonId).startsWith(
                    `${level.id}_LESSON_`
                );
            }).length;
        }

        const total = level.lessons;

        const percent = total > 0
            ? Math.round((completed / total) * 100)
            : 0;

        return {
            levelId: level.id,
            completed: completed,
            total: total,
            percent: Math.min(percent, 100),
            completedFully: completed >= total
        };
    }


    /* =====================================================
       CHECK LEVEL COMPLETION
       ===================================================== */

    function isLevelCompleted(levelId) {
        const progress = getLevelProgress(levelId);

        return progress.completedFully;
    }


    /* =====================================================
       LEVEL ACCESS
       ===================================================== */

    function isLevelUnlocked(levelId) {
        const level = getLevel(levelId);

        if (!level) return false;

        // A1 всегда открыт
        if (level.order === 1) {
            return true;
        }

        const previous = getPreviousLevel(level.id);

        if (!previous) return false;

        return isLevelCompleted(previous.id);
    }


    /* =====================================================
       LEVEL STATUS
       ===================================================== */

    function getLevelStatus(levelId) {
        const level = getLevel(levelId);

        if (!level) {
            return "unknown";
        }

        if (!isLevelUnlocked(level.id)) {
            return "locked";
        }

        if (isLevelCompleted(level.id)) {
            return "completed";
        }

        const progress = getLevelProgress(level.id);

        if (progress.completed > 0) {
            return "in-progress";
        }

        return "available";
    }


    /* =====================================================
       GET FULL LEVEL INFO
       ===================================================== */

    function getLevelInfo(levelId) {
        const level = getLevel(levelId);

        if (!level) return null;

        const progress = getLevelProgress(level.id);

        return {
            ...level,
            progress: progress,
            unlocked: isLevelUnlocked(level.id),
            status: getLevelStatus(level.id)
        };
    }


    /* =====================================================
       GET ALL LEVEL INFO
       ===================================================== */

    function getAllLevelInfo() {
        return LEVELS.map(function (level) {
            return getLevelInfo(level.id);
        });
    }


    /* =====================================================
       GLOBAL COURSE PROGRESS
       ===================================================== */

    function getCourseProgress() {
        let completed = 0;

        if (
            typeof ShohinStorage !== "undefined" &&
            typeof ShohinStorage.getCompletedLessons === "function"
        ) {
            completed =
                ShohinStorage.getCompletedLessons().length;
        }

        const total = TOTAL_LESSONS;

        const percent = total > 0
            ? Math.round((completed / total) * 100)
            : 0;

        return {
            completed: completed,
            total: total,
            percent: Math.min(percent, 100)
        };
    }


    /* =====================================================
       EXPORT
       ===================================================== */

    window.ShohinLevels = {

        // Data
        LEVELS: getLevels(),
        TOTAL_LESSONS: TOTAL_LESSONS,

        // Levels
        getLevels: getLevels,
        getLevel: getLevel,
        getFirstLevel: getFirstLevel,
        getLastLevel: getLastLevel,
        getNextLevel: getNextLevel,
        getPreviousLevel: getPreviousLevel,
        levelExists: levelExists,

        // IDs
        getLessonId: getLessonId,
        getVideoId: getVideoId,
        getTestId: getTestId,

        // Lessons
        getLessonNumbers: getLessonNumbers,

        // Progress
        getLevelProgress: getLevelProgress,
        getCourseProgress: getCourseProgress,

        // Status
        isLevelCompleted: isLevelCompleted,
        isLevelUnlocked: isLevelUnlocked,
        getLevelStatus: getLevelStatus,

        // Info
        getLevelInfo: getLevelInfo,
        getAllLevelInfo: getAllLevelInfo
    };


    /* =====================================================
       DEBUG
       ===================================================== */

    console.log(
        "SHOHIN ENGLISH:",
        LEVELS.length,
        "levels |",
        TOTAL_LESSONS,
        "lessons"
    );

})();