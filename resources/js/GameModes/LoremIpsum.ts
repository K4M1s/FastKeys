import Modal from "../UI/Modal/Modal";
import ModalButton from "../UI/Modal/ModalButton";
import Gamemode from "./Gamemode";

export default class LoremIpsum extends Gamemode {
    constructor(text: string) {
        super(text);

        this.name = "Lorem Ipsum";
        this.description = "Try typing non existing words for better accuracy and muscle memory."
    }

    onGameStart() {
        console.log("Game has started");
    }

    onGameEnd(data: any) {
        const modal = new Modal('Congrats!');
        modal.setContent(`You have finished this test with speed of ${data.speed} WPM`);
        const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });
        modal.setButtons([modalButton]);
        modal.show();
        console.log(data);
    }

    onGameBreak(data: any) {
        const modal = new Modal('STOP!');
        modal.setContent(`Stop hiting your keyboard!`);
        const modalButton = new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() });
        modal.setButtons([modalButton]);
        modal.show();
    }
}