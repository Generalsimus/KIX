import { createProgramHost } from ".";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { normalizeSlashes } from "../../utils/normaliz";

export function watchFiles(this: createProgramHost) {
    if (!this.watch) return;
    this.watcher.add(this.rootNames)
    this.configWatcher.add(this.configFileParser.configFileName)
    this.configWatcher.on("all", this.configFileParser.onConfigFileChange)
    // "add" | "addDir" | "change" | "unlink" | "unlinkDir"
    this.watcher.on("all", (eventName: string, path: string) => {
        path = normalizeSlashes(path)
        this.cacheController.removeCachedName(path)

        const modulesCount = this.moduleRootNamesSet.size
        this.getReportDiagnoseTime()
        this.emit(this.createProgram().getSourceFileByPath(this.getCanonicalFileName(path) as any));
        this.diagnose()
        this.buildModules(this.moduleRootNamesSet.size - modulesCount)
    })
}