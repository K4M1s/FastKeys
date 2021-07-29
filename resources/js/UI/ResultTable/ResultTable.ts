import axios from "axios";

export default class ResutlTable {

    private tableElements: {
        table: HTMLElement,
        header: HTMLElement,
        body: HTMLElement
    } = {
        table: document.createElement("div"),
        header: document.createElement("div"),
        body: document.createElement("div")
    }

    private refreshTimer: NodeJS.Timeout | null = null;

    constructor(private parentElement: HTMLElement, private gamemode: String) {
        parentElement.appendChild(this.tableElements.table);
        this.createTable()

        this.renderResultBody();
        this.startRefreshTimer();
    }

    private createTable(): void {
        this.tableElements.table.classList.add("result-table");

        this.tableElements.header.classList.add("result-table__header");
        const headingsRow = document.createElement("div");
        headingsRow.classList.add("result-table__row");
        this.tableElements.header.appendChild(headingsRow);
        const headings = ["user", "speed", "accuracy", "typos"];
        headings.forEach(heading => {
            const headingElement = document.createElement("div");
            headingElement.classList.add('result-table__column', `result-table__column--${heading}`);
            headingElement.innerText = heading;
            headingsRow.appendChild(headingElement);
        })
        this.tableElements.table.appendChild(this.tableElements.header);

        this.tableElements.body.classList.add("result-table__body");
        this.tableElements.table.appendChild(this.tableElements.body);
    }

    private startRefreshTimer(): void {
        this.refreshTimer = setInterval(() => {
            this.refreshResults();
        }, 2000);
    }

    private refreshResults(): void {
        this.renderResultBody();
    }

    private stopRefreshTimer(): void {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
    }

    private async getData(): Promise<ResultEntry[] | null> {
        try {
            const response = await axios.get<ResultEntry[]>("/result", {
                params: {
                    game: this.gamemode
                }
            })

            return response.data;

        } catch(error) {
            return null;
        }
    }

    private async renderResultBody(): Promise<void> {
        const data = await this.getData();

        if (data === null) {
            this.tableElements.body.innerText = `<div class="result-table__row"><div class="result-table__column">Could not fetch latest results 😥</div></div>`
            return;
        }

        if (data.length === 0) {
            this.tableElements.body.innerHTML = `<div class="result-table__row"><div class="result-table__column">There are no results yet. You can be first 😎</div></div>`
            return;
        }

        const resultElements: HTMLElement[] = data.map(result => {
            const row = document.createElement("div");
            row.classList.add("result-table__row");
            const headings = ["user", "speed", "accuracy", "typos"];
            headings.forEach(heading => {
                const col = document.createElement("div");
                col.classList.add("result-table__column", `result-table__column--${heading}`);
                switch(heading) {
                    case "user":
                        col.innerText = result.user ? result.user : "Anonymous";
                        break;
                    case "speed":
                        col.innerText = `${result.speed.toString()} WPM`;
                        break;
                    case "accuracy":
                        col.innerText = `${result.accuracy.toString()}%`;
                        break;
                    case "typos":
                        col.innerText = result.typos.toString();
                        break;
                }
                row.appendChild(col);
            })

            return row;
        })

        this.tableElements.body.innerHTML = '';
        resultElements.forEach(element => {
            this.tableElements.body.appendChild(element);
        })
    }

}

export interface ResultEntry {
    id: number,
    speed: number,
    accuracy: number,
    typos: number,
    game: string,
    user: string | null
}