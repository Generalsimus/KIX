"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleFiles = exports.getImportModuleName = exports.parseJsonFile = exports.createHost = exports.getColumnName = exports.deepAssign = void 0;
const typescript_1 = require("typescript");
const fs_1 = __importStar(require("fs"));
const posix_1 = __importDefault(require("path/posix"));
const tsserverlibrary_1 = __importDefault(require("typescript/lib/tsserverlibrary"));
const deepAssign = (target, ...sources) => {
    for (const source of sources) {
        for (let k in source) {
            let vs = source[k], vt = target[k];
            if (Object(vs) == vs && Object(vt) === vt) {
                target[k] = (0, exports.deepAssign)(vt, vs);
                continue;
            }
            target[k] = source[k];
        }
    }
    return target;
};
exports.deepAssign = deepAssign;
var Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const getColumnName = (i) => {
    var l = Chars.length, p = i >= l ? (0, exports.getColumnName)(Math.floor(i / l) - 1) : "", ls = Chars[i % l];
    return p + ls;
};
exports.getColumnName = getColumnName;
const createHost = (__compilerOptions) => {
    let FilesThree = new Map();
    const getSourceFileByExtName = (fileName, languageVersion) => {
        console.log("🚀 getSourceFileByExtName ---> fileName", fileName);
        switch (posix_1.default.extname(fileName).toLocaleLowerCase()) {
            case ".ts":
            case ".tsx":
            case ".js":
            case ".jsx":
            case ".json":
                return (0, typescript_1.createSourceFile)(fileName, (0, fs_1.readFileSync)(fileName, "utf-8"), languageVersion, true);
            case ".scss":
            case ".css":
                return (0, typescript_1.createSourceFile)(fileName, `
                 var sfsdfs = 2
                export { sfsdfs };
                export default "44444";
                `, languageVersion, true);
            // default
        }
    };
    const isCssRegex = /\.(((c|le|sa|sc)ss)|styl)$/, _HOST = (0, typescript_1.createCompilerHost)(__compilerOptions, true), currentDirectory = _HOST.getCurrentDirectory(), getCanonicalFileName = (0, typescript_1.createGetCanonicalFileName)(_HOST.useCaseSensitiveFileNames()), moduleResolutionCache = (0, typescript_1.createModuleResolutionCache)(currentDirectory, getCanonicalFileName), Module_loader = function (moduleName, containingFile, redirectedReference) {
        if (isCssRegex.test(moduleName)) {
            return {
                extension: tsserverlibrary_1.default.Extension.Js,
                isExternalLibraryImport: false,
                resolvedFileName: posix_1.default.join(posix_1.default.dirname(containingFile), moduleName),
            };
        }
        return (0, typescript_1.resolveModuleName)(moduleName, containingFile, __compilerOptions, Host, moduleResolutionCache, redirectedReference).resolvedModule;
    }, Host = Object.assign(_HOST, {
        getSourceFile: (fileName, languageVersion) => {
            if ((0, fs_1.existsSync)(fileName)) {
                return FilesThree.get(fileName) || getSourceFileByExtName(fileName, languageVersion);
            }
        },
        resolveModuleNames: function (moduleNames, containingFile, _reusedNames, redirectedReference) {
            console.log({ resolved: (0, typescript_1.loadWithLocalCache)(typescript_1.Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader) });
            return (0, typescript_1.loadWithLocalCache)(typescript_1.Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader);
        },
        resetFilesThree: (newFilesMap) => (FilesThree = new Map([...FilesThree, ...newFilesMap]))
    });
    return Host;
};
exports.createHost = createHost;
const parseJsonFile = (fileName) => {
    return fs_1.default.existsSync(fileName) ? (0, typescript_1.parseConfigFileTextToJson)(fileName, (0, fs_1.readFileSync)(fileName, "utf8")).config : {};
};
exports.parseJsonFile = parseJsonFile;
const getImportModuleName = () => `________KIX__IMPORT__MODULE__${new Date().getTime()}__`;
exports.getImportModuleName = getImportModuleName;
const getModuleFiles = (Module, ModuleFiles) => {
    for (const MODULE_PATH in Module.NodeModules) {
        ModuleFiles.add(MODULE_PATH);
    }
    for (const LocalModulesPathKey in Module.LocalModules) {
        (0, exports.getModuleFiles)(Module.LocalModules[LocalModulesPathKey], ModuleFiles);
    }
};
exports.getModuleFiles = getModuleFiles;
//# sourceMappingURL=utils.js.map