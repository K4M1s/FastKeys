import TypingField, {TYPING_FIELD_TEST_MODE} from "./typingField";

export default class Gamemode {
    name = "Gamemode name";
    description = "Longer gamemode description.";
    game = null;

    constructor(text, mode=TYPING_FIELD_TEST_MODE.FINISH_TEXT_MODE, time=0) {
        const typingFieldElement = document.querySelector(".typing-field");

        this.game = new TypingField(typingFieldElement, text, mode, time);
        this.registerEvents();
    }

    registerEvents() {
        this.game.onGameStart(this.onGameStart);
        this.game.onGameEnd(this.onGameEnd);
        this.game.onGameBreak(this.onGameBreak);

        this.game.onWordType(this.onWordType);
        this.game.onLetterType(this.onLetterType);
    }

    onGameStart(data) {

    }

    onGameEnd(data) {

    }

    onGameBreak(data) {

    }

    onWordType(word) {

    }

    onLetterType(letter) {

    }
}