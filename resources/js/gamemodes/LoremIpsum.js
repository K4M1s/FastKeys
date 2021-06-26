import Gamemode from "../Gamemode";
import Modal from "../modal";

export default class LoremIpsum extends Gamemode {
    constructor(text) {
        super(text);
    }

    onGameStart() {
        console.log("Game has started");
    }

    onGameEnd(data) {
        const modal = new Modal('Congrats!')
            .setContent(`You have finished this test with speed of ${data.speed} WPM`)
            .setButtons([{text: 'Close', classList: ['button', 'button--primary', 'button--outline'], action: () => {
                modal.hide()
            }}])
            .show();
        console.log(data);
    }

    onGameBreak(data) {
        const modal = new Modal('STOP!')
            .setContent(`Stop hiting your keyboard!`)
            .setButtons([{text: 'Close', classList: ['button', 'button--danger', 'button--outline'], action: () => {
                modal.hide()
            }}])
            .show();
    }
}