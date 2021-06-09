import TypingField from "./typingField";

export default class Gamemode {
    name = "Gamemode name";
    description = "Longer gamemode description.";
    game = null;

    constructor(text) {
        const typingFieldElement = document.querySelector(".typing-field");

        this.game = new TypingField(typingFieldElement, text);
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