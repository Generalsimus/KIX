import { rootWriter } from ".";
import { App } from "..";
import { getMapUrl } from "./utils/getMapUrl";

export function createCode(this: rootWriter) {

    this.responseJSCode = this.injectCode
    for (const fileName in this.codeByFileName) {
        const { code } = this.codeByFileName[fileName];
        this.responseJSCode += "\n" + code;
    }
    this.responseJSCode = `(function(${App.uniqAccessKey}){\n ${this.responseJSCode}\n${this.runCode}\n})(window.${App.windowModuleLocationName} || (window.${App.windowModuleLocationName} = {}))${getMapUrl(this)}`
}
