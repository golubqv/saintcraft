"use strict";

/*
=========================================================
 MYCRAFT — WORLD MANAGER
=========================================================

Локальный менеджер миров.

Возможности:

✓ создание мира
✓ список миров
✓ переименование
✓ удаление
✓ выбор мира
✓ сохранение метаданных
✓ IndexedDB
✓ резервная работа через localStorage

ВАЖНО:

Этот модуль хранит МЕТАДАННЫЕ миров.

Он не является реализацией Minecraft
и не заменяет систему сохранения конкретного
Eaglercraft-клиента.
=========================================================
*/


const MyCraftWorldManager = (() => {


    /*
    =====================================================
    CONFIG
    =====================================================
    */

    const CONFIG = {

        database:
            "mycraft_worlds",

        version:
            1,

        store:
            "worlds",

        localStorage:
            "mycraft_world_list"

    };


    /*
    =====================================================
    STATE
    =====================================================
    */

    const state = {

        initialized:
            false,

        database:
            null,

        worlds:
            [],

        selected:
            null

    };


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
                        "[MyCraftWorldManager]",
                        error
                    );

                }

            }
        );

    }


    /*
    =====================================================
    ID
    =====================================================
    */

    function createId() {

        if (
            typeof crypto !==
            "undefined" &&
            typeof crypto.randomUUID ===
            "function"
        ) {

            return crypto.randomUUID();

        }


        return (
            Date.now().toString(36) +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );

    }


    /*
    =====================================================
    DATE
    =====================================================
    */

    function now() {

        return Date.now();

    }


    /*
    =====================================================
    NORMALIZE
    =====================================================
    */

    function normalizeWorld(
        world
    ) {

        if (
            !world
        ) {

            return null;

        }


        return {

            id:
                String(
                    world.id ||
                    createId()
                ),

            name:
                String(
                    world.name ||
                    "Новый мир"
                ),

            seed:
                world.seed !== undefined
                    ? String(
                        world.seed
                    )
                    : "",

            gameMode:
                world.gameMode ||
                "survival",

            difficulty:
                world.difficulty ||
                "normal",

            cheats:
                Boolean(
                    world.cheats
                ),

            createdAt:
                Number(
                    world.createdAt ||
                    now()
                ),

            updatedAt:
                Number(
                    world.updatedAt ||
                    now()
                ),

            lastPlayed:
                Number(
                    world.lastPlayed ||
                    0
                ),

            playTime:
                Number(
                    world.playTime ||
                    0
                ),

            version:
                String(
                    world.version ||
                    "1.0"
                ),

            icon:
                world.icon ||
                "grass",

            favorite:
                Boolean(
                    world.favorite
                )

        };

    }


    /*
    =====================================================
    OPEN DATABASE
    =====================================================
    */

    function openDatabase() {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                if (
                    !("indexedDB" in window)
                ) {

                    reject(
                        new Error(
                            "IndexedDB не поддерживается."
                        )
                    );

                    return;

                }


                const request =
                    indexedDB.open(
                        CONFIG.database,
                        CONFIG.version
                    );


                request.onupgradeneeded =
                    event => {

                        const database =
                            event.target.result;


                        if (
                            !database.objectStoreNames
                                .contains(
                                    CONFIG.store
                                )
                        ) {

                            const store =
                                database.createObjectStore(
                                    CONFIG.store,
                                    {
                                        keyPath:
                                            "id"
                                    }
                                );


                            store.createIndex(
                                "updatedAt",
                                "updatedAt",
                                {
                                    unique:
                                        false
                                }
                            );


                            store.createIndex(
                                "name",
                                "name",
                                {
                                    unique:
                                        false
                                }
                            );

                        }

                    };


                request.onsuccess =
                    event => {

                        state.database =
                            event.target.result;


                        resolve(
                            state.database
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error ||
                            new Error(
                                "Не удалось открыть IndexedDB."
                            )
                        );

                    };

            }
        );

    }


    /*
    =====================================================
    FALLBACK
    =====================================================
    */

    function loadFallback() {

        try {

            const raw =
                localStorage.getItem(
                    CONFIG.localStorage
                );


            if (!raw) {

                return [];

            }


            const parsed =
                JSON.parse(
                    raw
                );


            if (
                !Array.isArray(parsed)
            ) {

                return [];

            }


            return parsed.map(
                normalizeWorld
            );

        }
        catch {

            return [];

        }

    }


    function saveFallback(
        worlds
    ) {

        try {

            localStorage.setItem(
                CONFIG.localStorage,
                JSON.stringify(
                    worlds
                )
            );


            return true;

        }
        catch {

            return false;

        }

    }


    /*
    =====================================================
    GET ALL
    =====================================================
    */

    async function getAll() {

        if (
            !state.database
        ) {

            return loadFallback();

        }


        return new Promise(
            (
                resolve,
                reject
            ) => {

                const transaction =
                    state.database.transaction(
                        [
                            CONFIG.store
                        ],
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        CONFIG.store
                    );


                const request =
                    store.getAll();


                request.onsuccess =
                    () => {

                        const worlds =
                            Array.isArray(
                                request.result
                            )
                                ? request.result
                                    .map(
                                        normalizeWorld
                                    )
                                : [];


                        worlds.sort(
                            (
                                a,
                                b
                            ) =>
                                b.updatedAt -
                                a.updatedAt
                        );


                        resolve(
                            worlds
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error ||
                            new Error(
                                "Не удалось получить миры."
                            )
                        );

                    };

            }
        );

    }


    /*
    =====================================================
    GET
    =====================================================
    */

    async function get(
        id
    ) {

        if (!id) {

            return null;

        }


        if (
            !state.database
        ) {

            return state.worlds.find(
                world =>
                    world.id ===
                    String(id)
            ) || null;

        }


        return new Promise(
            (
                resolve,
                reject
            ) => {

                const transaction =
                    state.database.transaction(
                        [
                            CONFIG.store
                        ],
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        CONFIG.store
                    );


                const request =
                    store.get(
                        String(id)
                    );


                request.onsuccess =
                    () => {

                        resolve(
                            request.result
                                ? normalizeWorld(
                                    request.result
                                )
                                : null
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    }


    /*
    =====================================================
    SAVE
    =====================================================
    */

    async function save(
        world
    ) {

        const normalized =
            normalizeWorld(
                world
            );


        if (!normalized) {

            throw new Error(
                "Некорректный мир."
            );

        }


        normalized.updatedAt =
            now();


        if (
            !normalized.createdAt
        ) {

            normalized.createdAt =
                now();

        }


        /*
        -------------------------------------------------
        INDEXED DB
        -------------------------------------------------
        */

        if (
            state.database
        ) {

            await new Promise(
                (
                    resolve,
                    reject
                ) => {

                    const transaction =
                        state.database.transaction(
                            [
                                CONFIG.store
                            ],
                            "readwrite"
                        );


                    const store =
                        transaction.objectStore(
                            CONFIG.store
                        );


                    const request =
                        store.put(
                            normalized
                        );


                    request.onsuccess =
                        () => {

                            resolve();

                        };


                    request.onerror =
                        () => {

                            reject(
                                request.error ||
                                new Error(
                                    "Не удалось сохранить мир."
                                )
                            );

                        };

                }
            );

        }


        /*
        -------------------------------------------------
        MEMORY
        -------------------------------------------------
        */

        const index =
            state.worlds.findIndex(
                item =>
                    item.id ===
                    normalized.id
            );


        if (
            index === -1
        ) {

            state.worlds.push(
                normalized
            );

        }
        else {

            state.worlds[index] =
                normalized;

        }


        /*
        -------------------------------------------------
        FALLBACK
        -------------------------------------------------
        */

        saveFallback(
            state.worlds
        );


        emit(
            "saved",
            normalized
        );


        emit(
            "changed",
            state.worlds
        );


        return normalized;

    }


    /*
    =====================================================
    CREATE
    =====================================================
    */

    async function create(
        options = {}
    ) {

        const world =
            normalizeWorld({

                id:
                    createId(),

                name:
                    options.name ||
                    "Новый мир",

                seed:
                    options.seed ||
                    "",

                gameMode:
                    options.gameMode ||
                    "survival",

                difficulty:
                    options.difficulty ||
                    "normal",

                cheats:
                    options.cheats ||
                    false,

                createdAt:
                    now(),

                updatedAt:
                    now(),

                lastPlayed:
                    0,

                playTime:
                    0,

                version:
                    "1.0",

                icon:
                    options.icon ||
                    "grass",

                favorite:
                    false

            });


        const saved =
            await save(
                world
            );


        emit(
            "created",
            saved
        );


        return saved;

    }


    /*
    =====================================================
    UPDATE
    =====================================================
    */

    async function update(
        id,
        changes = {}
    ) {

        const world =
            await get(
                id
            );


        if (!world) {

            throw new Error(
                "Мир не найден."
            );

        }


        const updated =
            normalizeWorld({

                ...world,

                ...changes,

                id:
                    world.id,

                updatedAt:
                    now()

            });


        return save(
            updated
        );

    }


    /*
    =====================================================
    RENAME
    =====================================================
    */

    async function rename(
        id,
        name
    ) {

        const cleanName =
            String(
                name || ""
            )
                .trim();


        if (
            cleanName.length ===
            0
        ) {

            throw new Error(
                "Название мира не может быть пустым."
            );

        }


        if (
            cleanName.length >
            32
        ) {

            throw new Error(
                "Название мира слишком длинное."
            );

        }


        return update(
            id,
            {
                name:
                    cleanName
            }
        );

    }


    /*
    =====================================================
    DELETE
    =====================================================
    */

    async function remove(
        id
    ) {

        if (!id) {

            return false;

        }


        if (
            state.database
        ) {

            await new Promise(
                (
                    resolve,
                    reject
                ) => {

                    const transaction =
                        state.database.transaction(
                            [
                                CONFIG.store
                            ],
                            "readwrite"
                        );


                    const store =
                        transaction.objectStore(
                            CONFIG.store
                        );


                    const request =
                        store.delete(
                            String(id)
                        );


                    request.onsuccess =
                        () => {

                            resolve();

                        };


                    request.onerror =
                        () => {

                            reject(
                                request.error
                            );

                        };

                }
            );

        }


        state.worlds =
            state.worlds.filter(
                world =>
                    world.id !==
                    String(id)
            );


        if (
            state.selected ===
            String(id)
        ) {

            state.selected =
                null;

        }


        saveFallback(
            state.worlds
        );


        emit(
            "deleted",
            String(id)
        );


        emit(
            "changed",
            state.worlds
        );


        return true;

    }


    /*
    =====================================================
    SELECT
    =====================================================
    */

    async function select(
        id
    ) {

        const world =
            await get(
                id
            );


        if (!world) {

            throw new Error(
                "Мир не найден."
            );

        }


        state.selected =
            world.id;


        emit(
            "selected",
            world
        );


        return world;

    }


    /*
    =====================================================
    GET SELECTED
    =====================================================
    */

    async function getSelected() {

        if (
            !state.selected
        ) {

            return null;

        }


        return get(
            state.selected
        );

    }


    /*
    =====================================================
    MARK PLAYED
    =====================================================
    */

    async function markPlayed(
        id
    ) {

        return update(
            id,
            {
                lastPlayed:
                    now()
            }
        );

    }


    /*
    =====================================================
    ADD PLAY TIME
    =====================================================
    */

    async function addPlayTime(
        id,
        milliseconds
    ) {

        const world =
            await get(
                id
            );


        if (!world) {

            return null;

        }


        const amount =
            Number(
                milliseconds
            );


        if (
            !Number.isFinite(
                amount
            ) ||
            amount < 0
        ) {

            return world;

        }


        return update(
            id,
            {
                playTime:
                    world.playTime +
                    amount,

                lastPlayed:
                    now()
            }
        );

    }


    /*
    =====================================================
    FAVORITE
    =====================================================
    */

    async function toggleFavorite(
        id
    ) {

        const world =
            await get(
                id
            );


        if (!world) {

            return null;

        }


        return update(
            id,
            {
                favorite:
                    !world.favorite
            }
        );

    }


    /*
    =====================================================
    SEARCH
    =====================================================
    */

    function search(
        query
    ) {

        const text =
            String(
                query || ""
            )
                .trim()
                .toLowerCase();


        if (!text) {

            return [
                ...state.worlds
            ];

        }


        return state.worlds.filter(
            world =>
                world.name
                    .toLowerCase()
                    .includes(
                        text
                    )
        );

    }


    /*
    =====================================================
    INITIALIZE
    =====================================================
    */

    async function init() {

        if (
            state.initialized
        ) {

            return state.worlds;

        }


        state.initialized =
            true;


        try {

            await openDatabase();

            state.worlds =
                await getAll();

        }
        catch (error) {

            console.warn(
                "[MyCraftWorldManager]",
                "IndexedDB недоступна.",
                error
            );


            state.worlds =
                loadFallback();

        }


        /*
        Синхронизируем fallback.
        */

        saveFallback(
            state.worlds
        );


        emit(
            "ready",
            state.worlds
        );


        return state.worlds;

    }


    /*
    =====================================================
    EXPORT
    =====================================================
    */

    async function exportWorld(
        id
    ) {

        const world =
            await get(
                id
            );


        if (!world) {

            throw new Error(
                "Мир не найден."
            );

        }


        return JSON.stringify(
            {
                type:
                    "mycraft-world",

                version:
                    1,

                exportedAt:
                    now(),

                world

            },
            null,
            2
        );

    }


    /*
    =====================================================
    IMPORT
    =====================================================
    */

    async function importWorld(
        json
    ) {

        let data;


        try {

            if (
                typeof json ===
                "string"
            ) {

                data =
                    JSON.parse(
                        json
                    );

            }
            else {

                data =
                    json;

            }

        }
        catch {

            throw new Error(
                "Файл мира повреждён."
            );

        }


        if (
            !data ||
            data.type !==
                "mycraft-world" ||
            !data.world
        ) {

            throw new Error(
                "Это не файл мира MyCraft."
            );

        }


        const world =
            normalizeWorld({

                ...data.world,

                id:
                    createId(),

                createdAt:
                    now(),

                updatedAt:
                    now()

            });


        return save(
            world
        );

    }


    /*
    =====================================================
    GET ALL WORLDS
    =====================================================
    */

    function getWorlds() {

        return [
            ...state.worlds
        ];

    }


    /*
    =====================================================
    PUBLIC API
    =====================================================
    */

    return {

        init,

        on,

        get,

        getAll,

        getWorlds,

        getSelected,

        create,

        save,

        update,

        rename,

        remove,

        select,

        markPlayed,

        addPlayTime,

        toggleFavorite,

        search,

        exportWorld,

        importWorld,

        getState() {

            return {

                initialized:
                    state.initialized,

                worlds:
                    [
                        ...state.worlds
                    ],

                selected:
                    state.selected

            };

        }

    };

})();


/*
=========================================================
GLOBAL
=========================================================
*/

window.MyCraftWorldManager =
    MyCraftWorldManager;


/*
=========================================================
AUTO INIT
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            await MyCraftWorldManager.init();


            console.log(
                "[MyCraftWorldManager]",
                "Миры загружены:",
                MyCraftWorldManager
                    .getWorlds()
                    .length
            );

        }
        catch (error) {

            console.error(
                "[MyCraftWorldManager]",
                error
            );

        }

    }
);
