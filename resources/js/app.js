require('./bootstrap');

import axios from "axios";
import menu from "./menu";
import LoremIpsum from "./gamemodes/LoremIpsum";
import usermenu from "./usermenu";
import Modal from "./modal";
import Speedtest from "./gamemodes/Speedtest";

menu();

if (Laravel.user) {
    usermenu();
}

export const showSpinner = () => {
    document.querySelector('.spinner').classList.remove('spinner--hide');
}

export const hideSpinner = () => {
    document.querySelector('.spinner').classList.add('spinner--hide');
}

if (window.location.href.indexOf('?verified=1') > -1) {
    const modal = new Modal('Email verified!')
            .setContent(`You have verified your email address successfuly. Thank You!`)
            .setButtons([{text: 'Close', classList: ['button', 'button--primary', 'button--outline'], action: () => {
                modal.hide()
            }}])
            .show();
}


window.initGame = (gamemode) =>  {
    showSpinner();
    switch(gamemode) {
        case "loremipsum":
            axios.get(window.location.href + '/text').then(response => {
                window.game = new LoremIpsum(response.data.text);
                hideSpinner();
            });
            break;
        case "speedtest":
            axios.get(window.location.href + '/text').then(response => {
                window.game = new Speedtest(response.data.text);
                hideSpinner();
            });
            break;
    }
}
