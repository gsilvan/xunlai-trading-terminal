// ==UserScript==
// @name         Xunlai Trading Terminal
// @namespace    https://github.com/gsilvan/xunlai-trading-terminal
// @version      1.0.0
// @description  Turn Kamadan Trade Chat into a Xunlai Trading Terminal
// @match        https://kamadan.gwtoolbox.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        :root {
            --main-bg-color: #010409;
            --main-text-color: #f0f6fc;
        }

        * {
            color: var(--main-text-color) !important;
            font: 12px monospace !important;
        }

        body, button, #footer, #nav, #results-header, .row, #search-input, #trader-overlay, #trader-overlay[selected-tab=common-materials] .trader-table-tab[selected-tab=common-materials]  {
            background: var(--main-bg-color) !important;
        }

        table, td, tr {
            border: unset !important;
        }

        .background_image_container {
            display: none !important;
        }

        .info {
            flex-direction: row !important;
            width: 250px;
            flex-basis: unset !important;
            gap: 5px !important;
            padding: 0 !important;
        }

        .my-iso-time {
            color: #888 !important;
            font-size: 10px !important;
            display: block;
            width: 100%;
        }

        .name {
            font-weight: bold !important;
            color: green !important;
            display: block;
        }

        .age {
            display: none !important;
        }

        #home-text {
            font-size: 18px !important;
            font-weight: bold !important;
        }

        #nav, #results-header {
             border: none !important;
        }

        #trader-summary {
          border: 2px dotted white !important;
          border-radius: 0 !important;
        }

        #trader-overlay, .trader-table-tab {
            border: 3px solid white !important;
            border-radius: 0 !important;
        }

        #search-input {
            border: 2px solid white !important;
            border-radius: 0 !important;
        }

        #search-input:hover {
            border-color: white !important;
        }

        #search-input:focus {
            border-color: white !important;
            box-shadow: unset !important;
        }

        .center-row {
            margin: unset !important;
        }
    `);

    function changeStaticElements() {
        const homeText = document.getElementById("home-text");
        if (homeText) {
            homeText.textContent = "Xunlai Trading Terminal";
            homeText.style.visibility = "visible";
        }

        const traderPrices = document.getElementById("trader-prices");
        if (traderPrices) {
            const description = document.createElement("div");
            description.textContent = "Commodity Market"
            traderPrices.prepend(description);
        }
    }

    function injectCustomTimestamps() {
        const ageElements = document.querySelectorAll('.age');

        ageElements.forEach(ageEl => {
            const parentInfo = ageEl.closest('.info');

            if (parentInfo && !parentInfo.querySelector('.my-iso-time')) {
                const rawTs = ageEl.getAttribute('data-timestamp');

                if (rawTs) {
                    const dateObj = new Date(Number(rawTs));
                    // Format: YYYY-MM-DD HH:MM:SS
                    const isoString = dateObj.toISOString().replace('T', ' ').split('.')[0];

                    const newTime = document.createElement('div');
                    newTime.className = 'my-iso-time';
                    newTime.textContent = isoString;
                    parentInfo.prepend(newTime);
                }
            }
        });
    }

    const observer = new MutationObserver(injectCustomTimestamps);

    window.addEventListener('load', () => {
        changeStaticElements();
        injectCustomTimestamps();
        const target = document.getElementById('current-wrapper') || document.body;
        observer.observe(target, {childList: true, subtree: true});
    });

})();
