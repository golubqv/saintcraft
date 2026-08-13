"use strict";

/*
=========================================================
 MYCRAFT — GAME UI
 Интерфейс поверх игрового контейнера.
=========================================================
*/

const MyCraftGameUI = (() => {

    const state = {
        visible: false,
        progress: 0,
        status: "Ожидание...",
        error: null
    };


    /*
    =====================================================
    СОЗДАНИЕ СТИЛЕЙ
    =====================================================
    */

    function createStyles() {

        if (
            document.getElementById(
                "mycraft-game-ui-styles"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "mycraft-game-ui-styles";


        style.textContent = `

        #mycraft-game-overlay {

            position: absolute;

            inset: 0;

            z-index: 50;

            display: flex;

            align-items: center;

            justify-content: center;

            pointer-events: none;

            transition:
                opacity .25s ease;

        }


        #mycraft-game-overlay.hidden {

            opacity: 0;

            pointer-events: none;

        }


        .mycraft-game-loading {

            width: min(
                90vw,
                440px
            );

            padding: 30px;

            border-radius: 20px;

            background:
                rgba(
                    15,
                    15,
                    15,
                    .88
                );

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .1
                );

            box-shadow:
                0 25px 80px
                rgba(
                    0,
                    0,
                    0,
                    .65
                );

            backdrop-filter:
                blur(18px);

            -webkit-backdrop-filter:
                blur(18px);

            text-align: center;

            pointer-events: auto;

        }


        .mycraft-game-logo {

            font-size: 31px;

            font-weight: 900;

            margin-bottom: 8px;

            letter-spacing:
                -1.5px;

        }


        .mycraft-game-logo span {

            color:
                #6dd257;

        }


        .mycraft-game-status {

            min-height: 22px;

            margin-top: 8px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .55
                );

            font-size: 13px;

        }


        .mycraft-progress {

            width: 100%;

            height: 8px;

            margin-top: 22px;

            overflow: hidden;

            border-radius: 20px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .08
                );

        }


        .mycraft-progress-bar {

            width: 0%;

            height: 100%;

            border-radius: inherit;

            background:
                linear-gradient(
                    90deg,
                    #4ca63d,
                    #7be065
                );

            transition:
                width .2s ease;

        }


        .mycraft-progress-value {

            margin-top: 9px;

            font-size: 11px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .35
                );

        }


        .mycraft-game-error {

            display: none;

            margin-top: 18px;

            padding: 12px;

            border-radius: 10px;

            background:
                rgba(
                    255,
                    60,
                    60,
                    .1
                );

            color:
                #ff9a9a;

            font-size: 12px;

            line-height: 1.5;

        }


        .mycraft-game-error.active {

            display: block;

        }


        .mycraft-game-actions {

            display: flex;

            gap: 10px;

            margin-top: 20px;

        }


        .mycraft-game-action {

            flex: 1;

            min-height: 45px;

            border: 0;

            border-radius: 11px;

            color: white;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .08
                );

            cursor: pointer;

            font-weight: 700;

        }


        .mycraft-game-action:hover {

            background:
                rgba(
                    255,
                    255,
                    255,
                    .13
                );

        }


        .mycraft-game-action.green {

            background:
                #55b847;

        }


        #mycraft-game-topbar {

            position: absolute;

            top: 15px;

            left: 15px;

            right: 15px;

            z-index: 40;

            display: flex;

            justify-content:
                space-between;

            pointer-events:
                none;

        }


        .mycraft-game-top-group {

            display: flex;

            gap: 8px;

        }


        .mycraft-game-top-button {

            width: 42px;

            height: 42px;

            border: 0;

            border-radius: 12px;

            background:
                rgba(
                    0,
                    0,
                    0,
                    .45
                );

            color: white;

            cursor: pointer;

            pointer-events: auto;

            backdrop-filter:
                blur(10px);

            -webkit-backdrop-filter:
                blur(10px);

            font-size: 17px;

        }


        .mycraft-game-top-button:hover {

            background:
                rgba(
                    0,
                    0,
                    0,
                    .65
                );

        }


        @media (
            max-width: 600px
        ) {

            .mycraft-game-loading {

                padding: 24px;

            }


            .mycraft-game-logo {

                font-size: 26px;

            }

        }

        `;


        document.head.appendChild(
            style
        );

    }


    /*
    =====================================================
    СОЗДАНИЕ UI
    =====================================================
    */

    function create() {

        if (
            document.getElementById(
                "mycraft-game-overlay"
            )
        ) {
            return;
        }


        const game =
            document.getElementById(
                "game"
            );


        if (!game) {
            return;
        }


        /*
        -------------------------------------------------
        OVERLAY
        -------------------------------------------------
        */

        const overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "mycraft-game-overlay";


        overlay.className =
            "hidden";


        overlay.innerHTML = `

            <div
                class="mycraft-game-loading"
            >

                <div
                    class="mycraft-game-logo"
                >
                    My<span>Craft</span>
                </div>


                <div
                    id="mycraft-game-status"
                    class="mycraft-game-status"
                >
                    Подготовка...
                </div>


                <div
                    class="mycraft-progress"
                >

                    <div
                        id="mycraft-progress-bar"
                        class="mycraft-progress-bar"
                    ></div>

                </div>


                <div
                    id="mycraft-progress-value"
                    class="mycraft-progress-value"
                >
                    0%
                </div>


                <div
                    id="mycraft-game-error"
                    class="mycraft-game-error"
                ></div>


                <div
                    class="mycraft-game-actions"
                >

                    <button
                        id="mycraft-game-cancel"
                        class="mycraft-game-action"
                    >
                        Отмена
                    </button>

                </div>

            </div>

        `;


        game.appendChild(
            overlay
        );


        /*
        -------------------------------------------------
        TOP BAR
        -------------------------------------------------
        */

        const topbar =
            document.createElement(
                "div"
            );


        topbar.id =
            "mycraft-game-topbar";


        topbar.innerHTML = `

            <div
                class="mycraft-game-top-group"
            >

                <button
                    id="mycraft-game-menu"
                    class="mycraft-game-top-button"
                    title="Вернуться в меню"
                >
                    ☰
                </button>

            </div>


            <div
                class="mycraft-game-top-group"
            >

                <button
                    id="mycraft-game-fullscreen"
                    class="mycraft-game-top-button"
                    title="Полный экран"
                >
                    ⛶
                </button>

            </div>

        `;


        game.appendChild(
            topbar
        );


        /*
        -------------------------------------------------
        BUTTONS
        -------------------------------------------------
        */

        const cancel =
            document.getElementById(
                "mycraft-game-cancel"
            );


        if (cancel) {

            cancel.addEventListener(
                "click",
                function () {

                    hide();

                    if (
                        window.MyCraftEagler &&
                        typeof
                            window.MyCraftEagler
                                .returnToMenu ===
                            "function"
                    ) {

                        window.MyCraftEagler
                            .returnToMenu();

                    }

                }
            );

        }


        const menuButton =
            document.getElementById(
                "mycraft-game-menu"
            );


        if (menuButton) {

            menuButton.addEventListener(
                "click",
                function () {

                    const confirmed =
                        confirm(
                            "Вернуться в главное меню?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    if (
                        window.MyCraftEagler &&
                        typeof
                            window.MyCraftEagler
                                .returnToMenu ===
                            "function"
                    ) {

                        window.MyCraftEagler
                            .returnToMenu();

                    }

                }
            );

        }


        const fullscreen =
            document.getElementById(
                "mycraft-game-fullscreen"
            );


        if (fullscreen) {

            fullscreen.addEventListener(
                "click",
                function () {

                    if (
                        window.MyCraftEagler &&
                        typeof
                            window.MyCraftEagler
                                .fullscreen ===
                            "function"
                    ) {

                        window.MyCraftEagler
                            .fullscreen();

                    }

                }
            );

        }

    }


    /*
    =====================================================
    SHOW
    =====================================================
    */

    function show(
        status = "Загрузка...",
        progress = 0
    ) {

        create();


        state.visible =
            true;

        state.status =
            status;

        state.progress =
            progress;

        state.error =
            null;


        const overlay =
            document.getElementById(
                "mycraft-game-overlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "hidden"
            );

        }


        update();

    }


    /*
    =====================================================
    HIDE
    =====================================================
    */

    function hide() {

        const overlay =
            document.getElementById(
                "mycraft-game-overlay"
            );


        if (overlay) {

            overlay.classList.add(
                "hidden"
            );

        }


        state.visible =
            false;

    }


    /*
    =====================================================
    STATUS
    =====================================================
    */

    function setStatus(
        text
    ) {

        state.status =
            text;


        update();

    }


    /*
    =====================================================
    PROGRESS
    =====================================================
    */

    function setProgress(
        value
    ) {

        let progress =
            Number(value);


        if (
            Number.isNaN(progress)
        ) {

            progress =
                0;

        }


        progress =
            Math.max(
                0,
                Math.min(
                    100,
                    progress
                )
            );


        state.progress =
            progress;


        update();

    }


    /*
    =====================================================
    ERROR
    =====================================================
    */

    function setError(
        message
    ) {

        state.error =
            String(message);


        state.status =
            "Ошибка загрузки";


        update();

    }


    /*
    =====================================================
    UPDATE
    =====================================================
    */

    function update() {

        const status =
            document.getElementById(
                "mycraft-game-status"
            );


        const bar =
            document.getElementById(
                "mycraft-progress-bar"
            );


        const value =
            document.getElementById(
                "mycraft-progress-value"
            );


        const error =
            document.getElementById(
                "mycraft-game-error"
            );


        if (status) {

            status.textContent =
                state.status;

        }


        if (bar) {

            bar.style.width =
                state.progress + "%";

        }


        if (value) {

            value.textContent =
                Math.round(
                    state.progress
                ) + "%";

        }


        if (error) {

            if (
                state.error
            ) {

                error.textContent =
                    state.error;

                error.classList.add(
                    "active"
                );

            }
            else {

                error.textContent =
                    "";

                error.classList.remove(
                    "active"
                );

            }

        }

    }


    /*
    =====================================================
    CONNECT TO EAGLER BRIDGE
    =====================================================
    */

    function connect() {

        if (
            !window.MyCraftEagler
        ) {

            console.warn(
                "[MyCraftGameUI] " +
                "MyCraftEagler не найден."
            );

            return;

        }


        /*
        Клиент начал запуск.
        */

        MyCraftEagler.on(
            "starting",
            function () {

                show(
                    "Запуск игрового клиента...",
                    5
                );

            }
        );


        /*
        Загрузка.
        */

        MyCraftEagler.on(
            "loading",
            function (data) {

                if (
                    data &&
                    typeof
                        data.progress ===
                        "number"
                ) {

                    setProgress(
                        data.progress
                    );

                }


                setStatus(
                    "Загрузка Minecraft-клиента..."
                );

            }
        );


        /*
        Клиент загружен.
        */

        MyCraftEagler.on(
            "loaded",
            function () {

                setProgress(
                    75
                );


                setStatus(
                    "Инициализация мира..."
                );

            }
        );


        /*
        Canvas появился.
        */

        MyCraftEagler.on(
            "canvas",
            function () {

                setProgress(
                    100
                );


                setStatus(
                    "Игра готова"
                );


                setTimeout(
                    function () {

                        hide();

                    },
                    300
                );

            }
        );


        /*
        Клиент готов.
        */

        MyCraftEagler.on(
            "ready",
            function () {

                setProgress(
                    100
                );


                setStatus(
                    "Готово"
                );


                setTimeout(
                    hide,
                    250
                );

            }
        );


        /*
        Ошибка.
        */

        MyCraftEagler.on(
            "error",
            function (data) {

                setError(
                    data &&
                    data.message
                        ? data.message
                        : "Неизвестная ошибка."
                );

            }
        );

    }


    /*
    =====================================================
    INIT
    =====================================================
    */

    function init() {

        create();

        connect();

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        init,

        create,

        show,

        hide,

        setStatus,

        setProgress,

        setError,

        getState() {

            return {
                ...state
            };

        }

    };

})();


/*
=========================================================
 GLOBAL
=========================================================
*/

window.MyCraftGameUI =
    MyCraftGameUI;


/*
=========================================================
 INIT
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        MyCraftGameUI.init();

    }
);
