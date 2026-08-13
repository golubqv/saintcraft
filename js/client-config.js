"use strict";

/*
=========================================================
 MYCRAFT — CLIENT CONFIG
=========================================================

Единая конфигурация игрового клиента.

ВАЖНО:
Этот файл НЕ содержит Minecraft-код.
Он только описывает, где находится клиент
и какие параметры использует MyCraft.
=========================================================
*/


const MyCraftClientConfig = (() => {

    /*
    =====================================================
    ОСНОВНАЯ КОНФИГУРАЦИЯ
    =====================================================
    */

    const config = {

        /*
        -------------------------------------------------
        ИНФОРМАЦИЯ
        -------------------------------------------------
        */

        name:
            "MyCraft",

        version:
            "1.0.0",


        /*
        -------------------------------------------------
        CLIENT
        -------------------------------------------------
        */

        client: {

            /*
            Главный JS-файл разрешённой
            сборки клиента.

            Например:

            ./client/classes.js
            */

            script:
                "./client/classes.js",


            /*
            Файл ресурсов.

            Например:

            ./client/assets.epk
            */

            assets:
                "./client/assets.epk",


            /*
            Папка клиента.
            */

            directory:
                "./client/",

        },


        /*
        -------------------------------------------------
        GAME
        -------------------------------------------------
        */

        game: {

            /*
            HTML-контейнер.
            */

            container:
                "game_frame",


            /*
            Основной игровой элемент.
            */

            element:
                "game",


            /*
            Canvas.
            */

            canvas:
                null,


            /*
            Автоматический fullscreen.
            */

            autoFullscreen:
                false,


            /*
            Разрешить изменение размера.
            */

            responsive:
                true

        },


        /*
        -------------------------------------------------
        STORAGE
        -------------------------------------------------
        */

        storage: {

            /*
            localStorage namespace.
            */

            localStorageNamespace:
                "_mycraft",


            /*
            IndexedDB база миров.
            */

            worldsDatabase:
                "mycraft_worlds",


            /*
            Список миров приложения.
            */

            worldList:
                "mycraft_world_list"

        },


        /*
        -------------------------------------------------
        LOADING
        -------------------------------------------------
        */

        loading: {

            /*
            Максимальное время загрузки.
            */

            timeout:
                60000,


            /*
            Показывать loading UI.
            */

            enabled:
                true,


            /*
            Проверять наличие клиента.
            */

            checkFiles:
                true

        },


        /*
        -------------------------------------------------
        FEATURES
        -------------------------------------------------
        */

        features: {

            singleplayer:
                true,

            multiplayer:
                true,

            servers:
                true,

            worlds:
                true,

            fullscreen:
                true,

            touch:
                true

        },


        /*
        -------------------------------------------------
        DEBUG
        -------------------------------------------------
        */

        debug: {

            enabled:
                true,

            logLoader:
                true,

            logWorlds:
                true,

            logServers:
                true

        }

    };


    /*
    =====================================================
    CLONE
    =====================================================
    */

    function clone(
        object
    ) {

        if (
            typeof structuredClone ===
            "function"
        ) {

            return structuredClone(
                object
            );

        }


        return JSON.parse(
            JSON.stringify(
                object
            )
        );

    }


    /*
    =====================================================
    GET
    =====================================================
    */

    function get() {

        return clone(
            config
        );

    }


    /*
    =====================================================
    GET CLIENT SCRIPT
    =====================================================
    */

    function getClientScript() {

        return config
            .client
            .script;

    }


    /*
    =====================================================
    GET ASSETS
    =====================================================
    */

    function getAssets() {

        return config
            .client
            .assets;

    }


    /*
    =====================================================
    GET CONTAINER
    =====================================================
    */

    function getContainer() {

        return config
            .game
            .container;

    }


    /*
    =====================================================
    GET WORLD DATABASE
    =====================================================
    */

    function getWorldDatabase() {

        return config
            .storage
            .worldsDatabase;

    }


    /*
    =====================================================
    SET
    =====================================================
    */

    function set(
        path,
        value
    ) {

        if (
            typeof path !==
            "string"
        ) {

            return false;

        }


        const parts =
            path.split(".");


        let target =
            config;


        for (
            let i = 0;
            i < parts.length - 1;
            i++
        ) {

            const key =
                parts[i];


            if (
                !target[key] ||
                typeof target[key] !==
                "object"
            ) {

                target[key] =
                    {};

            }


            target =
                target[key];

        }


        target[
            parts[
                parts.length - 1
            ]
        ] =
            value;


        return true;

    }


    /*
    =====================================================
    RESET
    =====================================================
    */

    const defaultConfig =
        clone(
            config
        );


    function reset() {

        Object.keys(
            config
        ).forEach(
            key => {

                delete config[key];

            }
        );


        Object.assign(
            config,
            clone(
                defaultConfig
            )
        );

    }


    /*
    =====================================================
    DEBUG LOGGER
    =====================================================
    */

    function log(
        ...args
    ) {

        if (
            !config.debug.enabled
        ) {

            return;

        }


        console.log(
            "[MyCraft]",
            ...args
        );

    }


    function warn(
        ...args
    ) {

        if (
            !config.debug.enabled
        ) {

            return;

        }


        console.warn(
            "[MyCraft]",
            ...args
        );

    }


    function error(
        ...args
    ) {

        console.error(
            "[MyCraft]",
            ...args
        );

    }


    /*
    =====================================================
    VALIDATE
    =====================================================
    */

    function validate() {

        const errors = [];


        /*
        CLIENT SCRIPT
        */

        if (
            typeof config.client.script !==
            "string" ||
            config.client.script.length ===
            0
        ) {

            errors.push(
                "client.script отсутствует."
            );

        }


        /*
        ASSETS
        */

        if (
            typeof config.client.assets !==
            "string" ||
            config.client.assets.length ===
            0
        ) {

            errors.push(
                "client.assets отсутствует."
            );

        }


        /*
        CONTAINER
        */

        if (
            typeof config.game.container !==
            "string" ||
            config.game.container.length ===
            0
        ) {

            errors.push(
                "game.container отсутствует."
            );

        }


        /*
        WORLD DATABASE
        */

        if (
            typeof config.storage.worldsDatabase !==
            "string" ||
            config.storage.worldsDatabase.length ===
            0
        ) {

            errors.push(
                "storage.worldsDatabase отсутствует."
            );

        }


        return {

            valid:
                errors.length === 0,

            errors

        };

    }


    /*
    =====================================================
    CHECK CLIENT FILES
    =====================================================
    */

    async function checkFiles() {

        const result = {

            script:
                false,

            assets:
                false,

            valid:
                false

        };


        /*
        SCRIPT
        */

        try {

            const response =
                await fetch(
                    config.client.script,
                    {
                        method:
                            "HEAD",
                        cache:
                            "no-store"
                    }
                );


            result.script =
                response.ok;

        }
        catch {

            try {

                const response =
                    await fetch(
                        config.client.script,
                        {
                            method:
                                "GET",
                            cache:
                                "no-store"
                        }
                    );


                result.script =
                    response.ok;

            }
            catch {

                result.script =
                    false;

            }

        }


        /*
        ASSETS
        */

        try {

            const response =
                await fetch(
                    config.client.assets,
                    {
                        method:
                            "HEAD",
                        cache:
                            "no-store"
                    }
                );


            result.assets =
                response.ok;

        }
        catch {

            try {

                const response =
                    await fetch(
                        config.client.assets,
                        {
                            method:
                                "GET",
                            cache:
                                "no-store"
                        }
                    );


                result.assets =
                    response.ok;

            }
            catch {

                result.assets =
                    false;

            }

        }


        result.valid =
            result.script &&
            result.assets;


        return result;

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        get,

        set,

        reset,

        validate,

        checkFiles,

        getClientScript,

        getAssets,

        getContainer,

        getWorldDatabase,

        log,

        warn,

        error

    };

})();


/*
=========================================================
GLOBAL
=========================================================
*/

window.MyCraftClientConfig =
    MyCraftClientConfig;


/*
=========================================================
STARTUP CHECK
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const validation =
            MyCraftClientConfig.validate();


        if (
            !validation.valid
        ) {

            MyCraftClientConfig.error(
                "Ошибка конфигурации:",
                validation.errors
            );

            return;

        }


        MyCraftClientConfig.log(
            "Client configuration loaded.",
            MyCraftClientConfig.get()
        );

    }
);
