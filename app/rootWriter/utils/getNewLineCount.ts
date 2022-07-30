export const getNewLineCount = (content: string) => {
    return (content.match(/\n/g)?.length ?? 0) + 1
}