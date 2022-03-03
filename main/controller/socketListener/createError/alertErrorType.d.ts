export interface AlertErrorType {
    fileText?: string;
    messageText: string;
    start: number | undefined;
    length: number | undefined;
    filePath?: string;
}