import { Gamemode, Newable } from "../common/types";
import TypingField from "../TypingField/TypingField";

/**
 * Game
 */
export default class Game {


    /**
     * Gamemode
     */
    private gamemode: Gamemode | null = null;


    /**
     * Typing field of game
     */
    public typingField: TypingField;

    constructor() {
        this.typingField = new TypingField(document.querySelector(".typing-field__wrapper")!);
    }

    public async setGamemode(gamemodeClass: Newable<Gamemode>) {
        this.gamemode = new gamemodeClass(this);

        this.createGameTitle()
        await this.prepareGame();
        this.hookEvents();
    }

    private createGameTitle(): void {
        const rootElement = this.typingField.getRootHTMLElement();
        
        const header = document.createElement("div");
        header.className = "typing-field__header";

        const title = document.createElement("h1");
        title.innerText = this.gamemode!.name;
        
        const description = document.createElement("p");
        description.innerText = this.gamemode!.description;

        header.appendChild(title);
        header.appendChild(description);

        rootElement.insertBefore(header, rootElement.firstChild);
    }

    private async prepareGame(): Promise<void> {
        const text = await this.gamemode!.loadText();
        this.typingField.setText(text);

        await this.gamemode!.prepareGame();
    }

    private hookEvents(): void {
        this.typingField.onStartedTyping(() => {
            this.gamemode!.onStartedTyping();
        })

        this.typingField.onFinishedTyping(() => {
            this.gamemode!.onFinishedTyping();
        })
    }

    public async reset(): Promise<void> {
        this.typingField.reset();
        const text = await this.gamemode?.loadText();
        if (text) {
            this.typingField.setText(text);
        }
    }
}