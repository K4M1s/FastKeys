import ModalButton from "./ModalButton";

export default class Modal {

    private element: HTMLDivElement;
    private title: string;
    private content: string | undefined;

    private buttons: ModalButton[] = [];

    constructor(title: string) {
        this.element = document.createElement('div');
        this.title = title;

        this.createElement();
    }

    createElement() {
        this.element.classList.add('modal__wrapper');
        this.element.classList.add('modal__wrapper--hide');

        const modalDiv = document.createElement('div');
        modalDiv.classList.add('modal');

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal__header');

        const modalHeaderText = document.createElement('h1');
        modalHeaderText.innerText = this.title;
        modalHeader.appendChild(modalHeaderText);

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal__body');

        const modalText = document.createElement('p');
        modalBody.appendChild(modalText)

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal__footer');

        modalDiv.appendChild(modalHeader);
        modalDiv.appendChild(modalBody);
        modalDiv.appendChild(modalFooter);

        this.element.appendChild(modalDiv);
        document.body.appendChild(this.element);
    }

    setContent(contentHTML: string) {
        this.content = contentHTML;
        const textElement = this.getContentElement();
        if (!textElement) return;
        textElement.innerHTML = this.content;
        return this;
    }

    setButtons(buttons: ModalButton[]) {
        this.buttons = [];
        buttons.forEach(btn => {
            this.buttons.push(btn);
        });

        const footerElement = this.getFooterElement();

        if (!footerElement) return;

        footerElement.innerHTML = "";
        this.buttons.forEach(button => {
            footerElement.appendChild(button.getElement());
        })
        return this;
    }

    show() {
        this.element.classList.remove('modal__wrapper--hide');
        this.element.classList.add('modal__wrapper--showing');
        setTimeout(()=> {
            this.element.classList.remove('modal__wrapper--showing');
            this.element.classList.add('modal__wrapper--show');
        }, 690);
        return this;
    }

    hide() {
        this.element.classList.remove('modal__wrapper--show');
        this.element.classList.add('modal__wrapper--hiding');
        setTimeout(()=> {
            this.element.classList.remove('modal__wrapper--hiding');
            this.element.classList.add('modal__wrapper--hide');
        }, 690);
        return this;
    }

    getContentElement() {
        return this.element.querySelector('.modal__body > p');
    }

    getFooterElement() {
        return this.element.querySelector('.modal__footer');
    }
}