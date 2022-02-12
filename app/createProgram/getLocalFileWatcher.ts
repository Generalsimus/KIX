import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export const getLocalFileWatcher = (host: createProgramHost) => {

    // resolvedModuleNames
    return host.watcher.createWatcher({
        event: "all",
        callBack: (eventName: string, path: string) => {
            path = normalizeSlashes(path);
            const moduleInfo = App.moduleThree.get(path)
            moduleInfo && (moduleInfo.resolvedModuleNames = undefined);
            host.sourceFileCache.delete(path)

            const modulesCount = host.moduleRootNamesSet.size
            host.getReportDiagnoseTime()
            host.emit(host.createProgram().getSourceFileByPath(host.getCanonicalFileName(path) as any));
            host.diagnose()

            host.buildModules(host.moduleRootNamesSet.size - modulesCount)
            // console.log("🚀 --> file: getLocalFileWatcher.ts --> line 21 --> getLocalFileWatcher --> host.moduleRootNamesSet.size - modulesCount)", host.moduleRootNamesSet.size - modulesCount);
        }
    })
}