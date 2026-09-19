/* =========================================================
   SHOHIN ENGLISH — EXERCISES
   =========================================================
   Универсальная система упражнений.

   Поддерживаемые типы:
   - multiple_choice
   - true_false
   - text_input
   - matching
   - fill_blank

   В будущем упражнения будут приходить из:
   Admin Panel → Database/API → User App

   Не добавляем реальные упражнения сейчас.
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       EXERCISE TYPES
       ===================================================== */

    const TYPES = {

        MULTIPLE_CHOICE: "multiple_choice",

        TRUE_FALSE: "true_false",

        TEXT_INPUT: "text_input",

        MATCHING: "matching",

        FILL_BLANK: "fill_blank"

    };


    /* =====================================================
       RESULT TYPES
       ===================================================== */

    const RESULTS = {

        CORRECT: "correct",

        INCORRECT: "incorrect",

        UNANSWERED: "unanswered"

    };


    /* =====================================================
       NORMALIZE EXERCISE
       ===================================================== */

    function normalizeExercise(exercise, index) {

        if (!exercise) {
            return null;
        }


        const item = {
            id:
                exercise.id ||
                `exercise-${index + 1}`,

            type:
                exercise.type ||
                TYPES.MULTIPLE_CHOICE,

            question:
                exercise.question || "",

            instruction:
                exercise.instruction || "",

            options:
                Array.isArray(exercise.options)
                    ? exercise.options
                    : [],

            answer:
                exercise.answer ?? null,

            explanation:
                exercise.explanation || "",

            points:
                Number.isFinite(
                    Number(exercise.points)
                )
                    ? Number(exercise.points)
                    : 1,

            required:
                exercise.required !== false

        };


        return item;
    }


    /* =====================================================
       NORMALIZE EXERCISES
       ===================================================== */

    function normalizeExercises(exercises) {

        if (!Array.isArray(exercises)) {
            return [];
        }

        return exercises
            .map(function (exercise, index) {

                return normalizeExercise(
                    exercise,
                    index
                );

            })
            .filter(Boolean);
    }


    /* =====================================================
       CHECK ANSWER
       ===================================================== */

    function checkAnswer(
        exercise,
        userAnswer
    ) {

        const item =
            normalizeExercise(
                exercise,
                0
            );


        if (!item) {

            return {
                result:
                    RESULTS.UNANSWERED,

                correct: false,

                points: 0,

                explanation: ""
            };

        }


        /* ---------------------------------------------
           Empty answer
           --------------------------------------------- */

        if (
            userAnswer === null ||
            userAnswer === undefined ||
            String(userAnswer).trim() === ""
        ) {

            return {
                result:
                    RESULTS.UNANSWERED,

                correct: false,

                points: 0,

                explanation:
                    item.explanation
            };

        }


        let correct = false;


        /* ---------------------------------------------
           Multiple Choice
           --------------------------------------------- */

        if (
            item.type ===
            TYPES.MULTIPLE_CHOICE
        ) {

            correct =
                compareValues(
                    userAnswer,
                    item.answer
                );

        }


        /* ---------------------------------------------
           True / False
           --------------------------------------------- */

        else if (
            item.type ===
            TYPES.TRUE_FALSE
        ) {

            correct =
                compareBoolean(
                    userAnswer,
                    item.answer
                );

        }


        /* ---------------------------------------------
           Text Input
           --------------------------------------------- */

        else if (
            item.type ===
            TYPES.TEXT_INPUT
        ) {

            correct =
                compareText(
                    userAnswer,
                    item.answer
                );

        }


        /* ---------------------------------------------
           Fill Blank
           --------------------------------------------- */

        else if (
            item.type ===
            TYPES.FILL_BLANK
        ) {

            correct =
                compareText(
                    userAnswer,
                    item.answer
                );

        }


        /* ---------------------------------------------
           Matching
           --------------------------------------------- */

        else if (
            item.type ===
            TYPES.MATCHING
        ) {

            correct =
                compareMatching(
                    userAnswer,
                    item.answer
                );

        }


        return {

            result:
                correct
                    ? RESULTS.CORRECT
                    : RESULTS.INCORRECT,

            correct:
                correct,

            points:
                correct
                    ? item.points
                    : 0,

            explanation:
                item.explanation

        };
    }


    /* =====================================================
       COMPARE VALUES
       ===================================================== */

    function compareValues(
        userAnswer,
        correctAnswer
    ) {

        if (
            userAnswer === null ||
            correctAnswer === null
        ) {
            return false;
        }


        return String(userAnswer)
            .trim()
            .toLowerCase() ===
            String(correctAnswer)
                .trim()
                .toLowerCase();
    }


    /* =====================================================
       COMPARE BOOLEAN
       ===================================================== */

    function compareBoolean(
        userAnswer,
        correctAnswer
    ) {

        function toBoolean(value) {

            if (
                value === true ||
                value === false
            ) {
                return value;
            }


            const normalized =
                String(value)
                    .trim()
                    .toLowerCase();


            if (
                normalized === "true" ||
                normalized === "yes" ||
                normalized === "1"
            ) {
                return true;
            }


            if (
                normalized === "false" ||
                normalized === "no" ||
                normalized === "0"
            ) {
                return false;
            }


            return null;
        }


        const user =
            toBoolean(userAnswer);

        const correct =
            toBoolean(correctAnswer);


        return (
            user !== null &&
            correct !== null &&
            user === correct
        );
    }


    /* =====================================================
       COMPARE TEXT
       ===================================================== */

    function compareText(
        userAnswer,
        correctAnswer
    ) {

        const user =
            normalizeText(
                userAnswer
            );


        /*
         * Correct answer can be:
         *
         * "hello"
         *
         * OR
         *
         * ["hello", "hi"]
         */

        if (
            Array.isArray(
                correctAnswer
            )
        ) {

            return correctAnswer.some(
                function (answer) {

                    return (
                        normalizeText(
                            answer
                        ) === user
                    );

                }
            );

        }


        return (
            user ===
            normalizeText(
                correctAnswer
            )
        );
    }


    /* =====================================================
       NORMALIZE TEXT
       ===================================================== */

    function normalizeText(value) {

        return String(
            value ?? ""
        )
            .trim()
            .toLowerCase()
            .replace(
                /\s+/g,
                " "
            );
    }


    /* =====================================================
       MATCHING
       ===================================================== */

    function compareMatching(
        userAnswer,
        correctAnswer
    ) {

        if (
            !userAnswer ||
            !correctAnswer
        ) {
            return false;
        }


        if (
            typeof userAnswer !==
                "object" ||
            typeof correctAnswer !==
                "object"
        ) {
            return false;
        }


        const userKeys =
            Object.keys(
                userAnswer
            );


        const correctKeys =
            Object.keys(
                correctAnswer
            );


        if (
            userKeys.length !==
            correctKeys.length
        ) {
            return false;
        }


        return correctKeys.every(
            function (key) {

                return (
                    String(
                        userAnswer[key]
                    ) ===
                    String(
                        correctAnswer[key]
                    )
                );

            }
        );
    }


    /* =====================================================
       CALCULATE SCORE
       ===================================================== */

    function calculateScore(
        exercises,
        answers
    ) {

        const list =
            normalizeExercises(
                exercises
            );


        const userAnswers =
            answers || {};


        let totalPoints = 0;

        let earnedPoints = 0;

        let correct = 0;

        let incorrect = 0;

        let unanswered = 0;


        list.forEach(
            function (exercise) {

                totalPoints +=
                    exercise.points;


                const answer =
                    userAnswers[
                        exercise.id
                    ];


                const result =
                    checkAnswer(
                        exercise,
                        answer
                    );


                if (
                    result.result ===
                    RESULTS.CORRECT
                ) {

                    correct++;

                    earnedPoints +=
                        result.points;

                }


                else if (
                    result.result ===
                    RESULTS.INCORRECT
                ) {

                    incorrect++;

                }


                else {

                    unanswered++;

                }

            }
        );


        const total =
            list.length;


        const percent =
            totalPoints > 0
                ? Math.round(
                    (earnedPoints /
                        totalPoints) *
                    100
                )
                : 0;


        return {

            total:

                total,

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
                )

        };
    }


    /* =====================================================
       CHECK PASS
       ===================================================== */

    function isPassingScore(
        score,
        minimumPercent
    ) {

        const minimum =
            Number.isFinite(
                Number(
                    minimumPercent
                )
            )
                ? Number(
                    minimumPercent
                )
                : 70;


        return (
            Number(
                score?.percent || 0
            ) >= minimum
        );
    }


    /* =====================================================
       CREATE EXERCISE STATE
       ===================================================== */

    function createExerciseState(
        exercises
    ) {

        const list =
            normalizeExercises(
                exercises
            );


        const answers = {};

        list.forEach(
            function (exercise) {

                answers[
                    exercise.id
                ] = null;

            }
        );


        return {

            exercises:
                list,

            answers:
                answers,

            currentIndex:
                0,

            finished:
                false,

            score:
                null

        };
    }


    /* =====================================================
       SET ANSWER
       ===================================================== */

    function setAnswer(
        state,
        exerciseId,
        answer
    ) {

        if (
            !state ||
            !state.answers
        ) {
            return false;
        }


        if (
            !Object.prototype.hasOwnProperty
                .call(
                    state.answers,
                    exerciseId
                )
        ) {
            return false;
        }


        state.answers[
            exerciseId
        ] = answer;


        return true;
    }


    /* =====================================================
       GET ANSWER
       ===================================================== */

    function getAnswer(
        state,
        exerciseId
    ) {

        if (
            !state ||
            !state.answers
        ) {
            return null;
        }


        return (
            state.answers[
                exerciseId
            ] ?? null
        );
    }


    /* =====================================================
       FINISH EXERCISES
       ===================================================== */

    function finishExercises(
        state
    ) {

        if (!state) {
            return null;
        }


        const score =
            calculateScore(
                state.exercises,
                state.answers
            );


        state.score =
            score;


        state.finished =
            true;


        return score;
    }


    /* =====================================================
       GET CURRENT EXERCISE
       ===================================================== */

    function getCurrentExercise(
        state
    ) {

        if (
            !state ||
            !Array.isArray(
                state.exercises
            )
        ) {
            return null;
        }


        return (
            state.exercises[
                state.currentIndex
            ] || null
        );
    }


    /* =====================================================
       NEXT EXERCISE
       ===================================================== */

    function nextExercise(
        state
    ) {

        if (
            !state ||
            !Array.isArray(
                state.exercises
            )
        ) {
            return false;
        }


        if (
            state.currentIndex >=
            state.exercises.length - 1
        ) {

            return false;

        }


        state.currentIndex++;

        return true;
    }


    /* =====================================================
       PREVIOUS EXERCISE
       ===================================================== */

    function previousExercise(
        state
    ) {

        if (
            !state ||
            !Array.isArray(
                state.exercises
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
       PROGRESS
       ===================================================== */

    function getExerciseProgress(
        state
    ) {

        if (
            !state ||
            !Array.isArray(
                state.exercises
            )
        ) {

            return {

                current: 0,

                total: 0,

                percent: 0

            };

        }


        const total =
            state.exercises.length;


        const current =
            total === 0
                ? 0
                : state.currentIndex + 1;


        const percent =
            total > 0
                ? Math.round(
                    (current / total) *
                    100
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
       SHUFFLE OPTIONS
       ===================================================== */

    function shuffleOptions(
        options
    ) {

        if (
            !Array.isArray(
                options
            )
        ) {
            return [];
        }


        const result =
            [...options];


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

    window.ShohinExercises = {

        TYPES:
            { ...TYPES },

        RESULTS:
            { ...RESULTS },

        normalizeExercise:
            normalizeExercise,

        normalizeExercises:
            normalizeExercises,

        checkAnswer:
            checkAnswer,

        calculateScore:
            calculateScore,

        isPassingScore:
            isPassingScore,

        createExerciseState:
            createExerciseState,

        setAnswer:
            setAnswer,

        getAnswer:
            getAnswer,

        finishExercises:
            finishExercises,

        getCurrentExercise:
            getCurrentExercise,

        nextExercise:
            nextExercise,

        previousExercise:
            previousExercise