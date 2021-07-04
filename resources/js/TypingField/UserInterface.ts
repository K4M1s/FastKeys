export enum USER_INTERFACE_ELEMENTS {
    PROGRESS,
    TYPOS,
    SPEED,
    TIME
}

interface ElementStructure {
    element: HTMLElement;
    valueElement: HTMLElement;
}

/**
 * User interface class
 */
export default class UserInterface {

    private rootElement: HTMLElement;
    private elements: ElementStructure[] = [];

    constructor() {
        this.rootElement = document.createElement("div");
        this.rootElement.classList.add("user-interface");

        this.elements[USER_INTERFACE_ELEMENTS.PROGRESS] = this.createUserInterfaceElement('ui-progress-value', "Progress ", "0%");
        this.rootElement.appendChild(this.elements[USER_INTERFACE_ELEMENTS.PROGRESS].element);

        this.elements[USER_INTERFACE_ELEMENTS.TYPOS] = this.createUserInterfaceElement('ui-typos-value', "Typos ", "0");
        this.rootElement.appendChild(this.elements[USER_INTERFACE_ELEMENTS.TYPOS].element);

        this.elements[USER_INTERFACE_ELEMENTS.SPEED] = this.createUserInterfaceElement('ui-speed-value', "Speed ", "0 WPM");
        this.rootElement.appendChild(this.elements[USER_INTERFACE_ELEMENTS.SPEED].element);

        this.elements[USER_INTERFACE_ELEMENTS.TIME] = this.createUserInterfaceElement('ui-time-value', "Time ", "0:00");
        this.rootElement.appendChild(this.elements[USER_INTERFACE_ELEMENTS.TIME].element);
    }


    /**
     * Appends element to given parent.
     * @param parent Parent element which should contain User Interface element.
     */
    public appendElement(parent: HTMLElement) {
        parent.appendChild(this.rootElement);
    }

    /**
     * Sets progress
     * @param progress Progress in percentage.
     */
    public setProgress(progress: number) {
        this.elements[USER_INTERFACE_ELEMENTS.PROGRESS].valueElement.innerText = `${progress}%`;
    }

    /**
     * Sets typos
     * @param typos Number of typos.
     */
    public setTypos(typos: number) {
        this.elements[USER_INTERFACE_ELEMENTS.TYPOS].valueElement.innerText = `${typos}`;
    }

    /**
     * Sets speed
     * @param speed Current typing speed.
     */
    public setSpeed(speed: number) {
        this.elements[USER_INTERFACE_ELEMENTS.SPEED].valueElement.innerText = `${speed} WPM`;
    }

    /**
     * Sets time
     * @param time String representing remaining time.
     */
    public setTime(time: string) {
        this.elements[USER_INTERFACE_ELEMENTS.TIME].valueElement.innerText = time;
    }


    /**
     * Sets visible interface elements.
     * @param toShow Array of elements that should be visible.
     */
    public setVisible(toShow: USER_INTERFACE_ELEMENTS[]): void {
        // Hide all elements;
        this.elements.forEach(element => this.hideElement(element.element));

        // Show provided elements.
        toShow.forEach(element => {
            this.showElement(this.elements[element].element);
        });
    }


    /**
     * Hides element
     * @param element Element to hide.
     */
    private hideElement(element: HTMLElement): void {
        element.classList.add("user-interface__element--hide");
    }


    /**
     * Shows element
     * @param element Element to show.
     */
    private showElement(element: HTMLElement): void {
        element.classList.remove("user-interface__element--hide");
    }

    /**
     * Creates user interface element
     * @param id Element ID
     * @param text Text to display
     * @param value Default value
     * @param [hidden] Optional: Should be hidden?
     * @returns user interface element 
     */
    private createUserInterfaceElement(id: string, text: string, value: string, hidden = false): ElementStructure {
        const element = document.createElement("div");
        element.classList.add("user-interface__element");
        if (hidden) {
            element.classList.add("user-interface__element--hide");
        }
        element.innerText = text;

        const valueElement = document.createElement("span");
        valueElement.id = id;
        valueElement.classList.add("user-interface__value");
        valueElement.innerText = value;
        element.appendChild(valueElement);

        return {
            element,
            valueElement
        };
    }
}