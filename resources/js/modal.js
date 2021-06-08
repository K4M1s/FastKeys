import { create, forEach } from "lodash";

export default class Modal {

    element = null;

    title = null;
    content = null;

    buttons = [];

    constructor(title) {
        this.title = title;
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
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

    setContent(contentHTML) {
        this.content = contentHTML;
        this.getContentElement().innerHTML = this.content;
        return this;
    }

    setButtons(buttonsArr) {
        this.buttons = [];
        buttonsArr.forEach(btn => {
            this.buttons.push(this.createButton(btn));
        });
        this.getFooterElement().innerHTML = "";
        this.buttons.forEach(button => {
            this.getFooterElement().appendChild(button);
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

    createButton(btnData) {
        const btn = document.createElement('button');
        btn.innerText = btnData.text;
        btnData.classList.forEach(c => {
            btn.classList.add(c);
        });
        btn.addEventListener('click', btnData.action);
        return btn;
    }
}