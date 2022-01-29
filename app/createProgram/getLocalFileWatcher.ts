import { createProgramHost } from ".";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export const getLocalFileWatcher = (host: createProgramHost) => {


    return host.watcher.createWatcher({
        event: "all",
        callBack: (eventName: string, path: string) => {
            // console.log("🚀 --> file: getLocalFileWatcher.ts --> line 11 --> getLocalFileWatcher --> path", host.createProgram().getSourceFileByPath(host.getCanonicalFileName(path) as any));
            path = normalizeSlashes(path)
            host.cacheController.removeCachedName(path)

            const modulesCount = host.moduleRootNamesSet.size
            host.getReportDiagnoseTime()
            host.emit(host.createProgram().getSourceFileByPath(host.getCanonicalFileName(path) as any));
            host.diagnose()

            // console.log("🚀 --> file: getLocalFileWatcher.ts --> line 21 --> getLocalFileWatcher --> host.moduleRootNamesSet.size - modulesCount)", host.moduleRootNamesSet.size - modulesCount);
      
            host.buildModules(host.moduleRootNamesSet.size - modulesCount)
            // console.log("🚀 --> file: getLocalFileWatcher.ts --> line 21 --> getLocalFileWatcher --> host.moduleRootNamesSet.size - modulesCount)", host.moduleRootNamesSet.size - modulesCount);
        }
    })
}