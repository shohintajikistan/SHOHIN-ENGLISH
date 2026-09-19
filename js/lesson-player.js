/* =========================================================
   SHOHIN ENGLISH — LESSON PLAYER
   =========================================================
   Универсальный проигрыватель уроков.

   Структура урока:

   1. Introduction
   2. Cards
   3. Exercises
   4. Test
   5. Completion

   Контент не хранится здесь.
   Контент приходит из Lesson Data / API / Admin Panel.
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       STATE
       ===================================================== */

    const state = {
        lesson: null,
        currentStep: 0,
        steps: [],
        startedAt: null,
        completed: false
    };


    /* =====================================================
       STEP TYPES
       ===================================================== */

    const STEP_TYPES = {
        INTRODUCTION: "introduction",
        CARDS: "cards",
        EXERCISES: "exercises",
        TEST: "test",
        COMPLETION: "completion"
    };


    /* =====================================================
       START LESSON
       ===================================================== */

    function start(levelId, lessonNumber) {

        if (
            typeof ShohinLessons === "undefined"
        ) {
            console.error(
                "ShohinLessons is not loaded."
            );

            return false;
        }


        const lesson =
            ShohinLessons.getLesson(
                levelId,
                lessonNumber
            );


        if (!lesson) {

            console.error(
                "Lesson not found:",
                levelId,
                lessonNumber
            );

            return false;
        }


        /* ---------------------------------------------
           Check access
           --------------------------------------------- */

        if (
            !ShohinLessons.isLessonUnlocked(
                levelId,
                lessonNumber
            )
        ) {

            showLockedMessage();

            return false;
        }


        /* ---------------------------------------------
           Reset player
           --------------------------------------------- */

        state.lesson = lesson;

        state.currentStep = 0;

        state.startedAt = Date.now();

        state.completed = false;

        state.steps =
            buildSteps(lesson);


        render();


        return true;
    }


    /* =====================================================
       BUILD STEPS
       ===================================================== */

    function buildSteps(lesson) {

        const steps = [];


        /* ---------------------------------------------
           Introduction
           --------------------------------------------- */

        steps.push({
            type: STEP_TYPES.INTRODUCTION,
            title: "Introduction"
        });


        /* ---------------------------------------------
           Cards
           --------------------------------------------- */

        if (
            lesson.cards &&
            lesson.cards.length > 0
        ) {

            steps.push({
                type: STEP_TYPES.CARDS,
                title: "Learning Cards"
            });

        }


        /* ---------------------------------------------
           Exercises
           --------------------------------------------- */

        if (
            lesson.exercises &&
            lesson.exercises.length > 0
        ) {

            steps.push({
                type: STEP_TYPES.EXERCISES,
                title: "Exercises"
            });

        }


        /* ---------------------------------------------
           Test
           --------------------------------------------- */

        if (
            lesson.test
        ) {

            steps.push({
                type: STEP_TYPES.TEST,
                title: "Test"
            });

        }


        /* ---------------------------------------------
           Completion
           --------------------------------------------- */

        steps.push({
            type: STEP_TYPES.COMPLETION,
            title: "Complete"
        });


        return steps;
    }


    /* =====================================================
       RENDER
       ===================================================== */

    function render() {

        const container =
            document.getElementById(
                "lesson-player-container"
            );


        if (!container) {

            console.warn(
                "lesson-player-container not found."
            );

            return;
        }


        const step =
            state.steps[state.currentStep];


        if (!step) {
            return;
        }


        container.innerHTML = "";


        /* ---------------------------------------------
           Player shell
           --------------------------------------------- */

        const shell =
            document.createElement("div");

        shell.className =
            "lesson-player-shell";


        /* ---------------------------------------------
           Header
           --------------------------------------------- */

        shell.appendChild(
            createHeader()
        );


        /* ---------------------------------------------
           Progress
           --------------------------------------------- */

        shell.appendChild(
            createProgress()
        );


        /* ---------------------------------------------
           Content
           --------------------------------------------- */

        const content =
            document.createElement("div");

        content.className =
            "lesson-player-content";


        renderStep(
            content,
            step
        );


        shell.appendChild(content);


        /* ---------------------------------------------
           Navigation
           --------------------------------------------- */

        shell.appendChild(
            createNavigation()
        );


        container.appendChild(shell);
    }


    /* =====================================================
       HEADER
       ===================================================== */

    function createHeader() {

        const header =
            document.createElement("div");

        header.className =
            "lesson-player-header";


        const left =
            document.createElement("div");

        left.className =
            "lesson-player-header-info";


        const level =
            document.createElement("span");

        level.className =
            "lesson-level-label";

        level.textContent =
            state.lesson.levelId;


        const title =
            document.createElement("h2");

        title.textContent =
            state.lesson.title;


        left.appendChild(level);

        left.appendChild(title);


        const close =
            document.createElement("button");

        close.type = "button";

        close.className =
            "lesson-close-button";

        close.setAttribute(
            "aria-label",
            "Close lesson"
        );

        close.innerHTML = "×";

        close.addEventListener(
            "click",
            function () {

                closeLesson();

            }
        );


        header.appendChild(left);

        header.appendChild(close);


        return header;
    }


    /* =====================================================
       PROGRESS BAR
       ===================================================== */

    function createProgress() {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "lesson-progress-wrapper";


        const label =
            document.createElement("div");

        label.className =
            "lesson-progress-label";


        const current =
            state.currentStep + 1;

        const total =
            state.steps.length;


        label.textContent =
            `Step ${current} of ${total}`;


        const track =
            document.createElement("div");

        track.className =
            "lesson-progress-track";


        const bar =
            document.createElement("div");

        bar.className =
            "lesson-progress-bar";


        const percent =
            total > 0
                ? (current / total) * 100
                : 0;


        bar.style.width =
            `${percent}%`;


        track.appendChild(bar);

        wrapper.appendChild(label);

        wrapper.appendChild(track);


        return wrapper;
    }


    /* =====================================================
       RENDER STEP
       ===================================================== */

    function renderStep(container, step) {

        switch (step.type) {

            case STEP_TYPES.INTRODUCTION:

                renderIntroduction(
                    container
                );

                break;


            case STEP_TYPES.CARDS:

                renderCards(
                    container
                );

                break;


            case STEP_TYPES.EXERCISES:

                renderExercises(
                    container
                );

                break;


            case STEP_TYPES.TEST:

                renderTest(
                    container
                );

                break;


            case STEP_TYPES.COMPLETION:

                renderCompletion(
                    container
                );

                break;


            default:

                renderEmpty(
                    container
                );

        }
    }


    /* =====================================================
       INTRODUCTION
       ===================================================== */

    function renderIntroduction(container) {

        const section =
            document.createElement("section");

        section.className =
            "lesson-introduction";


        const badge =
            document.createElement("div");

        badge.className =
            "lesson-section-badge";

        badge.textContent =
            state.lesson.levelId;


        const title =
            document.createElement("h1");

        title.textContent =
            state.lesson.title ||
            "Lesson";


        section.appendChild(badge);

        section.appendChild(title);


        if (state.lesson.subtitle) {

            const subtitle =
                document.createElement("p");

            subtitle.textContent =
                state.lesson.subtitle;

            section.appendChild(
                subtitle
            );

        }


        if (state.lesson.description) {

            const description =
                document.createElement("p");

            description.className =
                "lesson-description";

            description.textContent =
                state.lesson.description;

            section.appendChild(
                description
            );

        }


        if (state.lesson.introduction) {

            const intro =
                document.createElement("div");

            intro.className =
                "lesson-introduction-text";

            intro.textContent =
                state.lesson.introduction;

            section.appendChild(
                intro
            );

        }


        container.appendChild(section);
    }


    /* =====================================================
       CARDS
       ===================================================== */

    function renderCards(container) {

        const cards =
            state.lesson.cards || [];


        const section =
            document.createElement("section");

        section.className =
            "lesson-cards-section";


        const heading =
            document.createElement("h2");

        heading.textContent =
            "Learning Cards";


        section.appendChild(heading);


        if (cards.length === 0) {

            section.appendChild(
                createEmptyMessage(
                    "Cards will be added soon."
                )
            );

            container.appendChild(section);

            return;
        }


        const grid =
            document.createElement("div");

        grid.className =
            "learning-cards-grid";


        cards.forEach(
            function (card) {

                const element =
                    createLearningCard(
                        card
                    );

                grid.appendChild(
                    element
                );

            }
        );


        section.appendChild(grid);

        container.appendChild(section);
    }


    /* =====================================================
       CREATE LEARNING CARD
       ===================================================== */

    function createLearningCard(card) {

        const element =
            document.createElement("article");

        element.className =
            "learning-card";


        if (card.image) {

            const image =
                document.createElement("img");

            image.src =
                card.image;

            image.alt =
                card.title || "";


            element.appendChild(
                image
            );

        }


        if (card.title) {

            const title =
                document.createElement("h3");

            title.textContent =
                card.title;


            element.appendChild(
                title
            );

        }


        if (card.text) {

            const text =
                document.createElement("p");

            text.textContent =
                card.text;


            element.appendChild(
                text
            );

        }


        if (card.example) {

            const example =
                document.createElement("div");

            example.className =
                "learning-card-example";


            const label =
                document.createElement("span");

            label.textContent =
                "Example";


            const value =
                document.createElement("strong");

            value.textContent =
                card.example;


            example.appendChild(label);

            example.appendChild(value);


            element.appendChild(
                example
            );

        }


        return element;
    }


    /* =====================================================
       EXERCISES
       ===================================================== */

    function renderExercises(container) {

        const exercises =
            state.lesson.exercises || [];


        const section =
            document.createElement("section");

        section.className =
            "lesson-exercises-section";


        const heading =
            document.createElement("h2");

        heading.textContent =
            "Exercises";


        section.appendChild(
            heading
        );


        if (exercises.length === 0) {

            section.appendChild(
                createEmptyMessage(
                    "Exercises will be added soon."
                )
            );

            container.appendChild(
                section
            );

            return;
        }


        exercises.forEach(
            function (exercise, index) {

                section.appendChild(
                    createExercise(
                        exercise,
                        index
                    )
                );

            }
        );


        container.appendChild(
            section
        );
    }


    /* =====================================================
       CREATE EXERCISE
       ===================================================== */

    function createExercise(
        exercise,
        index
    ) {

        const element =
            document.createElement("div");

        element.className =
            "exercise-card";


        const number =
            document.createElement("span");

        number.className =
            "exercise-number";

        number.textContent =
            index + 1;


        const question =
            document.createElement("h3");

        question.textContent =
            exercise.question ||
            "Exercise";


        element.appendChild(
            number
        );

        element.appendChild(
            question
        );


        if (
            exercise.options &&
            Array.isArray(
                exercise.options
            )
        ) {

            const options =
                document.createElement("div");

            options.className =
                "exercise-options";


            exercise.options.forEach(
                function (option) {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "exercise-option";

                    button.textContent =
                        option.text ||
                        option;


                    button.addEventListener(
                        "click",
                        function () {

                            selectExerciseOption(
                                button,
                                exercise,
                                option
                            );

                        }
                    );


                    options.appendChild(
                        button
                    );

                }
            );


            element.appendChild(
                options
            );

        }


        return element;
    }


    /* =====================================================
       SELECT EXERCISE OPTION
       ===================================================== */

    function selectExerciseOption(
        button,
        exercise,
        option
    ) {

        const parent =
            button.parentElement;


        parent
            .querySelectorAll(
                ".exercise-option"
            )
            .forEach(
                function (item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


        button.classList.add(
            "selected"
        );


        /*
         * Correct-answer validation will be
         * handled by exercises.js later.
         */
    }


    /* =====================================================
       TEST
       ===================================================== */

    function renderTest(container) {

        const section =
            document.createElement("section");

        section.className =
            "lesson-test-section";


        const heading =
            document.createElement("h2");

        heading.textContent =
            "Lesson Test";


        section.appendChild(
            heading
        );


        if (!state.lesson.test) {

            section.appendChild(
                createEmptyMessage(
                    "Test will be added soon."
                )
            );

            container.appendChild(
                section
            );

            return;
        }


        const description =
            document.createElement("p");

        description.textContent =
            state.lesson.test.description ||
            "Complete the test to finish this lesson.";


        section.appendChild(
            description
        );


        container.appendChild(
            section
        );
    }


    /* =====================================================
       COMPLETION
       ===================================================== */

    function renderCompletion(container) {

        const section =
            document.createElement("section");

        section.className =
            "lesson-completion";


        const icon =
            document.createElement("div");

        icon.className =
            "completion-icon";

        icon.textContent =
            "✓";


        const title =
            document.createElement("h1");

        title.textContent =
            "Lesson Complete";


        const description =
            document.createElement("p");

        description.textContent =
            "You have completed this lesson.";


        section.appendChild(
            icon
        );

        section.appendChild(
            title
        );

        section.appendChild(
            description
        );


        container.appendChild(
            section
        );
    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

    function createNavigation() {

        const navigation =
            document.createElement("div");

        navigation.className =
            "lesson-player-navigation";


        /* ---------------------------------------------
           Previous
           --------------------------------------------- */

        const previous =
            document.createElement("button");

        previous.type =
            "button";

        previous.className =
            "lesson-nav-button secondary";

        previous.textContent =
            "Previous";


        previous.disabled =
            state.currentStep === 0;


        previous.addEventListener(
            "click",
            function () {

                previousStep();

            }
        );


        /* ---------------------------------------------
           Next
           --------------------------------------------- */

        const next =
            document.createElement("button");

        next.type =
            "button";

        next.className =
            "lesson-nav-button primary";


        if (
            state.currentStep ===
            state.steps.length - 1
        ) {

            next.textContent =
                "Finish";

        } else {

            next.textContent =
                "Continue";

        }


        next.addEventListener(
            "click",
            function () {

                nextStep();

            }
        );


        navigation.appendChild(
            previous
        );

        navigation.appendChild(
            next
        );


        return navigation;
    }


    /* =====================================================
       NEXT STEP
       ===================================================== */

    function nextStep() {

        if (
            state.currentStep >=
            state.steps.length - 1
        ) {

            completeLesson();

            return;
        }


        state.currentStep++;

        render();
    }


    /* =====================================================
       PREVIOUS STEP
       ===================================================== */

    function previousStep() {

        if (
            state.currentStep <= 0
        ) {
            return;
        }


        state.currentStep--;

        render();
    }


    /* =====================================================
       COMPLETE LESSON
       ===================================================== */

    function completeLesson() {

        if (!state.lesson) {
            return;
        }


        state.completed = true;


        if (
            typeof ShohinStorage !== "undefined" &&
            typeof ShohinStorage.completeLesson === "function"
        ) {

            ShohinStorage.completeLesson(
                state.lesson.id
            );

        }


        /*
         * Keep completion screen visible.
         */

        if (
            state.steps[
                state.steps.length - 1
            ].type !==
            STEP_TYPES.COMPLETION
        ) {

            state.steps.push({
                type:
                    STEP_TYPES.COMPLETION,

                title:
                    "Complete"
            });

        }


        state.currentStep =
            state.steps.length - 1;


        render();


        /* ---------------------------------------------
           Event for app.js
           --------------------------------------------- */

        document.dispatchEvent(
            new CustomEvent(
                "shohin:lesson-completed",
                {
                    detail: {
                        lesson:
                            state.lesson
                    }
                }
            )
        );
    }


    /* =====================================================
       CLOSE LESSON
       ===================================================== */

    function closeLesson() {

        document.dispatchEvent(
            new CustomEvent(
                "shohin:lesson-close"
            )
        );
    }


    /* =====================================================
       LOCKED MESSAGE
       ===================================================== */

    function showLockedMessage() {

        document.dispatchEvent(
            new CustomEvent(
                "shohin:lesson-locked"
            )
        );
    }


    /* =====================================================
       EMPTY MESSAGE
       ===================================================== */

    function createEmptyMessage(
        message
    ) {

        const element =
            document.createElement(
                "div"
            );

        element.className =
            "lesson-empty-message";

        element.textContent =
            message;


        return element;
    }


    /* =====================================================
       EMPTY STEP
       ===================================================== */

    function renderEmpty(container) {

        container.appendChild(
            createEmptyMessage(
                "This section is not available yet."
            )
        );
    }


    /* =====================================================
       GET CURRENT STATE
       ===================================================== */

    function getState() {

        return {

            lesson:
                state.lesson,

            currentStep:
                state.currentStep,

            totalSteps:
                state.steps.length,

            completed:
                state.completed

        };
    }


    /* =====================================================
       RESET
       ===================================================== */

    function reset() {

        state.lesson = null;

        state.currentStep = 0;

        state.steps = [];

        state.startedAt = null;

        state.completed = false;
    }


    /* =====================================================
       EXPORT
       ===================================================== */

    window.ShohinLessonPlayer = {

        STEP_TYPES:
            { ...STEP_TYPES },

        start:
            start,

        nextStep:
            nextStep,

        previousStep:
            previousStep,

        completeLesson:
            completeLesson,

        closeLesson:
            closeLesson,

        getState:
            getState,

        reset:
            reset

    };


    /* =====================================================
       DEBUG
       ===================================================== */

    console.log(
        "SHOHIN ENGLISH: Lesson Player ready"
    );

})();