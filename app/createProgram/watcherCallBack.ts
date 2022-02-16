import { createProgramHost } from ".";
import { App } from "..";

export function watcherCallBack(this: createProgramHost, path: string) {
    path = this.getCanonicalFileName(path)
    const moduleInfo = App.moduleThree.get(path)
    moduleInfo && (moduleInfo.resolvedModuleNames = undefined);
    this.sourceFileCache.delete(path)

    const modulesCount = this.moduleRootNamesSet.size

    this.startBuildProcess();
    this.createProgram()
    this.emit(this.getSourceFileByPath(path));
    this.endBuildProcess();
    this.buildModules(this.moduleRootNamesSet.size - modulesCount)
    // console.log("🚀 --> file: getLocalFileWatcher.ts --> line 21 --> getLocalFileWatcher --> this.moduleRootNamesSet.size - modulesCount)", this.moduleRootNamesSet.size - modulesCount);
}