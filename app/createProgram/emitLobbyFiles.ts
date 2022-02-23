import { createProgramHost } from ".";

export function emitLobbyFiles(this: createProgramHost) {
    this.emitFileLobby.forEach(filePath => {
        const sourceFile = this.getSourceFileByPath(filePath)
        // console.log("🚀 --> file:   --> sourceFile", sourceFile?.fileName);
        if (sourceFile) {
            this.emit(sourceFile);
        }
    })


    // console.log("🚀 --> file: emitLobbyFiles.ts --> line 14 --> emitLobbyFiles --> this.emitFileLobby", this.emitFileLobby);
    
    this.emitFileLobby.clear()
    
    
}