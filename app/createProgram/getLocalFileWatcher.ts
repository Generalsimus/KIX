import { createProgramHost } from ".";
import { App } from "..";
import { ModuleInfoType } from "../../utils/getModuleInfo";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export const getLocalFileWatcher = (host: createProgramHost) => {
    // var iiii = 0
    return host.watcher.createWatcher({
        event: "all",
        callBack: (eventName: string, path: string) => {
            // iiii++;
            // console.log(`START: ${iiii}`)

            host.watcherCallBack(path)
            // console.log(`\nEND: ${iiii}`)
        }
        // 
    })
}