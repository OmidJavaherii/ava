import { Tab } from "./Enums";
export interface TranscriptionSegment {
    start: string;
    end: string;
    text: string;
}

export interface Transcription {
    duration: string;
    media_url: string;
    segments: TranscriptionSegment[]
    stats: { words: number; known_words: number };
}

export interface TranscriptionRequest {
    id: number,
    request_type: string,
    response_data: Transcription[]
}

export interface RequestData {
    language: string;
    media_urls: string;
}

export interface Result {
    id: number;
    request_type: string;
    request_data: RequestData;
    duration: string;
    date: string;
}

export interface ExtendedResult extends Result {
    file_type: string;
}

export interface ArchiveResult {
    count: number;
    next: string | null;
    previous: string | null;
    results: Result[];
}

export interface ArchiveList extends ArchiveResult {
    results: ExtendedResult[];
}

export interface TimedText {
    start: number;
    end: number;
    text: string;
}

export interface AudioSubmit {
    onSubmit: (tab: Tab, audio: string | File) => void
}