import axios from "axios";
import { Gamemode, ResultWordData } from "../common/types";
import Game from "../Game/Game";
import Result from "../ResultManager/Result";
import ResultManager from "../ResultManager/ResultManager";
import UserInterface, { USER_INTERFACE_ELEMENTS } from "../TypingField/UserInterface";
import Modal from "../UI/Modal/Modal";
import ModalButton from "../UI/Modal/ModalButton";
import ResutlTable from "../UI/ResultTable/ResultTable";

/**
 * Lorem ipsum gamemode class
 */
export default class LoremIpsum implements Gamemode {

    public name = "Lorem Ipsum";
    public description = "Type random nonexisting words...";
    private game: Game;
    private ui: UserInterface;

    private startTime: Date | null = null;
    private endTime: Date | null = null;
    
    constructor(game: Game) {
        this.game = game;
        this.ui = new UserInterface();

        this.setupUI();
        this.gameLoop();
    }

    public async prepareGame() {
        // TO DO...
    }

    public onStartedTyping(): void {
        this.onGameStart();
    }

    public onFinishedTyping(): void {       
        this.onGameEnd();
    }

    public onGameStart(): void {
        this.game.typingField.disableScroll();
        
        this.startTime = new Date();
    }

    public onGameEnd(): void {
        this.endTime = new Date();
        this.updateUI();
        this.game.typingField.enableScroll();
        this.game.typingField.setLocked(true);

        const resultedSpeed = this.calculateSpeed();
        const resultedAccuracy = this.calculateAccuracy();
        const resultedTypos = this.calculateTypos();
        // Get typed text as string.
        const originalText = this.game.typingField.getText().map(word => word.getWord()).join('');

        // Calculate timestamps for each typed word before generating the result object.
        this.game.typingField.getTypedWords().forEach(word => word.calculateTimestamps());
        const words: ResultWordData[] = this.game.typingField.getTypedWords().map(word => {
            return {
                word: word.getWord(),
                typed: word.getTypedWord(),
                timestamps: word.getTimestamps()
            }
        })

        // Send data to API
        const result = new Result(
            this.name,
            originalText,
            resultedSpeed, 
            resultedAccuracy, 
            resultedTypos, 
            this.startTime!.getTime(), 
            this.endTime!.getTime(), 
            words);
        ResultManager.save(result).then(() => {
            // console.log("Result saved!");
        }).catch(() => {
            // console.error("Error while saving result");
        })

        // Show modal with data.
        const modal = new Modal("Test finished!");
        modal.setContent(`Your speed was ${resultedSpeed} WPM and your accuracy resulted in ${resultedAccuracy}%`);
        modal.setButtons([
            new ModalButton("Try again", ["button", "button--primary", "button--outline"], () => { modal.hide(); this.game.reset() }),
            new ModalButton("Close", ["button", "button--primary", "button--outline"], () => { modal.hide() })
        ]);
        modal.show();
    }

    public async loadText(): Promise<string> {
        const response = await axios.get(window.location.href + '/text');
        
        return response.data.text;
    }

    private gameLoop(): void {
        if (this.endTime != null) {
            return;
        }
        this.updateUI();

        requestAnimationFrame(() => {this.gameLoop()})
    }

    private setupUI(): void {
        this.ui.appendElement(this.game.typingField.getRootHTMLElement());

        this.ui.setVisible([
            USER_INTERFACE_ELEMENTS.PROGRESS,
            USER_INTERFACE_ELEMENTS.TYPOS,
            USER_INTERFACE_ELEMENTS.SPEED,
        ]);
        const resultTableWrapper = document.querySelector<HTMLElement>(".result-table__wrapper");
        if (resultTableWrapper) {
            const resultTable = new ResutlTable(resultTableWrapper, this.name);
        }
        
    }

    private updateUI(): void {
        this.ui.setProgress(this.calculateProgress());
        this.ui.setTypos(this.calculateTypos());
        this.ui.setSpeed(this.calculateSpeed());
    }

    /**
     * Calculates current speed
     * @returns current speed 
     */
    calculateSpeed(): number {
        const currentTime = this.endTime ? this.endTime : new Date();

        if (!this.startTime) {
            return 0;
        }

        const diff = (currentTime.getTime() - this.startTime.getTime()) / 1000;
        const correctWords = this.game.typingField.getCorrectWords();
        const wordsPerSecond = correctWords.length / diff;
        return Math.floor(wordsPerSecond * 60);
    }

    /**
     * Calculates progress
     * @returns progress 
     */
    calculateProgress(): number {
        let numOfLetters = 0;
        let numOfTypedLetters = 0;
        const text = this.game.typingField.getText();

        text.forEach(word => { numOfLetters += word.getLetters().length });

        for (let i=0; i<=this.game.typingField.getCurrentWordIndex(); i++) {
            numOfTypedLetters += text[i].getLetters().filter(letter => letter.getTypedLetter() != null).length
        }
        return Math.floor((numOfTypedLetters / numOfLetters)* 100);
    }

    /**
     * Calculates typos
     * @returns typos 
     */
    calculateTypos(): number {
        let typos = 0;

        this.game.typingField.getTypedWords().forEach(word => {
            typos += word.getLetters().filter(letter => !letter.isValid()).length;
        })

        return typos;
    }

    private calculateAccuracy(): number {
        const typedWords = this.game.typingField.getTypedWords();

        let accuracy= 0; 
        typedWords.forEach(word => accuracy += word.getCorrectness());
        accuracy = accuracy / typedWords.length;

        // result in percentage.
        const result = accuracy * 100;

        // Return result in percentage rounded to 2 decimal places.
        return Math.round( (result + Number.EPSILON) * 100) / 100;
    }
}