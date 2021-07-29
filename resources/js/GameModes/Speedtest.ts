import axios from "axios";
import { Gamemode, ResultWordData } from "../common/types";
import Game from "../Game/Game";
import Result from "../ResultManager/Result";
import ResultManager from "../ResultManager/ResultManager";
import UserInterface, { USER_INTERFACE_ELEMENTS } from "../TypingField/UserInterface";
import Modal from "../UI/Modal/Modal";
import ModalButton from "../UI/Modal/ModalButton";
import ResutlTable from "../UI/ResultTable/ResultTable";

export default class Speedtest implements Gamemode {
    name = "Speed Test"
    description = "Classical speed test. Try how fast you type.";
    public game: Game;
    private ui: UserInterface;

    private testTime = 60;

    private startTime: Date | null = null;
    private endTime: Date | null = null; 
    private gameTimer: NodeJS.Timeout | null = null;

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
        this.gameTimer = setTimeout(() => {
            this.onGameEnd();
        }, 60 * 1000);

        this.startTime = new Date();
    }

    public onGameEnd(): void {
        if (this.gameTimer !== null) {
            clearTimeout(this.gameTimer);
        }
        this.endTime = new Date();
        this.game.typingField.setLocked(true);
        this.game.typingField.enableScroll();

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
            USER_INTERFACE_ELEMENTS.TYPOS,
            USER_INTERFACE_ELEMENTS.SPEED,
            USER_INTERFACE_ELEMENTS.TIME
        ]);

        const resultTableWrapper = document.querySelector<HTMLElement>(".result-table__wrapper");
        if (resultTableWrapper) {
            const resultTable = new ResutlTable(resultTableWrapper, this.name);
        }
    }

    private updateUI(): void {
        this.ui.setTypos(this.calculateTypos());
        this.ui.setSpeed(this.calculateSpeed());
        const timeleft = this.calculateLeftTime();
        this.ui.setTime(`${timeleft.getMinutes()}:${timeleft.getSeconds() < 10 ? '0' : ''}${timeleft.getSeconds()}`);
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
     * Calculates left time.
     * @returns time left.
     */
    calculateLeftTime(): Date {

        if (!this.startTime) {
            return new Date(0);
        }

        const endtime = this.endTime ? this.endTime : new Date();

        const timeleft = this.startTime.getTime() + (this.testTime * 1000) - endtime.getTime();
        
        return new Date(timeleft < 0 ? 0 : timeleft);
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