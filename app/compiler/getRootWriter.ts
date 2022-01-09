import ts from "typescript"


export const getRootWriter = (rootFileName: string, WriterProgram: ts.Program) => {
    // const sources = {}
    return {
        text: '',
        rootFileName,
        outPutFileName: '',
        sourceMap: {
            version: 3,
            sources: [],
            names: [],
            mappings: "CAAA",
            sourcesContent: [],
            file: "app.js",
        },
        writeSourceFile(sourceFile: ts.SourceFile) {
            console.log("🚀 --> file: getRootWriter.ts --> line 18 --> writeSourceFile --> sourceFile", sourceFile.fileName);
            WriterProgram.emit(sourceFile, (fileName: string, content: string) => {
                if (fileName.endsWith(".js")) {
                    this.text += content;
                } else if (fileName.endsWith(".map")) {
                    const map = JSON.parse(content)
                    // sources[fileName] = map
                }
                console.log(fileName, content)
            })
        }
    };
}