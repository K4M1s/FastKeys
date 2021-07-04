import Letter from "../TypingField/Letter";
import TypingField, { TEST_MODE } from "../TypingField/TypingField";
import Word from "../TypingField/Word";

export default class Gamemode {
    protected name = "Gamemode name";
    protected description = "Longer gamemode description.";
    private game: TypingField;

    constructor(text: string, mode=TEST_MODE.FINISH_TEXT_MODE, time=0) {
        const typingFieldElement = document.querySelector(".typing-field__wrapper") as HTMLElement;

        if (!typingFieldElement) {
            throw new Error("Typing Field element is missing.");
        }

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

    onGameStart(data: any) {

    }

    onGameEnd(data: any) {

    }

    onGameBreak(data: any) {

    }

    onWordType(word: Word) {

    }

    onLetterType(letter: Letter) {

    }
}