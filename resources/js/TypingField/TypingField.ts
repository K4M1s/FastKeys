import Letter, { LETTER_TYPE } from "./Letter";
import Space from "./Space";
import Word from "./Word";

/**
 * Typing field class
 */
export default class TypingField {

    /**
     * Root element of typing field.
     */
    private rootElement: HTMLElement

    /**
     * Spinner element of typing field.
     */
    private spinnerElement: HTMLElement;

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
     * Text array.
     */
    private text: Word[] = [];

    /**
     * Number of currently visible words.
     */
    private renderedWords: number = -1;

    /**
     * Current word.
     */
    private currentWord: Word | null = null;

    /**
     * Current word index in text array.
     */
    private currentWordIndex: number = -1;

    /**
     * Cursor top offset used to position text on screen.
     */
    private cursorTopOffset: number = -1;

    /**
     * Text line height.
     */
    private textLineHeight: number = -1;

    /**
     * Current top margin (Used to position text on screen).
     */
    private currentTopMargin: number = 0;

    /**
     * Arrays for storing callback functions.
     */
    private callbacks: TypingFieldCallbacks = {
        StartedTyping: [],
        FinishedTyping: [],
        LetterTyped: [],
        WordTyped: []
    }

    /**
     * Determines if user has started typing.
     */
    private startedTyping: boolean = false;

    /**
     * Determines if typing field is locked.
     */
    private locked: boolean = true;

    constructor(element: HTMLElement) {
        // Get wrapper for Typing Field elements.
        this.rootElement = element

        // Create main Typing Field element.
        this.typingFieldElement = document.createElement("div");
        this.typingFieldElement.classList.add("typing-field");
        this.rootElement.appendChild(this.typingFieldElement);

        // Create element for loading spinner.
        this.spinnerElement = document.createElement("div");
        this.spinnerElement.className = "spinner__wrapper";
        const spinner = document.createElement("div");
        spinner.className = "spinner";
        for (let i=1; i<4; i++) {
            const dot = document.createElement("div");
            dot.className = `spinner__dot${i}`;
            spinner.appendChild(dot);
        }
        this.spinnerElement.appendChild(spinner);
        this.typingFieldElement.appendChild(this.spinnerElement);


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

        // Register needed events.
        this.registerKeyPressListener();
        this.registerInputChangeListener();
        document.addEventListener('click', () => {
            this.inputFieldElement.focus();
        });
    }

    public reset(): void {
        this.renderedWords = -1;
        this.currentWord = null;
        this.currentWordIndex = -1;
        this.cursorTopOffset = -1;
        this.textLineHeight = -1;
        this.currentTopMargin = -1;
        this.startedTyping = false;
        this.locked = true;
        this.text = [];
        this.showSpinner();
    }

    public showSpinner(): void {
        this.spinnerElement.classList.remove("spinner--hide");
    }

    public hideSpinner(): void {
        this.spinnerElement.classList.add("spinner--hide");
    }

    public setText(text: string): void {
        this.text = this.parseText(text);
        this.renderedWords = 0;
        this.renderText();

        // Setup initial word and its index.
        this.currentWord = this.text[0];
        this.currentWordIndex = 0;

        // Set cursor on initial position.
        this.setCursor();

        this.cursorTopOffset = this.getCursorTopOffset();
        this.textLineHeight = 0;
        const wordElement = this.typingFieldElement.querySelector('.typing-field__word') as HTMLElement;
        if (wordElement) {
            this.textLineHeight = wordElement.offsetHeight;
        }
        this.currentTopMargin = 0;

        this.startedTyping = false;
        this.setLocked(false);

        this.hideSpinner();
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
        this.textFieldElement.innerHTML = "";
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
            if (this.locked) {
                return;
            }

            this.processPressedKey(e.key, e.ctrlKey);
        })
    }

    /**
     * Process pressed key
     * @param key Pressed key
     * @param ctrl Is control pressed?
     */
    processPressedKey(key: string, ctrl: boolean): void {
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
        if (this.currentWord!.hasTypedLetters()) {
            this.currentWord!.removeLastLetter();

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
        this.currentWord!.clearLetters();
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
            if (this.locked) {
                return;
            }

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

        if (!this.startedTyping) {
            this.startedTyping = true;
            this.fireOnStartedTyping();
            this.text[this.currentWordIndex].startedTyping();
        }

        const addedLetter = this.currentWord!.addTypedLetter(letter);
        this.letterTyped(addedLetter);

        if (!this.currentWord!.hasEmptyLetters()) {
            this.wordFinished(this.currentWord!);
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
        this.fireOnLetterTyped(letter);
    }

    /**
     * Word finished event.
     * @param word Word typed.
     */
    wordFinished(word: Word) {
        word.finishedTyping();

        this.scrollView();

        if (word == this.text.slice(-1)[0]) {
            this.fireOnFinishedTyping();
            this.setLocked(true);
        } else {
            this.currentWordIndex++;
            this.currentWord = this.text[this.currentWordIndex];
            this.currentWord.startedTyping();
            this.setCursor();
        }

        this.renderMoreText();

        this.fireOnWordTyped(word);
    }

    /**
     * Security check for typing random things.
     * @param word Typed word.
     */
    // securityCheck(word: Word) {
    //     if (word.isSpace()) {
    //         return;
    //     }
    //     if (!word.isValid() && word.getCorrectness() < 0.6) {
    //         this.lastInvalidWordTime = this.lastInvalidWordTime ? this.lastInvalidWordTime : new Date();
    //         this.invalidWordsInRow++;
    //     } else {
    //         this.invalidWordsInRow = 0;
    //     }

    //     if (!this.lastInvalidWordTime) {
    //         return;
    //     }

    //     if (this.invalidWordsInRow > 6) {
    //         if (this.lastInvalidWordTime.getTime() - new Date().getTime() < 5000){ 
    //             this.breakGame();
    //         }
    //     }
    // }

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
     * Calculates correctness
     * @returns correctness 
     */
    // calculateCorrectness(): number {
    //     let correctness = 0;
    //     this.getTypedWords().forEach(word => {
    //         correctness += word.getCorrectness();
    //     })
    //     return correctness / this.getTypedWords().length;
    // }

    /**
     * Enables scroll
     */
    public enableScroll(): void {
        this.textFieldElement.style.marginTop = "0px";
        this.typingFieldElement.style.overflow = "auto";
    }

    /**
     * Disables scroll
     */
    public disableScroll(): void {
        this.textFieldElement.style.marginTop = `${this.currentTopMargin}px`;
        this.typingFieldElement.style.overflow = "hidden";
    }

    /**
     * Gets words time.
     * @returns Words time.
     */
    // getWordsTime(): number {
    //     let time = 0;
    //     this.getTypedWords().forEach((word: Word) => {
    //         const wordTime = word.getTime();
    //         if (wordTime !== null) {
    //             time += wordTime;
    //         }
    //     });
    //     return time;
    // }

    /**
     * Calculates words timestamps
     */
    // calculateWordsTimestamps(): void {
    //     this.getTypedWords().forEach(word => {
    //        word.calculateTimestamps();
    //     })
    // }

    /**
     * Gets letter delta time
     * @returns letter delta time 
     */
    // getLetterDeltaTime(): number {
    //     let smallest = Infinity;
    //     let biggest = 0;
    //     this.getTypedWords().forEach(word => {
    //         const letterTime = word.getLetterTime()

    //         if (!letterTime) {
    //             throw new Error("Letter time is null, which it shouldn't be.");
    //         }

    //         if (smallest > letterTime) {
    //             smallest = letterTime;
    //         }
    //         if (biggest < letterTime) {
    //             biggest = letterTime;
    //         }
    //     })
    //     return Math.abs(smallest - biggest);
    // }

    /**
     * Gets whole text
     * @returns whole text 
     */
    private getWholeText(): string {
        const words: string[] = this.text.map(word => {
            return word.getWord();
        })

        return words.join('');
    }

    // breakGame() {
    //     this.endTime = new Date();
    //     this.inputFieldElement.disabled = true;
    //     this.gameStop = true;

    //     this.enableScroll();
    //     this.updateUI();

    //     this.fireEvent('gameBreak', {})
    // }

    // endGame() {
    //     this.endTime = new Date();
    //     this.inputFieldElement.disabled = true;
    //     this.gameStop = true;

    //     this.updateUI(true);
    //     this.enableScroll();

    //     this.calculateWordsTimestamps();

    //     const words: ResultWordData[] = this.getTypedWords().map((w: Word) => {
    //         return {
    //             word: w.getWord(),
    //             typed: w.getTypedWord(),
    //             timestamps: w.getTimestamps()
    //         }
    //     });

    //     this.fireGameEnd({
    //         speed: this.calculateFinalSpeed(),
    //         accuracy: this.calculateCorrectness(),
    //         typos: this.calculateTypos(),
    //         words: words,
    //         originalText: this.getWholeText(),
    //         letterDeltaTime: this.getLetterDeltaTime(),
    //         startTime: this.startTime!,
    //         endTime: this.endTime
    //     });
    // }

    public getText(): Word[] {
        return this.text;
    }

    public getCurrentWordIndex(): number {
        return this.currentWordIndex;
    }

    public setLocked(state: boolean) {
        this.locked = state;
    }

    public getHTMLElement(): HTMLElement {
        return this.typingFieldElement;
    }

    public getRootHTMLElement(): HTMLElement {
        return this.rootElement;
    }

    private fireOnStartedTyping() {
        this.callbacks.StartedTyping.forEach(fn => { fn() });
    }

    private fireOnFinishedTyping() {
        this.callbacks.FinishedTyping.forEach(fn => { fn() });
    }

    private fireOnWordTyped(word: Word) {
        this.callbacks.WordTyped.forEach(fn => { fn(word) });
    }

    private fireOnLetterTyped(letter: Letter) {
        this.callbacks.LetterTyped.forEach(fn => { fn(letter) });
    }

    public onStartedTyping(listener: Function) {
        this.callbacks.StartedTyping.push(listener);
    }
    public onFinishedTyping(listener: Function) {
        this.callbacks.FinishedTyping.push(listener);
    }
    public onWordTyped(listener: (word: Word) => Function) {
        this.callbacks.WordTyped.push(listener);
    }
    public onLetterTyped(listener: (letter: Letter) => Function) {
        this.callbacks.LetterTyped.push(listener);
    }

}

export type TypingFieldCallbacks = {
    StartedTyping: Function[];
    FinishedTyping: Function[];
    WordTyped: Array<(word: Word) => Function>;
    LetterTyped: Array<(letter: Letter) => Function>;
}

export type TypingFieldCallbackTypes = "StartedTyping" | "FinishedTyping" | "LetterTyped";