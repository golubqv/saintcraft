"use strict";

/*
=========================================================
 MYCRAFT — SERVER MENU
 Меню серверов для браузерного Minecraft-клиента.
=========================================================
*/


const MyCraftServers = (() => {

    /*
    =====================================================
    НАСТРОЙКИ
    =====================================================
    */

    const CONFIG = {

        storageKey:
            "mycraft_servers",

        defaultServers: [

            {
                id: "local",

                name:
                    "Локальный мир",

                address:
                    "",

                port:
                    "",

                description:
                    "Одиночная игра",

                type:
                    "singleplayer"

            },

            {
                id: "example",

                name:
                    "Мой сервер",

                address:
                    "",

                port:
                    "",

                description:
                    "Добавь адрес своего сервера",

                type:
                    "multiplayer"

            }

        ]

    };


    /*
    =====================================================
    СОСТОЯНИЕ
    =====================================================
    */

    let servers = [];


    let selectedServer = null;


    /*
    =====================================================
    ЗАГРУЗКА СЕРВЕРОВ
    =====================================================
    */

    function load() {

        try {

            const saved =
                localStorage.getItem(
                    CONFIG.storageKey
                );


            if (saved) {

                const parsed =
                    JSON.parse(saved);


                if (
                    Array.isArray(parsed)
                ) {

                    servers =
                        parsed;

                    return;

                }

            }

        }
        catch (error) {

            console.warn(
                "[MyCraftServers]",
                "Не удалось загрузить серверы:",
                error
            );

        }


        servers =
            CONFIG.defaultServers.map(
                server => ({
                    ...server
                })
            );


        save();

    }


    /*
    =====================================================
    СОХРАНЕНИЕ
    =====================================================
    */

    function save() {

        try {

            localStorage.setItem(

                CONFIG.storageKey,

                JSON.stringify(
                    servers
                )

            );

        }
        catch (error) {

            console.warn(
                "[MyCraftServers]",
                "Не удалось сохранить серверы:",
                error
            );

        }

    }


    /*
    =====================================================
    ESCAPE HTML
    =====================================================
    */

    function escapeHTML(value) {

        return String(value)

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


    /*
    =====================================================
    СОЗДАНИЕ CSS
    =====================================================
    */

    function createStyles() {

        if (
            document.getElementById(
                "mycraft-server-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "mycraft-server-styles";


        style.textContent = `

        #mycraft-server-menu {

            position: fixed;

            inset: 0;

            z-index: 500;

            display: none;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background:
                rgba(0,0,0,.78);

            backdrop-filter:
                blur(12px);

            -webkit-backdrop-filter:
                blur(12px);

        }


        #mycraft-server-menu.active {

            display: flex;

        }


        .mycraft-server-window {

            width: min(
                94vw,
                720px
            );

            max-height: 90vh;

            overflow: hidden;

            display: flex;

            flex-direction: column;

            border-radius: 22px;

            background:
                #161616;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .1
                );

            box-shadow:
                0 30px 100px
                rgba(
                    0,
                    0,
                    0,
                    .7
                );

        }


        .mycraft-server-header {

            display: flex;

            align-items: center;

            justify-content: space-between;

            padding:
                22px 24px;

            border-bottom:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

        }


        .mycraft-server-title {

            font-size: 22px;

            font-weight: 800;

        }


        .mycraft-server-close {

            width: 38px;

            height: 38px;

            border: 0;

            border-radius: 10px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

            color: white;

            cursor: pointer;

            font-size: 20px;

        }


        .mycraft-server-list {

            padding: 16px;

            overflow-y: auto;

        }


        .mycraft-server-card {

            display: flex;

            align-items: center;

            gap: 14px;

            padding: 16px;

            margin-bottom: 10px;

            border-radius: 15px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .045
                );

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .06
                );

            transition:
                .15s ease;

        }


        .mycraft-server-card:hover {

            background:
                rgba(
                    255,
                    255,
                    255,
                    .075
                );

            transform:
                translateY(-1px);

        }


        .mycraft-server-icon {

            width: 52px;

            height: 52px;

            flex-shrink: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 12px;

            background:
                linear-gradient(
                    135deg,
                    #69c957,
                    #347f2c
                );

            font-size: 25px;

        }


        .mycraft-server-info {

            min-width: 0;

            flex: 1;

        }


        .mycraft-server-name {

            font-size: 16px;

            font-weight: 750;

            margin-bottom: 5px;

        }


        .mycraft-server-description {

            font-size: 12px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .45
                );

            overflow: hidden;

            text-overflow: ellipsis;

            white-space: nowrap;

        }


        .mycraft-server-address {

            margin-top: 4px;

            font-size: 11px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .3
                );

        }


        .mycraft-server-play {

            border: 0;

            padding:
                10px 16px;

            border-radius: 10px;

            background:
                #55b847;

            color: white;

            font-weight: 750;

            cursor: pointer;

        }


        .mycraft-server-play:hover {

            filter:
                brightness(1.08);

        }


        .mycraft-server-footer {

            padding:
                16px;

            border-top:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

        }


        .mycraft-add-server {

            width: 100%;

            min-height: 48px;

            border: 0;

            border-radius: 12px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

            color: white;

            cursor: pointer;

            font-weight: 700;

        }


        .mycraft-add-server:hover {

            background:
                rgba(
                    255,
                    255,
                    255,
                    .11
                );

        }


        .mycraft-server-empty {

            padding: 45px 20px;

            text-align: center;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .4
                );

        }


        @media (
            max-width: 600px
        ) {

            .mycraft-server-card {

                align-items:
                    flex-start;

            }


            .mycraft-server-play {

                padding:
                    9px 12px;

            }

        }

        `;


        document.head.appendChild(
            style
        );

    }


    /*
    =====================================================
    СОЗДАНИЕ HTML МЕНЮ
    =====================================================
    */

    function createMenu() {

        if (
            document.getElementById(
                "mycraft-server-menu"
            )
        ) {

            return;

        }


        const menu =
            document.createElement(
                "div"
            );


        menu.id =
            "mycraft-server-menu";


        menu.innerHTML = `

            <div
                class="mycraft-server-window"
            >

                <div
                    class="mycraft-server-header"
                >

                    <div
                        class="mycraft-server-title"
                    >
                        Серверы
                    </div>


                    <button
                        class="mycraft-server-close"
                        id="mycraft-server-close"
                    >
                        ×
                    </button>

                </div>


                <div
                    class="mycraft-server-list"
                    id="mycraft-server-list"
                ></div>


                <div
                    class="mycraft-server-footer"
                >

                    <button
                        class="mycraft-add-server"
                        id="mycraft-add-server"
                    >
                        ＋ Добавить сервер
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            menu
        );


        const close =
            document.getElementById(
                "mycraft-server-close"
            );


        close.addEventListener(
            "click",
            closeMenu
        );


        menu.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    menu
                ) {

                    closeMenu();

                }

            }
        );


        const add =
            document.getElementById(
                "mycraft-add-server"
            );


        add.addEventListener(
            "click",
            addServer
        );


        render();

    }


    /*
    =====================================================
    ОТРИСОВКА
    =====================================================
    */

    function render() {

        const list =
            document.getElementById(
                "mycraft-server-list"
            );


        if (!list) {

            return;

        }


        if (
            servers.length === 0
        ) {

            list.innerHTML = `

                <div
                    class="mycraft-server-empty"
                >
                    Серверов пока нет.
                </div>

            `;

            return;

        }


        list.innerHTML =
            servers.map(
                server => {

                    const address =
                        server.address
                            ? (
                                server.address +
                                (
                                    server.port
                                        ? ":" +
                                          server.port
                                        : ""
                                )
                              )
                            : "Адрес не указан";


                    const icon =
                        server.type ===
                        "singleplayer"
                            ? "🌎"
                            : "🖥️";


                    return `

                    <div
                        class="mycraft-server-card"
                        data-id="${escapeHTML(server.id)}"
                    >

                        <div
                            class="mycraft-server-icon"
                        >
                            ${icon}
                        </div>


                        <div
                            class="mycraft-server-info"
                        >

                            <div
                                class="mycraft-server-name"
                            >
                                ${escapeHTML(server.name)}
                            </div>


                            <div
                                class="mycraft-server-description"
                            >
                                ${escapeHTML(server.description)}
                            </div>


                            <div
                                class="mycraft-server-address"
                            >
                                ${escapeHTML(address)}
                            </div>

                        </div>


                        <button
                            class="mycraft-server-play"
                            data-play="${escapeHTML(server.id)}"
                        >
                            Играть
                        </button>

                    </div>

                    `;

                }
            ).join("");


        list
            .querySelectorAll(
                "[data-play]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            connect(
                                button.dataset.play
                            );

                        }
                    );

                }
            );

    }


    /*
    =====================================================
    ОТКРЫТЬ
    =====================================================
    */

    function open() {

        createStyles();

        createMenu();

        load();

        render();


        const menu =
            document.getElementById(
                "mycraft-server-menu"
            );


        if (menu) {

            menu.classList.add(
                "active"
            );

        }

    }


    /*
    =====================================================
    ЗАКРЫТЬ
    =====================================================
    */

    function closeMenu() {

        const menu =
            document.getElementById(
                "mycraft-server-menu"
            );


        if (menu) {

            menu.classList.remove(
                "active"
            );

        }

    }


    /*
    =====================================================
    ДОБАВИТЬ СЕРВЕР
    =====================================================
    */

    function addServer() {

        const name =
            prompt(
                "Название сервера:"
            );


        if (!name) {

            return;

        }


        const address =
            prompt(
                "Адрес сервера:"
            );


        if (!address) {

            return;

        }


        const port =
            prompt(
                "Порт сервера (можно оставить пустым):"
            );


        const server = {

            id:
                "server_" +
                Date.now(),

            name:
                name.trim(),

            address:
                address.trim(),

            port:
                port
                    ? port.trim()
                    : "",

            description:
                "Пользовательский сервер",

            type:
                "multiplayer"

        };


        servers.push(
            server
        );


        save();

        render();

    }


    /*
    =====================================================
    ПОДКЛЮЧЕНИЕ
    =====================================================
    */

    function connect(id) {

        const server =
            servers.find(
                item =>
                    item.id === id
            );


        if (!server) {

            return;

        }


        selectedServer =
            server;


        /*
        Пока клиент не подключён,
        просто сохраняем выбранный
        сервер.

        Позже здесь будет передача
        адреса непосредственно
        в Eaglercraft.
        */


        console.log(
            "[MyCraftServers]",
            "Выбран сервер:",
            server
        );


        closeMenu();


        /*
        Если загрузчик существует,
        передаём ему сервер.
        */

        if (
            window.MyCraftEagler &&
            typeof
                window.MyCraftEagler
                    .connectToServer ===
                "function"
        ) {

            window.MyCraftEagler
                .connectToServer(
                    server
                );

            return;

        }


        alert(

            server.type ===
            "singleplayer"

                ? "Открываем одиночную игру."

                : "Сервер выбран: " +
                  server.name +
                  "\\n\\n" +
                  (
                    server.address +
                    (
                        server.port
                            ? ":" +
                              server.port
                            : ""
                    )
                  )

        );

    }


    /*
    =====================================================
    ПОЛУЧИТЬ СПИСОК
    =====================================================
    */

    function getServers() {

        return servers.map(
            server => ({
                ...server
            })
        );

    }


    /*
    =====================================================
    ПОЛУЧИТЬ ВЫБРАННЫЙ
    =====================================================
    */

    function getSelectedServer() {

        if (!selectedServer) {

            return null;

        }


        return {
            ...selectedServer
        };

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        init() {

            createStyles();

            load();

        },


        open,

        close:
            closeMenu,

        add:
            addServer,

        getServers,

        getSelectedServer,

        connect

    };

})();


/*
=========================================================
 ИНИЦИАЛИЗАЦИЯ
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        MyCraftServers.init();

    }
);


/*
=========================================================
 ГЛОБАЛЬНЫЙ API
=========================================================
*/

window.MyCraftServers =
    MyCraftServers;
