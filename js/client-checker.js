"use strict";

/*
=========================================================
 MYCRAFT — CLIENT CHECKER
=========================================================

Проверяет:

✓ конфигурацию
✓ classes.js
✓ assets.epk
✓ игровой контейнер
✓ доступность клиента

Этот файл НЕ содержит Minecraft/Eaglercraft-код.
=========================================================
*/


const MyCraftClientChecker = (() => {

    /*
    =====================================================
    STATE
    =====================================================
    */

    const state = {

        checking:
            false,

        finished:
            false,

        valid:
            false,

        script:
            false,

        assets:
            false,

        container:
            false,

        errors:
            []

    };


    /*
    =====================================================
    EVENTS
    =====================================================
    */

    const listeners = {};


    function on(
        event,
        callback
    ) {

        if (
            typeof callback !==
            "function"
        ) {

            return;

        }


        if (
            !listeners[event]
        ) {

            listeners[event] = [];

        }


        listeners[event].push(
            callback
        );

    }


    function emit(
        event,
        data
    ) {

        if (
            !listeners[event]
        ) {

            return;

        }


        for (
            const callback of
            listeners[event]
        ) {

            try {

                callback(
                    data
                );

            }
            catch (error) {

                console.error(
                    "[MyCraftClientChecker]",
                    error
                );

            }

        }

    }


    /*
    =====================================================
    GET STATE
    =====================================================
    */

    function getState() {

        return {

            ...state,

            errors:
                [
                    ...state.errors
                ]

        };

    }


    /*
    =====================================================
    RESET
    =====================================================
    */

    function reset() {

        state.checking =
            false;

        state.finished =
            false;

        state.valid =
            false;

        state.script =
            false;

        state.assets =
            false;

        state.container =
            false;

        state.errors =
            [];

    }


    /*
    =====================================================
    REQUEST FILE
    =====================================================
    */

    async function requestFile(
        url
    ) {

        /*
        Сначала HEAD.

        Это позволяет не скачивать
        большой файл целиком.
        */

        try {

            const response =
                await fetch(
                    url,
                    {
                        method:
                            "HEAD",

                        cache:
                            "no-store"
                    }
                );


            if (
                response.ok
            ) {

                return {

                    exists:
                        true,

                    status:
                        response.status,

                    size:
                        response.headers.get(
                            "content-length"
                        ),

                    type:
                        response.headers.get(
                            "content-type"
                        )

                };

            }

        }
        catch {

            /*
            Некоторые серверы
            не поддерживают HEAD.
            */

        }


        /*
        Если HEAD не сработал,
        делаем небольшой GET.

        Для GitHub Pages это обычно
        будет достаточно для проверки
        существования файла.
        */

        try {

            const response =
                await fetch(
                    url,
                    {
                        method:
                            "GET",

                        headers: {

                            "Range":
                                "bytes=0-0"

                        },

                        cache:
                            "no-store"
                    }
                );


            return {

                exists:
                    response.ok,

                status:
                    response.status,

                size:
                    response.headers.get(
                        "content-length"
                    ),

                type:
                    response.headers.get(
                        "content-type"
                    )

            };

        }
        catch (error) {

            return {

                exists:
                    false,

                status:
                    0,

                size:
                    null,

                type:
                    null,

                error:
                    error.message

            };

        }

    }


    /*
    =====================================================
    CHECK CONFIG
    =====================================================
    */

    function checkConfig() {

        if (
            !window.MyCraftClientConfig
        ) {

            state.errors.push(
                "MyCraftClientConfig не найден."
            );


            return false;

        }


        const validation =
            MyCraftClientConfig.validate();


        if (
            !validation.valid
        ) {

            state.errors.push(
                ...validation.errors
            );


            return false;

        }


        return true;

    }


    /*
    =====================================================
    CHECK CONTAINER
    =====================================================
    */

    function checkContainer() {

        let containerId =
            "game_frame";


        if (
            window.MyCraftClientConfig
        ) {

            containerId =
                MyCraftClientConfig
                    .getContainer();

        }


        const container =
            document.getElementById(
                containerId
            );


        if (
            container
        ) {

            state.container =
                true;

            return true;

        }


        /*
        Если контейнера ещё нет,
        создаём его автоматически.
        */

        const game =
            document.getElementById(
                "game"
            );


        if (
            !game
        ) {

            state.errors.push(
                "Элемент #game не найден."
            );


            state.container =
                false;


            return false;

        }


        const newContainer =
            document.createElement(
                "div"
            );


        newContainer.id =
            containerId;


        newContainer.style.position =
            "absolute";


        newContainer.style.inset =
            "0";


        newContainer.style.width =
            "100%";


        newContainer.style.height =
            "100%";


        newContainer.style.overflow =
            "hidden";


        newContainer.style.background =
            "#000";


        game.appendChild(
            newContainer
        );


        state.container =
            true;


        return true;

    }


    /*
    =====================================================
    CHECK CLIENT SCRIPT
    =====================================================
    */

    async function checkScript() {

        let url =
            "./client/classes.js";


        if (
            window.MyCraftClientConfig
        ) {

            url =
                MyCraftClientConfig
                    .getClientScript();

        }


        emit(
            "progress",
            {
                value:
                    25,

                text:
                    "Проверка игрового клиента..."
            }
        );


        const result =
            await requestFile(
                url
            );


        state.script =
            result.exists;


        if (
            !result.exists
        ) {

            state.errors.push(
                "Не найден файл клиента: " +
                url
            );


            return false;

        }


        emit(
            "progress",
            {
                value:
                    50,

                text:
                    "Игровой клиент найден."
            }
        );


        return true;

    }


    /*
    =====================================================
    CHECK ASSETS
    =====================================================
    */

    async function checkAssets() {

        let url =
            "./client/assets.epk";


        if (
            window.MyCraftClientConfig
        ) {

            url =
                MyCraftClientConfig
                    .getAssets();

        }


        emit(
            "progress",
            {
                value:
                    60,

                text:
                    "Проверка игровых ресурсов..."
            }
        );


        const result =
            await requestFile(
                url
            );


        state.assets =
            result.exists;


        if (
            !result.exists
        ) {

            state.errors.push(
                "Не найден файл ресурсов: " +
                url
            );


            return false;

        }


        emit(
            "progress",
            {
                value:
                    80,

                text:
                    "Игровые ресурсы найдены."
            }
        );


        return true;

    }


    /*
    =====================================================
    CHECK
    =====================================================
    */

    async function check() {

        if (
            state.checking
        ) {

            return getState();

        }


        state.checking =
            true;

        state.finished =
            false;

        state.valid =
            false;

        state.errors =
            [];


        emit(
            "start"
        );


        /*
        -------------------------------------------------
        CONFIG
        -------------------------------------------------
        */

        emit(
            "progress",
            {
                value:
                    5,

                text:
                    "Проверка конфигурации..."
            }
        );


        const configOK =
            checkConfig();


        if (!configOK) {

            finish();

            return getState();

        }


        /*
        -------------------------------------------------
        CONTAINER
        -------------------------------------------------
        */

        emit(
            "progress",
            {
                value:
                    15,

                text:
                    "Проверка игрового контейнера..."
            }
        );


        checkContainer();


        /*
        -------------------------------------------------
        SCRIPT
        -------------------------------------------------
        */

        await checkScript();


        /*
        -------------------------------------------------
        ASSETS
        -------------------------------------------------
        */

        await checkAssets();


        /*
        -------------------------------------------------
        RESULT
        -------------------------------------------------
        */

        state.valid =
            state.script &&
            state.assets &&
            state.container &&
            state.errors.length === 0;


        finish();


        return getState();

    }


    /*
    =====================================================
    FINISH
    =====================================================
    */

    function finish() {

        state.checking =
            false;

        state.finished =
            true;


        emit(
            "progress",
            {
                value:
                    100,

                text:
                    state.valid
                        ? "Клиент готов к запуску."
                        : "Проверка завершена с ошибками."
            }
        );


        emit(
            "finish",
            getState()
        );


        if (
            state.valid
        ) {

            emit(
                "valid",
                getState()
            );

        }
        else {

            emit(
                "invalid",
                getState()
            );

        }

    }


    /*
    =====================================================
    FORMAT ERROR
    =====================================================
    */

    function getErrorText() {

        if (
            state.errors.length === 0
        ) {

            return "";

        }


        return state.errors.join(
            "\n"
        );

    }


    /*
    =====================================================
    UI
    =====================================================
    */

    function createUI() {

        if (
            document.getElementById(
                "mycraft-client-checker"
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


        const element =
            document.createElement(
                "div"
            );


        element.id =
            "mycraft-client-checker";


        element.innerHTML = `

            <div
                class="mycraft-checker-card"
            >

                <div
                    class="mycraft-checker-icon"
                    id="mycraft-checker-icon"
                >
                    ◈
                </div>


                <div
                    class="mycraft-checker-title"
                >
                    Проверка MyCraft
                </div>


                <div
                    class="mycraft-checker-status"
                    id="mycraft-checker-status"
                >
                    Подготовка...
                </div>


                <div
                    class="mycraft-checker-progress"
                >

                    <div
                        id="mycraft-checker-progress-bar"
                    ></div>

                </div>


                <div
                    class="mycraft-checker-errors"
                    id="mycraft-checker-errors"
                ></div>


                <button
                    id="mycraft-checker-retry"
                    class="mycraft-checker-button"
                >
                    Проверить снова
                </button>

            </div>

        `;


        game.appendChild(
            element
        );


        /*
        -------------------------------------------------
        STYLES
        -------------------------------------------------
        */

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "mycraft-client-checker-style";


        style.textContent = `

        #mycraft-client-checker {

            position: absolute;

            inset: 0;

            z-index: 100;

            display: none;

            align-items: center;

            justify-content: center;

            background:
                rgba(0,0,0,.55);

            backdrop-filter:
                blur(12px);

            -webkit-backdrop-filter:
                blur(12px);

        }


        #mycraft-client-checker.active {

            display: flex;

        }


        .mycraft-checker-card {

            width:
                min(
                    90vw,
                    430px
                );

            padding:
                28px;

            border-radius:
                20px;

            background:
                rgba(
                    20,
                    20,
                    20,
                    .94
                );

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .08
                );

            box-shadow:
                0 25px 80px
                rgba(
                    0,
                    0,
                    0,
                    .6
                );

            text-align:
                center;

        }


        .mycraft-checker-icon {

            width:
                58px;

            height:
                58px;

            margin:
                0 auto 15px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border-radius:
                16px;

            background:
                rgba(
                    90,
                    190,
                    70,
                    .12
                );

            color:
                #70d05e;

            font-size:
                28px;

        }


        .mycraft-checker-title {

            font-size:
                21px;

            font-weight:
                800;

            color:
                white;

        }


        .mycraft-checker-status {

            margin-top:
                8px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .55
                );

            font-size:
                13px;

            line-height:
                1.5;

            white-space:
                pre-line;

        }


        .mycraft-checker-progress {

            width:
                100%;

            height:
                7px;

            margin-top:
                20px;

            overflow:
                hidden;

            border-radius:
                20px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .08
                );

        }


        #mycraft-checker-progress-bar {

            width:
                0%;

            height:
                100%;

            border-radius:
                inherit;

            background:
                #65c956;

            transition:
                width .25s ease;

        }


        .mycraft-checker-errors {

            margin-top:
                15px;

            color:
                #ff8d8d;

            font-size:
                12px;

            line-height:
                1.6;

            white-space:
                pre-line;

        }


        .mycraft-checker-button {

            width:
                100%;

            min-height:
                44px;

            margin-top:
                20px;

            border:
                0;

            border-radius:
                11px;

            background:
                #55b847;

            color:
                white;

            font-weight:
                700;

            cursor:
                pointer;

        }


        .mycraft-checker-button:hover {

            filter:
                brightness(1.08);

        }

        `;


        document.head.appendChild(
            style
        );


        /*
        -------------------------------------------------
        RETRY
        -------------------------------------------------
        */

        const retry =
            document.getElementById(
                "mycraft-checker-retry"
            );


        if (
            retry
        ) {

            retry.addEventListener(
                "click",
                async () => {

                    reset();

                    updateUI();


                    await check();

                }
            );

        }


        /*
        -------------------------------------------------
        EVENTS
        -------------------------------------------------
        */

        on(
            "progress",
            data => {

                updateUI(
                    data
                );

            }
        );


        on(
            "finish",
            data => {

                updateUI(
                    {
                        value:
                            100,

                        text:
                            data.valid
                                ? "Клиент готов к запуску."
                                : "Обнаружены проблемы."
                    }
                );

            }
        );


        on(
            "invalid",
            data => {

                updateUI(
                    {
                        value:
                            100,

                        text:
                            getErrorText()
                    }
                );

            }
        );

    }


    /*
    =====================================================
    UPDATE UI
    =====================================================
    */

    function updateUI(
        data = null
    ) {

        const status =
            document.getElementById(
                "mycraft-checker-status"
            );


        const bar =
            document.getElementById(
                "mycraft-checker-progress-bar"
            );


        const errors =
            document.getElementById(
                "mycraft-checker-errors"
            );


        const icon =
            document.getElementById(
                "mycraft-checker-icon"
            );


        if (
            data &&
            status
        ) {

            status.textContent =
                data.text || "";

        }


        if (
            data &&
            bar
        ) {

            bar.style.width =
                (
                    data.value || 0
                ) + "%";

        }


        if (
            errors
        ) {

            errors.textContent =
                getErrorText();

        }


        if (
            icon
        ) {

            if (
                state.valid
            ) {

                icon.textContent =
                    "✓";

            }
            else if (
                state.errors.length
            ) {

                icon.textContent =
                    "!";

            }
            else {

                icon.textContent =
                    "◈";

            }

        }

    }


    /*
    =====================================================
    SHOW
    =====================================================
    */

    function show() {

        createUI();


        const element =
            document.getElementById(
                "mycraft-client-checker"
            );


        if (
            element
        ) {

            element.classList.add(
                "active"
            );

        }

    }


    /*
    =====================================================
    HIDE
    =====================================================
    */

    function hide() {

        const element =
            document.getElementById(
                "mycraft-client-checker"
            );


        if (
            element
        ) {

            element.classList.remove(
                "active"
            );

        }

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        check,

        reset,

        show,

        hide,

        createUI,

        getState,

        getErrorText,

        on

    };

})();


/*
=========================================================
GLOBAL
=========================================================
*/

window.MyCraftClientChecker =
    MyCraftClientChecker;


/*
=========================================================
INIT
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        MyCraftClientChecker.createUI();

    }
);
