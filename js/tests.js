/* =========================================================
   SHOHIN ENGLISH — LEVEL TESTS
   =========================================================
   Итоговые тесты уровней:

   A1 → Assessment → A2
   A2 → Assessment → B1
   B1 → Assessment → B2
   B2 → Assessment → C1
   C1 → Assessment → C2

   ВАЖНО:
   - Реальные вопросы здесь НЕ хранятся.
   - В будущем тесты будут приходить из Admin Panel/API.
   - Этот файл отвечает за логику теста.
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       CONFIG
       ===================================================== */

    const DEFAULT_PASS_PERCENT = 70;

    const MAX_ATTEMPTS = 0;
    /*
     * 0 = без ограничения количества попыток.
     *
     * В будущем Admin Panel сможет изменить это.
     */


    /* =====================================================
       TEST STATUS
       ===================================================== */

    const TEST_STATUS = {

        NOT_STARTED:
            "not_started",

        IN_PROGRESS:
            "in_progress",

        PASSED:
            "passed",

        FAILED:
            "failed"

    };


    /* =====================================================
       CREATE EMPTY TEST
       ===================================================== */

    function createEmptyTest(levelId) {

        const level =
            getLevel(levelId);


        if (!level) {
            return null;
        }


        return {

            id:
                ShohinLevels.getTestId(
                    level.id
                ),

            levelId:
                level.id,

            title:
                `${level.title} Assessment`,

            description:
                `Final assessment for ${level.title}.`,

            status:
                "draft",

            published:
                false,

            passPercent:
                DEFAULT_PASS_PERCENT,

            maxAttempts:
                MAX_ATTEMPTS,

            questions: [],

            duration:
                0,

            settings: {

                shuffleQuestions:
                    true,

                shuffleOptions:
                    true,

                showCorrectAnswers:
                    true,

                allowRetry:
                    true

            }

        };
    }


    /* =====================================================
       GET LEVEL
       ===================================================== */

    function getLevel(levelId) {

        if (
            typeof ShohinLevels ===
            "undefined"
        ) {
            return null;
        }


        return ShohinLevels.getLevel(
            levelId
        );
    }


    /* =====================================================
       GET TEST
       ===================================================== */

    function getTest(levelId) {

        const level =
            getLevel(levelId);


        if (!level) {
            return null;
        }


        /*
         * Сейчас тест пустой.
         *
         * Позже:
         * API / Database / Admin Panel
         * заменит эти данные.
         */

        return createEmptyTest(
            level.id
        );
    }


    /* =====================================================
       NORMALIZE QUESTION
       ===================================================== */

    function normalizeQuestion(
        question,
        index
    ) {

        if (!question) {
            return null;
        }


        return {

            id:
                question.id ||
                `question-${index + 1}`,

            type:
                question.type ||
                "multiple_choice",

            question:
                question.question || "",

            instruction:
                question.instruction || "",

            options:
                Array.isArray(
                    question.options
                )
                    ? question.options
                    : [],

            answer:
                question.answer ?? null,

            explanation:
                question.explanation || "",

            points:
                Number.isFinite(
                    Number(
                        question.points
                    )
                )
                    ? Number(
                        question.points
                    )
                    : 1

        };
    }


    /* =====================================================
       NORMALIZE QUESTIONS
       ===================================================== */

    function normalizeQuestions(
        questions
    ) {

        if (
            !Array.isArray(
                questions
            )
        ) {
            return [];
        }


        return questions
            .map(
                function (
                    question,
                    index
                ) {

                    return normalizeQuestion(
                        question,
                        index
                    );

                }
            )
            .filter(Boolean);
    }


    /* =====================================================
       CREATE TEST STATE
       ===================================================== */

    function createTestState(
        levelId,
        testData
    ) {

        const test =
            testData ||
            getTest(levelId);


        if (!test) {
            return null;
        }


        let questions =
            normalizeQuestions(
                test.questions
            );


        if (
            test.settings &&
            test.settings.shuffleQuestions
        ) {

            questions =
                shuffle(
                    questions
                );

        }


        return {

            test:
                test,

            levelId:
                test.levelId,

            questions:
                questions,

            answers: {},

            currentIndex:
                0,

            startedAt:
                Date.now(),

            finished:
                false,

            result:
                null

        };
    }


    /* =====================================================
       SET ANSWER
       ===================================================== */

    function setAnswer(
        state,
        questionId,
        answer
    ) {

        if (
            !state ||
            !state.answers
        ) {
            return false;
        }


        const question =
            state.questions.find(
                function (item) {

                    return (
                        item.id ===
                        questionId
                    );

                }
            );


        if (!question) {
            return false;
        }


        state.answers[
            questionId
        ] = answer;


        return true;
    }


    /* =====================================================
       GET ANSWER
       ===================================================== */

    function getAnswer(
        state,
        questionId
    ) {

        if (
            !state ||
            !state.answers
        ) {
            return null;
        }


        return (
            state.answers[
                questionId
            ] ?? null
        );
    }


    /* =====================================================
       GET CURRENT QUESTION
       ===================================================== */

    function getCurrentQuestion(
        state
    ) {

        if (
            !state ||
            !Array.isArray(
                state.questions
            )
        ) {
            return null;
        }


        return (
            state.questions[
                state.currentIndex
            ] || null
        );
    }


    /* =====================================================
       NEXT QUESTION
       ===================================================== */

    function nextQuestion(
        state
    ) {

        if (
            !state ||
            !Array.isArray(
                state.questions
            )
        ) {
            return false;
        }


        if (
            state.currentIndex >=
            state.questions.length - 1
        ) {
            return false;
        }


        state.currentIndex++;

        return true;
    }


    /* =====================================================
       PREVIOUS QUESTION
       ===================================================== */

    function previousQuestion(
        state
    ) {

        if (
            !state ||
            !Array.isArray(
                state.questions
            )
        ) {
            return false;
        }


        if (
            state.currentIndex <= 0
        ) {
            return false;
        }


        state.currentIndex--;

        return true;
    }


    /* =====================================================
       CHECK QUESTION
       ===================================================== */

    function checkQuestion(
        question,
        userAnswer
    ) {

        if (
            typeof ShohinExercises !==
            "undefined" &&
            typeof ShohinExercises.checkAnswer ===
            "function"
        ) {

            return ShohinExercises.checkAnswer(
                question,
                userAnswer
            );

        }


        return {

            result:
                "unanswered",

            correct:
                false,

            points:
                0,

            explanation:
                question.explanation || ""

        };
    }


    /* =====================================================
       CALCULATE RESULT
       ===================================================== */

    function calculateResult(
        state
    ) {

        if (!state) {
            return null;
        }


        let totalPoints = 0;

        let earnedPoints = 0;

        let correct = 0;

        let incorrect = 0;

        let unanswered = 0;


        state.questions.forEach(
            function (question) {

                totalPoints +=
                    Number(
                        question.points || 1
                    );


                const answer =
                    getAnswer(
                        state,
                        question.id
                    );


                const result =
                    checkQuestion(
                        question,
                        answer
                    );


                if (
                    result.correct
                ) {

                    correct++;

                    earnedPoints +=
                        Number(
                            result.points || 0
                        );

                }

                else if (
                    result.result ===
                    "unanswered"
                ) {

                    unanswered++;

                }

                else {

                    incorrect++;

                }

            }
        );


        const percent =
            totalPoints > 0
                ? Math.round(
                    (
                        earnedPoints /
                        totalPoints
                    ) * 100
                )
                : 0;


        const passPercent =
            Number(
                state.test.passPercent ||
                DEFAULT_PASS_PERCENT
            );


        const passed =
            percent >= passPercent;


        return {

            levelId:
                state.levelId,

            totalQuestions:
                state.questions.length,

            correct:
                correct,

            incorrect:
                incorrect,

            unanswered:
                unanswered,

            totalPoints:
                totalPoints,

            earnedPoints:
                earnedPoints,

            percent:
                Math.min(
                    percent,
                    100
                ),

            passPercent:
                passPercent,

            passed:
                passed,

            status:
                passed
                    ? TEST_STATUS.PASSED
                    : TEST_STATUS.FAILED,

            completedAt:
                Date.now()

        };
    }


    /* =====================================================
       FINISH TEST
       ===================================================== */

    function finishTest(
        state
    ) {

        if (!state) {
            return null;
        }


        const result =
            calculateResult(
                state
            );


        state.result =
            result;


        state.finished =
            true;


        /* ---------------------------------------------
           Save result locally
           --------------------------------------------- */

        if (
            typeof ShohinStorage !==
            "undefined" &&
            typeof ShohinStorage.saveTestResult ===
            "function"
        ) {

            ShohinStorage.saveTestResult(
                state.levelId,
                result
            );

        }


        /* ---------------------------------------------
           If passed, complete level
           --------------------------------------------- */

        if (
            result &&
            result.passed
        ) {

            completeLevel(
                state.levelId
            );

        }


        /* ---------------------------------------------
           Event
           --------------------------------------------- */

        document.dispatchEvent(
            new CustomEvent(
                "shohin:test-completed",
                {
                    detail: {
                        result:
                            result
                    }
                }
            )
        );


        return result;
    }


    /* =====================================================
       COMPLETE LEVEL
       ===================================================== */

    function completeLevel(
        levelId
    ) {

        if (
            typeof ShohinStorage ===
            "undefined"
        ) {
            return false;
        }


        if (
            typeof ShohinStorage.completeLevel !==
            "function"
        ) {
            return false;
        }


        return ShohinStorage.completeLevel(
            levelId
        );
    }


    /* =====================================================
       GET LAST TEST RESULT
       ===================================================== */

    function getLastResult(
        levelId
    ) {

        if (
            typeof ShohinStorage ===
            "undefined" ||
            typeof ShohinStorage.getTestResult !==
            "function"
        ) {

            return null;
        }


        return ShohinStorage.getTestResult(
            levelId
        );
    }


    /* =====================================================
       CHECK LEVEL TEST PASSED
       ===================================================== */

    function hasPassed(
        levelId
    ) {

        const result =
            getLastResult(
                levelId
            );


        return Boolean(
            result &&
            result.passed === true
        );
    }


    /* =====================================================
       GET TEST STATUS
       ===================================================== */

    function getTestStatus(
        levelId
    ) {

        const result =
            getLastResult(
                levelId
            );


        if (!result) {

            return TEST_STATUS.NOT_STARTED;

        }


        if (result.passed) {

            return TEST_STATUS.PASSED;

        }


        return TEST_STATUS.FAILED;
    }


    /* =====================================================
       CHECK IF NEXT LEVEL CAN OPEN
       ===================================================== */

    function canUnlockNextLevel(
        levelId
    ) {

        const level =
            getLevel(levelId);


        if (!level) {
            return false;
        }


        /*
         * Final level has no next level.
         */

        const next =
            ShohinLevels.getNextLevel(
                level.id
            );


        if (!next) {
            return false;
        }


        /*
         * Level must have all lessons completed.
         */

        if (
            !ShohinLevels.isLevelCompleted(
                level.id
            )
        ) {

            return false;

        }


        /*
         * Final assessment must be passed.
         */

        return hasPassed(
            level.id
        );
    }


    /* =====================================================
       GET TEST PROGRESS
       ===================================================== */

    function getTestProgress(
        state
    ) {

        if (
            !state ||
            !Array.isArray(
                state.questions
            )
        ) {

            return {

                current:
                    0,

                total:
                    0,

                percent:
                    0

            };

        }


        const total =
            state.questions.length;


        const current =
            total === 0
                ? 0
                : state.currentIndex + 1;


        const percent =
            total > 0
                ? Math.round(
                    (current / total) * 100
                )
                : 0;


        return {

            current:
                current,

            total:
                total,

            percent:
                Math.min(
                    percent,
                    100
                )

        };
    }


    /* =====================================================
       SHUFFLE
       ===================================================== */

    function shuffle(
        array
    ) {

        const result =
            [...array];


        for (
            let i =
                result.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                result[i],
                result[j]
            ] =
            [
                result[j],
                result[i]
            ];

        }


        return result;
    }


    /* =====================================================
       EXPORT
       ===================================================== */

    window.ShohinTests = {

        TEST_STATUS:
            { ...TEST_STATUS },

        DEFAULT_PASS_PERCENT:
            DEFAULT_PASS_PERCENT,

        createEmptyTest:
            createEmptyTest,

        getTest:
            getTest,

        normalizeQuestion:
            normalizeQuestion,

        normalizeQuestions:
            normalizeQuestions,

        createTestState:
            createTestState,

        setAnswer:
            setAnswer,

        getAnswer:
            getAnswer,

        getCurrentQuestion:
            getCurrentQuestion,

        nextQuestion:
            nextQuestion,

        previousQuestion:
            previousQuestion,

        checkQuestion:
            checkQuestion,

        calculateResult:
            calculateResult,

        finishTest:
            finishTest,

        completeLevel:
            completeLevel,

        getLastResult:
            getLastResult,

        hasPassed:
            hasPassed,

        getTestStatus:
            getTestStatus,

        canUnlockNextLevel:
            canUnlockNextLevel,

        getTestProgress:
            getTestProgress

    };


    /* =====================================================
       DEBUG
       ===================================================== */

    console.log(
        "SHOHIN ENGLISH: Level Tests system ready"
    );

})();