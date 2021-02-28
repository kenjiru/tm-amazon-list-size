// ==UserScript==
// @name         Amazon: Wish list height
// @namespace    http://kenjiru.ro
// @version      0.1
// @description  Bigger wish list when moving an item.
// @author       Kenjiru
// @require      https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @match        https://www.amazon.de/*/wishlist/genericItemsPage*
// @match        https://www.amazon.de/*/en/dp*
// @license       MIT
// @license       GPL-3.0-or-later
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var DESIRED_HEIGHT = '800px';

    console.debug('Extension loaded!');

    function handleWishlistNodeAdded(targetNode) {
        var isScriptSettingStyle = false;
        console.debug('wishlist element matched!', targetNode);

        var handleMutation = function (mutationsList, observer) {
            mutationsList.forEach(function (mutation) {
                if (mutation.type !== 'attributes' || mutation.attributeName !== 'style') {
                    return;
                }

                if (isScriptSettingStyle === false && mutation.oldValue.indexOf('height: auto') > -1) {
                    targetNode.style.height = DESIRED_HEIGHT;

                    isScriptSettingStyle = true;
                } else {
                    isScriptSettingStyle = false;
                }
            });
        };

        var mutationObserver = new MutationObserver(handleMutation);

        var mutationConfig = {
            attributes: true,
            attributeOldValue: true,
        };

        mutationObserver.observe(targetNode, mutationConfig);

        setTimeout(function () {
            isScriptSettingStyle = true;
            targetNode.style.height = DESIRED_HEIGHT;
        }, 500);
    }

    function handlePageNodeAdded(targetNode) {
        console.debug('page element matched!', targetNode);

        targetNode.style.maxHeight = DESIRED_HEIGHT;
    }

    if (document.location.href.indexOf('wishlist') > -1) {
        document.arrive('.a-popover .a-popover-inner', handleWishlistNodeAdded);
    } else {
        document.arrive('.a-popover #atwl-popover-inner', handlePageNodeAdded);
    }
})();
