import { createProgramHost } from ".";
import { ModuleInfoType } from "../../utils/getModuleInfo";


export function watchFiles(this: createProgramHost) {
    this.watcher.add(this.rootNames)
    this.configWatcher.add(this.configFileParser.configFileName)
    this.configWatcher.on("all", this.configFileParser.onConfigFileChange)
    // "add" | "addDir" | "change" | "unlink" | "unlinkDir"
    this.watcher.on("all", (eventName: string, path: string) => {
        console.log("🚀 --> file: watchFiles.ts --> line 7 --> this.watcher.on --> path", eventName, path);
        // this.recreateProgram();
        this.emit();
        this.diagnose()
    })
}