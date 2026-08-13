"use strict";

/*
=========================================================
 MYCRAFT — WORLD MENU
 Менеджер одиночных миров.

 Пока это интерфейс и хранилище списка миров.
 Позже выбранный мир будет передаваться
 непосредственно браузерному Minecraft-клиенту.
=========================================================
*/


const MyCraftWorlds = (() => {


    /*
    =====================================================
    НАСТРОЙКИ
    =====================================================
    */

    const CONFIG = {

        storageKey:
            "mycraft_world_list",

        maxWorlds:
            50

    };


    /*
    =====================================================
    СОСТОЯНИЕ
    =====================================================
    */

    let worlds = [];


    let selectedWorld =
        null;


    /*
    =====================================================
    ЗАГРУЗКА
    =====================================================
    */

    function load() {

        try {

            const data =
                localStorage.getItem(
                    CONFIG.storageKey
                );


            if (!data) {

                worlds = [];

                return;

            }


            const parsed =
                JSON.parse(data);


            if (
                Array.isArray(parsed)
            ) {

                worlds = parsed;

            }
            else {

                worlds = [];

            }

        }
        catch (error) {

            console.error(
                "[MyCraftWorlds] " +
                "Ошибка загрузки миров:",
                error
            );

            worlds = [];

        }

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
                    worlds
                )

            );

        }
        catch (error) {

            console.error(
                "[MyCraftWorlds] " +
                "Ошибка сохранения:",
                error
            );

        }

    }


    /*
    =====================================================
    HTML ESCAPE
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
    CSS
    =====================================================
    */

    function createStyles() {

        if (
            document.getElementById(
                "mycraft-world-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "mycraft-world-styles";


        style.textContent = `

        #mycraft-world-menu {

            position: fixed;

            inset: 0;

            z-index: 600;

            display: none;

            align-items: center;

            justify-content: center;

            padding: 18px;

            background:
                rgba(0,0,0,.8);

            backdrop-filter:
                blur(14px);

            -webkit-backdrop-filter:
                blur(14px);

        }


        #mycraft-world-menu.active {

            display: flex;

        }


        .mycraft-world-window {

            width: min(
                94vw,
                760px
            );

            max-height: 90vh;

            display: flex;

            flex-direction: column;

            overflow: hidden;

            border-radius: 22px;

            background:
                #151515;

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
                    .75
                );

        }


        .mycraft-world-header {

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


        .mycraft-world-title {

            font-size: 23px;

            font-weight: 850;

        }


        .mycraft-world-close {

            width: 40px;

            height: 40px;

            border: 0;

            border-radius: 11px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

            color: white;

            font-size: 22px;

            cursor: pointer;

        }


        .mycraft-world-list {

            flex: 1;

            overflow-y: auto;

            padding: 16px;

        }


        .mycraft-world-card {

            display: flex;

            align-items: center;

            gap: 15px;

            padding: 15px;

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
                background .15s ease;

        }


        .mycraft-world-card:hover {

            background:
                rgba(
                    255,
                    255,
                    255,
                    .075
                );

        }


        .mycraft-world-icon {

            width: 58px;

            height: 58px;

            flex-shrink: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 12px;

            background:
                linear-gradient(
                    135deg,
                    #6bc95a,
                    #367d2d
                );

            font-size: 28px;

        }


        .mycraft-world-info {

            flex: 1;

            min-width: 0;

        }


        .mycraft-world-name {

            font-size: 17px;

            font-weight: 800;

            margin-bottom: 5px;

        }


        .mycraft-world-meta {

            font-size: 12px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .4
                );

        }


        .mycraft-world-actions {

            display: flex;

            gap: 7px;

        }


        .mycraft-world-play {

            border: 0;

            padding:
                10px 15px;

            border-radius: 10px;

            background:
                #55b847;

            color: white;

            font-weight: 750;

            cursor: pointer;

        }


        .mycraft-world-delete {

            width: 40px;

            height: 40px;

            border: 0;

            border-radius: 10px;

            background:
                rgba(
                    255,
                    70,
                    70,
                    .1
                );

            color:
                #ff8585;

            cursor: pointer;

        }


        .mycraft-world-empty {

            padding:
                60px 20px;

            text-align: center;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .4
                );

        }


        .mycraft-world-empty-icon {

            font-size: 48px;

            margin-bottom: 15px;

        }


        .mycraft-world-footer {

            padding: 16px;

            border-top:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

        }


        .mycraft-world-create {

            width: 100%;

            min-height: 52px;

            border: 0;

            border-radius: 13px;

            background:
                linear-gradient(
                    180deg,
                    #70d15d,
                    #4da53e
                );

            color: white;

            font-size: 15px;

            font-weight: 800;

            cursor: pointer;

        }


        .mycraft-world-create:hover {

            filter:
                brightness(1.08);

        }


        @media (
            max-width: 600px
        ) {

            .mycraft-world-card {

                align-items:
                    flex-start;

            }


            .mycraft-world-actions {

                flex-direction:
                    column;

            }


            .mycraft-world-play {

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
    СОЗДАНИЕ МЕНЮ
    =====================================================
    */

    function createMenu() {

        if (
            document.getElementById(
                "mycraft-world-menu"
            )
        ) {

            return;

        }


        const menu =
            document.createElement(
                "div"
            );


        menu.id =
            "mycraft-world-menu";


        menu.innerHTML = `

            <div
                class="mycraft-world-window"
            >

                <div
                    class="mycraft-world-header"
                >

                    <div
                        class="mycraft-world-title"
                    >
                        Одиночная игра
                    </div>


                    <button
                        id="mycraft-world-close"
                        class="mycraft-world-close"
                    >
                        ×
                    </button>

                </div>


                <div
                    id="mycraft-world-list"
                    class="mycraft-world-list"
                ></div>


                <div
                    class="mycraft-world-footer"
                >

                    <button
                        id="mycraft-world-create"
                        class="mycraft-world-create"
                    >
                        ＋ Создать новый мир
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            menu
        );


        document
            .getElementById(
                "mycraft-world-close"
            )
            .addEventListener(
                "click",
                close
            );


        document
            .getElementById(
                "mycraft-world-create"
            )
            .addEventListener(
                "click",
                createWorld
            );


        menu.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    menu
                ) {

                    close();

                }

            }
        );


        render();

    }


    /*
    =====================================================
    ОТРИСОВКА МИРОВ
    =====================================================
    */

    function render() {

        const list =
            document.getElementById(
                "mycraft-world-list"
            );


        if (!list) {

            return;

        }


        if (
            worlds.length === 0
        ) {

            list.innerHTML = `

                <div
                    class="mycraft-world-empty"
                >

                    <div
                        class="mycraft-world-empty-icon"
                    >
                        🌍
                    </div>

                    <div>
                        У тебя пока нет миров.
                    </div>

                    <div
                        style="
                            margin-top:8px;
                            font-size:12px;
                        "
                    >
                        Создай первый мир,
                        чтобы начать игру.
                    </div>

                </div>

            `;

            return;

        }


        list.innerHTML =
            worlds
                .map(
                    world => {

                        const date =
                            new Date(
                                world.createdAt
                            );


                        const dateText =
                            Number.isNaN(
                                date.getTime()
                            )
                                ? "Дата неизвестна"
                                : date.toLocaleString(
                                    "ru-RU"
                                  );


                        return `

                        <div
                            class="mycraft-world-card"
                            data-world-id="${escapeHTML(world.id)}"
                        >

                            <div
                                class="mycraft-world-icon"
                            >
                                🌳
                            </div>


                            <div
                                class="mycraft-world-info"
                            >

                                <div
                                    class="mycraft-world-name"
                                >
                                    ${escapeHTML(world.name)}
                                </div>


                                <div
                                    class="mycraft-world-meta"
                                >
                                    Создан:
                                    ${escapeHTML(dateText)}
                                </div>


                                <div
                                    class="mycraft-world-meta"
                                >
                                    Режим:
                                    ${escapeHTML(world.mode)}
                                </div>

                            </div>


                            <div
                                class="mycraft-world-actions"
                            >

                                <button
                                    class="mycraft-world-play"
                                    data-world-play="${escapeHTML(world.id)}"
                                >
                                    Играть
                                </button>


                                <button
                                    class="mycraft-world-delete"
                                    data-world-delete="${escapeHTML(world.id)}"
                                    title="Удалить мир"
                                >
                                    🗑
                                </button>

                            </div>

                        </div>

                        `;

                    }
                )
                .join("");


        list
            .querySelectorAll(
                "[data-world-play]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            play(
                                button.dataset.worldPlay
                            );

                        }
                    );

                }
            );


        list
            .querySelectorAll(
                "[data-world-delete]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            remove(
                                button.dataset.worldDelete
                            );

                        }
                    );

                }
            );

    }


    /*
    =====================================================
    СОЗДАНИЕ МИРА
    =====================================================
    */

    function createWorld() {

        if (
            worlds.length >=
            CONFIG.maxWorlds
        ) {

            alert(
                "Достигнут лимит миров."
            );

            return;

        }


        const name =
            prompt(
                "Название нового мира:",
                "Мой мир"
            );


        if (
            name === null
        ) {

            return;

        }


        const cleanName =
            name.trim();


        if (
            cleanName.length === 0
        ) {

            alert(
                "Название мира не может быть пустым."
            );

            return;

        }


        if (
            cleanName.length > 32
        ) {

            alert(
                "Название мира должно содержать не более 32 символов."
            );

            return;

        }


        const world = {

            id:
                "world_" +
                Date.now() +
                "_" +
                Math.random()
                    .toString(36)
                    .slice(2, 9),

            name:
                cleanName,

            mode:
                "Выживание",

            difficulty:
                "Обычная",

            createdAt:
                Date.now(),

            lastPlayed:
                null,

            seed:
                Math.floor(
                    Math.random() *
                    2147483647
                )

        };


        worlds.unshift(
            world
        );


        save();

        render();


        /*
        Сразу запускаем новый мир.
        */

        play(
            world.id
        );

    }


    /*
    =====================================================
    ЗАПУСК МИРА
    =====================================================
    */

    function play(id) {

        const world =
            worlds.find(
                item =>
                    item.id === id
            );


        if (!world) {

            return;

        }


        selectedWorld =
            world;


        world.lastPlayed =
            Date.now();


        save();


        console.log(
            "[MyCraftWorlds] " +
            "Выбран мир:",
            world
        );


        close();


        /*
        -------------------------------------------------
        ПЕРЕДАЧА В EAGLERCRAFT
        -------------------------------------------------

        Пока оставляем интерфейсный
        переход.

        Когда настоящий клиент будет
        подключён, здесь можно будет
        передавать параметры выбранного
        мира непосредственно клиенту.
        */


        if (
            window.MyCraftEagler &&
            typeof
                window.MyCraftEagler
                    .openWorld ===
                "function"
        ) {

            window.MyCraftEagler
                .openWorld(
                    world
                );

            return;

        }


        /*
        Пока показываем информацию.
        */

        alert(

            "Мир выбран: " +
            world.name +
            "\n\n" +

            "Seed: " +
            world.seed +
            "\n\n" +

            "Следующий этап — " +
            "подключение выбранного мира " +
            "к браузерному клиенту."

        );

    }


    /*
    =====================================================
    УДАЛЕНИЕ
    =====================================================
    */

    function remove(id) {

        const world =
            worlds.find(
                item =>
                    item.id === id
            );


        if (!world) {

            return;

        }


        const confirmed =
            confirm(

                'Удалить мир "' +
                world.name +
                '"?'

            );


        if (!confirmed) {

            return;

        }


        worlds =
            worlds.filter(
                item =>
                    item.id !== id
            );


        if (
            selectedWorld &&
            selectedWorld.id === id
        ) {

            selectedWorld =
                null;

        }


        save();

        render();

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
                "mycraft-world-menu"
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

    function close() {

        const menu =
            document.getElementById(
                "mycraft-world-menu"
            );


        if (menu) {

            menu.classList.remove(
                "active"
            );

        }

    }


    /*
    =====================================================
    GETTERS
    =====================================================
    */

    function getWorlds() {

        return worlds.map(
            world => ({
                ...world
            })
        );

    }


    function getSelectedWorld() {

        if (!selectedWorld) {

            return null;

        }


        return {
            ...selectedWorld
        };

    }


    /*
    =====================================================
    INIT
    =====================================================
    */

    function init() {

        createStyles();

        load();

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        init,

        open,

        close,

        create:
            createWorld,

        remove,

        play,

        getWorlds,

        getSelectedWorld

    };


})();


/*
=========================================================
 ГЛОБАЛЬНЫЙ API
=========================================================
*/

window.MyCraftWorlds =
    MyCraftWorlds;


/*
=========================================================
 ИНИЦИАЛИЗАЦИЯ
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        MyCraftWorlds.init();

    }
);
