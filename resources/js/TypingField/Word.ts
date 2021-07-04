import Letter from "./Letter";
import Space from "./Space";

export interface WordTimestamps {
    start: number;
    end: number;
    time: number;
    letterTime: number;
}

export default class Word {

    private letters: Letter[];
    private element: HTMLElement;
    private startedTypingTime: Date | null;
    private finishedTypingTime: Date | null;
    private timestamps: WordTimestamps | null = null;

    constructor() {
        this.letters = [];
        this.element = document.createElement('span');
        
        this.createElement();

        this.startedTypingTime = null;
        this.finishedTypingTime = null;
    }

    createElement() {
        this.element.classList.add("typing-field__word");
    }

    addLetter(letter: Letter) {
        this.letters.push(letter)
        letter.appendElement(this.element);
    }

    startedTyping() {
        if (this.letters[0].getTypedLetter() == null) {
            this.startedTypingTime = new Date();
        }
    }

    finishedTyping() {
        if (this.letters[this.letters.length - 1].getTypedLetter() != null) {
            this.finishedTypingTime = new Date();
        }
    }

    addTypedLetter(letter: string) {
        const emptyLetter = this.letters.filter(letter => letter.getTypedLetter() == null)[0];
        emptyLetter.setTypedLetter(letter);

        return emptyLetter;
    }

    removeLastLetter() {
        const typedLetters = this.letters.filter(letter => letter.getTypedLetter() != null );
        typedLetters[typedLetters.length - 1].setTypedLetter(null);
    }

    clearLetters() {
        this.letters.forEach(letter => {
            letter.setTypedLetter(null);
        })
    }

    hasEmptyLetters() {
        return this.letters.filter(letter => letter.getTypedLetter() == null).length > 0;
    }

    hasTypedLetters() {
        return this.letters.filter(letter => letter.getTypedLetter() != null).length > 0;
    }

    appendElement(parent: HTMLElement) {
        parent.appendChild(this.element);
    }

    setCursor() {
        this.letters.forEach(letter => {
            letter.removeCursor();
        })
        const firstEmptyLetter = this.letters.filter(letter => letter.getTypedLetter() == null);
        if (firstEmptyLetter.length > 0) {
            firstEmptyLetter[0].setCursor();
        }
    }

    removeCursor() {
        this.letters.forEach(letter => {
            letter.removeCursor();
        })
    }

    isSpace() {
        return this.letters.length == 1 && this.letters[0] instanceof Space;
    }

    isValid() {
        return this.letters.filter(letter => letter.isValid()).length == this.letters.length;
    }

    getCorrectness() {
        return this.letters.filter(letter => letter.isValid()).length / this.letters.length;
    }

    getLetters() {
        return this.letters;
    }

    getWord() {
        let letters = this.letters.map(letter => letter.getLetter());
        return letters.join('');
    }

    getTime(): number | null {
        if (!this.startedTypingTime || !this.finishedTypingTime) return null;

        return this.finishedTypingTime.getTime() - this.startedTypingTime.getTime();
    }

    getLetterTime(): number | null {
        const time = this.getTime();
        if (!time) return null;

        return (time / this.letters.length);
    }

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

    getTimestamps(): WordTimestamps | null {
        return this.timestamps;
    }
}