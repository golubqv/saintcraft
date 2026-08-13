"use strict";

/*
=========================================================
 MYCRAFT — EAGLERCRAFT BRIDGE
=========================================================

Этот файл является "мостом" между интерфейсом MyCraft
и браузерным Minecraft-клиентом.

Меню миров:
    MyCraftWorlds

Меню серверов:
    MyCraftServers

Игровой клиент:
    MyCraftEagler

Сейчас мост умеет:

    • запускать клиент
    • открывать выбранный мир
    • подключаться к серверу
    • возвращаться в меню
    • отслеживать состояние игры
    • отправлять события

Когда будет подключён настоящий клиент, здесь можно
будет заменить только внутреннюю реализацию, не
переписывая весь интерфейс MyCraft.
=========================================================
*/


const MyCraftEagler = (() => {


    /*
    =====================================================
    CONFIG
    =====================================================
    */

    const CONFIG = {

        /*
        Контейнер игрового клиента.
        */

        containerId:
            "game_frame",


        /*
        Путь к JS-клиенту.

        Файл появится после подготовки
        легальной сборки Eaglercraft.
        */

        clientScript:
            "./client/classes.js",


        /*
        Путь к ресурсам.
        */

        assets:
            "./client/assets.epk",


        /*
        Таймаут загрузки.
        */

        loadTimeout:
            60000

    };


    /*
    =====================================================
    STATE
    =====================================================
    */

    const state = {

        initialized:
            false,

        loading:
            false,

        loaded:
            false,

        playing:
            false,

        mode:
            null,

        world:
            null,

        server:
            null,

        clientScript:
            null,

        canvas:
            null

    };


    /*
    =====================================================
    EVENTS
    =====================================================
    */

    const events = {};


    /*
    =====================================================
    ON
    =====================================================
    */

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
            !events[event]
        ) {

            events[event] = [];

        }


        events[event].push(
            callback
        );

    }


    /*
    =====================================================
    OFF
    =====================================================
    */

    function off(
        event,
        callback
    ) {

        if (
            !events[event]
        ) {

            return;

        }


        events[event] =
            events[event].filter(
                item =>
                    item !== callback
            );

    }


    /*
    =====================================================
    EMIT
    =====================================================
    */

    function emit(
        event,
        data
    ) {

        const listeners =
            events[event];


        if (
            !listeners
        ) {

            return;

        }


        listeners.forEach(
            callback => {

                try {

                    callback(
                        data
                    );

                }
                catch (error) {

                    console.error(
                        "[MyCraftEagler] " +
                        "Event error:",
                        error
                    );

                }

            }
        );

    }


    /*
    =====================================================
    GET CONTAINER
    =====================================================
    */

    function getContainer() {

        const container =
            document.getElementById(
                CONFIG.containerId
            );


        if (!container) {

            throw new Error(
                "Игровой контейнер #" +
                CONFIG.containerId +
                " не найден."
            );

        }


        return container;

    }


    /*
    =====================================================
    LOADING SCREEN
    =====================================================
    */

    function setLoading(
        visible,
        text
    ) {

        const loading =
            document.getElementById(
                "loading"
            );


        if (!loading) {

            return;

        }


        if (visible) {

            loading.classList.remove(
                "hidden"
            );

        }
        else {

            loading.classList.add(
                "hidden"
            );

        }


        if (text) {

            const textElement =
                loading.querySelector(
                    ".loading-text"
                );


            if (textElement) {

                textElement.textContent =
                    text;

            }

        }

    }


    /*
    =====================================================
    ERROR
    =====================================================
    */

    function showError(
        message
    ) {

        const loading =
            document.getElementById(
                "loading"
            );


        if (!loading) {

            alert(
                message
            );

            return;

        }


        loading.classList.remove(
            "hidden"
        );


        const loader =
            loading.querySelector(
                ".loader"
            );


        if (loader) {

            loader.style.display =
                "none";

        }


        const text =
            loading.querySelector(
                ".loading-text"
            );


        if (text) {

            text.textContent =
                message;

        }


        emit(
            "error",
            {
                message
            }
        );

    }


    /*
    =====================================================
    CREATE OPTIONS
    =====================================================
    */

    function createOptions() {

        /*
        EaglercraftX использует
        window.eaglercraftXOpts.

        Не перезаписываем объект,
        если он уже создан загрузчиком.
        */

        if (
            !window.eaglercraftXOpts
        ) {

            window.eaglercraftXOpts = {};

        }


        const options =
            window.eaglercraftXOpts;


        options.container =
            CONFIG.containerId;


        options.assetsURI =
            CONFIG.assets;


        /*
        База миров.
        */

        options.worldsDB =
            "mycraft_worlds";


        /*
        Namespace localStorage.
        */

        options.localStorageNamespace =
            "_mycraft_eagler";


        return options;

    }


    /*
    =====================================================
    LOAD SCRIPT
    =====================================================
    */

    function loadClientScript() {

        return new Promise(
            (
                resolve,
                reject
            ) => {


                /*
                Уже загружен.
                */

                if (
                    state.loaded
                ) {

                    resolve();

                    return;

                }


                /*
                Уже загружается.
                */

                if (
                    state.loading
                ) {

                    const started =
                        Date.now();


                    const wait =
                        setInterval(
                            () => {

                                if (
                                    state.loaded
                                ) {

                                    clearInterval(
                                        wait
                                    );

                                    resolve();

                                    return;

                                }


                                if (
                                    !state.loading
                                ) {

                                    clearInterval(
                                        wait
                                    );

                                    reject(
                                        new Error(
                                            "Загрузка клиента завершилась ошибкой."
                                        )
                                    );

                                    return;

                                }


                                if (
                                    Date.now() -
                                    started >
                                    CONFIG.loadTimeout
                                ) {

                                    clearInterval(
                                        wait
                                    );

                                    reject(
                                        new Error(
                                            "Истекло время ожидания загрузки клиента."
                                        )
                                    );

                                }

                            },
                            100
                        );

                    return;

                }


                state.loading =
                    true;


                emit(
                    "loading",
                    {
                        progress: 0
                    }
                );


                /*
                Создаём options
                ДО загрузки клиента.
                */

                createOptions();


                /*
                Проверяем,
                существует ли script.
                */

                const existing =
                    document.querySelector(
                        'script[data-mycraft-client="true"]'
                    );


                if (
                    existing
                ) {

                    state.clientScript =
                        existing;

                    state.loaded =
                        true;

                    state.loading =
                        false;


                    emit(
                        "loaded"
                    );


                    resolve();

                    return;

                }


                /*
                Создаём script.
                */

                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    CONFIG.clientScript;


                script.async =
                    false;


                script.dataset.mycraftClient =
                    "true";


                let finished =
                    false;


                const timeout =
                    setTimeout(
                        () => {

                            if (
                                finished
                            ) {

                                return;

                            }


                            finished =
                                true;


                            state.loading =
                                false;


                            reject(
                                new Error(
                                    "Eaglercraft client не загрузился за отведённое время."
                                )
                            );

                        },
                        CONFIG.loadTimeout
                    );


                /*
                УСПЕХ
                */

                script.onload =
                    () => {

                        if (
                            finished
                        ) {

                            return;

                        }


                        finished =
                            true;


                        clearTimeout(
                            timeout
                        );


                        state.clientScript =
                            script;


                        state.loaded =
                            true;


                        state.loading =
                            false;


                        emit(
                            "loading",
                            {
                                progress: 100
                            }
                        );


                        emit(
                            "loaded"
                        );


                        resolve();

                    };


                /*
                ОШИБКА
                */

                script.onerror =
                    () => {

                        if (
                            finished
                        ) {

                            return;

                        }


                        finished =
                            true;


                        clearTimeout(
                            timeout
                        );


                        state.loading =
                            false;


                        reject(
                            new Error(
                                "Не удалось загрузить " +
                                CONFIG.clientScript
                            )
                        );

                    };


                document.head.appendChild(
                    script
                );

            }
        );

    }


    /*
    =====================================================
    START
    =====================================================
    */

    async function start() {

        if (
            state.playing
        ) {

            return;

        }


        try {

            const game =
                document.getElementById(
                    "game"
                );


            const menu =
                document.getElementById(
                    "menu"
                );


            if (
                menu
            ) {

                menu.classList.add(
                    "hidden"
                );

            }


            if (
                game
            ) {

                game.classList.add(
                    "active"
                );

            }


            setLoading(
                true,
                "Подготовка Minecraft-клиента..."
            );


            emit(
                "starting"
            );


            await loadClientScript();


            state.initialized =
                true;


            state.playing =
                true;


            emit(
                "started"
            );


            waitForCanvas();


        }
        catch (error) {

            state.playing =
                false;


            console.error(
                "[MyCraftEagler]",
                error
            );


            showError(
                error.message
            );

        }

    }


    /*
    =====================================================
    WAIT FOR CANVAS
    =====================================================
    */

    function waitForCanvas() {

        const container =
            getContainer();


        let attempts =
            0;


        const maxAttempts =
            200;


        const timer =
            setInterval(
                () => {

                    attempts++;


                    const canvas =
                        container.querySelector(
                            "canvas"
                        );


                    if (
                        canvas
                    ) {

                        clearInterval(
                            timer
                        );


                        state.canvas =
                            canvas;


                        state.playing =
                            true;


                        prepareCanvas(
                            canvas
                        );


                        setLoading(
                            false
                        );


                        emit(
                            "canvas",
                            canvas
                        );


                        emit(
                            "ready"
                        );


                        return;

                    }


                    if (
                        attempts >=
                        maxAttempts
                    ) {

                        clearInterval(
                            timer
                        );


                        /*
                        Не считаем отсутствие
                        canvas мгновенной
                        критической ошибкой.
                        */

                        console.warn(
                            "[MyCraftEagler] " +
                            "Canvas пока не найден."
                        );

                    }

                },
                100
            );

    }


    /*
    =====================================================
    CANVAS
    =====================================================
    */

    function prepareCanvas(
        canvas
    ) {

        canvas.style.width =
            "100%";


        canvas.style.height =
            "100%";


        canvas.style.display =
            "block";


        canvas.addEventListener(
            "contextmenu",
            event => {

                event.preventDefault();

            }
        );

    }


    /*
    =====================================================
    OPEN WORLD
    =====================================================
    */

    async function openWorld(
        world
    ) {

        if (
            !world
        ) {

            throw new Error(
                "Мир не указан."
            );

        }


        state.mode =
            "singleplayer";


        state.world =
            {
                ...world
            };


        state.server =
            null;


        emit(
            "worldSelected",
            {
                world:
                    {
                        ...world
                    }
            }
        );


        /*
        Запускаем клиент.
        */

        await start();


        /*
        Здесь позже будет
        непосредственный вызов
        API клиента для открытия
        конкретного сохранения.
        */


        console.log(
            "[MyCraftEagler] " +
            "World selected:",
            world
        );

    }


    /*
    =====================================================
    CONNECT SERVER
    =====================================================
    */

    async function connectToServer(
        server
    ) {

        if (
            !server
        ) {

            throw new Error(
                "Сервер не указан."
            );

        }


        state.mode =
            "multiplayer";


        state.server =
            {
                ...server
            };


        state.world =
            null;


        emit(
            "serverSelected",
            {
                server:
                    {
                        ...server
                    }
            }
        );


        await start();


        console.log(
            "[MyCraftEagler] " +
            "Server selected:",
            server
        );


        /*
        Позже здесь будет вызов
        функции подключения
        настоящего Eaglercraft-клиента.
        */

    }


    /*
    =====================================================
    RETURN TO MENU
    =====================================================
    */

    function returnToMenu() {

        state.playing =
            false;


        state.mode =
            null;


        state.world =
            null;


        state.server =
            null;


        state.canvas =
            null;


        const game =
            document.getElementById(
                "game"
            );


        const menu =
            document.getElementById(
                "menu"
            );


        if (
            game
        ) {

            game.classList.remove(
                "active"
            );

        }


        if (
            menu
        ) {

            menu.classList.remove(
                "hidden"
            );

        }


        emit(
            "menu"
        );

    }


    /*
    =====================================================
    FULLSCREEN
    =====================================================
    */

    async function fullscreen() {

        const game =
            document.getElementById(
                "game"
            );


        if (!game) {

            return;

        }


        try {

            if (
                !document.fullscreenElement
            ) {

                await game.requestFullscreen();

            }
            else {

                await document.exitFullscreen();

            }

        }
        catch (error) {

            console.warn(
                "[MyCraftEagler]",
                "Fullscreen error:",
                error
            );

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

            world:
                state.world
                    ? {
                        ...state.world
                    }
                    : null,

            server:
                state.server
                    ? {
                        ...state.server
                    }
                    : null

        };

    }


    /*
    =====================================================
    INIT
    =====================================================
    */

    function init() {

        if (
            state.initialized
        ) {

            return;

        }


        console.log(
            "[MyCraftEagler] " +
            "Bridge initialized."
        );


        state.initialized =
            true;


        /*
        Слушаем Escape.

        Если игра открыта,
        Escape не уничтожает состояние,
        а оставляет возможность
        клиенту самому обработать клавишу.
        */

        document.addEventListener(
            "fullscreenchange",
            () => {

                emit(
                    "fullscreen",
                    {
                        active:
                            Boolean(
                                document.fullscreenElement
                            )
                    }
                );

            }
        );

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        init,

        start,

        openWorld,

        connectToServer,

        returnToMenu,

        fullscreen,

        getState,

        on,

        off

    };

})();


/*
=========================================================
 GLOBAL API
=========================================================
*/

window.MyCraftEagler =
    MyCraftEagler;


/*
=========================================================
 INIT
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        MyCraftEagler.init();

    }
);
