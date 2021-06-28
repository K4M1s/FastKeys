import Gamemode from "../Gamemode";
import Modal from "../modal";
import Result from "../ResultManager/Result";
import ResultManager from "../ResultManager/ResultManager";
import { TYPING_FIELD_TEST_MODE } from "../typingField";

export default class Speedtest extends Gamemode {
    constructor(text) {
        super(text, TYPING_FIELD_TEST_MODE.TIME_MODE, 60);

        this.name = "Speed Test";
        this.description = "Classical speed test. Try how fast you type."
    }

    onGameStart() {
        console.log("Game has started");
    }

    async onGameEnd(data) {
        const modal = new Modal('Congrats!')
            .setContent(`You have finished this test with speed of ${data.speed} WPM`)
            .setButtons([{text: 'Close', classList: ['button', 'button--primary', 'button--outline'], action: () => {
                modal.hide()
            }}])
            .show();
        console.log(data);

        const result = new Result(data.speed, data.correctness, 'speedtest', data.words);
        const resultManager = new ResultManager();

        if (await resultManager.save(result)) {
            console.log('saved!');
        } else {
            console.log('error while saving!');
        }
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