import { createProgramHost } from ".";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export const getLocalFileWatcher = (host: createProgramHost) => {


    return host.watcher.createWatcher({
        event: "all",
        callBack: (eventName: string, path: string) => {
            path = normalizeSlashes(path)
            host.cacheController.removeCachedName(path)

            const modulesCount = host.moduleRootNamesSet.size
            host.getReportDiagnoseTime()
            host.emit(host.createProgram().getSourceFileByPath(host.getCanonicalFileName(path) as any));
            host.diagnose()
            host.buildModules(host.moduleRootNamesSet.size - modulesCount)
        }
    })
}