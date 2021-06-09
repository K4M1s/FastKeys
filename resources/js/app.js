require('./bootstrap');
import axios from "axios";
import LoremIpsum from "./gamemodes/LoremIpsum";

export const showSpinner = () => {
    document.querySelector('.spinner').classList.remove('spinner--hide');
}

export const hideSpinner = () => {
    document.querySelector('.spinner').classList.add('spinner--hide');
}


window.initGame = (gamemode) =>  {
    showSpinner();
    switch(gamemode) {
        case "loremipsum":
            axios.get('/text/lorem/100').then(response => {
                window.game = new LoremIpsum(response.data.text);
                hideSpinner();
            });
            break;
    }
}