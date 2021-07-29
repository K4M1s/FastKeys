import { Gamemode, ResultWordData } from "../common/types";

export default class Result {

    public words: string;

    constructor(
        public gamemode: string,
        public originalText: string,
        public speed: number,
        public accuracy: number,
        public typos: number,
        public startTime: number,
        public endTime: number,
        words: ResultWordData[]
    ) {
        this.words = JSON.stringify(words);
    }
}