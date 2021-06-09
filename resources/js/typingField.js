import Letter, { LETTER_TYPE } from "./Letter";
import Space from "./Space";
import Word from "./Word";
import Modal from "./modal";

class TypingField {
    constructor(element, text) {
        this.element = element
        this.textField = this.element.querySelector(".typing-field__text");
        this.inputField = this.element.querySelector(".typing-field__input");
        this.userInterface = document.querySelector(".user-interface");

        this.userInterfaceElements = {
            progress: this.userInterface.querySelector("#ui-progress-value"),
            typos: this.userInterface.querySelector("#ui-typos-value"),
            speed: this.userInterface.querySelector("#ui-speed-value"),
        }

        this.text = this.parseText(text);
        this.renderText();

        this.registerKeyPressListener();
        this.registerInputChangeListener();
        document.addEventListener('click', () => {
            this.inputField.focus();
        })

        this.setCursor();

        this.currentWord = this.text[0];
        this.currentWordIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.finishedRows = 0;

        this.padding = this.getCursorPosition();
        this.lineHeight = this.element.querySelector('.typing-field__word').offsetHeight;
        this.currentMarginTop = 0;

        this.gameLoop = null;

        this.lastInvalidWordTime = null;
        this.invalidWordsInRow = 0;
    }

    startGame() {
        this.startTime = new Date();
        this.gameLoop = this.startGameLoop();
    }


    startGameLoop() {
        return setInterval(()=> {
            this.updateUI();
        }, 1000 / 30);
    }

    parseText(text) {
        const words = [];
        text.split(' ').forEach(w => {
            const word = new Word();
            w.split('').forEach(l => {
                const letter = new Letter(l, LETTER_TYPE.PLACEHOLDER);
                word.addLetter(letter);
            })
            words.push(word);
            const space = new Word();
            space.addLetter(new Space(LETTER_TYPE.PLACEHOLDER));
            words.push(space);
        })
        words.pop();
        return words;
    }

    renderText() {
        this.text.forEach(word => {
            word.appendElement(this.textField);
        })
    }

    registerKeyPressListener() {
        document.addEventListener('keydown', (e) => {
            this.processPressedKey(e.key, e.ctrlKey);
        })
    }

    processPressedKey(key, ctrl) {
        if (key == "Backspace") {
            if (ctrl) {
                this.removeLastWord();
            } else {
                this.removeLastLetter();
            }
            this.scrollView()
        }
    }

    removeLastLetter() {
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

    removeLastWord() {
        this.currentWord.clearLetters();
        if (this.currentWordIndex > 0) {
            this.currentWordIndex--;
            this.currentWord = this.text[this.currentWordIndex];
        }
        this.setCursor();
    }

    registerInputChangeListener() {
        const input = this.element.querySelector('.typing-field__input');
        input.addEventListener('input', (e) => {
            const data = e.data;
            if (data.length > 0) {
                input.value = ""
                this.processTypedLetter(data)
            }
        })
        input.focus();
    }

    processTypedLetter(letter) {
        if (this.endTime) {
            return;
        }

        if (this.startTime == null) {
            this.startGame();
        }

        this.currentWord.addTypedLetter(letter);

        if (!this.currentWord.hasEmptyLetters()) {
            this.onWordFinish(this.currentWord);
        }
        this.setCursor();
    }

    getCursorPosition() {
        this.cursor = this.element.querySelector('.typing-field__letter--cursor');
        return this.cursor.offsetTop;
    }

    setCursor() {
        this.text.forEach(word => {
            word.removeCursor();
        })

        const notFinishedWords = this.text.filter(word => word.hasEmptyLetters());
        if (notFinishedWords.length > 0) {
            notFinishedWords[0].setCursor();
        }
    }

    onWordFinish(word) {  
        if (word == this.text.slice(-1)[0]) {
            this.endGame();
        } else {
            this.currentWordIndex++;
            this.currentWord = this.text[this.currentWordIndex];
            this.setCursor();
        }
        
        this.securityCheck(word)
        this.scrollView();
    }

    securityCheck(word) {
        if (!word.isValid()) {
            this.lastInvalidWordTime = new Date();
            this.invalidWordsInRow++;
        } else {
            this.invalidWordsInRow = 0;
        }

        if (this.invalidWordsInRow > 6) {
            if (this.lastInvalidWordTime.getTime() - new Date().getTime() < 5000){ 
                this.breakGame();
            }
        }
    }

    scrollView() {
        if (this.getCursorPosition() >= ((this.lineHeight * 2) + this.padding)) {
            this.currentMarginTop -= this.lineHeight;
        } else if (this.getCursorPosition() < 0) {
            this.currentMarginTop += this.lineHeight;
        }
        this.textField.style.marginTop = `${this.currentMarginTop}px`;
    }

    getCorrectWords() {
        return this.text.filter(word => !word.isSpace() && word.isValid());
    }

    calculateCurrentSpeed() {
        const currentTime = new Date();
        const diff = (currentTime.getTime() - this.startTime.getTime()) / 1000;
        const correctWords = this.getCorrectWords();
        const wordsPerSecond = correctWords.length / diff;
        return Math.floor(wordsPerSecond * 60);
    }

    calculateFinalSpeed() {
        const diff = (this.endTime.getTime() - this.startTime.getTime()) / 1000;
        const correctWords = this.getCorrectWords();
        const wordsPerSecond = correctWords.length / diff;
        return Math.floor(wordsPerSecond * 60);
    }

    calculateProgress() {
        return Math.ceil((this.currentWordIndex / (this.text.length - 1)) * 100);
    }

    calculateTypos() {
        let typos = 0;

        this.text.forEach(word => {
            typos += word.getLetters().filter(letter => letter.getTypedLetter() != null && !letter.isValid()).length;
        })

        return typos;
    }

    updateUI(final = false) {
        this.userInterfaceElements.progress.innerText = `${this.calculateProgress()}%`;
        this.userInterfaceElements.typos.innerText = this.calculateTypos();
        this.userInterfaceElements.speed.innerText = `${final ? this.calculateFinalSpeed() : this.calculateCurrentSpeed()} WPM`;
    }

    enableScroll() {
        this.textField.style.marginTop = "0px";
        this.element.style.overflow = "auto";
    }

    breakGame() {
        this.endTime = new Date();
        this.textField.disabled = true;
        const modal = new Modal('You motherfucker!')
            .setContent(`Stop hiting your keybor you idiot!`)
            .setButtons([{text: 'Fuck me', classList: ['button', 'button--danger', 'button--outline'], action: () => {
                modal.hide()
                this.enableScroll();
            }}])
            .show();
        clearInterval(this.gameLoop);
        this.updateUI();
    }

    endGame() {
        this.endTime = new Date();
        this.textField.disabled = true;
        const modal = new Modal('Congrats!')
            .setContent(`You have finished this test with speed of ${this.calculateFinalSpeed()} WPM`)
            .setButtons([{text: 'Close', classList: ['button', 'button--primary', 'button--outline'], action: () => {
                modal.hide()
                this.enableScroll();
            }}])
            .show();
        clearInterval(this.gameLoop);
        this.updateUI(true);
    }
}

export default TypingField;