/* =========================================================
   SHOHIN ENGLISH — PROGRESS
   =========================================================
   Общая система прогресса пользователя.

   Отслеживает:
   - уроки
   - уровни
   - видео
   - слова
   - тесты
   - общий прогресс курса

   Сейчас данные сохраняются локально через ShohinStorage.
   В будущем этот слой можно подключить к API/Database.
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       GET COMPLETED LESSONS
       ===================================================== */

    function getCompletedLessons() {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.getCompletedLessons !== "function"
        ) {
            return [];
        }

        return ShohinStorage.getCompletedLessons();
    }


    /* =====================================================
       GET COMPLETED LESSON COUNT
       ===================================================== */

    function getCompletedLessonCount() {

        return getCompletedLessons().length;
    }


    /* =====================================================
       GET TOTAL LESSON COUNT
       ===================================================== */

    function getTotalLessonCount() {

        if (
            typeof ShohinLevels === "undefined"
        ) {
            return 0;
        }

        return ShohinLevels.TOTAL_LESSONS || 0;
    }


    /* =====================================================
       GET LESSON PROGRESS
       ===================================================== */

    function getLessonProgress() {

        const completed =
            getCompletedLessonCount();

        const total =
            getTotalLessonCount();

        const percent =
            total > 0
                ? Math.round(
                    (completed / total) * 100
                )
                : 0;

        return {

            completed: completed,

            total: total,

            remaining:
                Math.max(
                    total - completed,
                    0
                ),

            percent:
                Math.min(
                    percent,
                    100
                )

        };
    }


    /* =====================================================
       GET LEVEL PROGRESS
       ===================================================== */

    function getLevelProgress(
        levelId
    ) {

        if (
            typeof ShohinLevels === "undefined"
        ) {
            return null;
        }

        return ShohinLevels.getLevelProgress(
            levelId
        );
    }


    /* =====================================================
       GET ALL LEVEL PROGRESS
       ===================================================== */

    function getAllLevelProgress() {

        if (
            typeof ShohinLevels === "undefined"
        ) {
            return [];
        }

        return ShohinLevels
            .getLevels()
            .map(function (level) {

                return {

                    ...level,

                    progress:
                        getLevelProgress(
                            level.id
                        ),

                    status:
                        ShohinLevels.getLevelStatus(
                            level.id
                        ),

                    unlocked:
                        ShohinLevels.isLevelUnlocked(
                            level.id
                        )

                };

            });
    }


    /* =====================================================
       COMPLETED LEVELS
       ===================================================== */

    function getCompletedLevels() {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.getCompletedLevels !== "function"
        ) {
            return [];
        }

        return ShohinStorage.getCompletedLevels();
    }


    /* =====================================================
       COMPLETED LEVEL COUNT
       ===================================================== */

    function getCompletedLevelCount() {

        return getCompletedLevels().length;
    }


    /* =====================================================
       VIDEO PROGRESS
       ===================================================== */

    function getWatchedVideos() {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.getWatchedVideos !== "function"
        ) {
            return [];
        }

        return ShohinStorage.getWatchedVideos();
    }


    function getWatchedVideoCount() {

        return getWatchedVideos().length;
    }


    /* =====================================================
       WORD PROGRESS
       ===================================================== */

    function getLearnedWords() {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.getLearnedWords !== "function"
        ) {
            return [];
        }

        return ShohinStorage.getLearnedWords();
    }


    function getLearnedWordCount() {

        return getLearnedWords().length;
    }


    /* =====================================================
       TEST RESULTS
       ===================================================== */

    function getTestResult(
        levelId
    ) {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.getTestResult !== "function"
        ) {
            return null;
        }

        return ShohinStorage.getTestResult(
            levelId
        );
    }


    /* =====================================================
       TEST SUMMARY
       ===================================================== */

    function getTestSummary() {

        const levels =
            typeof ShohinLevels !== "undefined"
                ? ShohinLevels.getLevels()
                : [];

        let passed = 0;

        let attempted = 0;

        const results = [];


        levels.forEach(function (level) {

            const result =
                getTestResult(
                    level.id
                );

            if (result) {

                attempted++;

                if (
                    result.passed === true
                ) {
                    passed++;
                }

                results.push({

                    levelId:
                        level.id,

                    result:
                        result

                });

            }

        });


        return {

            attempted:
                attempted,

            passed:
                passed,

            failed:
                Math.max(
                    attempted - passed,
                    0
                ),

            results:
                results

        };
    }


    /* =====================================================
       CURRENT LEVEL
       ===================================================== */

    function getCurrentLevel() {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.getCurrentLevel !== "function"
        ) {
            return "A1";
        }

        return ShohinStorage.getCurrentLevel();
    }


    /* =====================================================
       CURRENT LESSON
       ===================================================== */

    function getCurrentLesson() {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.getCurrentLesson !== "function"
        ) {
            return 1;
        }

        return ShohinStorage.getCurrentLesson();
    }


    /* =====================================================
       CONTINUE LEARNING
       ===================================================== */

    function getContinueLesson() {

        const levelId =
            getCurrentLevel();

        const lessonNumber =
            getCurrentLesson();


        if (
            typeof ShohinLessons === "undefined"
        ) {
            return {

                levelId:
                    levelId,

                lessonNumber:
                    lessonNumber,

                lesson:
                    null

            };
        }


        let lesson =
            ShohinLessons.getLesson(
                levelId,
                lessonNumber
            );


        /*
         * If current lesson is already completed,
         * find the next available lesson.
         */

        if (
            lesson &&
            typeof ShohinStorage !== "undefined" &&
            typeof ShohinStorage.isLessonCompleted === "function"
        ) {

            if (
                ShohinStorage.isLessonCompleted(
                    lesson.id
                )
            ) {

                const next =
                    ShohinLessons.getNextLesson(
                        levelId,
                        lessonNumber
                    );


                if (next) {

                    lesson =
                        next;

                }

            }

        }


        return {

            levelId:
                lesson
                    ? lesson.levelId
                    : levelId,

            lessonNumber:
                lesson
                    ? lesson.lessonNumber
                    : lessonNumber,

            lesson:
                lesson

        };
    }


    /* =====================================================
       COURSE PERCENT
       ===================================================== */

    function getCoursePercent() {

        const lessonProgress =
            getLessonProgress();


        return lessonProgress.percent;
    }


    /* =====================================================
       TOTAL ACTIVITY
       ===================================================== */

    function getTotalActivity() {

        return {

            lessons:
                getCompletedLessonCount(),

            videos:
                getWatchedVideoCount(),

            words:
                getLearnedWordCount(),

            levels:
                getCompletedLevelCount()

        };
    }


    /* =====================================================
       FULL SUMMARY
       ===================================================== */

    function getSummary() {

        const lessonProgress =
            getLessonProgress();

        const levelProgress =
            getAllLevelProgress();

        const tests =
            getTestSummary();

        const activity =
            getTotalActivity();


        return {

            currentLevel:
                getCurrentLevel(),

            currentLesson:
                getCurrentLesson(),

            coursePercent:
                getCoursePercent(),

            lessons:
                lessonProgress,

            levels:
                levelProgress,

            tests:
                tests,

            activity:
                activity

        };
    }


    /* =====================================================
       GET DASHBOARD DATA
       ===================================================== */

    function getDashboardData() {

        const summary =
            getSummary();

        const continueLesson =
            getContinueLesson();


        return {

            ...summary,

            continueLesson:
                continueLesson

        };
    }


    /* =====================================================
       SAVE CURRENT POSITION
       ===================================================== */

    function saveCurrentPosition(
        levelId,
        lessonNumber
    ) {

        if (
            typeof ShohinStorage === "undefined"
        ) {
            return false;
        }


        let levelSaved = false;

        let lessonSaved = false;


        if (
            typeof ShohinStorage.setCurrentLevel ===
            "function"
        ) {

            levelSaved =
                ShohinStorage.setCurrentLevel(
                    levelId
                );

        }


        if (
            typeof ShohinStorage.setCurrentLesson ===
            "function"
        ) {

            lessonSaved =
                ShohinStorage.setCurrentLesson(
                    lessonNumber
                );

        }


        return (
            levelSaved ||
            lessonSaved
        );
    }


    /* =====================================================
       COMPLETE LESSON
       ===================================================== */

    function completeLesson(
        lessonId
    ) {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.completeLesson !== "function"
        ) {
            return false;
        }


        const result =
            ShohinStorage.completeLesson(
                lessonId
            );


        updatePositionAfterCompletion(
            lessonId
        );


        dispatchProgressEvent(
            "lesson",
            lessonId
        );


        return result;
    }


    /* =====================================================
       UPDATE POSITION
       ===================================================== */

    function updatePositionAfterCompletion(
        lessonId
    ) {

        if (
            !lessonId ||
            typeof ShohinLessons === "undefined"
        ) {
            return;
        }


        const lesson =
            ShohinLessons.getLessonById(
                lessonId
            );


        if (!lesson) {
            return;
        }


        const next =
            ShohinLessons.getNextLesson(
                lesson.levelId,
                lesson.lessonNumber
            );


        if (next) {

            saveCurrentPosition(
                next.levelId,
                next.lessonNumber
            );

        }
    }


    /* =====================================================
       MARK VIDEO WATCHED
       ===================================================== */

    function markVideoWatched(
        levelId,
        videoId
    ) {

        if (
            typeof ShohinStorage === "undefined" ||
            typeof ShohinStorage.markVideoWatched !== "function"
        ) {
            return false;
        }


        const result =
            ShohinStorage.markVideoWatched(
                levelId,
                videoId
            );


        dispatchProgressEvent(
            "video",
            videoId
        );


        return result;
    }