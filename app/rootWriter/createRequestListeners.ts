import { rootWriter } from ".";
import { App } from "..";
import { filePathToUrl } from "../../utils/filePathToUrl";

export function createRequestListeners(this: rootWriter) {
    const requestPath = filePathToUrl(this.outFileName);
    App.requestsThreshold.set(requestPath, () => {
        if (!this.responseJSCode) {
            this.createCode();
        }
        // res.end(this.responseJSCode);
        // console.log({ responseJSCode: this.responseJSCode });
        return this.responseJSCode!;
    })
    if (this.host.options.sourceMap && !this.isNodeModules) {
        App.requestsThreshold.set(`${requestPath}.map`, () => {
            if (!this.responseMAPCode) {
                this.createMapCode();
            }
            // res.end(this.responseMAPCode)
            return this.responseMAPCode!;
        })
    }

}