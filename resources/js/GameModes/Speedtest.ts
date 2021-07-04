import { TEST_MODE } from "../TypingField/TypingField";
import Modal from "../UI/Modal/Modal";
import ModalButton from "../UI/Modal/ModalButton";
import Gamemode from "./Gamemode";


/**
 * Speedtest gamemode class
 */
export default class Speedtest extends Gamemode {

    /**
     * Creates an instance of speedtest.
     * @param text Text to type
     */
    constructor(text: string) {
        super(text, TEST_MODE.TIME_MODE, 60);

        this.name = "Speed Test";
        this.description = "Classical speed test. Try how fast you type."
    }

    /**
     * @inheritdoc
     */
    onGameStart() {
        console.log("Game has started");
    }

    /**
     * @inheritdoc
     */
    async onGameEnd(data: any) {
        const modal = new Modal('Congrats!');
        modal.setContent(`You have finished this test with speed of ${data.speed} WPM`);
        const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });
        modal.setButtons([modalButton]);
        modal.show();

        console.log(data);
    }

    /**
     * @inheritdoc
     */
    onGameBreak(data: any) {
        const modal = new Modal('STOP!');
        modal.setContent(`Stop hiting your keyboard!`);
        const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });
        modal.setButtons([modalButton]);
        modal.show();
    }
}