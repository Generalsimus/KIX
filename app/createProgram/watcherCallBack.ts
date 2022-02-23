import { createProgramHost } from ".";
import { App } from "..";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export function watcherCallBack(this: createProgramHost, path: string) {
    path = normalizeSlashes(path)
    const moduleInfo = App.moduleThree.get(path)
    moduleInfo && (moduleInfo.resolvedModuleNames = undefined);
    // console.log(this.sourceFileCache.keys());
    // console.log(path);
    this.sourceFileCache.delete(path)

    const modulesCount = this.moduleRootNamesSet.size

    this.startBuildProcess();
    this.createProgram()
    this.emitFileLobby.add(path)
    this.emitLobbyFiles()
    this.endBuildProcess();
    this.buildModules(this.moduleRootNamesSet.size - modulesCount)
    // console.log("🚀 --> file: getLocalFileWatcher.ts --> line 21 --> getLocalFileWatcher --> this.moduleRootNamesSet.size - modulesCount)", this.moduleRootNamesSet.size - modulesCount);
}