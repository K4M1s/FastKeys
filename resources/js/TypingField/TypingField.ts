import Letter, { LETTER_TYPE } from "./Letter";
import Space from "./Space";
import UserInterface, { USER_INTERFACE_ELEMENTS } from "./UserInterface";
import Word from "./Word";


/**
 * Test mode
 */
export enum TEST_MODE {
    FINISH_TEXT_MODE,
    TIME_MODE
}


/**
 * Typing field class
 */
export default class TypingField {

    /**
     * Root element of typing field.
     */
    private rootElement: HTMLElement

    /**
     * Typing field element.
     */
    private typingFieldElement: HTMLElement;

    /**
     * Text field element of typing field
     */
    private textFieldElement: HTMLElement;

    /**
     * Input field element of typing field
     */
    private inputFieldElement: HTMLInputElement;

    /**
     * User inteface of typing field
     */
    private userInteface: UserInterface;

    /**
     * Text array.
     */
    private text: Word[];


    /**
     * Number of currently visible words.
     */
    private renderedWords: number;


    /**
     * Current word.
     */
    private currentWord: Word;


    /**
     * Current word index in text array.
     */
    private currentWordIndex: number;

    /**
     * Time when typing started.
     */
    private startTime: Date | null = null;
    
    /**
     * Time when typing ended.
     */
    private endTime: Date | null = null;


    /**
     * Cursor top offset used to position text on screen.
     */
    private cursorTopOffset: number;


    /**
     * Text line height.
     */
    private textLineHeight: number;


    /**
     * Current top margin (Used to position text on screen).
     */
    private currentTopMargin: number = 0;

    /**
     * Last invalid word time (Used to break game if user starts to typing random things)
     */
    private lastInvalidWordTime: Date | null = null;

    /**
     * Last invalid word time (Used to break game if user starts to typing random things)
     */
    private invalidWordsInRow: number = 0;


    /**
     * Test mode.
     */
    private testMode: TEST_MODE;


    /**
     * Time in which user can type (in seconds)
     */
    private testTime: number;


    /**
     * Test time timer (Used to stop game in TIME_MODE)
     */
    private testTimeTimer: NodeJS.Timeout | null = null;

    private gameStop: boolean = false;

    /**
     * Creates an instance of typing field.
     * @param element Parent element.
     * @param text Text to type.
     * @param mode Typing mode
     * @param [time] Optional: time in TIME_MODE
     */
    constructor(element: HTMLElement, text: string, mode: TEST_MODE, time: number = 0) {
        // Get wrapper for Typing Field elements.
        this.rootElement = element

        // Create main Typing Field element.
        this.typingFieldElement = document.createElement("div");
        this.typingFieldElement.classList.add("typing-field");
        this.rootElement.appendChild(this.typingFieldElement);

        // Create element for text.
        this.textFieldElement = document.createElement("div");
        this.textFieldElement.classList.add("typing-field__text");
        this.typingFieldElement.appendChild(this.textFieldElement);

        // Create element for text input.
        this.inputFieldElement = document.createElement("input");
        this.inputFieldElement.classList.add("typing-field__input");
        this.inputFieldElement.autocomplete="off";
        this.inputFieldElement.autocapitalize="none";
        this.typingFieldElement.appendChild(this.inputFieldElement);

        // Instantiate User Interface and attach it to the root element.
        this.userInteface = new UserInterface();
        this.userInteface.appendElement(this.rootElement);

        this.text = this.parseText(text);
        this.renderedWords = 0;
        this.renderText();

        // Register needed events.
        this.registerKeyPressListener();
        this.registerInputChangeListener();
        document.addEventListener('click', () => {
            this.inputFieldElement.focus();
        })

        // Set cursor on initial position.
        this.setCursor();

        // Setup initial word and its index.
        this.currentWord = this.text[0];
        this.currentWordIndex = 0;

        this.cursorTopOffset = this.getCursorTopOffset();
        this.textLineHeight = 0;
        const wordElement = this.typingFieldElement.querySelector('.typing-field__word') as HTMLElement;
        if (wordElement) {
            this.textLineHeight = wordElement.offsetHeight;
        }
        this.currentTopMargin = 0;

        this.testMode = mode;
        this.testTime = time;

        if (this.testMode == TEST_MODE.TIME_MODE) {
            this.userInteface.setVisible([
                USER_INTERFACE_ELEMENTS.PROGRESS,
                USER_INTERFACE_ELEMENTS.TIME,
                USER_INTERFACE_ELEMENTS.TYPOS,
                USER_INTERFACE_ELEMENTS.SPEED,
            ]);
        } else {
            this.userInteface.setVisible([
                USER_INTERFACE_ELEMENTS.PROGRESS,
                USER_INTERFACE_ELEMENTS.TYPOS,
                USER_INTERFACE_ELEMENTS.SPEED,
            ]);
        }
    }


    /**
     * Starts game
     */
    startGame(): void {
        this.startTime = new Date();
        this.currentWord.startedTyping();

        this.gameLoop();

        if (this.testMode == TEST_MODE.TIME_MODE) {
            this.startTimer();
        }

        this.fireEvent('gameStart', {
            startTime: this.startTime
        })
    }


    /**
     * Game loop
     */
    gameLoop() {
        if (this.gameStop) return;

        this.updateUI();
        requestAnimationFrame(() => { this.gameLoop() });
    }


    /**
     * Starts timer
     */
    startTimer() {
        this.testTimeTimer = setTimeout(()=>{
            this.endGame();
        }, this.testTime * 1000);
    }


    /**
     * Parses text
     * @param text Text string.
     * @returns Text in words array.
     */
    parseText(text: string): Word[] {
        // Create words array.
        const words: Word[] = [];

        // Split text by spaces.
        text.split(' ').forEach(w => {
            // Create word object.
            const word = new Word();

            // Split word string to single letters.
            w.split('').forEach(l => {
                // Create letter object.
                const letter = new Letter(l, LETTER_TYPE.PLACEHOLDER);
                // Add letter to word object.
                word.addLetter(letter);
            })
            // Add word to words array.
            words.push(word);

            // Add space after each word.
            const space = new Word();
            space.addLetter(new Space(LETTER_TYPE.PLACEHOLDER));
            words.push(space);
        })
        // Remove last space which is unnecessary.
        words.pop();
        return words;
    }


    /**
     * Renders text
     */
    renderText(): void {
        if (this.text.length > 50) {
            for (let i=0; i < 50; i++) {
                this.text[i].appendElement(this.textFieldElement);
                this.renderedWords = i;
            }
        } else {
            this.text.forEach(word => {
                word.appendElement(this.textFieldElement);
            })
            this.renderedWords = this.text.length;
        }
    }


    /**
     * Renders more text
     */
    renderMoreText(): void {
        if (this.renderedWords + 1 < this.text.length && this.currentWordIndex + 49 > this.renderedWords) {
            this.renderedWords++;
            this.text[this.renderedWords].appendElement(this.textFieldElement);
        }
    }


    /**
     * Registers key press listener
     */
    registerKeyPressListener(): void {
        document.addEventListener('keydown', (e) => {
            this.processPressedKey(e.key, e.ctrlKey);
        })
    }


    /**
     * Process pressed key
     * @param key Pressed key
     * @param ctrl Is control pressed?
     */
    processPressedKey(key: string, ctrl: boolean): void {
        if (this.endTime) {
            return;
        }

        if (key == "Backspace") {
            if (ctrl) {
                this.removeLastWord();
            } else {
                this.removeLastLetter();
            }
            this.scrollView()
        }
    }


    /**
     * Removes last letter
     */
    removeLastLetter(): void {
        if (this.currentWord.hasTypedLetters()) {
            this.currentWord.removeLastLetter();

        } else {
            if (this.currentWordIndex > 0) {
                this.currentWordIndex--;
                this.currentWord = this.text[this.currentWordIndex];
                this.removeLastLetter()
            } else {
                return;
            }
        }
        this.setCursor();
    }


    /**
     * Removes last word
     */
    removeLastWord(): void {
        this.currentWord.clearLetters();
        if (this.currentWordIndex > 0) {
            this.currentWordIndex--;
            this.currentWord = this.text[this.currentWordIndex];
        }
        this.setCursor();
    }


    /**
     * Registers input change listener
     */
    registerInputChangeListener(): void {
        this.inputFieldElement.addEventListener('input', (e) => {
            if (this.inputFieldElement.value.length > 0) {
                this.processTypedLetter(this.inputFieldElement.value)
                this.inputFieldElement.value = ""
            }
        })
        this.inputFieldElement.focus();
    }


    /**
     * Process typed letter
     * @param letter Pressed letter
     */
    processTypedLetter(letter: string): void {
        // Do nothing if game has ended.
        if (this.endTime) {
            return;
        }

        // Start game if it hasn't start already.
        if (this.startTime == null) {
            this.startGame();
        }

        const addedLetter = this.currentWord.addTypedLetter(letter);
        this.letterTyped(addedLetter);

        if (!this.currentWord.hasEmptyLetters()) {
            this.wordFinished(this.currentWord);
        }
        this.setCursor();
    }


    /**
     * Gets cursor top offset
     * @returns cursor top offset 
     */
    getCursorTopOffset(): number {
        const cursor = this.typingFieldElement.querySelector('.typing-field__letter--cursor') as HTMLElement;
        if (!cursor) return 0;
        return cursor.offsetTop;
    }


    /**
     * Sets cursor position.
     */
    setCursor(): void {
        this.text.forEach(word => {
            word.removeCursor();
        })

        const notFinishedWords = this.text.filter(word => word.hasEmptyLetters());
        if (notFinishedWords.length > 0) {
            notFinishedWords[0].setCursor();
        }
    }


    /**
     * Letters typed event.
     * @param letter Typed letter.
     */
    letterTyped(letter: Letter) {
        this.fireEvent('letterType', {
            letter
        });
    }


    /**
     * Word finished event.
     * @param word Word typed.
     */
    wordFinished(word: Word) {
        word.finishedTyping();

        this.securityCheck(word);
        this.scrollView();

        if (word == this.text.slice(-1)[0]) {
            this.endGame();
        } else {
            this.currentWordIndex++;
            this.currentWord = this.text[this.currentWordIndex];
            this.currentWord.startedTyping();
            this.setCursor();
        }

        this.renderMoreText();

        this.fireEvent('wordType', {
            word
        });
    }


    /**
     * Security check for typing random things.
     * @param word Typed word.
     */
    securityCheck(word: Word) {
        if (word.isSpace()) {
            return;
        }
        if (!word.isValid() && word.getCorrectness() < 0.6) {
            this.lastInvalidWordTime = this.lastInvalidWordTime ? this.lastInvalidWordTime : new Date();
            this.invalidWordsInRow++;
        } else {
            this.invalidWordsInRow = 0;
        }

        if (!this.lastInvalidWordTime) {
            return;
        }

        if (this.invalidWordsInRow > 6) {
            if (this.lastInvalidWordTime.getTime() - new Date().getTime() < 5000){ 
                this.breakGame();
            }
        }
    }

    /**
     * Gets typed words.
     * @returns typed words.
     */
    getTypedWords(): Word[] {
        return this.text.filter(word => word.hasEmptyLetters() == false);
    }


    /**
     * Scrolls view for easier typing.
     */
    scrollView(): void {
        if (this.getCursorTopOffset() >= ((this.textLineHeight * 2) + this.cursorTopOffset)) {
            this.currentTopMargin -= this.textLineHeight;
        } else if (this.getCursorTopOffset() < 0) {
            this.currentTopMargin += this.textLineHeight;
        }
        this.textFieldElement.style.marginTop = `${this.currentTopMargin}px`;
    }


    /**
     * Get correct words
     * @returns correct words 
     */
    getCorrectWords(): Word[] {
        return this.text.filter(word => !word.isSpace() && word.isValid());
    }


    /**
     * Calculates current speed
     * @returns current speed 
     */
    calculateCurrentSpeed(): number {
        const currentTime = new Date();

        if (!this.startTime) {
            throw new Error("Game hasn't started yet");
        }

        const diff = (currentTime.getTime() - this.startTime.getTime()) / 1000;
        const correctWords = this.getCorrectWords();
        const wordsPerSecond = correctWords.length / diff;
        return Math.floor(wordsPerSecond * 60);
    }

    /**
     * Calculates final speed
     * @returns final speed 
     */
    calculateFinalSpeed(): number {
        if (this.testMode == TEST_MODE.TIME_MODE) {
            return this.getCorrectWords().length;
        }

        if (!this.startTime || !this.endTime) {
            throw new Error("Game hasn't started yet or ended yet");
        }
        const diff = (this.endTime.getTime() - this.startTime.getTime()) / 1000;
        const correctWords = this.getCorrectWords();
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
        this.text.forEach(word => { numOfLetters += word.getLetters().length });
        for (let i=0; i<=this.currentWordIndex; i++) {
            numOfTypedLetters += this.text[i].getLetters().filter(letter => letter.getTypedLetter() != null).length
        }
        return Math.floor((numOfTypedLetters / numOfLetters)* 100);
    }


    /**
     * Calculates typos
     * @returns typos 
     */
    calculateTypos(): number {
        let typos = 0;

        this.getTypedWords().forEach(word => {
            typos += word.getLetters().filter(letter => !letter.isValid()).length;
        })

        return typos;
    }


    /**
     * Calculates correctness
     * @returns correctness 
     */
    calculateCorrectness(): number {
        let correctness = 0;
        this.getTypedWords().forEach(word => {
            correctness += word.getCorrectness();
        })
        return correctness / this.getTypedWords().length;
    }


    /**
     * Calculates left time.
     * @returns time left.
     */
    calculateLeftTime(): Date {

        if (!this.startTime) {
            throw new Error("Game hasn't started yet");
        }

        const timeleft = this.startTime.getTime() + (this.testTime * 1000) - new Date().getTime();
        
        return new Date(timeleft < 0 ? 0 : timeleft);
    }

    /**
     * Updates UI
     * @param [final] Is it final update (When game ends)?
     */
    updateUI(final = false): void {
        this.userInteface.setProgress(this.calculateProgress());
        this.userInteface.setTypos(this.calculateTypos());
        this.userInteface.setSpeed(final ? this.calculateFinalSpeed() : this.calculateCurrentSpeed());
        const timeleft = this.calculateLeftTime();
        this.userInteface.setTime(`${timeleft.getMinutes()}:${timeleft.getSeconds() < 10 ? '0' : ''}${timeleft.getSeconds()}`);
    }

    /**
     * Enables scroll
     */
    enableScroll(): void {
        this.textFieldElement.style.marginTop = "0px";
        this.typingFieldElement.style.overflow = "auto";
    }

    /**
     * Gets words time.
     * @returns Words time.
     */
    getWordsTime(): number {
        let time = 0;
        this.getTypedWords().forEach((word: Word) => {
            const wordTime = word.getTime();
            if (wordTime !== null) {
                time += wordTime;
            }
        });
        return time;
    }

    /**
     * Calculates words timestamps
     */
    calculateWordsTimestamps(): void {
        this.getTypedWords().forEach(word => {
           word.calculateTimestamps();
        })
    }

    /**
     * Gets letter delta time
     * @returns letter delta time 
     */
    getLetterDeltaTime(): number {
        let smallest = Infinity;
        let biggest = 0;
        this.getTypedWords().forEach(word => {
            const letterTime = word.getLetterTime()

            if (!letterTime) {
                throw new Error("Letter time is null, which it shouldn't be.");
            }

            if (smallest > letterTime) {
                smallest = letterTime;
            }
            if (biggest < letterTime) {
                biggest = letterTime;
            }
        })
        return Math.abs(smallest - biggest);
    }

    breakGame() {
        this.endTime = new Date();
        this.inputFieldElement.disabled = true;
        this.gameStop = true;

        this.enableScroll();
        this.updateUI();

        this.fireEvent('gameBreak', {})
    }

    endGame() {
        this.endTime = new Date();
        this.inputFieldElement.disabled = true;
        this.gameStop = true;

        this.updateUI(true);
        this.enableScroll();

        this.calculateWordsTimestamps();

        this.fireEvent('gameEnd', {
            speed: this.calculateFinalSpeed(),
            correctness: this.calculateCorrectness(),
            typos: this.calculateTypos(),
            words: this.getTypedWords(),
            letterDeltaTime: this.getLetterDeltaTime()
        });
    }

    onGameStartCallbacks: Function[] = [];
    onGameEndCallbacks: Function[] = [];
    onGameBreakCallbacks: Function[] = [];

    onWordTypeCallbacks: Function[] = [];
    onLetterTypeCallbacks: Function[] = [];

    fireEvent(type: string, data: any) {
        switch(type) {
            case "gameStart":
                this.onGameStartCallbacks.forEach(callback => { callback(data) });
                break;
            case "gameEnd":
                this.onGameEndCallbacks.forEach(callback => { callback(data) });
                break;
            case "gameBreak":
                this.onGameBreakCallbacks.forEach(callback => { callback(data) });
                break;
            case "wordType":
                this.onWordTypeCallbacks.forEach(callback => { callback(data) });
                break;
            case "letterType":
                this.onWordTypeCallbacks.forEach(callback => { callback(data) });
                break;
        }
    }

    onGameStart(callback: Function) {
        this.onGameStartCallbacks.push(callback);
    }

    onGameEnd(callback: Function) {
        this.onGameEndCallbacks.push(callback);
    }

    onGameBreak(callback: Function) {
        this.onGameBreakCallbacks.push(callback);
    }

    onWordType(callback: Function) {
        this.onWordTypeCallbacks.push(callback);
    }

    onLetterType(callback: Function) {
        this.onLetterTypeCallbacks.push(callback);
    }

}