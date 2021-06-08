import Space from "./Space";

export default class Word {

    constructor() {
        this.letters = [];
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('span');
        this.element.classList.add("typing-field__word");
    }

    addLetter(letter) {
        this.letters.push(letter)
        letter.appendElement(this.element);
    }

    addTypedLetter(letter) {
        const emptyLetter = this.letters.filter(letter => letter.getTypedLetter() == null)[0];
        emptyLetter.setTypedLetter(letter);
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

    getLetters() {
        return this.letters;
    }
}