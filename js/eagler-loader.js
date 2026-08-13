/*
=========================================================
 MYCRAFT — EAGLERCRAFT LOADER
=========================================================

Этот файл отвечает только за запуск браузерного клиента.

Структура проекта:

MyCraft/
│
├── index.html
│
├── js/
│   └── eagler-loader.js
│
└── client/
    ├── assets.epk
    ├── classes.js
    └── lang/
        └── ...
=========================================================
*/


"use strict";


/* =====================================================
   НАСТРОЙКИ
===================================================== */

const MYCRAFT_CONFIG = {

    /*
    Контейнер, куда Eaglercraft
    создаст игровой canvas.
    */

    container:
        "game_frame",


    /*
    Путь к ресурсам клиента.

    ВАЖНО:

    Здесь должен находиться
    именно тот assets.epk,
    который разрешено использовать
    в твоей сборке.
    */

    assetsURI:
        "./client/assets.epk",


    /*
    Локализация.
    */

    localesURI:
        "./client/lang/",


    /*
    Название базы миров.

    Eaglercraft использует IndexedDB
    для сохранения миров.
    */

    worldsDB:
        "mycraft_worlds",


    /*
    Не включаем голосовой чат
    по умолчанию.
    */

    allowVoiceClient:
        false,


    /*
    Свой namespace,
    чтобы настройки MyCraft
    не пересекались с другими
    Eaglercraft-сайтами.
    */

    localStorageNamespace:
        "_mycraft_eagler",


    /*
    Серверы.

    Пока пусто.

    Позже сюда можно добавить
    свой Eaglercraft-совместимый сервер.
    */

    servers: [],


    /*
    Relay-серверы используются
    для Shared Worlds.

    Мы не будем автоматически
    добавлять сторонние relay,
    пока ты не решишь,
    какие серверы использовать.
    */

    relays: []

};


/* =====================================================
   СОСТОЯНИЕ
===================================================== */

let eaglerLoaded = false;

let eaglerStarted = false;


/* =====================================================
   ПОЛУЧИТЬ GAME CONTAINER
===================================================== */

function getGameContainer() {

    const container =
        document.getElementById(
            MYCRAFT_CONFIG.container
        );


    if (!container) {

        throw new Error(
            "MyCraft: контейнер #" +
            MYCRAFT_CONFIG.container +
            " не найден."
        );

    }


    return container;

}


/* =====================================================
   ПОКАЗАТЬ ЗАГРУЗКУ
===================================================== */

function showLoading(text) {

    const loading =
        document.getElementById(
            "loading"
        );


    if (!loading) {

        return;

    }


    loading.classList.remove(
        "hidden"
    );


    const textElement =
        loading.querySelector(
            ".loading-text"
        );


    if (textElement) {

        textElement.textContent =
            text;

    }

}


/* =====================================================
   СКРЫТЬ ЗАГРУЗКУ
===================================================== */

function hideLoading() {

    const loading =
        document.getElementById(
            "loading"
        );


    if (!loading) {

        return;

    }


    loading.classList.add(
        "hidden"
    );

}


/* =====================================================
   СОЗДАТЬ EAGLERCRAFT OPTIONS
===================================================== */

function createEaglerOptions() {

    /*
    EaglercraftX использует
    window.eaglercraftXOpts
    для конфигурации клиента.
    */

    window.eaglercraftXOpts = {

        /*
        -------------------------------------------------
        Основной контейнер
        -------------------------------------------------
        */

        container:
            MYCRAFT_CONFIG.container,


        /*
        -------------------------------------------------
        Ресурсы
        -------------------------------------------------
        */

        assetsURI:
            MYCRAFT_CONFIG.assetsURI,


        /*
        -------------------------------------------------
        Локализация
        -------------------------------------------------
        */

        localesURI:
            MYCRAFT_CONFIG.localesURI,


        /*
        -------------------------------------------------
        Миры
        -------------------------------------------------
        */

        worldsDB:
            MYCRAFT_CONFIG.worldsDB,


        /*
        -------------------------------------------------
        Голос
        -------------------------------------------------
        */

        allowVoiceClient:
            MYCRAFT_CONFIG.allowVoiceClient,


        /*
        -------------------------------------------------
        Namespace
        -------------------------------------------------
        */

        localStorageNamespace:
            MYCRAFT_CONFIG.localStorageNamespace,


        /*
        -------------------------------------------------
        Серверы
        -------------------------------------------------
        */

        servers:
            MYCRAFT_CONFIG.servers,


        /*
        -------------------------------------------------
        Relay
        -------------------------------------------------
        */

        relays:
            MYCRAFT_CONFIG.relays,


        /*
        -------------------------------------------------
        Badge
        -------------------------------------------------

        Показываем информацию
        о подписи клиента,
        если конкретная сборка
        её поддерживает.
        */

        enableSignatureBadge:
            true,


        /*
        -------------------------------------------------
        Hooks
        -------------------------------------------------
        */

        hooks: {

            /*
            Сохранение настроек.
            */

            localStorageSaved:
                function(
                    key,
                    data
                ) {

                    console.log(
                        "[MyCraft] " +
                        "localStorage saved:",
                        key
                    );

                },


            /*
            Загрузка настроек.

            null означает:
            использовать обычное
            браузерное хранилище.
            */

            localStorageLoaded:
                function(
                    key
                ) {

                    console.log(
                        "[MyCraft] " +
                        "localStorage load:",
                        key
                    );


                    return null;

                }

        }

    };


    return window.eaglercraftXOpts;

}


/* =====================================================
   ЗАГРУЗКА JAVASCRIPT КЛИЕНТА
===================================================== */

function loadEaglerClient(
    scriptURL
) {

    return new Promise(
        function(
            resolve,
            reject
        ) {

            /*
            Если клиент уже загружен,
            повторно его не загружаем.
            */

            if (
                eaglerLoaded
            ) {

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
                scriptURL;


            script.async =
                false;


            /*
            ------------------------------------------------
            УСПЕШНАЯ ЗАГРУЗКА
            ------------------------------------------------
            */

            script.onload =
                function() {

                    console.log(
                        "[MyCraft] " +
                        "Eaglercraft client loaded."
                    );


                    eaglerLoaded =
                        true;


                    resolve();

                };


            /*
            ------------------------------------------------
            ОШИБКА
            ------------------------------------------------
            */

            script.onerror =
                function(error) {

                    console.error(
                        "[MyCraft] " +
                        "Failed to load client:",
                        error
                    );


                    reject(

                        new Error(
                            "Не удалось загрузить " +
                            "Eaglercraft client."
                        )

                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


/* =====================================================
   ЗАПУСК КЛИЕНТА
===================================================== */

async function startEaglercraft() {

    /*
    Не запускаем дважды.
    */

    if (
        eaglerStarted
    ) {

        return;

    }


    try {

        /*
        -------------------------------------------------
        GAME CONTAINER
        -------------------------------------------------
        */

        getGameContainer();


        /*
        -------------------------------------------------
        CONFIG
        -------------------------------------------------
        */

        createEaglerOptions();


        /*
        -------------------------------------------------
        LOADING
        -------------------------------------------------
        */

        showLoading(
            "Загрузка игрового клиента..."
        );


        /*
        -------------------------------------------------
        CLIENT SCRIPT
        -------------------------------------------------

        ВАЖНО:

        Пока файла classes.js
        у нас нет.

        Когда у тебя появится
        легальная сборка клиента,
        положим её сюда:

            client/classes.js
        */

        await loadEaglerClient(
            "./client/classes.js"
        );


        /*
        -------------------------------------------------
        SUCCESS
        -------------------------------------------------
        */

        eaglerStarted =
            true;


        console.log(
            "[MyCraft] " +
            "Eaglercraft started."
        );


        /*
        Обычно сам клиент
        создаёт canvas внутри
        game_frame.

        Поэтому просто
        ждём его появления.
        */

        waitForCanvas();


    }
    catch (
        error
    ) {

        console.error(
            error
        );


        showError(
            error.message
        );

    }

}


/* =====================================================
   ОЖИДАНИЕ CANVAS
===================================================== */

function waitForCanvas() {

    const container =
        getGameContainer();


    let attempts =
        0;


    const maxAttempts =
        100;


    const timer =
        setInterval(

            function() {

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


                    hideLoading();


                    setupCanvas(
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


                    /*
                    Клиент мог работать
                    без canvas на первом
                    этапе загрузки.

                    Поэтому не считаем
                    это критической ошибкой.
                    */

                    console.warn(
                        "[MyCraft] " +
                        "Canvas not found yet."
                    );


                }

            },

            100

        );

}


/* =====================================================
   CANVAS
===================================================== */

function setupCanvas(
    canvas
) {

    /*
    Убираем возможные
    ограничения браузера.
    */

    canvas.style.width =
        "100%";


    canvas.style.height =
        "100%";


    canvas.style.display =
        "block";


    /*
    Контекстное меню
    внутри игры не нужно.
    */

    canvas.addEventListener(

        "contextmenu",

        function(event) {

            event.preventDefault();

        }

    );


    console.log(
        "[MyCraft] Canvas ready."
    );

}


/* =====================================================
   ОШИБКА
===================================================== */

function showError(
    message
) {

    const loading =
        document.getElementById(
            "loading"
        );


    if (!loading) {

        return;

    }


    loading.classList.remove(
        "hidden"
    );


    const loader =
        loading.querySelector(
            ".loader"
        );


    if (
        loader
    ) {

        loader.style.display =
            "none";

    }


    const text =
        loading.querySelector(
            ".loading-text"
        );


    if (
        text
    ) {

        text.innerHTML =

            "Не удалось запустить игру." +

            "<br><br>" +

            "<small>" +

            escapeHTML(
                message
            ) +

            "</small>";

    }

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   КНОПКА PLAY
===================================================== */

function setupMyCraftButton() {

    const play =
        document.getElementById(
            "play"
        );


    if (!play) {

        return;

    }


    play.addEventListener(

        "click",

        async function() {

            /*
            Открываем игру.
            */

            const menu =
                document.getElementById(
                    "menu"
                );


            const game =
                document.getElementById(
                    "game"
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


            /*
            Запускаем клиент.
            */

            await startEaglercraft();

        }

    );

}


/* =====================================================
   INIT
===================================================== */

function initMyCraftEaglerLoader() {

    console.log(
        "[MyCraft] " +
        "Eaglercraft loader initialized."
    );


    setupMyCraftButton();

}


/* =====================================================
   DOM READY
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(

        "DOMContentLoaded",

        initMyCraftEaglerLoader

    );

}
else {

    initMyCraftEaglerLoader();

}
