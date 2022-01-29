import { App } from "../..";

export const getPolyfillsStringCodes = () => {

    return [
        /* javascript */`
        const ${App.uniqAccessKey}_MODULE = (moduleIndex, module, exports) => Object.defineProperty(${App.uniqAccessKey}, moduleIndex, {
            get: () => (exports || (module(exports = {}), exports)), 
            configurable:true,
        }) 
        `
    ];
}


