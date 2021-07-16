import Letter from "./Letter";
import Space from "./Space";


/**
 * Word timestamps
 */
export interface WordTimestamps {
    start: number;
    end: number;
    time: number;
    letterTime: number;
}


/**
 * Word class
 */
export default class Word {

    private letters: Letter[];
    private element: HTMLElement;
    private startedTypingTime: Date | null;
    private finishedTypingTime: Date | null;
    private timestamps: WordTimestamps | null = null;


    /**
     * Creates an instance of word.
     */
    constructor() {
        this.letters = [];
        this.element = document.createElement('span');
        this.element.classList.add("typing-field__word");

        this.startedTypingTime = null;
        this.finishedTypingTime = null;
    }


    /**
     * Adds letter to word
     * @param letter Letter to add.
     */
    addLetter(letter: Letter): void {
        this.letters.push(letter)
        letter.appendElement(this.element);
    }

    /**
     * Set started typing time on that word.
     */
    startedTyping(): void {
        if (this.letters[0].getTypedLetter() == null) {
            this.startedTypingTime = new Date();
        }
    }

    /**
     * Set finished typing time on that word.
     */
    finishedTyping(): void {
        if (this.letters[this.letters.length - 1].getTypedLetter() != null) {
            this.finishedTypingTime = new Date();
        }
    }


    /**
     * Adds typed letter
     * @param letter Letter typed by user.
     * @returns  
     */
    addTypedLetter(letter: string) {
        const emptyLetter = this.letters.filter(letter => letter.getTypedLetter() == null)[0];
        emptyLetter.setTypedLetter(letter);

        return emptyLetter;
    }


    /**
     * Removes last letter
     */
    removeLastLetter() {
        const typedLetters = this.letters.filter(letter => letter.getTypedLetter() != null );
        typedLetters[typedLetters.length - 1].setTypedLetter(null);
    }


    /**
     * Clears letters
     */
    clearLetters() {
        this.letters.forEach(letter => {
            letter.setTypedLetter(null);
        })
    }


    /**
     * Determines whether word has any empty letters
     * @returns true if has empty letters
     */
    hasEmptyLetters(): boolean {
        return this.letters.filter(letter => letter.getTypedLetter() == null).length > 0;
    }

    /**
     * Determines whether word has any typed letters
     * @returns true if has any typed letters
     */
    hasTypedLetters(): boolean {
        return this.letters.filter(letter => letter.getTypedLetter() != null).length > 0;
    }

    /**
     * Appends element to parent
     * @param parent HTML Element
     */
    appendElement(parent: HTMLElement): void {
        parent.appendChild(this.element);
    }


    /**
     * Sets cursor to one of its letters
     */
    setCursor(): void {
        this.letters.forEach(letter => {
            letter.removeCursor();
        })
        const firstEmptyLetter = this.letters.filter(letter => letter.getTypedLetter() == null);
        if (firstEmptyLetter.length > 0) {
            firstEmptyLetter[0].setCursor();
        }
    }


    /**
     * Removes cursor from all of its letters
     */
    removeCursor(): void {
        this.letters.forEach(letter => {
            letter.removeCursor();
        })
    }


    /**
     * Determines whether word is space
     * @returns true if space 
     */
    isSpace(): boolean {
        return this.letters.length == 1 && this.letters[0] instanceof Space;
    }


    /**
     * Determines whether typed word is valid
     * @returns true if valid 
     */
    isValid(): boolean {
        return this.letters.filter(letter => letter.isValid()).length == this.letters.length;
    }

    /**
     * Gets correctness
     * @returns correctness 
     */
    getCorrectness(): number {
        return this.letters.filter(letter => letter.isValid()).length / this.letters.length;
    }


    /**
     * Gets letters
     * @returns letters 
     */
    getLetters(): Letter[] {
        return this.letters;
    }


    /**
     * Gets word
     * @returns word 
     */
     getWord(): string {
        let letters = this.letters.map(letter => letter.getLetter());
        return letters.join('');
    }

    /**
     * Gets typed word
     * @returns typed word 
     */
    getTypedWord(): string {
        let letters = this.letters.map(letter => letter.getTypedLetter());
        return letters.join('');
    }


    /**
     * Gets elapsed word time.
     * @returns time 
     */
    getTime(): number | null {
        if (!this.startedTypingTime || !this.finishedTypingTime) return null;

        return this.finishedTypingTime.getTime() - this.startedTypingTime.getTime();
    }


    /**
     * Gets average letter time
     * @returns letter time 
     */
    getLetterTime(): number | null {
        const time = this.getTime();
        if (!time) return null;

        return (time / this.letters.length);
    }


    /**
     * Calculates timestamps
     */
    calculateTimestamps(): void {

        const start = this.startedTypingTime;
        const end = this.finishedTypingTime;
        const time = this.getTime();
        const letterTime = this.getLetterTime();

        if (!start || !end || !time || !letterTime) {
            throw new Error("Word is not finished?");
        }

        this.timestamps = {
            start: start.getTime(),
            end: end.getTime(),
            time,
            letterTime,
        }
    }


    /**
     * Gets timestamps
     * @returns timestamps 
     */
    getTimestamps(): WordTimestamps | null {
        return this.timestamps;
    }
}