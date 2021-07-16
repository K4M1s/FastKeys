import { GameEndData, GameResult } from "../common/types";
import Result from "../ResultManager/Result";
import ResultManager from "../ResultManager/ResultManager";
import Modal from "../UI/Modal/Modal";
import ModalButton from "../UI/Modal/ModalButton";
import Gamemode from "./Gamemode";


/**
 * Lorem ipsum gamemode class
 */
export default class LoremIpsum extends Gamemode {

    /**
     * Creates an instance of lorem ipsum.
     * @param text Text to type.
     */
    constructor(text: string) {
        super(text, "Lorem Ipsum", "Try typing non existing words for better accuracy and muscle memory.");
    }

    /**
     * @inheritdoc
     */
    public onGameStart() {
        console.log("Game has started");
    }

    /**
     * @inheritdoc
     */
    public onGameEnd(data: GameEndData) {
        const modal = new Modal('Congrats!');
        modal.setContent(`You have finished this test with speed of ${data.speed} WPM`);
        const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });
        modal.setButtons([modalButton]);
        modal.show();
        
        console.log(this);

        const result = new Result(data.speed, data.accuracy, data.typos, this.name, data.originalText, data.words, data.startTime.getTime(), data.endTime.getTime());

        ResultManager.save(result).then(console.log);
    }

    /**
     * @inheritdoc
     */
    public onGameBreak(data: any) {
        const modal = new Modal('STOP!');
        modal.setContent(`Stop hiting your keyboard!`);
        const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });
        modal.setButtons([modalButton]);
        modal.show();
    }
}