import { WordTimestamps } from "../TypingField/Word";

export interface AppWindow extends Window {
    Laravel: any;
    initGame: Function;
    game: any
}

export interface GameEndData {
    speed: number;
    accuracy: number;
    typos: number;
    words: ResultWordData[];
    originalText: string;
    letterDeltaTime: number;
    startTime: Date;
    endTime: Date;
}

export interface GameResult {
    game: string;
    speed: number;
    accuracy: number;
    typos: number;
    originalText: string;
    words: ResultWordData[];
    startTime: Date;
    endTime: Date;
}

export interface ResultWordData {
    word: string;
    typed: string;
    timestamps: WordTimestamps | null;
}