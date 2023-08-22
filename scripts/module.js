// SPDX-FileCopyrightText: 2020 Cody Swendrowski
//
// SPDX-License-Identifier: MIT

import JourneyDrawer from "./JourneyDrawer.js";

Hooks.once('init', async function () {
    CONFIG.debug.hooks = true

});

Hooks.once('ready', async function () {

});
Hooks.on('renderTor2eJourneyLogSheet', function (journeySheet, buttons) {
    createCanvas(journeySheet);

});
function createCanvas(journeySheet) {
    let html = journeySheet.element[0];

    let img = html.querySelector('#path img');
    let container = img.parentNode;
    container.classList.add('journey-canvas-container')
    container.style.position = "relative";



    let pixiApp = new JourneyDrawer({
        background: 'black',
        resizeTo: container
    },
        journeySheet.object
    );
    let canvas = pixiApp.view;
    canvas.classList.add('journey-canvas')

    container.append(canvas);
    img.classList.add('unused')

    if (game.user.isGM) {
        let editBut = document.createElement('a');
        editBut.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        editBut.addEventListener('click', () => {
            pixiApp.toggleEditMode()
        });

        let imgBut = document.createElement('a');
        imgBut.innerHTML = '<i class="fa-solid fa-image"></i>'
        imgBut.addEventListener('click', () => {
            img.click()
        });
        let clearBut = document.createElement('a');
        clearBut.innerHTML = '<i class="fas fa-trash"></i>'
        clearBut.addEventListener('click', () => {
            pixiApp.clearPath()
        });
        let undoBut = document.createElement('a');
        undoBut.innerHTML = '<i class="fa-solid fa-undo"></i>'
        undoBut.addEventListener('click', () => {
            pixiApp.undoPath()
        });
        let controlDiv = document.createElement('DIV');
        controlDiv.append(imgBut, editBut, undoBut, clearBut);
        controlDiv.classList.add('control')
        container.append(controlDiv);
    }

}
