/* =========================================================
   MOMO MTN | Digital Finance
   Shared scripts: mobile navigation + application storage
========================================================= */

(function () {
    'use strict';

    var STORAGE_KEY = 'momoMtnApplication';

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    function initMenu() {
        var toggle = document.getElementById('menuToggle');
        var nav = document.getElementById('navLinks');

        if (!toggle || !nav) {
            return;
        }

        var icon = toggle.querySelector('i');

        function closeMenu() {
            nav.classList.remove('active');

            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }

        toggle.addEventListener('click', function () {
            nav.classList.toggle('active');

            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
            link.addEventListener('click', closeMenu);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 600) {
                closeMenu();
            }
        });
    }

    /* =====================================================
       SHARED HELPERS
    ===================================================== */

    function money(value) {
        var amount = Number(value) || 0;

        return '$' + amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function readData() {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || null;
        } catch (error) {
            return null;
        }
    }

    function writeData(data) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            /* storage unavailable - the flow still works without it */
        }
    }

    function mergeData(data) {
        var current = readData() || {};
        var merged = {};

        Object.keys(current).forEach(function (key) {
            merged[key] = current[key];
        });

        Object.keys(data).forEach(function (key) {
            merged[key] = data[key];
        });

        writeData(merged);

        return merged;
    }

    function makeReference() {
        var now = new Date();
        var stamp = String(now.getFullYear()).slice(2) +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0');
        var random = '';

        for (var i = 0; i < 4; i++) {
            random += Math.floor(Math.random() * 10);
        }

        return 'MMT-' + stamp + '-' + random;
    }

    /* =====================================================
       BOOT
    ===================================================== */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }

    window.Momo = {
        storageKey: STORAGE_KEY,
        money: money,
        read: readData,
        write: writeData,
        merge: mergeData,
        makeReference: makeReference
    };
})();
