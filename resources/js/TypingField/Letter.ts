
/**
 * Letter type
 */
export enum LETTER_TYPE {
    PLACEHOLDER,
    TYPED_LETTER
}

/**
 * Letter class
 */
export default class Letter {

    private letter: string;
    private typedLetter: string | null = null;
    private element: HTMLElement;


    /**
     * Creates an instance of letter
     * @param letter Letter string
     * @param letterType Letter type
     */
    constructor(letter: string, letterType: LETTER_TYPE) {
        this.letter = letter;
        this.element = document.createElement('span');

        this.createElement(letterType);
    }

    /**
     * Creates element
     * @param letterType Type of letter
     */
    createElement(letterType: LETTER_TYPE) {
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

    /**
     * Gets letter
     * @returns String representation of letter
     */
    getLetter(): string {
        return this.letter;
    }


    /**
     * Gets element
     * @returns HTML Element
     */
    getElement(): HTMLElement {
        return this.element;
    }


    /**
     * Gets typed letter
     * @returns  typed letter
     */
    getTypedLetter(): string | null {
        return this.typedLetter;
    }


    /**
     * Sets typed letter
     * @param letter typed letter (null if removed)
     */
    setTypedLetter(letter: string | null): void {
        this.typedLetter = letter;
        if (this.typedLetter != null) {
            this.element.classList.add("typing-field__letter--typed")
            this.validate();
        } else {
            this.element.classList.remove("typing-field__letter--typed")
            this.setNormal();
        }
    }

    /**
     * Set letter as correct
     */
    setCorrect(): void {
        this.element.classList.remove('typing-field__letter--incorrect');
        this.element.classList.add('typing-field__letter--correct');
    }

    /**
     * Set letter as incorrect
     */
    setIncorrect(): void {
        this.element.classList.remove('typing-field__letter--correct');
        this.element.classList.add('typing-field__letter--incorrect');
    }

    /**
     * Set letter as normal (without background)
     */
    setNormal(): void {
        this.element.classList.remove('typing-field__letter--correct');
        this.element.classList.remove('typing-field__letter--incorrect');
    }

    /**
     * Display cursor on this letter (only visual)
     */
    setCursor(): void {
        this.element.classList.add('typing-field__letter--cursor');
    }


    /**
     * Removes cursor
     */
    removeCursor(): void {
        this.element.classList.remove('typing-field__letter--cursor');
    }

    /**
     * Determines whether typed letter is valid
     * @returns true if valid 
     */
    isValid(): boolean {
        return this.typedLetter == this.letter;
    }
    
    /**
     * Validates letter (adds background)
     * @returns true if validate 
     */
    validate(): boolean {
        if (this.isValid()) {
            this.setCorrect();
            return true;
        } else {
            this.setIncorrect();
            return false;
        }
    }


    /**
     * Appends element to parent
     * @param parent Parent HTML Element
     */
    appendElement(parent: HTMLElement): void {
        parent.appendChild(this.element);
    }
}