import "./bootstrap";
import {AppWindow} from "./common/types";

import axios from "axios";
import menu from "./UI/NavbarMenu";
import usermenu from "./UI/UserMenu";
import Modal from "./UI/Modal/Modal";
import ModalButton from "./UI/Modal/ModalButton";
import LoremIpsum from "./GameModes/LoremIpsum";
import Speedtest from "./GameModes/Speedtest";

menu();

declare let window: AppWindow;

if (window.Laravel.user) {
    usermenu();
}

export const showSpinner = () => {
    document.querySelector('.spinner')?.classList.remove('spinner--hide');
}

export const hideSpinner = () => {
    document.querySelector('.spinner')?.classList.add('spinner--hide');
}

if (window.location.href.indexOf('?verified=1') > -1) {
    const modal = new Modal("Email verfied!")
    const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });

    modal.setContent('You have verified your email address successfuly. Thank You!');
    modal.setButtons([modalButton]);
}

window.initGame = (gamemode: string) => {
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
