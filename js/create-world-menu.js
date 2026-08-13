"use strict";

/*
=========================================================
 MYCRAFT — CREATE WORLD MENU
=========================================================

Экран создания мира.

Возможности:

✓ название мира
✓ seed
✓ случайный seed
✓ выживание
✓ творческий режим
✓ приключение
✓ сложность
✓ читы
✓ создание через World Manager
✓ мобильная адаптация
=========================================================
*/

const MyCraftCreateWorldMenu = (() => {

    const state = {

        initialized: false,

        opened: false,

        creating: false

    };


    const listeners = {};


    /*
    =====================================================
    EVENTS
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
                        "[MyCraftCreateWorldMenu]",
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
            "mycraft-create-world-menu"
        );

    }


    /*
    =====================================================
    CREATE UI
    =====================================================
    */

    function createUI() {

        if (
            getElement()
        ) {

            return;

        }


        const game =
            document.getElementById(
                "game"
            );


        if (!game) {

            console.error(
                "[MyCraftCreateWorldMenu] " +
                "#game не найден."
            );

            return;

        }


        const element =
            document.createElement(
                "div"
            );


        element.id =
            "mycraft-create-world-menu";


        element.innerHTML = `

            <div
                class="mycraft-create-shell"
            >

                <div
                    class="mycraft-create-header"
                >

                    <button
                        id="mycraft-create-back"
                        class="mycraft-create-back"
                    >
                        ←
                    </button>


                    <div>

                        <div
                            class="mycraft-create-title"
                        >
                            Создать новый мир
                        </div>

                        <div
                            class="mycraft-create-subtitle"
                        >
                            Настрой свой мир
                        </div>

                    </div>

                </div>


                <div
                    class="mycraft-create-content"
                >

                    <!-- NAME -->

                    <section
                        class="mycraft-create-section"
                    >

                        <div
                            class="mycraft-create-label"
                        >
                            Название мира
                        </div>


                        <input
                            id="mycraft-world-name"
                            class="mycraft-create-input"
                            type="text"
                            maxlength="32"
                            value="Мой мир"
                            placeholder="Название мира"
                            autocomplete="off"
                        >

                    </section>


                    <!-- SEED -->

                    <section
                        class="mycraft-create-section"
                    >

                        <div
                            class="mycraft-create-label-row"
                        >

                            <div
                                class="mycraft-create-label"
                            >
                                Seed
                            </div>

                            <button
                                id="mycraft-random-seed"
                                class="mycraft-small-button"
                            >
                                Случайный
                            </button>

                        </div>


                        <input
                            id="mycraft-world-seed"
                            class="mycraft-create-input"
                            type="text"
                            maxlength="64"
                            placeholder="Оставь пустым для случайного"
                            autocomplete="off"
                        >


                        <div
                            class="mycraft-create-help"
                        >
                            Seed определяет генерацию мира.
                        </div>

                    </section>


                    <!-- GAME MODE -->

                    <section
                        class="mycraft-create-section"
                    >

                        <div
                            class="mycraft-create-label"
                        >
                            Режим игры
                        </div>


                        <div
                            id="mycraft-gamemode"
                            class="mycraft-option-grid"
                        >

                            <button
                                class="mycraft-option active"
                                data-mode="survival"
                            >

                                <span
                                    class="mycraft-option-icon"
                                >
                                    ⚔
                                </span>

                                <span>

                                    <b>
                                        Выживание
                                    </b>

                                    <small>
                                        Собирай ресурсы
                                    </small>

                                </span>

                            </button>


                            <button
                                class="mycraft-option"
                                data-mode="creative"
                            >

                                <span
                                    class="mycraft-option-icon"
                                >
                                    ✦
                                </span>

                                <span>

                                    <b>
                                        Творческий
                                    </b>

                                    <small>
                                        Строй без ограничений
                                    </small>

                                </span>

                            </button>


                            <button
                                class="mycraft-option"
                                data-mode="adventure"
                            >

                                <span
                                    class="mycraft-option-icon"
                                >
                                    🗺
                                </span>

                                <span>

                                    <b>
                                        Приключение
                                    </b>

                                    <small>
                                        Исследуй мир
                                    </small>

                                </span>

                            </button>

                        </div>

                    </section>


                    <!-- DIFFICULTY -->

                    <section
                        class="mycraft-create-section"
                    >

                        <div
                            class="mycraft-create-label"
                        >
                            Сложность
                        </div>


                        <div
                            id="mycraft-difficulty"
                            class="mycraft-difficulty-list"
                        >

                            <button
                                class="
                                    mycraft-difficulty-option
                                    active
                                "
                                data-difficulty="easy"
                            >

                                <span>
                                    Легко
                                </span>

                                <small>
                                    Меньше опасности
                                </small>

                            </button>


                            <button
                                class="
                                    mycraft-difficulty-option
                                    active-normal
                                "
                                data-difficulty="normal"
                            >

                                <span>
                                    Нормально
                                </span>

                                <small>
                                    Стандартная игра
                                </small>

                            </button>


                            <button
                                class="
                                    mycraft-difficulty-option
                                "
                                data-difficulty="hard"
                            >

                                <span>
                                    Сложно
                                </span>

                                <small>
                                    Больше опасности
                                </small>

                            </button>

                        </div>

                    </section>


                    <!-- CHEATS -->

                    <section
                        class="mycraft-create-section"
                    >

                        <div
                            class="mycraft-toggle-row"
                        >

                            <div>

                                <div
                                    class="mycraft-toggle-title"
                                >
                                    Читы
                                </div>

                                <div
                                    class="mycraft-toggle-description"
                                >
                                    Разрешить команды
                                    в этом мире
                                </div>

                            </div>


                            <button
                                id="mycraft-cheats-toggle"
                                class="mycraft-toggle"
                                aria-pressed="false"
                            >

                                <span></span>

                            </button>

                        </div>

                    </section>


                    <!-- SUMMARY -->

                    <section
                        class="mycraft-create-summary"
                    >

                        <div
                            class="mycraft-summary-icon"
                        >
                            🌍
                        </div>


                        <div>

                            <div
                                id="mycraft-summary-name"
                                class="mycraft-summary-title"
                            >
                                Мой мир
                            </div>

                            <div
                                id="mycraft-summary-info"
                                class="mycraft-summary-info"
                            >
                                Выживание · Нормально
                            </div>

                        </div>

                    </section>


                    <!-- CREATE -->

                    <button
                        id="mycraft-create-button"
                        class="mycraft-create-main-button"
                    >

                        Создать мир

                    </button>


                    <div
                        id="mycraft-create-error"
                        class="mycraft-create-error"
                    ></div>

                </div>

            </div>

        `;


        game.appendChild(
            element
        );


        createStyles();

        bindEvents();

        updateSummary();


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
                "mycraft-create-world-style"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "mycraft-create-world-style";


        style.textContent = `

        #mycraft-create-world-menu {

            position: absolute;

            inset: 0;

            z-index: 90;

            display: none;

            overflow: hidden;

            background:
                radial-gradient(
                    circle at 50% -20%,
                    rgba(
                        92,
                        189,
                        77,
                        .14
                    ),
                    transparent 45%
                ),
                #111;

            color: white;

            font-family:
                Inter,
                Arial,
                sans-serif;

        }


        #mycraft-create-world-menu.active {

            display: block;

        }


        .mycraft-create-shell {

            width: 100%;

            height: 100%;

            display: flex;

            flex-direction: column;

        }


        .mycraft-create-header {

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
                    10,
                    10,
                    10,
                    .78
                );

            backdrop-filter:
                blur(18px);

        }


        .mycraft-create-back {

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


        .mycraft-create-title {

            font-size: 20px;

            font-weight: 800;

        }


        .mycraft-create-subtitle {

            margin-top: 3px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .4
                );

            font-size: 12px;

        }


        .mycraft-create-content {

            width:
                min(
                    100%,
                    720px
                );

            margin:
                0 auto;

            padding:
                24px;

            overflow-y: auto;

            box-sizing:
                border-box;

        }


        .mycraft-create-section {

            margin-bottom: 23px;

        }


        .mycraft-create-label-row {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 10px;

        }


        .mycraft-create-label {

            margin-bottom: 9px;

            font-size: 13px;

            font-weight: 800;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .78
                );

        }


        .mycraft-create-input {

            width: 100%;

            height: 48px;

            box-sizing:
                border-box;

            padding:
                0 14px;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .08
                );

            outline: none;

            border-radius: 12px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .055
                );

            color: white;

            font-size: 14px;

        }


        .mycraft-create-input:focus {

            border-color:
                rgba(
                    92,
                    189,
                    77,
                    .7
                );

            background:
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

        }


        .mycraft-create-help {

            margin-top: 7px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .32
                );

            font-size: 11px;

        }


        .mycraft-small-button {

            min-height: 32px;

            padding:
                0 10px;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .08
                );

            border-radius: 9px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .055
                );

            color:
                rgba(
                    255,
                    255,
                    255,
                    .7
                );

            cursor: pointer;

        }


        .mycraft-small-button:hover {

            background:
                rgba(
                    255,
                    255,
                    255,
                    .1
                );

        }


        .mycraft-option-grid {

            display: grid;

            grid-template-columns:
                repeat(
                    3,
                    1fr
                );

            gap: 9px;

        }


        .mycraft-option {

            min-height: 100px;

            display: flex;

            flex-direction: column;

            align-items: flex-start;

            justify-content: center;

            gap: 9px;

            padding:
                13px;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

            border-radius: 13px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .045
                );

            color: white;

            text-align: left;

            cursor: pointer;

        }


        .mycraft-option:hover {

            background:
                rgba(
                    255,
                    255,
                    255,
                    .075
                );

        }


        .mycraft-option.active {

            border-color:
                rgba(
                    92,
                    189,
                    77,
                    .7
                );

            background:
                rgba(
                    92,
                    189,
                    77,
                    .1
                );

        }


        .mycraft-option-icon {

            font-size: 22px;

        }


        .mycraft-option b {

            display: block;

            font-size: 13px;

        }


        .mycraft-option small {

            display: block;

            margin-top: 4px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .38
                );

            font-size: 10px;

            line-height: 1.3;

        }


        .mycraft-difficulty-list {

            display: grid;

            grid-template-columns:
                repeat(
                    3,
                    1fr
                );

            gap: 9px;

        }


        .mycraft-difficulty-option {

            min-height: 67px;

            display: flex;

            flex-direction: column;

            justify-content: center;

            padding:
                10px 12px;

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
                    .045
                );

            color: white;

            text-align: left;

            cursor: pointer;

        }


        .mycraft-difficulty-option.active {

            border-color:
                rgba(
                    92,
                    189,
                    77,
                    .7
                );

            background:
                rgba(
                    92,
                    189,
                    77,
                    .1
                );

        }


        .mycraft-difficulty-option span {

            font-size: 13px;

            font-weight: 800;

        }


        .mycraft-difficulty-option small {

            margin-top: 4px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .36
                );

            font-size: 10px;

        }


        .mycraft-toggle-row {

            min-height: 70px;

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 20px;

            padding:
                14px;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .07
                );

            border-radius: 13px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .045
                );

        }


        .mycraft-toggle-title {

            font-size: 14px;

            font-weight: 800;

        }


        .mycraft-toggle-description {

            margin-top: 4px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .35
                );

            font-size: 11px;

        }


        .mycraft-toggle {

            position: relative;

            width: 52px;

            height: 30px;

            flex-shrink: 0;

            border: 0;

            border-radius: 30px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .13
                );

            cursor: pointer;

            transition:
                .2s ease;

        }


        .mycraft-toggle span {

            position: absolute;

            top: 4px;

            left: 4px;

            width: 22px;

            height: 22px;

            border-radius: 50%;

            background: white;

            transition:
                .2s ease;

        }


        .mycraft-toggle.active {

            background:
                #5cbd4d;

        }


        .mycraft-toggle.active span {

            left: 26px;

        }


        .mycraft-create-summary {

            display: flex;

            align-items: center;

            gap: 13px;

            padding:
                14px;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .06
                );

            border-radius: 13px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .035
                );

        }


        .mycraft-summary-icon {

            width: 48px;

            height: 48px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 12px;

            background:
                linear-gradient(
                    145deg,
                    #65c451,
                    #286d2d
                );

            font-size: 24px;

        }


        .mycraft-summary-title {

            font-size: 14px;

            font-weight: 800;

        }


        .mycraft-summary-info {

            margin-top: 4px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    .4
                );

            font-size: 11px;

        }


        .mycraft-create-main-button {

            width: 100%;

            height: 52px;

            margin-top: 16px;

            border: 0;

            border-radius: 13px;

            background:
                #5cbd4d;

            color: white;

            font-size: 15px;

            font-weight: 800;

            cursor: pointer;

        }


        .mycraft-create-main-button:hover {

            filter:
                brightness(1.08);

        }


        .mycraft-create-main-button:disabled {

            opacity: .5;

            cursor:
                not-allowed;

        }


        .mycraft-create-error {

            min-height: 20px;

            margin-top: 10px;

            color:
                #ff8989;

            font-size: 12px;

            text-align: center;

            white-space:
                pre-line;

        }


        @media (
            max-width: 600px
        ) {

            .mycraft-create-content {

                padding:
                    18px 12px 30px;

            }


            .mycraft-option-grid {

                grid-template-columns:
                    1fr;

            }


            .mycraft-option {

                min-height:
                    70px;

                flex-direction:
                    row;

                align-items:
                    center;

            }


            .mycraft-difficulty-list {

                grid-template-columns:
                    1fr;

            }

        }

        `;


        document.head.appendChild(
            style
        );

    }


    /*
    =====================================================
    VALUES
    =====================================================
    */

    function getValue(
        id
    ) {

        const element =
            document.getElementById(
                id
            );


        return element
            ? element.value
            : "";

    }


    function getSelectedMode() {

        const active =
            document.querySelector(
                "#mycraft-gamemode " +
                ".mycraft-option.active"
            );


        return active
            ? active.dataset.mode
            : "survival";

    }


    function getSelectedDifficulty() {

        const active =
            document.querySelector(
                "#mycraft-difficulty " +
                ".mycraft-difficulty-option.active"
            );


        return active
            ? active.dataset.difficulty
            : "normal";

    }


    function getCheats() {

        const toggle =
            document.getElementById(
                "mycraft-cheats-toggle"
            );


        return Boolean(
            toggle &&
            toggle.classList.contains(
                "active"
            )
        );

    }


    /*
    =====================================================
    SUMMARY
    =====================================================
    */

    function updateSummary() {

        const name =
            getValue(
                "mycraft-world-name"
            ) ||
            "Мой мир";


        const mode =
            getSelectedMode();


        const difficulty =
            getSelectedDifficulty();


        const modeNames = {

            survival:
                "Выживание",

            creative:
                "Творческий",

            adventure:
                "Приключение"

        };


        const difficultyNames = {

            easy:
                "Легко",

            normal:
                "Нормально",

            hard:
                "Сложно"

        };


        const summaryName =
            document.getElementById(
                "mycraft-summary-name"
            );


        const summaryInfo =
            document.getElementById(
                "mycraft-summary-info"
            );


        if (
            summaryName
        ) {

            summaryName.textContent =
                name;

        }


        if (
            summaryInfo
        ) {

            summaryInfo.textContent =
                `${modeNames[mode]} · ` +
                `${difficultyNames[difficulty]}`;

        }

    }


    /*
    =====================================================
    RANDOM SEED
    =====================================================
    */

    function generateSeed() {

        const input =
            document.getElementById(
                "mycraft-world-seed"
            );


        if (!input) {
            return;
        }


        /*
        Генерируем seed только
        как идентификатор настройки.

        Фактическая генерация мира
        должна выполняться игровым клиентом.
        */

        let seed;


        if (
            window.crypto &&
            crypto.getRandomValues
        ) {

            const values =
                new Uint32Array(
                    4
                );


            crypto.getRandomValues(
                values
            );


            seed =
                Array.from(
                    values
                )
                    .map(
                        value =>
                            value.toString(36)
                    )
                    .join("");

        }
        else {

            seed =
                Math.floor(
                    Math.random() *
                    Number.MAX_SAFE_INTEGER
                ).toString();

        }


        input.value =
            seed;

    }


    /*
    =====================================================
    SELECT GAME MODE
    =====================================================
    */

    function selectGameMode(
        button
    ) {

        const buttons =
            document.querySelectorAll(
                "#mycraft-gamemode " +
                ".mycraft-option"
            );


        buttons.forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


        button.classList.add(
            "active"
        );


        updateSummary();

    }


    /*
    =====================================================
    SELECT DIFFICULTY
    =====================================================
    */

    function selectDifficulty(
        button
    ) {

        const buttons =
            document.querySelectorAll(
                "#mycraft-difficulty " +
                ".mycraft-difficulty-option"
            );


        buttons.forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


        button.classList.add(
            "active"
        );


        updateSummary();

    }


    /*
    =====================================================
    TOGGLE CHEATS
    =====================================================
    */

    function toggleCheats() {

        const toggle =
            document.getElementById(
                "mycraft-cheats-toggle"
            );


        if (!toggle) {
            return;
        }


        const active =
            toggle.classList.toggle(
                "active"
            );


        toggle.setAttribute(
            "aria-pressed",
            String(
                active
            )
        );

    }


    /*
    =====================================================
    CREATE
    =====================================================
    */

    async function createWorld() {

        if (
            state.creating
        ) {

            return;

        }


        const manager =
            window.MyCraftWorldManager;


        if (!manager) {

            showError(
                "World Manager не подключён."
            );

            return;

        }


        const name =
            getValue(
                "mycraft-world-name"
            )
                .trim();


        const seed =
            getValue(
                "mycraft-world-seed"
            )
                .trim();


        const gameMode =
            getSelectedMode();


        const difficulty =
            getSelectedDifficulty();


        const cheats =
            getCheats();


        /*
        -------------------------------------------------
        VALIDATION
        -------------------------------------------------
        */

        if (!name) {

            showError(
                "Введите название мира."
            );

            return;

        }


        if (
            name.length >
            32
        ) {

            showError(
                "Название не должно превышать 32 символа."
            );

            return;

        }


        /*
        -------------------------------------------------
        LOCK UI
        -------------------------------------------------
        */

        state.creating =
            true;


        const button =
            document.getElementById(
                "mycraft-create-button"
            );


        if (
            button
        ) {

            button.disabled =
                true;

            button.textContent =
                "Создание мира...";

        }


        clearError();


        try {

            const world =
                await manager.create({

                    name,

                    seed,

                    gameMode,

                    difficulty,

                    cheats

                });


            emit(
                "created",
                world
            );


            /*
            ---------------------------------------------
            Возвращаемся к списку миров
            ---------------------------------------------
            */

            close();


            if (
                window.MyCraftSingleplayerMenu
            ) {

                await MyCraftSingleplayerMenu.open();

            }


            /*
            Автоматически выбираем
            только что созданный мир.
            */

            if (
                window.MyCraftSingleplayerMenu
            ) {

                await MyCraftSingleplayerMenu
                    .selectWorld(
                        world.id
                    );

            }

        }
        catch (error) {

            console.error(
                "[MyCraftCreateWorldMenu]",
                error
            );


            showError(
                error.message ||
                "Не удалось создать мир."
            );

        }
        finally {

            state.creating =
                false;


            if (
                button
            ) {

                button.disabled =
                    false;

                button.textContent =
                    "Создать мир";

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

        const element =
            document.getElementById(
                "mycraft-create-error"
            );


        if (
            element
        ) {

            element.textContent =
                message ||
                "";

        }

    }


    function clearError() {

        showError(
            ""
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
                "mycraft-create-back"
            );


        if (
            back
        ) {

            back.addEventListener(
                "click",
                close
            );

        }


        const randomSeed =
            document.getElementById(
                "mycraft-random-seed"
            );


        if (
            randomSeed
        ) {

            randomSeed.addEventListener(
                "click",
                generateSeed
            );

        }


        const modes =
            document.querySelectorAll(
                "#mycraft-gamemode " +
                ".mycraft-option"
            );


        modes.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        selectGameMode(
                            button
                        );

                    }
                );

            }
        );


        const difficulties =
            document.querySelectorAll(
                "#mycraft-difficulty " +
                ".mycraft-difficulty-option"
            );


        difficulties.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        selectDifficulty(
                            button
                        );

                    }
                );

            }
        );


        const cheats =
            document.getElementById(
                "mycraft-cheats-toggle"
            );


        if (
            cheats
        ) {

            cheats.addEventListener(
                "click",
                toggleCheats
            );

        }


        const nameInput =
            document.getElementById(
                "mycraft-world-name"
            );


        if (
            nameInput
        ) {

            nameInput.addEventListener(
                "input",
                updateSummary
            );

        }


        const create =
            document.getElementById(
                "mycraft-create-button"
            );


        if (
            create
        ) {

            create.addEventListener(
                "click",
                createWorld
            );

        }


        /*
        Enter → создать мир
        */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    !state.opened
                ) {

                    return;

                }


                if (
                    event.key ===
                    "Enter"
                ) {

                    const active =
                        document.activeElement;


                    if (
                        active &&
                        active.tagName ===
                        "TEXTAREA"
                    ) {

                        return;

                    }


                    createWorld();

                }

            }
        );

    }


    /*
    =====================================================
    OPEN
    =====================================================
    */

    function open() {

        createUI();


        const element =
            getElement();


        if (!element) {
            return;
        }


        state.opened =
            true;


        element.classList.add(
            "active"
        );


        clearError();


        const name =
            document.getElementById(
                "mycraft-world-name"
            );


        if (
            name
        ) {

            name.focus();

        }


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

        const element =
            getElement();


        if (
            element
        ) {

            element.classList.remove(
                "active"
            );

        }


        state.opened =
            false;


        state.creating =
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
    PUBLIC API
    =====================================================
    */

    return {

        init,

        open,

        close,

        createWorld,

        generateSeed,

        on

    };

})();


/*
=========================================================
GLOBAL
=========================================================
*/

window.MyCraftCreateWorldMenu =
    MyCraftCreateWorldMenu;


/*
=========================================================
INIT
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        MyCraftCreateWorldMenu.init();

    }
);
