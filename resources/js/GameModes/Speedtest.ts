import { TEST_MODE } from "../TypingField/TypingField";
import Modal from "../UI/Modal/Modal";
import ModalButton from "../UI/Modal/ModalButton";
import Gamemode from "./Gamemode";

export default class Speedtest extends Gamemode {
    constructor(text: string) {
        super(text, TEST_MODE.TIME_MODE, 60);

        this.name = "Speed Test";
        this.description = "Classical speed test. Try how fast you type."
    }

    onGameStart() {
        console.log("Game has started");
    }

    async onGameEnd(data: any) {
        const modal = new Modal('Congrats!');
        modal.setContent(`You have finished this test with speed of ${data.speed} WPM`);
        const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });
        modal.setButtons([modalButton]);
        modal.show();
        console.log(data);

        // const result = new Result(data.speed, data.correctness, 'speedtest', data.words);
        // const resultManager = new ResultManager();

        // if (await resultManager.save(result)) {
        //     console.log('saved!');
        // } else {
        //     console.log('error while saving!');
        // }
    }

    onGameBreak(data: any) {
        const modal = new Modal('STOP!');
        modal.setContent(`Stop hiting your keyboard!`);
        const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });
        modal.setButtons([modalButton]);
        modal.show();
    }
}