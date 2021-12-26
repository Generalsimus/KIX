"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModuleFileHostModuleRegistrator = exports.useLocalFileHostModuleRegistrator = exports.geModuleLocationMeta = exports.createObjectPropertyLoop = exports.getTransformersObject = exports.watchModuleFileChange = exports.nodeModuleResolver = exports.nodeModuleThree = exports.defaultModuleThree = exports.codeControlerIndex = exports.codePolyfillPath = exports.codeControlerPath = exports.startModulesIndex = void 0;
const typescript_1 = require("typescript");
const tsserverlibrary_1 = __importDefault(require("typescript/lib/tsserverlibrary"));
const resolve_1 = __importDefault(require("resolve"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const App_1 = require("../../App");
const { createToken, createBinaryExpression, createVariableStatement, createVariableDeclarationList, createVariableDeclaration, createBlock, createIdentifier, createPropertyAccessExpression, createObjectLiteralExpression, createParameterDeclaration, createParenthesizedExpression, createArrowFunction, createCallExpression, createObjectBindingPattern, createBindingElement } = typescript_1.factory;
exports.startModulesIndex = 1;
const defaultModules = {
    kix: {
        moduleIndex: exports.startModulesIndex++,
        modulePath: App_1.App.__kixModuleLocation,
        isNodeModule: true,
        __Module_Window_Name: App_1.App.__compilerOptions.__Node_Module_Window_Name,
        moduleColection: {},
        isAsyncModule: false,
    }
};
exports.codeControlerPath = (0, typescript_1.normalizeSlashes)(path_1.default.join(__dirname, "./../../../../main/codeController/index.js"));
exports.codePolyfillPath = (0, typescript_1.normalizeSlashes)(path_1.default.join(__dirname, "./../../../../main/polyfill.js"));
exports.codeControlerIndex = exports.startModulesIndex++;
exports.defaultModuleThree = [
    [defaultModules.kix.modulePath, defaultModules.kix],
    [exports.codeControlerPath, {
            moduleIndex: exports.codeControlerIndex,
            modulePath: exports.codeControlerPath,
            isNodeModule: true,
            __Module_Window_Name: App_1.App.__compilerOptions.__Node_Module_Window_Name,
            moduleColection: {},
            isAsyncModule: false,
        }],
    [exports.codePolyfillPath, {
            moduleIndex: exports.startModulesIndex++,
            modulePath: exports.codePolyfillPath,
            isNodeModule: true,
            __Module_Window_Name: App_1.App.__compilerOptions.__Node_Module_Window_Name,
            moduleColection: {},
            isAsyncModule: false,
        }],
];
exports.nodeModuleThree = new Map(exports.defaultModuleThree);
const nodeModuleResolver = (modulePath, fileDirectory) => {
    try {
        return {
            resolvedFileName: (0, typescript_1.normalizeSlashes)(resolve_1.default.sync(modulePath, {
                basedir: fileDirectory,
                extensions: ['.js', '.ts', '.jsx', '.tsx', path_1.default.extname(modulePath)],
            })),
            originalPath: undefined,
            extension: tsserverlibrary_1.default.Extension.Js,
            isExternalLibraryImport: false,
            packageId: undefined
        };
    }
    catch {
        return {
            resolvedFileName: defaultModules[modulePath].modulePath,
            originalPath: undefined,
            extension: tsserverlibrary_1.default.Extension.Js,
            isExternalLibraryImport: true,
            packageId: undefined
        };
    }
};
exports.nodeModuleResolver = nodeModuleResolver;
const watchModuleFileChange = (NODE, moduleInfo, { visitedSourceFilesMap, __isNodeModuleBuilding, cancellationToken: { requesteCancell }, changeFileCallback }) => {
    if (!((!moduleInfo.fileWatcher && App_1.App.__Dev_Mode && !__isNodeModuleBuilding) &&
        (!moduleInfo.isAsyncModule || (moduleInfo.isAsyncModule && !moduleInfo.isEs6Module)))) {
        return;
    }
    moduleInfo.fileWatcher = chokidar_1.default.watch(NODE.originalFileName).on('change', (event, path) => {
        delete moduleInfo.resolvedModuleNames;
        App_1.App.__Host.deleteFileinThree(NODE.path);
        visitedSourceFilesMap.delete(NODE.originalFileName);
        requesteCancell();
        changeFileCallback();
        App_1.App.server.socketClientSender("RESTART_SERVER", {});
    });
};
exports.watchModuleFileChange = watchModuleFileChange;
const concatBeforOrAfterTransformers = (BeforeOrAfter, transfromers = {}) => {
    for (const transformersObject of BeforeOrAfter) {
        for (const transfromersKey in transformersObject)
            if (transfromersKey in transfromers) {
                const transfromer = transfromers[transfromersKey];
                const newtransfromer = transformersObject[transfromersKey];
                transfromers[transfromersKey] = (node, ...args) => newtransfromer(transfromer(node, ...args), ...args);
            }
            else {
                transfromers[transfromersKey] = transformersObject[transfromersKey];
            }
    }
    return transfromers;
};
const getTransformersObject = (before, after) => {
    const transpilerBefore = concatBeforOrAfterTransformers(before);
    const transpilerAfter = concatBeforOrAfterTransformers(after);
    return {
        before: [
            (CTX) => {
                const visitor = (NODE) => {
                    return (transpilerBefore[NODE.kind] || typescript_1.visitEachChild)(NODE, visitor, CTX);
                };
                return visitor;
            }
        ],
    };
};
exports.getTransformersObject = getTransformersObject;
const createObjectPropertyLoop = (namesObject, returnValue = []) => {
    for (const nameKey in namesObject) {
        const value = namesObject[nameKey];
        returnValue.push(createBindingElement(undefined, value && createIdentifier(nameKey), value && (0, exports.createObjectPropertyLoop)(value) || createIdentifier(nameKey), undefined));
    }
    return createObjectBindingPattern(returnValue);
};
exports.createObjectPropertyLoop = createObjectPropertyLoop;
const geModuleLocationMeta = (moduleInfo, compilerOptions) => {
    if (!moduleInfo) {
        return;
    }
    const propNode = typescript_1.factory.createNumericLiteral(moduleInfo.moduleIndex);
    return moduleInfo.__Module_Window_Name === compilerOptions.__Import_Module_Name ?
        [compilerOptions.__Import_Module_Name, propNode] :
        ["window", typescript_1.factory.createStringLiteral(moduleInfo.__Module_Window_Name), propNode];
};
exports.geModuleLocationMeta = geModuleLocationMeta;
const useLocalFileHostModuleRegistrator = (oldhost, compilerOptions) => {
    let incrementModuleIndex = exports.startModulesIndex;
    const moduleThree = compilerOptions.moduleThree, currentDirectory = oldhost.getCurrentDirectory(), getCanonicalFileName = (0, typescript_1.createGetCanonicalFileName)(oldhost.useCaseSensitiveFileNames()), moduleResolutionCache = (0, typescript_1.createModuleResolutionCache)(currentDirectory, getCanonicalFileName), Module_loader = (moduleName, containingFile, containinModuleInfo, redirectedReference, isMainAsyncModule) => {
        let resolvedModule = containinModuleInfo.moduleColection[moduleName];
        if (resolvedModule) {
            return resolvedModule.resolvedModule;
        }
        resolvedModule = ((0, typescript_1.resolveModuleName)(moduleName, containingFile, compilerOptions, newHost, moduleResolutionCache, redirectedReference).resolvedModule ||
            (0, exports.nodeModuleResolver)(moduleName, path_1.default.dirname(containingFile)));
        if (!resolvedModule) {
            return;
        }
        if (resolvedModule.extension === tsserverlibrary_1.default.Extension.Dts) {
            return resolvedModule;
        }
        const modulePath = resolvedModule.resolvedFileName;
        const childModule = moduleThree.get(modulePath);
        const moduleInfo = childModule || {
            moduleIndex: incrementModuleIndex++,
            modulePath: modulePath,
            isNodeModule: containinModuleInfo.isNodeModule || (/[/\\]node_modules[/\\]/).test(modulePath),
            __Module_Window_Name: compilerOptions.__Module_Window_Name,
            moduleColection: {},
            resolvedModule,
        };
        moduleInfo.isMainAsyncModule = moduleInfo.isMainAsyncModule || !!isMainAsyncModule;
        moduleInfo.isAsyncModule = (moduleInfo.isAsyncModule === false ?
            false :
            (containinModuleInfo.isMainAsyncModule || moduleInfo.isAsyncModule || isMainAsyncModule));
        console.log(containinModuleInfo.modulePath, modulePath, moduleInfo.isMainAsyncModule, moduleInfo.isAsyncModule);
        containinModuleInfo.moduleColection[moduleName] = moduleInfo;
        if (!childModule) {
            moduleThree.set(modulePath, moduleInfo);
        }
        if (moduleInfo.isNodeModule) {
            moduleInfo.__Module_Window_Name = compilerOptions.__Node_Module_Window_Name;
            exports.nodeModuleThree.set(modulePath, moduleInfo);
            compilerOptions.resetModuleFiles();
        }
        return resolvedModule;
    };
    const newHost = {
        ...oldhost,
        resolveModuleNames(moduleNames, containingFile, _reusedNames, redirectedReference, compilerOptions, sourceFile) {
            return loadWithLocalWithSourceFileCache(sourceFile.imports, containingFile, moduleThree.get(containingFile), redirectedReference, Module_loader);
        }
    };
    return newHost;
};
exports.useLocalFileHostModuleRegistrator = useLocalFileHostModuleRegistrator;
const useModuleFileHostModuleRegistrator = (oldhost, compilerOptions) => {
    let incrementModuleIndex = exports.startModulesIndex;
    const moduleThree = compilerOptions.moduleThree;
    const Module_loader = (moduleName, containingFile, containinModuleInfo, redirectedReference, isMainAsyncModule) => {
        let resolvedModule = containinModuleInfo.moduleColection[moduleName];
        if (resolvedModule) {
            return resolvedModule.resolvedModule;
        }
        resolvedModule = (0, exports.nodeModuleResolver)(moduleName, path_1.default.dirname(containingFile));
        if (!resolvedModule) {
            return;
        }
        const modulePath = resolvedModule.resolvedFileName;
        const childModule = moduleThree.get(modulePath);
        const moduleInfo = childModule || {
            moduleIndex: incrementModuleIndex++,
            modulePath: modulePath,
            isNodeModule: true,
            __Module_Window_Name: compilerOptions.__Module_Window_Name,
            moduleColection: {},
            resolvedModule,
        };
        moduleInfo.isMainAsyncModule = moduleInfo.isMainAsyncModule || !!isMainAsyncModule;
        moduleInfo.isAsyncModule = moduleInfo.isAsyncModule === false || containinModuleInfo.isAsyncModule === false ?
            false :
            (containinModuleInfo.isMainAsyncModule || containinModuleInfo.isAsyncModule || !!isMainAsyncModule);
        containinModuleInfo.moduleColection[moduleName] = moduleInfo;
        if (!childModule) {
            moduleThree.set(modulePath, moduleInfo);
        }
        return resolvedModule;
    };
    return {
        ...oldhost,
        resolveModuleNames(moduleNames, containingFile, _reusedNames, redirectedReference, compilerOptions, sourceFile) {
            return loadWithLocalWithSourceFileCache(sourceFile.imports, containingFile, exports.nodeModuleThree.get(containingFile), redirectedReference, Module_loader);
        }
    };
};
exports.useModuleFileHostModuleRegistrator = useModuleFileHostModuleRegistrator;
const loadWithLocalWithSourceFileCache = (imports, containingFile, containinModuleInfo, redirectedReference, loader) => {
    return containinModuleInfo.resolvedModuleNames || (containinModuleInfo.resolvedModuleNames = (imports || []).flatMap(({ text, parent }) => {
        const resolved = loader(text, containingFile, containinModuleInfo, redirectedReference, parent?.expression?.kind === typescript_1.SyntaxKind.ImportKeyword);
        return resolved ? [resolved] : [];
    }));
};
