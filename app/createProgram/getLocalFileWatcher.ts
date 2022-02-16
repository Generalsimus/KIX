import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export const getLocalFileWatcher = (host: createProgramHost) => {


    return host.watcher.createWatcher({
        event: "all",
        callBack: (eventName: string, path: string) => host.watcherCallBack(path)
    })
}