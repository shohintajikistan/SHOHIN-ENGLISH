/* =========================================================
   SHOHIN ENGLISH — STORAGE
   Guest progress / local device storage
   SHOHIN BRAND COLORS — НЕ МЕНЯТЬ
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       STORAGE KEY
       ===================================================== */

    const STORAGE_KEY = "shohin_english_guest_v1";


    /* =====================================================
       DEFAULT DATA
       ===================================================== */

    const DEFAULT_DATA = {

        version: 1,

        user: {
            mode: "guest",
            createdAt: null,
            lastActiveAt: null
        },

        learning: {
            currentLevel: "A1",
            currentLesson: 1,

            completedLessons: [],
            completedLevels: [],

            watchedVideos: [],
            learnedWords: [],

            testResults: {},

            levelProgress: {}
        },

        settings: {
            sound: true,
            notifications: false
        }

    };


    /* =====================================================
       INTERNAL HELPERS
       ===================================================== */

    function cloneDefaultData() {

        return JSON.parse(
            JSON.stringify(DEFAULT_DATA)
        );

    }


    function readData() {

        try {

            const raw =
                localStorage.getItem(STORAGE_KEY);

            if (!raw) {

                const fresh =
                    cloneDefaultData();

                fresh.user.createdAt =
                    new Date().toISOString();

                fresh.user.lastActiveAt =
                    new Date().toISOString();

                writeData(fresh);

                return fresh;
            }


            const parsed =
                JSON.parse(raw);


            /*
             * Merge with defaults.
             * This protects the app if we add new
             * storage fields in future versions.
             */

            const merged =
                mergeObjects(
                    cloneDefaultData(),
                    parsed
                );


            merged.user.lastActiveAt =
                new Date().toISOString();


            writeData(merged);


            return merged;

        } catch (error) {

            console.error(
                "SHOHIN STORAGE READ ERROR:",
                error
            );

            return cloneDefaultData();
        }

    }


    function writeData(data) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "SHOHIN STORAGE WRITE ERROR:",
                error
            );

            return false;
        }

    }


    function mergeObjects(base, extra) {

        if (
            typeof base !== "object" ||
            base === null
        ) {
            return extra;
        }


        if (
            typeof extra !== "object" ||
            extra === null
        ) {
            return base;
        }


        const result = {
            ...base
        };


        Object.keys(extra).forEach(function (key) {

            if (
                typeof extra[key] === "object" &&
                extra[key] !== null &&
                !Array.isArray(extra[key]) &&

                typeof result[key] === "object" &&
                result[key] !== null &&
                !Array.isArray(result[key])
            ) {

                result[key] =
                    mergeObjects(
                        result[key],
                        extra[key]
                    );

            } else {

                result[key] =
                    extra[key];

            }

        });


        return result;
    }


    function updateData(callback) {

        const data = readData();

        callback(data);

        data.user.lastActiveAt =
            new Date().toISOString();

        writeData(data);

        return data;
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ShohinStorage = {


        /* ================================================
           GET ALL DATA
           ================================================ */

        get: function () {

            return readData();

        },


        /* ================================================
           RESET
           ================================================ */

        reset: function () {

            const fresh =
                cloneDefaultData();

            fresh.user.createdAt =
                new Date().toISOString();

            fresh.user.lastActiveAt =
                new Date().toISOString();

            writeData(fresh);

            return fresh;

        },


        /* ================================================
           CURRENT LEVEL
           ================================================ */

        getCurrentLevel: function () {

            const data = readData();

            return data.learning.currentLevel;

        },


        setCurrentLevel: function (levelCode) {

            if (!levelCode) {
                return false;
            }

            updateData(function (data) {

                data.learning.currentLevel =
                    String(levelCode).toUpperCase();

            });

            return true;

        },


        /* ================================================
           CURRENT LESSON
           ================================================ */

        getCurrentLesson: function () {

            const data = readData();

            return data.learning.currentLesson;

        },


        setCurrentLesson: function (lessonNumber) {

            const number =
                Number(lessonNumber);

            if (
                !Number.isFinite(number) ||
                number < 1
            ) {
                return false;
            }


            updateData(function (data) {

                data.learning.currentLesson =
                    number;

            });


            return true;

        },


        /* ================================================
           COMPLETED LESSONS
           ================================================ */

        getCompletedLessons: function () {

            const data = readData();

            return [
                ...data.learning.completedLessons
            ];

        },


        isLessonCompleted: function (
            levelCode,
            lessonNumber
        ) {

            const id =
                createLessonId(
                    levelCode,
                    lessonNumber
                );


            const data = readData();


            return data.learning.completedLessons
                .includes(id);

        },


        completeLesson: function (
            levelCode,
            lessonNumber
        ) {

            const id =
                createLessonId(
                    levelCode,
                    lessonNumber
                );


            updateData(function (data) {

                if (
                    !data.learning.completedLessons
                        .includes(id)
                ) {

                    data.learning.completedLessons
                        .push(id);

                }

            });


            return true;

        },


        /* ================================================
           COMPLETED LEVELS
           ================================================ */

        getCompletedLevels: function () {

            const data = readData();

            return [
                ...data.learning.completedLevels
            ];

        },


        isLevelCompleted: function (
            levelCode
        ) {

            const code =
                String(levelCode)
                    .toUpperCase();


            const data = readData();


            return data.learning.completedLevels
                .includes(code);

        },


        completeLevel: function (
            levelCode
        ) {

            const code =
                String(levelCode)
                    .toUpperCase();


            updateData(function (data) {

                if (
                    !data.learning.completedLevels
                        .includes(code)
                ) {

                    data.learning.completedLevels
                        .push(code);

                }

            });


            return true;

        },


        /* ================================================
           VIDEO PROGRESS
           ================================================ */

        getWatchedVideos: function () {

            const data = readData();

            return [
                ...data.learning.watchedVideos
            ];

        },


        isVideoWatched: function (
            levelCode,
            videoId
        ) {

            const id =
                createVideoId(
                    levelCode,
                    videoId
                );


            const data = readData();


            return data.learning.watchedVideos
                .includes(id);

        },


        markVideoWatched: function (
            levelCode,
            videoId
        ) {

            const id =
                createVideoId(
                    levelCode,
                    videoId
                );


            updateData(function (data) {

                if (
                    !data.learning.watchedVideos
                        .includes(id)
                ) {

                    data.learning.watchedVideos
                        .push(id);

                }

            });


            return true;

        },


        /* ================================================
           VOCABULARY
           ================================================ */

        getLearnedWords: function () {

            const data = readData();

            return [
                ...data.learning.learnedWords
            ];

        },


        isWordLearned: function (
            wordId
        ) {

            const id =
                String(wordId);


            const data = readData();


            return data.learning.learnedWords
                .includes(id);

        },


        markWordLearned: function (
            wordId
        ) {

            const id =
                String(wordId);


            updateData(function (data) {

                if (
                    !data.learning.learnedWords
                        .includes(id)
                ) {

                    data.learning.learnedWords
                        .push(id);

                }

            });


            return true;

        },


        /* ================================================
           TEST RESULTS
           ================================================ */

        getTestResult: function (
            levelCode,
            testId
        ) {

            const key =
                createTestId(
                    levelCode,
                    testId
                );


            const data = readData();


            return (
                data.learning.testResults[key] ||
                null
            );

        },


        saveTestResult: function (
            levelCode,
            testId,
            result
        ) {

            const key =
                createTestId(
                    levelCode,
                    testId
                );


            updateData(function (data) {

                data.learning.testResults[key] = {

                    score:
                        Number(result.score) || 0,

                    total:
                        Number(result.total) || 0,

                    percentage:
                        Number(result.percentage) || 0,

                    passed:
                        Boolean(result.passed),

                    completedAt:
                        new Date().toISOString()

                };

            });


            return true;

        },


        /* ================================================
           LEVEL PROGRESS
           ================================================ */

        getLevelProgress: function (
            levelCode
        ) {

            const code =
                String(levelCode)
                    .toUpperCase();


            const data = readData();


            return (
                Number(
                    data.learning.levelProgress[code]
                ) || 0
            );

        },


        setLevelProgress: function (
            levelCode,
            percentage
        ) {

            const code =
                String(levelCode)
                    .toUpperCase();


            let value =
                Number(percentage);


            if (!Number.isFinite(value)) {
                value = 0;
            }


            value =
                Math.max(
                    0,
                    Math.min(
                        100,
                        value
                    )
                );


            updateData(function (data) {

                data.learning.levelProgress[code] =
                    Math.round(value);

            });


            return true;

        },


        /* ================================================
           SETTINGS
           ================================================ */

        getSetting: function (
            key
        ) {

            const data = readData();

            return data.settings[key];

        },


        setSetting: function (
            key,
            value
        ) {

            updateData(function (data) {

                data.settings[key] =
                    value;

            });


            return true;

        },


        /* ================================================
           STATISTICS
           ================================================ */

        getStatistics: function () {

            const data = readData();


            const completedLessons =
                data.learning.completedLessons.length;


            const watchedVideos =
                data.learning.watchedVideos.length;


            const learnedWords =
                data.learning.learnedWords.length;


            const completedLevels =
                data.learning.completedLevels.length;


            const testResults =
                Object.values(
                    data.learning.testResults
                );


            let averageScore = 0;


            if (testResults.length > 0) {

                const total =
                    testResults.reduce(
                        function (
                            sum,
                            item
                        ) {

                            return (
                                sum +
                                Number(
                                    item.percentage
                                )
                            );

                        },
                        0
                    );


                averageScore =
                    Math.round(
                        total /
                        testResults.length
                    );

            }


            return {

                lessons:
                    completedLessons,

                videos:
                    watchedVideos,

                words:
                    learnedWords,

                levels:
                    completedLevels,

                tests:
                    testResults.length,

                averageTestScore:
                    averageScore

            };

        }

    };


    /* =====================================================
       ID HELPERS
       ===================================================== */

    function createLessonId(
        levelCode,
        lessonNumber
    ) {

        return (
            String(levelCode)
                .toUpperCase() +
            "_LESSON_" +
            String(lessonNumber)
        );

    }


    function createVideoId(
        levelCode,
        videoId
    ) {

        return (
            String(levelCode)
                .toUpperCase() +
            "_VIDEO_" +
            String(videoId)
        );

    }


    function createTestId(
        levelCode,
        testId
    ) {

        return (
            String(levelCode)
                .toUpperCase() +
            "_TEST_" +
            String(testId)
        );

    }


    /* =====================================================
       DEBUG SUPPORT
       ===================================================== */

    window.ShohinStorageDebug = {

        show: function () {

            console.log(
                "SHOHIN ENGLISH STORAGE:",
                readData()
            );

        },

        clear: function () {

            localStorage.removeItem(
                STORAGE_KEY
            );

            console.log(
                "SHOHIN ENGLISH storage cleared."
            );

        }

    };


})();