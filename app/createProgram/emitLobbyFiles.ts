import { createProgramHost } from ".";

export function emitLobbyFiles(this: createProgramHost) {
    this.emitFileLobby.forEach(filePath => {
        // console.log("🚀 --> file: emitLobbyFiles.ts --> line 5 --> emitLobbyFiles --> filePath", filePath);
        const sourceFile = this.getSourceFileByPath(filePath)
        // console.log("🚀 --> file: emitLobbyFiles.ts --> line 7 --> emitLobbyFiles --> filePath", filePath);
        // console.log("🚀 --> file:   --> sourceFile", sourceFile?.fileName);
        if (sourceFile) {
            this.emit(sourceFile);
        }
    })


    // console.log("🚀 --> file: emitLobbyFiles.ts --> line 14 --> emitLobbyFiles --> this.emitFileLobby", this.emitFileLobby);

    this.emitFileLobby.clear()


}