import { createProgramHost } from ".";
import { ModuleInfoType } from "../../utils/getModuleInfo";


export function watchFiles(this: createProgramHost) {
    if (!this.watch) return;
    this.watcher.add(this.rootNames)
    this.configWatcher.add(this.configFileParser.configFileName)
    this.configWatcher.on("all", this.configFileParser.onConfigFileChange)
    // "add" | "addDir" | "change" | "unlink" | "unlinkDir"
    this.watcher.on("all", (eventName: string, path: string) => {
        console.log("🚀 --> file: watchFiles.ts --> line 7 --> this.watcher.on --> path", eventName, path);
        // this.cacheController.Cache
        console.log("🚀 --> file: watchFiles.ts --> line 14 --> this.watcher.on --> this.cacheController.Cache", Object.values(this.cacheController.cache));
        // this.oldProgram?.getFilesByNameMap()
        // this.getSourceFile(path)
        // this.oldProgram?.getSourceFileByPath(path as any)
        console.log("🚀 --> file: watchFiles.ts --> line 15 --> this.watcher.on --> this.oldProgram?.getSourceFileByPath(path as any)", this.oldProgram?.getSourceFileByPath(path as any));
        // this.recreateProgram();
        this.getReportDiagnoseTime()
        this.emit();
        this.diagnose()
    })
}