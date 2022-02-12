import { rootWriter } from ".";
import { App } from "..";
import { filePathToUrl } from "../../utils/filePathToUrl";

export function createRequestListeners(this: rootWriter) {
    const requestPath = filePathToUrl(this.outFileName);
    App.requestsThreshold.set(requestPath, (req, res) => {
        if (!this.responseJSCode) {
            this.createCode();
        }
        res.end(this.responseJSCode);
    })
    if (this.host.options.sourceMap) {
        App.requestsThreshold.set(requestPath + ".map", (req, res) => {
            if (!this.responseMAPCode) {
                this.createMapCode();
            }
            res.end(this.responseMAPCode)
        })
    }

}