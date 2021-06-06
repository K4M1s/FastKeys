const LETTER_TYPE = {
    PLACEHOLDER: 1,
    TYPED_LETTER: 2,
};

export default class Letter {

    letter = ""
    typedLetter = null

    constructor(letter, letterType) {
        this.letter = letter;
        this.createElement(letterType);
    }

    createElement(letterType) {
        this.element = document.createElement('span');
        this.element.classList.add('typing-field__letter');
        switch(letterType) {
            case LETTER_TYPE.PLACEHOLDER:
                this.element.classList.add("typing-field__letter--placeholder")
                break;
            case LETTER_TYPE.TYPED_LETTER:
                this.element.classList.add("typing-field__letter--typed")
                break;
        }
        if (this.letter == " ") { 
            this.element.innerHTML = "&nbsp;";
        } else {
            this.element.innerText = this.letter;
        }
        
    }

    getLetter() {
        return this.letter;
    }

    getElement() {
        return this.element;
    }

    getTypedLetter() {
        return this.typedLetter;
    }

    setTypedLetter(letter) {
        this.typedLetter = letter;
        if (this.typedLetter != null) {
            this.element.classList.add("typing-field__letter--typed")
            this.validate();
        } else {
            this.element.classList.remove("typing-field__letter--typed")
            this.setNormal();
        }
    }

    setCorrect() {
        this.element.classList.remove('typing-field__letter--incorrect');
        this.element.classList.add('typing-field__letter--correct');
    }

    setIncorrect() {
        this.element.classList.remove('typing-field__letter--correct');
        this.element.classList.add('typing-field__letter--incorrect');
    }

    setNormal() {
        this.element.classList.remove('typing-field__letter--correct');
        this.element.classList.remove('typing-field__letter--incorrect');
    }

    setCursor() {
        this.element.classList.add('typing-field__letter--cursor');
    }

    removeCursor() {
        this.element.classList.remove('typing-field__letter--cursor');
    }

    isValid() {
        return this.typedLetter == this.letter;
    }

    validate() {
        if (this.isValid()) {
            this.setCorrect();
            return true;
        } else {
            this.setIncorrect();
            return false;
        }
    }

    appendElement(parent) {
        parent.appendChild(this.element);
    }
}

export {LETTER_TYPE}