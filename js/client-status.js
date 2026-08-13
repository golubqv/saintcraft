"use strict";

/*
=========================================================
 MYCRAFT — CLIENT STATUS
 Проверяет наличие браузерного клиента
 и показывает понятный статус загрузки.
=========================================================
*/

const MyCraftClientStatus = (() => {

    const CONFIG = {
        clientPath: "./client/classes.js",
        assetsPath: "./client/assets.epk",
        checkInterval: 500,
        maxChecks: 20
    };


    let checks = 0;


    function getElement(id) {
        return document.getElementById(id);
    }


    function setLoading(text) {

        const loading =
            getElement("loading");

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


    function setReady() {

        const loading =
            getElement("loading");

        if (!loading) {
            return;
        }


        loading.classList.add(
            "hidden"
        );

    }


    function showClientError(message) {

        const loading =
            getElement("loading");

        if (!loading) {
            return;
        }


        loading.classList.remove(
            "hidden"
        );


        const spinner =
            loading.querySelector(
                ".loader"
            );


        if (spinner) {

            spinner.style
