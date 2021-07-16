import { GameEndData, GameResult } from "../common/types";
import Letter from "../TypingField/Letter";
import TypingField, { TEST_MODE } from "../TypingField/TypingField";
import Word from "../TypingField/Word";


/**
 * Gamemode class
 */
export default class Gamemode {
    /**
     * Name of gamemode
     */
    public name = "Gamemode name";

    /**
     * Description of gamemode
     */
    public description = "Longer gamemode description.";

    /**
     * Game object
     */
    private game: TypingField;


    /**
     * Creates an instance of gamemode.
     * @param text Text to type
     * @param name Gamemode name
     * @param description Gamemode description
     * @param text Text to type
     * @param [mode] Test mode
     * @param [time] Time in TIME_MDOE
     */
    constructor(text: string, name: string, description: string, mode=TEST_MODE.FINISH_TEXT_MODE, time=0) {
        const typingFieldElement = document.querySelector(".typing-field__wrapper") as HTMLElement;

        this.name = name;
        this.description = description;

        if (!typingFieldElement) {
            throw new Error("Typing Field element is missing.");
        }

        this.game = new TypingField(typingFieldElement, text, mode, time);
        this.registerEvents();
    }


    /**
     * Registers events
     */
    public registerEvents() {
        this.game.onGameStart(this.onGameStart);
        this.game.onGameEnd(this.onGameEnd, this);
        this.game.onGameBreak(this.onGameBreak);

        this.game.onWordType(this.onWordType);
        this.game.onLetterType(this.onLetterType);
    }


    /**
     * Game start hook
     * @param data 
     */
    public onGameStart(data: any) {

    }

    /**
     * Game end hook
     * @param data 
     */
    public onGameEnd(data: GameEndData) {
        console.log(data);
    }

    /**
     * Game break hook
     * @param data 
     */
    public onGameBreak(data: any) {

    }

    /**
     * Word typed hook
     * @param word Typed word
     */
    public onWordType(word: Word) {

    }

    /**
     * Letter typed hook
     * @param letter Typed letter
     */
    public onLetterType(letter: Letter) {

    }
}