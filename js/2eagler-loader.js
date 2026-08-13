"use strict";

/*
=========================================================
 MYCRAFT — EAGLERCRAFT LOADER
=========================================================

Назначение:

1. Проверяет наличие игрового клиента.
2. Загружает его JavaScript.
3. Показывает прогресс.
4. Не запускает клиент повторно.
5. Передаёт управление MyCraftEagler.
6. Даёт возможность получить состояние загрузки.

ВАЖНО:

Этот загрузчик НЕ содержит Minecraft/Eaglercraft код.
Он только загружает локальную сборку клиента.

Путь клиента:

    /client/classes.js

Ресурсы:

    /client/assets.epk

Используй только сборку и ресурсы, которые ты
имеешь право размещать и распространять.
=========================================================
*/


const MyCraftEaglerLoader = (() => {


    /*
    =====================================================
    CONFIG
    =====================================================
    */

    const CONFIG = {

        /*
        Главный JS-файл клиента.
        */

        clientScript:
            "./client/classes.js",


        /*
        Файл ресурсов клиента.
        */

        assets:
            "./client/assets.epk",


        /*
        Максимальное время ожидания.
        */

        timeout:
            60000,


        /*
        Имя атрибута,
        чтобы не загрузить script дважды.
        */

        scriptAttribute:
            "data-mycraft-eagler"


    };


    /*
    =====================================================
    STATE
    =====================================================
    */

    const state = {

        status:
            "idle",

        progress:
            0,

        loaded:
            false,

        error:
            null,

        script:
            null,

        startedAt:
            null,

        finishedAt:
            null

    };


    /*
    =====================================================
    EVENTS
    =====================================================
    */

    const listeners = {};


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
            !listeners[event]
        ) {

            listeners[event] = [];

        }


        listeners[event].push(
            callback
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

        if (
            !listeners[event]
        ) {

            return;

        }


        listeners[event].forEach(
            callback => {

                try {

                    callback(
                        data
                    );

                }
                catch (error) {

                    console.error(
                        "[MyCraftLoader]",
                        error
                    );

                }

            }
        );

    }


    /*
    =====================================================
    SET STATE
    =====================================================
    */

    function setState(
        status,
        progress,
        error = null
    ) {

        state.status =
            status;


        state.progress =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(progress) || 0
                )
            );


        state.error =
            error;


        emit(
            "state",
            getState()
        );

    }


    /*
    =====================================================
    GET STATE
    =====================================================
    */

    function getState() {

        return {
            ...state
        };

    }


    /*
    =====================================================
    CHECK CLIENT SCRIPT
    =====================================================
    */

    function findExistingScript() {

        return document.querySelector(
            "script[" +
            CONFIG.scriptAttribute +
            '="true"]'
        );

    }


    /*
    =====================================================
    CHECK FILE
    =====================================================
    */

    async function checkFile(
        url
    ) {

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


            return response.ok;

        }
        catch (error) {

            /*
            Некоторые GitHub Pages
            конфигурации могут не поддерживать
            HEAD.

            Тогда пробуем GET.
            */

            try {

                const response =
                    await fetch(
                        url,
                        {
                            method:
                                "GET",
                            headers: {
                                Range:
                                    "bytes=0-0"
                            },
                            cache:
                                "no-store"
                        }
                    );


                return response.ok;

            }
            catch {

                return false;

            }

        }

    }


    /*
    =====================================================
    CHECK CLIENT
    =====================================================
    */

    async function checkClient() {

        setState(
            "checking",
            5
        );


        const exists =
            await checkFile(
                CONFIG.clientScript
            );


        if (!exists) {

            const error =
                new Error(
                    "Игровой клиент не найден: " +
                    CONFIG.clientScript
                );


            state.error =
                error.message;


            setState(
                "error",
                0,
                error.message
            );


            emit(
                "error",
                error
            );


            return false;

        }


        setState(
            "found",
            15
        );


        return true;

    }


    /*
    =====================================================
    CREATE OPTIONS
    =====================================================
    */

    function createOptions() {

        if (
            !window.eaglercraftXOpts
        ) {

            window.eaglercraftXOpts =
                {};

        }


        const options =
            window.eaglercraftXOpts;


        /*
        Контейнер игрового клиента.
        */

        options.container =
            "game_frame";


        /*
        Ресурсы.
        */

        options.assetsURI =
            CONFIG.assets;


        /*
        Пространство хранения.
        */

        options.localStorageNamespace =
            "_mycraft";


        /*
        IndexedDB namespace.
        */

        options.worldsDB =
            "mycraft_worlds";


        /*
        Эти поля могут использоваться
        сборкой клиента, если она их
        поддерживает.
        */

        options.enableEPKVersionCheck =
            true;


        return options;

    }


    /*
    =====================================================
    LOAD SCRIPT
    =====================================================
    */

    function loadScript() {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                /*
                Если уже загружен.
                */

                if (
                    state.loaded
                ) {

                    resolve(
                        state.script
                    );

                    return;

                }


                /*
                Если script уже существует.
                */

                const existing =
                    findExistingScript();


                if (
                    existing
                ) {

                    state.script =
                        existing;


                    state.loaded =
                        true;


                    state.finishedAt =
                        Date.now();


                    setState(
                        "loaded",
                        100
                    );


                    resolve(
                        existing
                    );


                    return;

                }


                /*
                Создаём options
                до клиента.
                */

                createOptions();


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


                script.defer =
                    false;


                script.setAttribute(
                    CONFIG.scriptAttribute,
                    "true"
                );


                let finished =
                    false;


                const started =
                    Date.now();


                state.startedAt =
                    started;


                /*
                -------------------------------------------------
                TIMEOUT
                -------------------------------------------------
                */

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


                            const error =
                                new Error(
                                    "Истекло время ожидания загрузки Eaglercraft."
                                );


                            state.error =
                                error.message;


                            setState(
                                "error",
                                state.progress,
                                error.message
                            );


                            emit(
                                "error",
                                error
                            );


                            reject(
                                error
                            );

                        },
                        CONFIG.timeout
                    );


                /*
                -------------------------------------------------
                PROGRESS
                -------------------------------------------------
                */

                setState(
                    "loading",
                    20
                );


                /*
                -------------------------------------------------
                LOAD
                -------------------------------------------------
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


                        state.script =
                            script;


                        state.loaded =
                            true;


                        state.finishedAt =
                            Date.now();


                        setState(
                            "loaded",
                            100
                        );


                        emit(
                            "loaded",
                            {
                                script:
                                    script,

                                duration:
                                    state.finishedAt -
                                    state.startedAt
                            }
                        );


                        resolve(
                            script
                        );

                    };


                /*
                -------------------------------------------------
                ERROR
                -------------------------------------------------
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


                        const error =
                            new Error(
                                "Не удалось загрузить " +
                                CONFIG.clientScript
                            );


                        state.error =
                            error.message;


                        setState(
                            "error",
                            0,
                            error.message
                        );


                        emit(
                            "error",
                            error
                        );


                        reject(
                            error
                        );

                    };


                /*
                Добавляем в document.
                */

                document.head.appendChild(
                    script
                );


                /*
                Имитация этапов загрузки
                интерфейса.

                Реальный progress HTTP
                для обычного script.onload
                браузер напрямую не отдаёт.
                */

                const progressSteps = [

                    {
                        time: 250,
                        value: 30
                    },

                    {
                        time: 750,
                        value: 45
                    },

                    {
                        time: 1500,
                        value: 60
                    },

                    {
                        time: 3000,
                        value: 75
                    },

                    {
                        time: 7000,
                        value: 85
                    }

                ];


                progressSteps.forEach(
                    step => {

                        setTimeout(
                            () => {

                                if (
                                    finished
                                ) {

                                    return;

                                }


                                if (
                                    state.progress <
                                    step.value
                                ) {

                                    setState(
                                        "loading",
                                        step.value
                                    );

                                }

                            },
                            step.time
                        );

                    }
                );

            }
        );

    }


    /*
    =====================================================
    LOAD
    =====================================================
    */

    async function load() {

        if (
            state.loaded
        ) {

            return {
                success:
                    true
            };

        }


        if (
            state.status ===
            "loading"
        ) {

            return waitForFinish();

        }


        try {

            const exists =
                await checkClient();


            if (!exists) {

                return {
                    success:
                        false,

                    error:
                        state.error
                };

            }


            await loadScript();


            return {

                success:
                    true

            };

        }
        catch (error) {

            console.error(
                "[MyCraftLoader]",
                error
            );


            return {

                success:
                    false,

                error:
                    error.message

            };

        }

    }


    /*
    =====================================================
    WAIT FOR FINISH
    =====================================================
    */

    function waitForFinish() {

        return new Promise(
            resolve => {

                const started =
                    Date.now();


                const timer =
                    setInterval(
                        () => {

                            if (
                                state.loaded
                            ) {

                                clearInterval(
                                    timer
                                );


                                resolve({

                                    success:
                                        true

                                });


                                return;

                            }


                            if (
                                state.status ===
                                "error"
                            ) {

                                clearInterval(
                                    timer
                                );


                                resolve({

                                    success:
                                        false,

                                    error:
                                        state.error

                                });


                                return;

                            }


                            if (
                                Date.now() -
                                started >
                                CONFIG.timeout
                            ) {

                                clearInterval(
                                    timer
                                );


                                resolve({

                                    success:
                                        false,

                                    error:
                                        "Timeout"

                                });

                            }

                        },
                        100
                    );

            }
        );

    }


    /*
    =====================================================
    RESET
    =====================================================
    */

    function reset() {

        state.status =
            "idle";


        state.progress =
            0;


        state.loaded =
            false;


        state.error =
            null;


        state.script =
            null;


        state.startedAt =
            null;


        state.finishedAt =
            null;


        const script =
            findExistingScript();


        if (
            script
        ) {

            script.remove();

        }


        emit(
            "reset",
            getState()
        );

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        load,

        checkClient,

        createOptions,

        getState,

        reset,

        on

    };

})();


/*
=========================================================
 GLOBAL API
=========================================================
*/

window.MyCraftEaglerLoader =
    MyCraftEaglerLoader;


/*
=========================================================
 CONNECT TO GAME BRIDGE
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
        Передаём loader в bridge,
        если bridge существует.
        */

        if (
            window.MyCraftEagler
        ) {

            window.MyCraftEagler.loader =
                MyCraftEaglerLoader;

        }

    }
);
