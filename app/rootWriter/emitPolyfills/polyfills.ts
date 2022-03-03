import { App } from "../..";

export const getPolyfillsStringCodes = () => {

    return [
        /* javascript */`
            const ${App.uniqAccessKey}_MODULE = (moduleIndex, moduleFunc, exports, nodeModuleExport) => Object.defineProperty(${App.uniqAccessKey}, moduleIndex, {
                    get: () => (exports || (moduleFunc(exports = {}, {}, nodeModuleExport = { exports:{} }), exports = { ...exports, ...(nodeModuleExport.exports || {})})),
                    configurable: true,
            })
        `
    ];
}


