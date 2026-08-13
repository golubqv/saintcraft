"use strict";

/*
=========================================================
 MYCRAFT — EAGLERCRAFT RUNTIME BRIDGE
=========================================================

Связь:

Главное меню
    ↓
World Menu / Server Menu
    ↓
MyCraftEagler
    ↓
MyCraftEaglerLoader
    ↓
Легально полученный Eaglercraft-клиент
    ↓
Canvas / Minecraft
=========================================================
*/


const MyCraftEagler = (() => {


    /*
    =====================================================
    CONFIG
    =====================================================
    */

    const CONFIG = {

        gameId:
            "mycraft-game",

        containerId:
            "game_frame",

        gameElementId:
            "game",

        menuElementId:
            "menu"

    };


    /*
    =====================================================
    STATE
    =====================================================
    */

    const state = {

        initialized:
            false,

        running:
            false,

        loading:
            false,

        ready:
            false,

        mode:
            null,

        world:
            null,

        server:
            null,

        canvas:
            null,

        error:
            null

    };


    /*
    =====================================================
    EVENTS
    =====================================================
    */

    const events = {};


    function on(
        name,
        callback
    ) {

        if (
            typeof callback !==
            "function"
        ) {

            return;

        }


        if (
            !events[name]
        ) {

            events[name] = [];

        }


        events[name].push(
            callback
        );

    }


    function off(
        name,
        callback
    ) {

        if (
            !events[name]
        ) {

            return;

        }


        events[name] =
            events[name].filter(
                item =>
                    item !== callback
            );

    }


    function emit(
        name,
        data
    ) {

        if (
            !events[name]
        ) {

            return;

        }


        events[name].forEach(
            callback => {

                try {

                    callback(
                        data
                    );

                }
                catch (error) {

                    console.error(
                        "[MyCraftEagler]",
                        error
                    );

                }

            }
        );

    }


    /*
    =====================================================
    ELEMENTS
    =====================================================
    */

    function getGame() {

        return document.getElementById(
            CONFIG.gameElementId
        );

    }


    function getMenu() {

        return document.getElementById(
            CONFIG.menuElementId
        );

    }


    function getContainer() {

        return document.getElementById(
            CONFIG.containerId
        );

    }


    /*
    =====================================================
    CREATE GAME CONTAINER
    =====================================================
    */

    function ensureContainer() {

        const game =
            getGame();


        if (!game) {

            throw new Error(
                "Элемент #game не найден."
            );

        }


        let container =
            getContainer();


        if (
            container
        ) {

            return container;

        }


        container =
            document.createElement(
                "div"
            );


        container.id =
            CONFIG.containerId;


        container.style.position =
            "absolute";


        container.style.inset =
            "0";


        container.style.width =
            "100%";


        container.style.height =
            "100%";


        container.style.overflow =
            "hidden";


        container.style.background =
            "#000";


        game.appendChild(
            container
        );


        return container;

    }


    /*
    =====================================================
    SHOW GAME
    =====================================================
    */

    function showGame() {

        const game =
            getGame();


        const menu =
            getMenu();


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

    }


    /*
    =====================================================
    HIDE GAME
    =====================================================
    */

    function hideGame() {

        const game =
            getGame();


        if (
            game
        ) {

            game.classList.remove(
                "active"
            );

        }


        const menu =
            getMenu();


        if (
            menu
        ) {

            menu.classList.remove(
                "hidden"
            );

        }

    }


    /*
    =====================================================
    LOADING UI
    =====================================================
    */

    function showLoading(
        text,
        progress
    ) {

        if (
            window.MyCraftGameUI
        ) {

            MyCraftGameUI.show(
                text,
                progress
            );

        }

    }


    function setLoading(
        text,
        progress
    ) {

        if (
            window.MyCraftGameUI
        ) {

            MyCraftGameUI.setStatus(
                text
            );


            MyCraftGameUI.setProgress(
                progress
            );

        }

    }


    function hideLoading() {

        if (
            window.MyCraftGameUI
        ) {

            MyCraftGameUI.hide();

        }

    }


    function showError(
        message
    ) {

        state.error =
            message;


        if (
            window.MyCraftGameUI
        ) {

            MyCraftGameUI.setError(
                message
            );

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
    LOADER
    =====================================================
    */

    function getLoader() {

        if (
            window.MyCraftEaglerLoader
        ) {

            return (
                window.MyCraftEaglerLoader
            );

        }


        return null;

    }


    /*
    =====================================================
    CONNECT LOADER
    =====================================================
    */

    function connectLoader() {

        const loader =
            getLoader();


        if (!loader) {

            console.warn(
                "[MyCraftEagler] " +
                "Loader не найден."
            );

            return;

        }


        loader.on(
            "state",
            data => {

                if (!data) {

                    return;

                }


                state.loading =
                    data.status ===
                    "loading";


                if (
                    data.status ===
                    "checking"
                ) {

                    setLoading(
                        "Проверка клиента...",
                        data.progress
                    );

                }


                if (
                    data.status ===
                    "found"
                ) {

                    setLoading(
                        "Клиент найден...",
                        data.progress
                    );

                }


                if (
                    data.status ===
                    "loading"
                ) {

                    setLoading(
                        "Загрузка Minecraft-клиента...",
                        data.progress
                    );

                }


                if (
                    data.status ===
                    "loaded"
                ) {

                    setLoading(
                        "Клиент загружен...",
                        100
                    );

                }


                if (
                    data.status ===
                    "error"
                ) {

                    showError(
                        data.error ||
                        "Ошибка загрузки клиента."
                    );

                }

            }
        );


        loader.on(
            "loaded",
            () => {

                state.loading =
                    false;

                state.ready =
                    true;


                emit(
                    "clientLoaded"
                );

            }
        );


        loader.on(
            "error",
            error => {

                state.loading =
                    false;

                state.ready =
                    false;


                showError(
                    error &&
                    error.message
                        ? error.message
                        : "Неизвестная ошибка."
                );

            }
        );

    }


    /*
    =====================================================
    FIND CANVAS
    =====================================================
    */

    function findCanvas() {

        const container =
            getContainer();


        if (!container) {

            return null;

        }


        const canvas =
            container.querySelector(
                "canvas"
            );


        if (
            canvas
        ) {

            state.canvas =
                canvas;


            prepareCanvas(
                canvas
            );


            return canvas;

        }


        return null;

    }


    /*
    =====================================================
    WAIT CANVAS
    =====================================================
    */

    function waitForCanvas() {

        return new Promise(
            resolve => {

                let attempts =
                    0;


                const maxAttempts =
                    300;


                const timer =
                    setInterval(
                        () => {

                            attempts++;


                            const canvas =
                                findCanvas();


                            if (
                                canvas
                            ) {

                                clearInterval(
                                    timer
                                );


                                state.running =
                                    true;


                                state.ready =
                                    true;


                                emit(
                                    "ready",
                                    {
                                        canvas
                                    }
                                );


                                resolve(
                                    canvas
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


                                resolve(
                                    null
                                );

                            }

                        },
                        100
                    );

            }
        );

    }


    /*
    =====================================================
    PREPARE CANVAS
    =====================================================
    */

    function prepareCanvas(
        canvas
    ) {

        canvas.style.display =
            "block";


        canvas.style.width =
            "100%";


        canvas.style.height =
            "100%";


        canvas.style.touchAction =
            "none";


        /*
        Minecraft сам обрабатывает
        игровой ввод.

        Мы только запрещаем
        стандартное context menu.
        */

        canvas.addEventListener(
            "contextmenu",
            event => {

                event.preventDefault();

            }
        );


        /*
        На мобильных устройствах
        браузер не должен прокручивать
        страницу во время игры.
        */

        canvas.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

            },
            {
                passive:
                    false
            }
        );


        canvas.addEventListener(
            "touchmove",
            event => {

                event.preventDefault();

            },
            {
                passive:
                    false
            }
        );

    }


    /*
    =====================================================
    START CLIENT
    =====================================================
    */

    async function start() {

        if (
            state.running
        ) {

            return true;

        }


        ensureContainer();

        showGame();


        showLoading(
            "Запуск клиента...",
            0
        );


        state.error =
            null;


        state.loading =
            true;


        emit(
            "starting"
        );


        const loader =
            getLoader();


        if (!loader) {

            const error =
                "MyCraftEaglerLoader не подключён.";


            showError(
                error
            );


            state.loading =
                false;


            return false;

        }


        /*
        Загружаем клиент.
        */

        const result =
            await loader.load();


        if (
            !result ||
            result.success !== true
        ) {

            state.loading =
                false;


            showError(
                result &&
                result.error
                    ? result.error
                    : "Не удалось загрузить игровой клиент."
            );


            return false;

        }


        state.loading =
            false;


        state.ready =
            true;


        emit(
            "loaded"
        );


        /*
        Даём клиенту время
        создать canvas.
        */

        const canvas =
            await waitForCanvas();


        if (!canvas) {

            /*
            Не обязательно ошибка:
            конкретная сборка клиента
            может использовать другой
            способ создания игрового окна.
            */

            console.warn(
                "[MyCraftEagler] " +
                "Canvas не найден."
            );


            hideLoading();

        }
        else {

            setLoading(
                "Игра готова",
                100
            );


            setTimeout(
                () => {

                    hideLoading();

                },
                300
            );

        }


        emit(
            "started"
        );


        return true;

    }


    /*
    =====================================================
    OPEN WORLD
    =====================================================
    */

    async function openWorld(
        world
    ) {

        if (!world) {

            showError(
                "Мир не выбран."
            );

            return false;

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
        Сначала запускаем клиент.
        */

        const started =
            await start();


        if (!started) {

            return false;

        }


        /*
        =================================================
        ВАЖНО
        =================================================

        На этом месте нельзя выдумывать API
        Eaglercraft, которого может не быть
        в конкретной сборке.

        Когда будет известен API конкретного
        клиента, сюда добавляется его вызов
        открытия singleplayer мира.

        Пока передаём информацию через
        глобальное событие.
        =================================================
        */

        window.dispatchEvent(
            new CustomEvent(
                "mycraft:world",
                {
                    detail:
                        {
                            ...world
                        }
                }
            )
        );


        console.log(
            "[MyCraftEagler] " +
            "Selected world:",
            world
        );


        return true;

    }


    /*
    =====================================================
    CONNECT SERVER
    =====================================================
    */

    async function connectToServer(
        server
    ) {

        if (!server) {

            showError(
                "Сервер не выбран."
            );

            return false;

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


        const started =
            await start();


        if (!started) {

            return false;

        }


        /*
        Передаём данные серверу
        через событие.

        Конкретный клиент сможет
        обработать их своим API.
        */

        window.dispatchEvent(
            new CustomEvent(
                "mycraft:server",
                {
                    detail:
                        {
                            ...server
                        }
                }
            )
        );


        console.log(
            "[MyCraftEagler] " +
            "Selected server:",
            server
        );


        return true;

    }


    /*
    =====================================================
    FULLSCREEN
    =====================================================
    */

    async function fullscreen() {

        const game =
            getGame();


        if (!game) {

            return;

        }


        try {

            if (
                document.fullscreenElement
            ) {

                await document.exitFullscreen();

                return;

            }


            await game.requestFullscreen();

        }
        catch (error) {

            console.warn(
                "[MyCraftEagler] " +
                "Fullscreen:",
                error
            );

        }

    }


    /*
    =====================================================
    RETURN MENU
    =====================================================
    */

    function returnToMenu() {

        state.running =
            false;


        state.loading =
            false;


        state.ready =
            false;


        state.mode =
            null;


        state.world =
            null;


        state.server =
            null;


        state.canvas =
            null;


        hideLoading();


        hideGame();


        emit(
            "menu"
        );

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


        state.initialized =
            true;


        ensureContainer();


        connectLoader();


        console.log(
            "[MyCraftEagler] " +
            "Runtime bridge initialized."
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
 GLOBAL
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
    function () {

        MyCraftEagler.init();

    }
);
