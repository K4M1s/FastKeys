import { ResultWordData } from "../common/types";

export default class Result {

    public words: string;

    constructor(
        public speed: number, 
        public accuracy: number,
        public typos: number,
        public game: string,
        public originalText: string,
        words: ResultWordData[],
        public startTime: number,
        public endTime: number
    ) {
        this.words = JSON.stringify(words);
    }
}