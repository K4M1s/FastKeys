/**
 * Modal button
 */
export default class ModalButton {

    /**
     * Element of modal button
     */
    private element: HTMLElement;

    /**
     * Creates an instance of modal button
     * @param title Button title
     * @param classes Button classes
     * @param action On click action
     */
    constructor(title: string, classes: string[], action: EventListenerOrEventListenerObject) {
        this.element = document.createElement('button');
        this.element.innerText = title;
        classes.forEach(c => {
            this.element.classList.add(c);
        });
        this.element.addEventListener('click', action);
    }
    
    /**
     * Gets element
     * @returns element 
     */
    getElement(): HTMLElement {
        return this.element;
    }
}