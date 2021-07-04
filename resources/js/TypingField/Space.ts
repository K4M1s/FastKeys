import Letter, { LETTER_TYPE } from "./Letter";


/**
 * Space class.
 */
export default class Space extends Letter {

    /**
     * Creates an instance of space.
     * @param letterType Letter Type
     */
    constructor(letterType: LETTER_TYPE) {
        super(" ", letterType);
    }
}