"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModuleNamesResolver = void 0;
const typescript_1 = __importDefault(require("typescript"));
const resolve_1 = __importDefault(require("resolve"));
const index_1 = require("../app/index");
const createModuleInfo_1 = require("./createModuleInfo");
const reportDiagnostic_1 = require("./reportDiagnostic");
const path_1 = __importDefault(require("path"));
const createModuleNamesResolver = (host) => {
    const moduleResolutionCache = typescript_1.default.createModuleResolutionCache(index_1.App.runDirName, reportDiagnostic_1.formatDiagnosticsHost.getCanonicalFileName), moduleThree = index_1.App.moduleThree;
    return (moduleNames, containingFile, reusedNames, redirectedReference, compilerOptions, containingSourceFile) => {
        return loadWithLocalWithCache(moduleNames, moduleThree.get(containingFile), (moduleName) => typescript_1.default.resolveModuleName(moduleName, containingFile, compilerOptions, host, moduleResolutionCache, redirectedReference).resolvedModule);
    };
    function loadWithLocalWithCache(moduleNames, containinModuleInfo, moduleResolver) {
        return (containinModuleInfo.resolvedModuleNames ||
            moduleNames.flatMap((moduleName) => {
                const resolved = loadResolver(moduleName, containinModuleInfo, moduleResolver);
                return resolved ? [resolved] : [];
            }));
    }
    function loadResolver(moduleName, containinModuleInfo, moduleResolver) {
        var _a;
        const resolvedModule = ((_a = containinModuleInfo.moduleColection[moduleName]) === null || _a === void 0 ? void 0 : _a.resolvedModule) ||
            moduleResolver(moduleName) ||
            nodeModuleResolver(moduleName, path_1.default.dirname(containinModuleInfo.modulePath));
        if (!resolvedModule) {
            return;
        }
        const modulePath = resolvedModule.resolvedFileName;
        const childModule = moduleThree.get(modulePath);
        const moduleInfo = childModule || (0, createModuleInfo_1.createModuleInfo)(modulePath);
        containinModuleInfo.moduleColection[moduleName] = moduleInfo;
        return resolvedModule;
    }
};
exports.createModuleNamesResolver = createModuleNamesResolver;
function nodeModuleResolver(modulePath, fileDirectory) {
    try {
        return {
            resolvedFileName: typescript_1.default["normalizeSlashes"](resolve_1.default.sync(modulePath, {
                basedir: fileDirectory,
                extensions: [".js", path_1.default.extname(modulePath)],
            })),
            originalPath: undefined,
            extension: typescript_1.default.Extension.Js,
            isExternalLibraryImport: false,
            packageId: undefined,
        };
    }
    catch (_a) { }
}
