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
exports.createCancellationToken = exports.getModuleWindowName = exports.getModuleFiles = exports.getImportModuleName = exports.parseJsonFile = exports.fixLibFileLocationInCompilerOptions = exports.createHost = exports.FilesThree = exports.getColumnName = exports.deepAssign = void 0;
const typescript_1 = require("typescript");
const fs_1 = __importStar(require("fs"));
const posix_1 = __importDefault(require("path/posix"));
const tsserverlibrary_1 = __importDefault(require("typescript/lib/tsserverlibrary"));
const createCssSourceFile_1 = __importDefault(require("./createCssSourceFile"));
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
exports.FilesThree = new Map();
const createHost = (__compilerOptions) => {
    const getSourceFileByExtName = (fileName, languageVersion) => {
        // console.log("🚀 getSourceFileByExtName ---> fileName", fileName)
        switch (posix_1.default.extname(fileName).toLocaleLowerCase()) {
            case ".ts":
            case ".tsx":
            case ".js":
            case ".jsx":
            case ".json":
                return (0, typescript_1.createSourceFile)(fileName, (0, fs_1.readFileSync)(fileName, "utf-8"), languageVersion, true);
            case ".scss":
            case ".css":
                return (0, createCssSourceFile_1.default)(fileName, (0, fs_1.readFileSync)(fileName, "utf-8"), languageVersion);
            // default
        }
    };
    const isCssRegex = /\.(((c|le|sa|sc)ss)|styl)$/, _HOST = (0, typescript_1.createCompilerHost)(__compilerOptions, true), currentDirectory = _HOST.getCurrentDirectory(), getCanonicalFileName = (0, typescript_1.createGetCanonicalFileName)(_HOST.useCaseSensitiveFileNames()), moduleResolutionCache = (0, typescript_1.createModuleResolutionCache)(currentDirectory, getCanonicalFileName), Module_loader = function (moduleName, containingFile, redirectedReference) {
        if (isCssRegex.test(moduleName)) {
            return {
                extension: tsserverlibrary_1.default.Extension.Dts,
                isExternalLibraryImport: false,
                resolvedFileName: posix_1.default.join(posix_1.default.dirname(containingFile), moduleName),
            };
        }
        return (0, typescript_1.resolveModuleName)(moduleName, containingFile, __compilerOptions, Host, moduleResolutionCache, redirectedReference).resolvedModule;
    }, Host = Object.assign(_HOST, {
        getSourceFile: (fileName, languageVersion) => {
            if ((0, fs_1.existsSync)(fileName)) {
                // let sourceFile = FilesThree.get(fileName)
                // if (sourceFile) {
                //     return sourceFile
                //     // FilesThree.set(fileName,sourceFile)
                // }
                // sourceFile = getSourceFileByExtName(fileName, languageVersion)
                // return FilesThree.set(fileName, sourceFile), sourceFile
                return exports.FilesThree.get(fileName.toLowerCase()) || getSourceFileByExtName(fileName, languageVersion);
            }
        },
        resolveModuleNames: function (moduleNames, containingFile, _reusedNames, redirectedReference) {
            // console.log({ resolved: loadWithLocalCache(Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader) })
            return (0, typescript_1.loadWithLocalCache)(typescript_1.Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, Module_loader);
        },
        resetFilesThree: (newFilesMap) => (exports.FilesThree = new Map([...exports.FilesThree, ...newFilesMap])),
        deleteFileinThree: (filesThreeLocationPath) => (exports.FilesThree.delete(filesThreeLocationPath)),
        // setFileinThree: (key, file) => (FilesThree.set(key, file)),
        getDefaultLibLocation: () => (0, typescript_1.normalizeSlashes)(posix_1.default.resolve(__dirname + "/../node_modules/typescript/lib/")),
    });
    return Host;
};
exports.createHost = createHost;
const fixLibFileLocationInCompilerOptions = (compilerOptions, host) => {
    const defaultLibFileName = host.getDefaultLibFileName(compilerOptions);
    const libDirectory = posix_1.default.dirname(defaultLibFileName);
    const newLibs = new Set([defaultLibFileName]);
    if (compilerOptions.lib) {
        for (const lib of compilerOptions.lib) {
            const libFilePath = posix_1.default.join(libDirectory, `/lib.${lib.toLowerCase()}.d.ts`);
            if (fs_1.default.existsSync(libFilePath)) {
                newLibs.add((0, typescript_1.normalizeSlashes)(libFilePath));
            }
        }
    }
    else {
        newLibs.add(defaultLibFileName);
    }
    compilerOptions.lib = [...newLibs];
    return compilerOptions;
};
exports.fixLibFileLocationInCompilerOptions = fixLibFileLocationInCompilerOptions;
// "../../../node_modules/typescript/lib"
// import sss from 
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
let ModuleUnnesesaryIndex = 0;
const getModuleWindowName = () => {
    return `_KIX${++ModuleUnnesesaryIndex}${new Date().getTime()}`;
};
exports.getModuleWindowName = getModuleWindowName;
const createCancellationToken = () => {
    let requesteCancell = false;
    return {
        isCancellationRequested: () => { return requesteCancell; },
        throwIfCancellationRequested: () => { },
        requesteCancell: () => { requesteCancell = true; },
    };
};
exports.createCancellationToken = createCancellationToken;
