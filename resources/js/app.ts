import "./bootstrap";
import {AppWindow} from "./common/types";

import menu from "./UI/NavbarMenu";
import usermenu from "./UI/UserMenu";
import Modal from "./UI/Modal/Modal";
import ModalButton from "./UI/Modal/ModalButton";
import LoremIpsum from "./GameModes/LoremIpsum";
import Speedtest from "./GameModes/Speedtest";
import Game from "./Game/Game";

menu();

declare let window: AppWindow;

if (window.Laravel.user) {
    usermenu();
}

if (window.location.href.indexOf('?verified=1') > -1) {
    const modal = new Modal("Email verfied!")
    const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });

    modal.setContent('You have verified your email address successfuly. Thank You!');
    modal.setButtons([modalButton]);
}

window.initGame = (gamemode: string) => {
    switch(gamemode) {
        case "loremipsum":
            window.game = new Game();
            window.game.setGamemode(LoremIpsum);
            break;
        case "speedtest":
            window.game = new Game();
            window.game.setGamemode(Speedtest);
            break;
    }
}