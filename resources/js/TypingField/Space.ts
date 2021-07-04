import Letter, { LETTER_TYPE } from "./Letter";

export default class Space extends Letter {
    constructor(letterType: LETTER_TYPE) {
        super(" ", letterType);
    }
}