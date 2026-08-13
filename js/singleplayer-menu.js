"use strict";

/*
=========================================================
 MYCRAFT — SINGLEPLAYER MENU
=========================================================

Экран:

    Одиночная игра

Возможности:

✓ список миров
✓ создание мира
✓ выбор мира
✓ запуск мира
✓ переименование
✓ удаление
✓ избранные миры
✓ поиск
✓ адаптация под телефон
✓ подключение к MyCraftEagler
=========================================================
*/

const MyCraftSingleplayerMenu = (() => {

    const state = {

        initialized: false,

        opened: false,

        selectedWorld: null,

        search: ""

    };


    const listeners = {};


    function on(event, callback) {

        if (
            typeof callback !== "function"
        ) {
            return;
        }

        if (!listeners[event]) {
            listeners[event] = [];
        }

        listeners[event].push(callback);

    }


    function emit(event, data) {

        if (!listeners[event]) {
            return;
        }

        listeners[event].forEach(
            callback => {

                try {
                    callback(data);
                }
                catch (error) {
                    console.error(
                        "[MyCraftSingleplayerMenu]",
                        error
                    );
                }

            }
        );

    }


    /*
    =====================================================
    ELEMENT
    =====================================================
    */

    function getElement() {

        return document.getElementById(
            "mycraft-singleplayer-menu"
        );

    }


    /*
    =====================================================
    CREATE UI
    =====================================================
    */

    function createUI() {

        if (getElement()) {
            return;
        }


        const game =
            document.getElementById("game");


        if (!game) {

            console.error(
                "[MyCraftSingleplayerMenu] #game не найден."
            );

            return;
        }


        const menu =
            document.createElement("div");


        menu.id =
            "mycraft-singleplayer-menu";


        menu.innerHTML = `

            <div class="mycraft-sp-shell">

                <div class="mycraft-sp-header">

                    <button
                        id="mycraft-sp-back"
                        class="mycraft-sp-icon-button"
                        aria-label="Назад"
                    >
                        ←
                    </button>


                    <div class="mycraft-sp-title-area">

                        <div class="mycraft-sp-title">
                            Одиночная игра
                        </div>

                        <div
                            id="mycraft-sp-count"
                            class="mycraft-sp-subtitle"
                        >
                            0 миров
                        </div>

                    </div>


                    <button
                        id="mycraft-sp-create"
                        class="mycraft-sp-create-button"
                    >
                        + Новый мир
                    </button>

                </div>


                <div class="mycraft-sp-toolbar">

                    <div class="mycraft-sp-search">

                        <span>⌕</span>

                        <input
                            id="mycraft-sp-search-input"
                            type="text"
                            placeholder="Поиск миров..."
                            autocomplete="off"
                        >

                    </div>

                </div>


                <div
                    id="mycraft-sp-worlds"
                    class="mycraft-sp-worlds"
                ></div>


                <div
                    id="mycraft-sp-empty"
                    class="mycraft-sp-empty"
                >

                    <div class="mycraft-sp-empty-icon">
                        ⛏
                    </div>

                    <div class="mycraft-sp-empty-title">
                        Миры ещё не созданы
                    </div>

                    <div class="mycraft-sp-empty-text">
                        Создай свой первый мир
                        и начни игру.
                    </div>

                    <button
                        id="mycraft-sp-empty-create"
                        class="mycraft-sp-main-button"
                    >
                        Создать новый мир
                    </button>

                </div>

            </div>

        `;


        game.appendChild(menu);


        createStyles();

        bindEvents();

        state.initialized =
            true;

    }


    /*
    =====================================================
    STYLES
    =====================================================
    */

    function createStyles() {

        if (
            document.getElementById(
                "mycraft-singleplayer-style"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "mycraft-singleplayer-style";


        style.textContent = `

        #mycraft-singleplayer-menu {

            position: absolute;

            inset: 0;

            z-index: 80;

            display: none;

            overflow: hidden;

            background:
                radial-gradient(
                    circle at 50% -20%,
                    rgba(92, 183, 77, .13),
                    transparent 45%
                ),
                #111;

            color: white;

            font-family:
                Inter,
                Arial,
                sans-serif;

        }


        #mycraft-singleplayer-menu.active {

            display: block;

        }


        .mycraft-sp-shell {

            width: 100%;

            height: 100%;

            display: flex;

            flex-direction: column;

        }


        .mycraft-sp-header {

            min-height: 72px;

            display: flex;

            align-items: center;

            gap: 14px;

            padding:
                12px 18px;

            border-bottom:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

            background:
                rgba(
                    12,
                    12,
                    12,
                    .75
                );

            backdrop-filter:
                blur(18px);

        }


        .mycraft-sp-icon-button {

            width: 44px;

            height: 44px;

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

            font-size: 23px;

            cursor: pointer;

        }


        .mycraft-sp-icon-button:hover {

            background:
                rgba(
                    255,
                    255,
                    255,
                    .12
                );

        }


        .mycraft-sp-title-area {

            flex: 1;

            min-width: 0;

        }


        .mycraft-sp-title {

            font-size: 20px;

            font-weight: 800;

        }


        .mycraft-sp-subtitle {

            margin-top: 3px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .42
                );

            font-size: 12px;

        }


        .mycraft-sp-create-button {

            min-height: 42px;

            padding:
                0 17px;

            border: 0;

            border-radius: 11px;

            background:
                #5cbd4d;

            color: white;

            font-weight: 800;

            cursor: pointer;

        }


        .mycraft-sp-create-button:hover {

            filter:
                brightness(1.08);

        }


        .mycraft-sp-toolbar {

            padding:
                15px 18px 5px;

        }


        .mycraft-sp-search {

            width: 100%;

            max-width: 600px;

            height: 44px;

            display: flex;

            align-items: center;

            gap: 10px;

            padding:
                0 14px;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

            border-radius: 12px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .055
                );

        }


        .mycraft-sp-search span {

            font-size: 21px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .4
                );

        }


        .mycraft-sp-search input {

            flex: 1;

            min-width: 0;

            height: 100%;

            border: 0;

            outline: 0;

            background: transparent;

            color: white;

            font-size: 14px;

        }


        .mycraft-sp-search input::placeholder {

            color:
                rgba(
                    255,
                    255,
                    255,
                    .3
                );

        }


        .mycraft-sp-worlds {

            flex: 1;

            overflow-y: auto;

            padding:
                14px 18px 30px;

        }


        .mycraft-sp-worlds::-webkit-scrollbar {

            width: 7px;

        }


        .mycraft-sp-worlds::-webkit-scrollbar-thumb {

            border-radius: 10px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .12
                );

        }


        .mycraft-world-card {

            width: 100%;

            min-height: 100px;

            display: flex;

            align-items: center;

            gap: 14px;

            margin-bottom: 10px;

            padding: 12px;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .06
                );

            border-radius: 15px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .045
                );

            transition:
                .18s ease;

            cursor: pointer;

        }


        .mycraft-world-card:hover {

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


        .mycraft-world-card.selected {

            border-color:
                rgba(
                    92,
                    189,
                    77,
                    .65
                );

            background:
                rgba(
                    92,
                    189,
                    77,
                    .08
                );

        }


        .mycraft-world-icon {

            width: 72px;

            height: 72px;

            flex-shrink: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 12px;

            background:
                linear-gradient(
                    145deg,
                    #64c451,
                    #27732b
                );

            box-shadow:
                inset 0 -12px 0
                rgba(
                    0,
                    0,
                    0,
                    .15
                );

            font-size: 31px;

        }


        .mycraft-world-info {

            flex: 1;

            min-width: 0;

        }


        .mycraft-world-name {

            font-size: 16px;

            font-weight: 800;

            overflow: hidden;

            text-overflow: ellipsis;

            white-space: nowrap;

        }


        .mycraft-world-details {

            margin-top: 5px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .42
                );

            font-size: 12px;

        }


        .mycraft-world-actions {

            display: flex;

            align-items: center;

            gap: 6px;

        }


        .mycraft-world-action {

            width: 38px;

            height: 38px;

            border: 0;

            border-radius: 10px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .06
                );

            color: white;

            cursor: pointer;

        }


        .mycraft-world-action:hover {

            background:
                rgba(
                    255,
                    255,
                    255,
                    .12
                );

        }


        .mycraft-world-action.play {

            background:
                #5cbd4d;

        }


        .mycraft-world-action.delete:hover {

            background:
                rgba(
                    220,
                    70,
                    70,
                    .25
                );

        }


        .mycraft-sp-empty {

            position: absolute;

            inset: 130px 20px 20px;

            display: none;

            align-items: center;

            justify-content: center;

            flex-direction: column;

            text-align: center;

        }


        .mycraft-sp-empty.active {

            display: flex;

        }


        .mycraft-sp-empty-icon {

            width: 76px;

            height: 76px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 20px;

            background:
                rgba(
                    92,
                    189,
                    77,
                    .1
                );

            font-size: 34px;

        }


        .mycraft-sp-empty-title {

            margin-top: 17px;

            font-size: 20px;

            font-weight: 800;

        }


        .mycraft-sp-empty-text {

            max-width: 340px;

            margin-top: 8px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .42
                );

            line-height: 1.5;

            font-size: 13px;

        }


        .mycraft-sp-main-button {

            margin-top: 20px;

            min-height: 45px;

            padding:
                0 22px;

            border: 0;

            border-radius: 11px;

            background:
                #5cbd4d;

            color: white;

            font-weight: 800;

            cursor: pointer;

        }


        @media (
            max-width: 600px
        ) {

            .mycraft-sp-header {

                padding:
                    10px;

            }


            .mycraft-sp-toolbar {

                padding:
                    10px 10px 3px;

            }


            .mycraft-sp-worlds {

                padding:
                    10px 10px 25px;

            }


            .mycraft-sp-create-button {

                width: 42px;

                padding: 0;

                font-size: 0;

            }


            .mycraft-sp-create-button::after {

                content: "+";

                font-size: 22px;

            }


            .mycraft-world-icon {

                width: 58px;

                height: 58px;

            }


            .mycraft-world-actions {

                flex-direction: column;

            }

        }

        `;


        document.head.appendChild(
            style
        );

    }


    /*
    =====================================================
    FORMAT DATE
    =====================================================
    */

    function formatDate(
        timestamp
    ) {

        if (!timestamp) {

            return "Никогда";

        }


        const date =
            new Date(
                timestamp
            );


        return date.toLocaleDateString(
            "ru-RU",
            {
                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"
            }
        );

    }


    /*
    =====================================================
    FORMAT PLAY TIME
    =====================================================
    */

    function formatPlayTime(
        milliseconds
    ) {

        const seconds =
            Math.floor(
                Number(
                    milliseconds || 0
                ) / 1000
            );


        if (
            seconds < 60
        ) {

            return "0 мин.";

        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        if (
            minutes < 60
        ) {

            return `${minutes} мин.`;

        }


        const hours =
            Math.floor(
                minutes / 60
            );


        return `${hours} ч.`;

    }


    /*
    =====================================================
    GAME MODE
    =====================================================
    */

    function getGameModeName(
        mode
    ) {

        const modes = {

            survival:
                "Выживание",

            creative:
                "Творческий",

            adventure:
                "Приключение",

            spectator:
                "Наблюдатель"

        };


        return (
            modes[mode] ||
            mode ||
            "Выживание"
        );

    }


    /*
    =====================================================
    RENDER
    =====================================================
    */

    function render() {

        const container =
            document.getElementById(
                "mycraft-sp-worlds"
            );


        const empty =
            document.getElementById(
                "mycraft-sp-empty"
            );


        const count =
            document.getElementById(
                "mycraft-sp-count"
            );


        if (
            !container ||
            !empty
        ) {

            return;

        }


        const manager =
            window.MyCraftWorldManager;


        if (!manager) {

            container.innerHTML = "";

            empty.classList.add(
                "active"
            );

            return;

        }


        let worlds =
            manager.getWorlds();


        /*
        SEARCH
        */

        if (
            state.search
        ) {

            worlds =
                manager.search(
                    state.search
                );

        }


        /*
        COUNT
        */

        const total =
            manager
                .getWorlds()
                .length;


        if (
            count
        ) {

            count.textContent =
                `${total} ${
                    total === 1
                        ? "мир"
                        : "миров"
                }`;

        }


        /*
        EMPTY
        */

        if (
            worlds.length === 0
        ) {

            container.innerHTML = "";

            empty.classList.add(
                "active"
            );

            return;

        }


        empty.classList.remove(
            "active"
        );


        /*
        WORLD CARDS
        */

        container.innerHTML =
            worlds
                .map(
                    world =>
                        createWorldCard(
                            world
                        )
                )
                .join(
                    ""
                );


        bindWorldCards();

    }


    /*
    =====================================================
    WORLD CARD
    =====================================================
    */

    function createWorldCard(
        world
    ) {

        const selected =
            state.selectedWorld ===
            world.id
                ? "selected"
                : "";


        const favorite =
            world.favorite
                ? " ★"
                : "";


        return `

        <div
            class="
                mycraft-world-card
                ${selected}
            "
            data-world-id="${escapeHtml(
                world.id
            )}"
        >

            <div
                class="mycraft-world-icon"
            >
                🌿
            </div>


            <div
                class="mycraft-world-info"
            >

                <div
                    class="mycraft-world-name"
                >
                    ${escapeHtml(
                        world.name
                    )}
                    ${favorite}
                </div>


                <div
                    class="mycraft-world-details"
                >

                    ${escapeHtml(
                        getGameModeName(
                            world.gameMode
                        )
                    )}

                    ·

                    ${escapeHtml(
                        world.difficulty ||
                        "normal"
                    )}

                    ·

                    Играл:
                    ${formatDate(
                        world.lastPlayed
                    )}

                    ·

                    ${formatPlayTime(
                        world.playTime
                    )}

                </div>

            </div>


            <div
                class="mycraft-world-actions"
            >

                <button
                    class="
                        mycraft-world-action
                        play
                    "
                    data-action="play"
                    data-id="${escapeHtml(
                        world.id
                    )}"
                    title="Играть"
                >
                    ▶
                </button>


                <button
                    class="
                        mycraft-world-action
                    "
                    data-action="favorite"
                    data-id="${escapeHtml(
                        world.id
                    )}"
                    title="Избранное"
                >
                    ${world.favorite ? "★" : "☆"}
                </button>


                <button
                    class="
                        mycraft-world-action
                    "
                    data-action="rename"
                    data-id="${escapeHtml(
                        world.id
                    )}"
                    title="Переименовать"
                >
                    ✎
                </button>


                <button
                    class="
                        mycraft-world-action
                        delete
                    "
                    data-action="delete"
                    data-id="${escapeHtml(
                        world.id
                    )}"
                    title="Удалить"
                >
                    ×
                </button>

            </div>

        </div>

        `;

    }


    /*
    =====================================================
    ESCAPE
    =====================================================
    */

    function escapeHtml(
        value
    ) {

        return String(
            value ?? ""
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


    /*
    =====================================================
    WORLD EVENTS
    =====================================================
    */

    function bindWorldCards() {

        const cards =
            document.querySelectorAll(
                ".mycraft-world-card"
            );


        cards.forEach(
            card => {

                card.addEventListener(
                    "click",
                    event => {

                        const button =
                            event.target.closest(
                                "[data-action]"
                            );


                        const id =
                            card.dataset.worldId;


                        if (
                            button
                        ) {

                            handleAction(
                                button.dataset.action,
                                button.dataset.id
                            );

                            return;

                        }


                        selectWorld(
                            id
                        );

                    }
                );

            }
        );

    }


    /*
    =====================================================
    ACTION
    =====================================================
    */

    async function handleAction(
        action,
        id
    ) {

        const manager =
            window.MyCraftWorldManager;


        if (!manager) {
            return;
        }


        if (
            action ===
            "play"
        ) {

            await playWorld(
                id
            );

            return;

        }


        if (
            action ===
            "favorite"
        ) {

            await manager.toggleFavorite(
                id
            );

            render();

            return;

        }


        if (
            action ===
            "rename"
        ) {

            await renameWorld(
                id
            );

            return;

        }


        if (
            action ===
            "delete"
        ) {

            await deleteWorld(
                id
            );

        }

    }


    /*
    =====================================================
    SELECT
    =====================================================
    */

    async function selectWorld(
        id
    ) {

        const manager =
            window.MyCraftWorldManager;


        if (!manager) {
            return;
        }


        try {

            const world =
                await manager.select(
                    id
                );


            state.selectedWorld =
                world.id;


            render();


            emit(
                "selected",
                world
            );

        }
        catch (error) {

            console.error(
                error
            );

        }

    }


    /*
    =====================================================
    PLAY
    =====================================================
    */

    async function playWorld(
        id
    ) {

        const manager =
            window.MyCraftWorldManager;


        if (!manager) {

            alert(
                "World Manager не подключён."
            );

            return;

        }


        try {

            const world =
                await manager.select(
                    id
                );


            state.selectedWorld =
                world.id;


            await manager.markPlayed(
                world.id
            );


            emit(
                "play",
                world
            );


            /*
            ---------------------------------------------
            Запускаем игровой клиент
            ---------------------------------------------
            */

            if (
                window.MyCraftEagler
            ) {

                await MyCraftEagler.openWorld(
                    world
                );

            }
            else {

                console.warn(
                    "[MyCraftSingleplayerMenu] " +
                    "MyCraftEagler не подключён."
                );

            }

        }
        catch (error) {

            console.error(
                "[MyCraftSingleplayerMenu]",
                error
            );

            alert(
                error.message ||
                "Не удалось открыть мир."
            );

        }

    }


    /*
    =====================================================
    CREATE WORLD
    =====================================================
    */

    async function createWorld() {

        const name =
            prompt(
                "Название нового мира:",
                "Мой мир"
            );


        if (
            name ===
            null
        ) {

            return;

        }


        const cleanName =
            name.trim();


        if (
            !cleanName
        ) {

            alert(
                "Введите название мира."
            );

            return;

        }


        const manager =
            window.MyCraftWorldManager;


        if (!manager) {

            alert(
                "World Manager не подключён."
            );

            return;

        }


        try {

            const world =
                await manager.create({

                    name:
                        cleanName,

                    gameMode:
                        "survival",

                    difficulty:
                        "normal",

                    cheats:
                        false

                });


            state.selectedWorld =
                world.id;


            render();


            emit(
                "created",
                world
            );

        }
        catch (error) {

            console.error(
                error
            );

            alert(
                error.message ||
                "Не удалось создать мир."
            );

        }

    }


    /*
    =====================================================
    RENAME
    =====================================================
    */

    async function renameWorld(
        id
    ) {

        const manager =
            window.MyCraftWorldManager;


        if (!manager) {
            return;
        }


        const world =
            await manager.get(
                id
            );


        if (!world) {
            return;
        }


        const name =
            prompt(
                "Новое название:",
                world.name
            );


        if (
            name ===
            null
        ) {

            return;

        }


        try {

            await manager.rename(
                id,
                name
            );


            render();

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }


    /*
    =====================================================
    DELETE
    =====================================================
    */

    async function deleteWorld(
        id
    ) {

        const manager =
            window.MyCraftWorldManager;


        if (!manager) {
            return;
        }


        const world =
            await manager.get(
                id
            );


        if (!world) {
            return;
        }


        const confirmed =
            confirm(
                `Удалить мир "${world.name}"?\n\n` +
                "Это действие нельзя отменить."
            );


        if (!confirmed) {

            return;

        }


        try {

            await manager.remove(
                id
            );


            if (
                state.selectedWorld ===
                id
            ) {

                state.selectedWorld =
                    null;

            }


            render();


            emit(
                "deleted",
                id
            );

        }
        catch (error) {

            alert(
                error.message ||
                "Не удалось удалить мир."
            );

        }

    }


    /*
    =====================================================
    SEARCH
    =====================================================
    */

    function bindSearch() {

        const input =
            document.getElementById(
                "mycraft-sp-search-input"
            );


        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            event => {

                state.search =
                    event.target.value;


                render();

            }
        );

    }


    /*
    =====================================================
    EVENTS
    =====================================================
    */

    function bindEvents() {

        const back =
            document.getElementById(
                "mycraft-sp-back"
            );


        const create =
            document.getElementById(
                "mycraft-sp-create"
            );


        const emptyCreate =
            document.getElementById(
                "mycraft-sp-empty-create"
            );


        if (back) {

            back.addEventListener(
                "click",
                () => {

                    close();

                }
            );

        }


        if (create) {

            create.addEventListener(
                "click",
                createWorld
            );

        }


        if (emptyCreate) {

            emptyCreate.addEventListener(
                "click",
                createWorld
            );

        }


        bindSearch();


        /*
        World Manager changes
        */

        if (
            window.MyCraftWorldManager
        ) {

            MyCraftWorldManager.on(
                "changed",
                () => {

                    render();

                }
            );

            MyCraftWorldManager.on(
                "created",
                () => {

                    render();

                }
            );

            MyCraftWorldManager.on(
                "deleted",
                () => {

                    render();

                }
            );

        }

    }


    /*
    =====================================================
    OPEN
    =====================================================
    */

    async function open() {

        createUI();


        const menu =
            getElement();


        if (!menu) {
            return;
        }


        state.opened =
            true;


        menu.classList.add(
            "active"
        );


        /*
        Убеждаемся, что менеджер миров
        уже инициализирован.
        */

        if (
            window.MyCraftWorldManager
        ) {

            await MyCraftWorldManager.init();

        }


        render();


        emit(
            "opened"
        );

    }


    /*
    =====================================================
    CLOSE
    =====================================================
    */

    function close() {

        const menu =
            getElement();


        if (
            menu
        ) {

            menu.classList.remove(
                "active"
            );

        }


        state.opened =
            false;


        emit(
            "closed"
        );

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


        createUI();

    }


    /*
    =====================================================
    PUBLIC
    =====================================================
    */

    return {

        init,

        open,

        close,

        render,

        createWorld,

        playWorld,

        selectWorld,

        on

    };

})();


/*
=========================================================
GLOBAL
=========================================================
*/

window.MyCraftSingleplayerMenu =
    MyCraftSingleplayerMenu;


/*
=========================================================
INIT
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        MyCraftSingleplayerMenu.init();

    }
);
