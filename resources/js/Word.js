import Space from "./Space";

export default class Word {

    constructor() {
        this.letters = [];
        this.createElement();

        this.startedTypingTime = null;
        this.finishedTypingTime = null;
    }

    createElement() {
        this.element = document.createElement('span');
        this.element.classList.add("typing-field__word");
    }

    addLetter(letter) {
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

    addTypedLetter(letter) {
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

    appendElement(parent) {
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

    getTime() {
        return this.finishedTypingTime.getTime() - this.startedTypingTime.getTime();
    }

    getLetterTime() {
        return this.getTime() / this.letters.length;
    }

    getTimestamps() {
        return {
            start: this.startedTypingTime.getTime(),
            end: this.finishedTypingTime.getTime(),
            time: this.getTime(),
            letterTime: this.getLetterTime()
        }
    }
}