"use strict";

/*
=========================================================
 MYCRAFT — MENU ROUTER
=========================================================

Центральный роутер меню MyCraft.

Отвечает за переходы:

Главное меню
    ↓
Одиночная игра
    ↓
Создание мира
    ↓
Назад

Также автоматически закрывает
остальные экраны, чтобы меню
не накладывались друг на друга.
=========================================================
*/

const MyCraftMenuRouter = (() => {

    const state = {

        initialized: false,

        current:
            "main"

    };


    /*
    =====================================================
    MENU IDS
    =====================================================
    */

    const MENUS = {

        main:
            "mycraft-main-menu",

        singleplayer:
            "mycraft-singleplayer-menu",

        createWorld:
            "mycraft-create-world-menu",

        server:
            "mycraft-server-menu",

        world:
            "mycraft-world-menu"

    };


    /*
    =====================================================
    HELPERS
    =====================================================
    */

    function element(
        id
    ) {

        return document.getElementById(
            id
        );

    }


    function closeElement(
        id
    ) {

        const el =
            element(
                id
            );


        if (
            el
        ) {

            el.classList.remove(
                "active"
            );

        }

    }


    function closeAll() {

        Object.values(
            MENUS
        ).forEach(
            id => {

                closeElement(
                    id
                );

            }
        );


        /*
        Также закрываем наши
        JS-модули, если они доступны.
        */

        try {

            if (
                window.MyCraftSingleplayerMenu
            ) {

                MyCraftSingleplayerMenu.close();

            }

        }
        catch (_) {}


        try {

            if (
                window.MyCraftCreateWorldMenu
            ) {

                MyCraftCreateWorldMenu.close();

            }

        }
        catch (_) {}

    }


    /*
    =====================================================
    MAIN MENU
    =====================================================
    */

    function showMain() {

        closeAll();


        const main =
            element(
                MENUS.main
            );


        if (
            main
        ) {

            main.classList.add(
                "active"
            );

        }


        state.current =
            "main";


        emit(
            "change",
            "main"
        );

    }


    /*
    =====================================================
    SINGLEPLAYER
    =====================================================
    */

    async function showSingleplayer() {

        closeAll();


        if (
            window.MyCraftSingleplayerMenu
        ) {

            await MyCraftSingleplayerMenu.open();

        }
        else {

            const menu =
                element(
                    MENUS.singleplayer
                );


            if (
                menu
            ) {

                menu.classList.add(
                    "active"
                );

            }

        }


        state.current =
            "singleplayer";


        emit(
            "change",
            "singleplayer"
        );

    }


    /*
    =====================================================
    CREATE WORLD
    =====================================================
    */

    function showCreateWorld() {

        closeAll();


        if (
            window.MyCraftCreateWorldMenu
        ) {

            MyCraftCreateWorldMenu.open();

        }
        else {

            const menu =
                element(
                    MENUS.createWorld
                );


            if (
                menu
            ) {

                menu.classList.add(
                    "active"
                );

            }

        }


        state.current =
            "createWorld";


        emit(
            "change",
            "createWorld"
        );

    }


    /*
    =====================================================
    SERVER MENU
    =====================================================
    */

    function showServers() {

        closeAll();


        const menu =
            element(
                MENUS.server
            );


        if (
            menu
        ) {

            menu.classList.add(
                "active"
            );

        }


        state.current =
            "server";


        emit(
            "change",
            "server"
        );

    }


    /*
    =====================================================
    WORLD MENU
    =====================================================
    */

    function showWorldMenu() {

        closeAll();


        const menu =
            element(
                MENUS.world
            );


        if (
            menu
        ) {

            menu.classList.add(
                "active"
            );

        }


        state.current =
            "world";


        emit(
            "change",
            "world"
        );

    }


    /*
    =====================================================
    BACK
    =====================================================
    */

    function back() {

        switch (
            state.current
        ) {

            case "singleplayer":

                showMain();

                break;


            case "createWorld":

                showSingleplayer();

                break;


            case "server":

                showMain();

                break;


            case "world":

                showSingleplayer();

                break;


            default:

                showMain();

                break;

        }

    }


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


        listeners[event].forEach(
            callback => {

                try {

                    callback(
                        data
                    );

                }
                catch (error) {

                    console.error(
                        "[MyCraftMenuRouter]",
                        error
                    );

                }

            }
        );

    }


    /*
    =====================================================
    FIND MAIN MENU BUTTONS
    =====================================================
    */

    function findButton(
        selectors
    ) {

        for (
            const selector of selectors
        ) {

            const button =
                document.querySelector(
                    selector
                );


            if (
                button
            ) {

                return button;

            }

        }


        return null;

    }


    /*
    =====================================================
    CONNECT MAIN MENU
    =====================================================
    */

    function connectMainMenu() {

        /*
        -------------------------------------------------
        Варианты селекторов для кнопки
        "Одиночная игра".
        -------------------------------------------------
        */

        const singleplayerButton =
            findButton([

                "#singleplayer-button",

                "#singleplayer",

                "[data-menu='singleplayer']",

                "[data-action='singleplayer']",

                "[data-screen='singleplayer']",

                ".singleplayer-button",

                ".singleplayer",

                ".menu-singleplayer"

            ]);


        if (
            singleplayerButton
        ) {

            /*
            Не даём старому обработчику
            перейти на другой экран.
            */

            singleplayerButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showSingleplayer();

                },
                true
            );

        }


        /*
        -------------------------------------------------
        Серверы
        -------------------------------------------------
        */

        const serversButton =
            findButton([

                "#servers-button",

                "#servers",

                "[data-menu='servers']",

                "[data-action='servers']",

                "[data-screen='servers']",

                ".servers-button"

            ]);


        if (
            serversButton
        ) {

            serversButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showServers();

                },
                true
            );

        }


        /*
        -------------------------------------------------
        Новый мир
        -------------------------------------------------
        */

        const createButton =
            findButton([

                "#create-world-button",

                "#new-world-button",

                "[data-menu='create-world']",

                "[data-action='create-world']"

            ]);


        if (
            createButton
        ) {

            createButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showCreateWorld();

                },
                true
            );

        }

    }


    /*
    =====================================================
    CONNECT SINGLEPLAYER
    =====================================================
    */

    function connectSingleplayer() {

        /*
        Кнопка "Новый мир"
        */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "#mycraft-sp-create, " +
                        "#mycraft-sp-empty-create, " +
                        "[data-action='create-world']"
                    );


                if (
                    !button
                ) {

                    return;

                }


                if (
                    button.id ===
                    "mycraft-sp-create" ||

                    button.id ===
                    "mycraft-sp-empty-create"
                ) {

                    event.preventDefault();

                    event.stopPropagation();

                    showCreateWorld();

                }

            },
            true
        );


        /*
        Кнопка "Назад"
        */

        const back =
            document.getElementById(
                "mycraft-sp-back"
            );


        if (
            back
        ) {

            back.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showMain();

                },
                true
            );

        }

    }


    /*
    =====================================================
    CONNECT CREATE WORLD
    =====================================================
    */

    function connectCreateWorld() {

        const back =
            document.getElementById(
                "mycraft-create-back"
            );


        if (
            back
        ) {

            back.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showSingleplayer();

                },
                true
            );

        }


        /*
        После создания мира
        возвращаемся к списку миров.
        */

        if (
            window.MyCraftCreateWorldMenu
        ) {

            MyCraftCreateWorldMenu.on(
                "created",
                world => {

                    console.log(
                        "[MyCraftMenuRouter] " +
                        "Создан мир:",
                        world
                    );

                }
            );

        }

    }


    /*
    =====================================================
    ESC KEY
    =====================================================
    */

    function bindKeyboard() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                if (
                    state.current ===
                    "main"
                ) {

                    return;

                }


                back();

            }
        );

    }


    /*
    =====================================================
    MOBILE BACK BUTTON
    =====================================================
    */

    function bindBrowserBack() {

        window.addEventListener(
            "popstate",
            () => {

                back();

            }
        );

    }


    /*
    =====================================================
    INITIALIZE
    =====================================================
    */

    function init() {

        if (
            state.initialized
        ) {

            return;

        }


        connectMainMenu();

        connectSingleplayer();

        connectCreateWorld();

        bindKeyboard();

        bindBrowserBack();


        state.initialized =
            true;


        console.log(
            "[MyCraftMenuRouter] initialized"
        );

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        init,

        showMain,

        showSingleplayer,

        showCreateWorld,

        showServers,

        showWorldMenu,

        back,

        closeAll,

        on,

        get current() {

            return state.current;

        }

    };

})();


/*
=========================================================
GLOBAL
=========================================================
*/

window.MyCraftMenuRouter =
    MyCraftMenuRouter;


/*
=========================================================
INIT
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
        Небольшая задержка нужна,
        чтобы остальные меню успели
        создать свои DOM-элементы.
        */

        setTimeout(
            () => {

                MyCraftMenuRouter.init();

            },
            100
        );

    }
);
