import {
    getDirectoryPath, SyntaxKind, visitEachChild, factory, normalizeSlashes,
    parseConfigFileTextToJson,
    createSourceFile,
    createCompilerHost,
    resolveModuleName,
    createGetCanonicalFileName,
    createModuleResolutionCache,
    Debug,
    normalizeSlashes
} from "typescript"
import tsModule from 'typescript/lib/tsserverlibrary';
import resolve from "resolve"
import chokidar from "chokidar"
import path from "path"
import { getColumnName } from "../../../helpers/utils"
import { App } from "../../App"

import ts from "typescript/lib/tsserverlibrary";


const {
    createToken,
    createBinaryExpression,
    createVariableStatement,
    createVariableDeclarationList,
    createVariableDeclaration,
    createBlock,
    createIdentifier,
    createPropertyAccessExpression,
    createObjectLiteralExpression,
    createParameterDeclaration,
    createParenthesizedExpression,
    createArrowFunction,
    createCallExpression,
    createObjectBindingPattern,
    createBindingElement
} = factory






export let startModulesIndex = 1;

const defaultModules = {
    kix: {
        moduleIndex: startModulesIndex++,
        modulePath: App.__kixModuleLocation,
        isNodeModule: true,
        __Module_Window_Name: App.__compilerOptions.__Node_Module_Window_Name,
        moduleColection: {},
        isAsyncModule: false,
    }

}

export const codeControlerPath = normalizeSlashes(path.join(__dirname, "./../../../../main/codeController/index.js"))
export const codePolyfillPath = normalizeSlashes(path.join(__dirname, "./../../../../main/polyfill.js"))
export const codeControlerIndex = startModulesIndex++
export const defaultModuleThree = [
    [defaultModules.kix.modulePath, defaultModules.kix],
    [codeControlerPath, {
        moduleIndex: codeControlerIndex,
        modulePath: codeControlerPath,
        isNodeModule: true,
        __Module_Window_Name: App.__compilerOptions.__Node_Module_Window_Name,
        moduleColection: {},
        isAsyncModule: false,
    }],
    [codePolyfillPath, {
        moduleIndex: startModulesIndex++,
        modulePath: codePolyfillPath,
        isNodeModule: true,
        __Module_Window_Name: App.__compilerOptions.__Node_Module_Window_Name,
        moduleColection: {},
        isAsyncModule: false,
    }],
]

export const nodeModuleThree = new Map(defaultModuleThree)




export const nodeModuleResolver = (modulePath, fileDirectory) => {
    try {
        return {
            resolvedFileName: normalizeSlashes(resolve.sync(modulePath, {
                basedir: fileDirectory,
                extensions: ['.js', '.ts', '.jsx', '.tsx', path.extname(modulePath)],
            })),
            originalPath: undefined,
            extension: tsModule.Extension.Js,
            isExternalLibraryImport: false,
            packageId: undefined
        }

    } catch {
        return {
            resolvedFileName: defaultModules[modulePath].modulePath,
            originalPath: undefined,
            extension: tsModule.Extension.Js,
            isExternalLibraryImport: true,
            packageId: undefined
        }

    }
}





export const watchModuleFileChange = (NODE, moduleInfo, {visitedSourceFilesMap, __isNodeModuleBuilding, cancellationToken: { requesteCancell }, changeFileCallback }) => {
    if (!(
        (!moduleInfo.fileWatcher && App.__Dev_Mode && !__isNodeModuleBuilding) &&
        (!moduleInfo.isAsyncModule || (moduleInfo.isAsyncModule && !moduleInfo.isEs6Module))
    )) { return }

    moduleInfo.fileWatcher = chokidar.watch(NODE.originalFileName).on('change', (event, path) => {

        delete moduleInfo.resolvedModuleNames

        App.__Host.deleteFileinThree(NODE.path)
        visitedSourceFilesMap.delete(NODE.originalFileName)
        requesteCancell()
        changeFileCallback()
        App.server.socketClientSender("RESTART_SERVER", {})
    });
}






















const concatBeforOrAfterTransformers = (BeforeOrAfter, transfromers = {}) => {
    for (const transformersObject of BeforeOrAfter) {
        for (const transfromersKey in transformersObject)
            if (transfromersKey in transfromers) {
                const transfromer = transfromers[transfromersKey]
                const newtransfromer = transformersObject[transfromersKey]
                transfromers[transfromersKey] = (node, ...args) => newtransfromer(transfromer(node, ...args), ...args)
            } else {
                transfromers[transfromersKey] = transformersObject[transfromersKey]
            }
    }
    return transfromers
}















export const getTransformersObject = (before, after) => {
    const transpilerBefore = concatBeforOrAfterTransformers(before)
    const transpilerAfter = concatBeforOrAfterTransformers(after)
    return {
        before: [
            (CTX) => {
                const visitor = (NODE) => {

                    // console.log(SyntaxKind[NODE.kind])

                    // return visitEachChild(NODE, visitor, CTX)
                    return (transpilerBefore[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
                }

                return visitor
            }
        ],
        // after: [
        //     (CTX) => {
        //         const visitor = (NODE) => {

        //             // console.log(SyntaxKind[NODE.kind])

        //             return (transpilerAfter[NODE.kind] || visitEachChild)(NODE, visitor, CTX)
        //         }

        //         return visitor
        //     }
        // ]
    }
}










export const createObjectPropertyLoop = (namesObject, returnValue = []) => {
    for (const nameKey in namesObject) {
        const value = namesObject[nameKey]
        returnValue.push(createBindingElement(
            undefined,
            value && createIdentifier(nameKey),
            value && createObjectPropertyLoop(value) || createIdentifier(nameKey),
            undefined
        ))

    }
    return createObjectBindingPattern(returnValue)
}










export const geModuleLocationMeta = (moduleInfo, compilerOptions) => {
    if (!moduleInfo) {
        return
    }
    // moduleInfo. = true;
    // moduleInfo.isAsyncModule = false;

    const propNode = factory.createNumericLiteral(moduleInfo.moduleIndex)
    return moduleInfo.__Module_Window_Name === compilerOptions.__Import_Module_Name ?
        [compilerOptions.__Import_Module_Name, propNode] :
        ["window", factory.createStringLiteral(moduleInfo.__Module_Window_Name), propNode]
}



export const useLocalFileHostModuleRegistrator = (oldhost, compilerOptions) => {
    let incrementModuleIndex = startModulesIndex;
    // const isCssRegex = /\.(((c|le|sa|sc)ss)|styl)$/,
    const moduleThree = compilerOptions.moduleThree,
        currentDirectory = oldhost.getCurrentDirectory(),
        getCanonicalFileName = createGetCanonicalFileName(oldhost.useCaseSensitiveFileNames()),
        moduleResolutionCache = createModuleResolutionCache(currentDirectory, getCanonicalFileName),
        Module_loader = (moduleName, containingFile, containinModuleInfo, redirectedReference, isMainAsyncModule) => {
            // console.log("🚀 --> file: utils.js --> line 255 --> useLocalFileHostModuleRegistrator --> redirectedReference", redirectedReference)
            let resolvedModule = containinModuleInfo.moduleColection[moduleName];

            if (resolvedModule) {
                return resolvedModule.resolvedModule
            }

            resolvedModule = (
                resolveModuleName(moduleName, containingFile, compilerOptions, newHost, moduleResolutionCache, redirectedReference).resolvedModule ||
                nodeModuleResolver(moduleName, path.dirname(containingFile))
            );

            // console.log("🚀 --> file: utils.js --> line 263 --> useLocalFileHostModuleRegistrator --> resolvedModule", resolvedModule)
            // console.log("🚀 --> file: utils.js --> line 263 --> useLocalFileHostModuleRegistrator --> resolvedModule", resolvedModule)

            if (!resolvedModule) {
                return;
            }
            if (resolvedModule.extension === tsModule.Extension.Dts) {
                return resolvedModule;
            }




            const modulePath = resolvedModule.resolvedFileName;
            const childModule = moduleThree.get(modulePath);
            const moduleInfo = childModule || {
                moduleIndex: incrementModuleIndex++,
                modulePath: modulePath,
                isNodeModule: containinModuleInfo.isNodeModule || (/[/\\]node_modules[/\\]/).test(modulePath),
                __Module_Window_Name: compilerOptions.__Module_Window_Name,
                // isAsyncModule, 
                moduleColection: {},
                resolvedModule,
            };

            // moduleInfo.isEs6Module = true;
            moduleInfo.isMainAsyncModule = moduleInfo.isMainAsyncModule || !!isMainAsyncModule;
            moduleInfo.isAsyncModule = (
                moduleInfo.isAsyncModule === false ?
                    false :
                    (containinModuleInfo.isMainAsyncModule || moduleInfo.isAsyncModule || isMainAsyncModule)
                // (moduleInfo.isMainAsyncModule ? true : containinModuleInfo.isMainAsyncModule || false)
            );

            //  (containinModuleInfo.isMainAsyncModule || (!!isMainAsyncModule))
            //  || !isMainAsyncModule ? containinModuleInfo.isMainAsyncModule || false : true;
            // moduleInfo.isAsyncModule === false || containinModuleInfo.isAsyncModule === false ?
            //     false :
            //     (containinModuleInfo.isMainAsyncModule || containinModuleInfo.isAsyncModule || !!isMainAsyncModule)
            console.log(containinModuleInfo.modulePath, modulePath, moduleInfo.isMainAsyncModule, moduleInfo.isAsyncModule)
            //  isMainAsyncModule
            // moduleInfo.isAsyncModule = containinModuleInfo.isAsyncModule === false ? false : moduleInfo.isAsyncModule || isMainAsyncModule;

            // !isMainAsyncModule || containinModuleInfo.isMainAsyncModule || containinModuleInfo.isAsyncModule
            //  moduleInfo.hasOwnProperty("isAsyncModule") ?
            //     moduleInfo.isAsyncModule :
            //     (!isMainAsyncModule ?
            //         false :
            //         (containinModuleInfo.isMainAsyncModule || containinModuleInfo.isAsyncModule)
            //     );

            // moduleInfo.isAsyncModule = moduleInfo.isAsyncModule === false ? false : containinModuleInfo.isMainAsyncModule || containinModuleInfo.isAsyncModule;
            // moduleInfo.isAsyncModule = moduleInfo.isAsyncModule === false ? false : containinModuleInfo.isMainAsyncModule || containinModuleInfo.isAsyncModule;
            // moduleInfo.isParentAsyncModule = containinModuleInfo.isAsyncModule && !containinModuleInfo.isEs6Module
            // if (!isMainAsyncModule) {
            //     moduleInfo.isAsyncModule = false;
            // }

            containinModuleInfo.moduleColection[moduleName] = moduleInfo;

            if (!childModule) {
                moduleThree.set(modulePath, moduleInfo)
            }
            if (moduleInfo.isNodeModule) {
                moduleInfo.__Module_Window_Name = compilerOptions.__Node_Module_Window_Name;

                nodeModuleThree.set(modulePath, moduleInfo)

                compilerOptions.resetModuleFiles()

            }


            return resolvedModule
        }
    // console.log("🚀 --> file: utils.js --> line 348 --> useModuleFileHostModuleRegistrator --> moduleThree", moduleThree)
    const newHost = {
        ...oldhost,
        resolveModuleNames(moduleNames, containingFile, _reusedNames, redirectedReference, compilerOptions, sourceFile) {

            return loadWithLocalWithSourceFileCache(
                sourceFile.imports,
                containingFile,
                moduleThree.get(containingFile),
                redirectedReference,
                Module_loader
            )
        }
    }
    return newHost
}







export const useModuleFileHostModuleRegistrator = (oldhost, compilerOptions) => {
    let incrementModuleIndex = startModulesIndex;
    const moduleThree = compilerOptions.moduleThree;
    const Module_loader = (moduleName, containingFile, containinModuleInfo, redirectedReference, isMainAsyncModule) => {
        let resolvedModule = containinModuleInfo.moduleColection[moduleName];

        if (resolvedModule) {
            return resolvedModule.resolvedModule
        }

        resolvedModule = nodeModuleResolver(moduleName, path.dirname(containingFile));
        if (!resolvedModule) {
            return;
        }

        const modulePath = resolvedModule.resolvedFileName;
        const childModule = moduleThree.get(modulePath)



        const moduleInfo = childModule || {
            moduleIndex: incrementModuleIndex++,
            modulePath: modulePath,
            isNodeModule: true,
            // isAsyncModule,
            // isEs6Module: isAsyncModule === false,
            __Module_Window_Name: compilerOptions.__Module_Window_Name,
            moduleColection: {},
            resolvedModule,
        }
        // if (!isAsyncModule) {
        //     moduleInfo.isEs6Module = true;
        // }

        // moduleInfo.isAsyncModule = moduleInfo.isAsyncModule === false ? false : moduleInfo.isAsyncModule || isAsyncModule;
        moduleInfo.isMainAsyncModule = moduleInfo.isMainAsyncModule || !!isMainAsyncModule;
        moduleInfo.isAsyncModule = moduleInfo.isAsyncModule === false || containinModuleInfo.isAsyncModule === false ?
            false :
            (containinModuleInfo.isMainAsyncModule || containinModuleInfo.isAsyncModule || !!isMainAsyncModule)

        containinModuleInfo.moduleColection[moduleName] = moduleInfo;
        if (!childModule) {
            moduleThree.set(modulePath, moduleInfo)
        }

        return resolvedModule
    }
    return {
        ...oldhost,
        resolveModuleNames(moduleNames, containingFile, _reusedNames, redirectedReference, compilerOptions, sourceFile) {
            return loadWithLocalWithSourceFileCache(
                sourceFile.imports,
                containingFile,
                nodeModuleThree.get(containingFile),
                redirectedReference,
                Module_loader
            )
        }
    }
}


const loadWithLocalWithSourceFileCache = (imports, containingFile, containinModuleInfo, redirectedReference, loader) => {



    return containinModuleInfo.resolvedModuleNames || (containinModuleInfo.resolvedModuleNames = (imports || []).flatMap(({ text, parent }) => {

        const resolved = loader(text, containingFile, containinModuleInfo, redirectedReference, parent?.expression?.kind === SyntaxKind.ImportKeyword);
        return resolved ? [resolved] : []
    }))


}

