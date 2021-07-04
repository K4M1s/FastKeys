export default class ModalButton {

    private element: HTMLElement;

    constructor(title: string, classes: string[], action: EventListenerOrEventListenerObject) {
        this.element = document.createElement('button');
        this.element.innerText = title;
        classes.forEach(c => {
            this.element.classList.add(c);
        });
        this.element.addEventListener('click', action);
    }

    getElement(): HTMLElement {
        return this.element;
    }
}