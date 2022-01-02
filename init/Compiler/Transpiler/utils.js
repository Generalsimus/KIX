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
import { filePathToUrl, getColumnName } from "../../../helpers/utils"


import ts from "typescript/lib/tsserverlibrary";
import { App } from "../../App";


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





export const watchModuleFileChange = (NODE, moduleInfo, { __visitedSourceFilesMap, __emitProgram, __isNodeModuleBuilding, cancellationToken: { requesteCancell } }) => {
    if (!(
        (!moduleInfo.fileWatcher && App.__Dev_Mode && !__isNodeModuleBuilding) &&
        (!moduleInfo.isAsyncModule || (moduleInfo.isAsyncModule && !moduleInfo.isEs6Module))
    )) { return }

    moduleInfo.fileWatcher = chokidar.watch(NODE.originalFileName).on('change', (event, path) => {

        delete moduleInfo.resolvedModuleNames

        App.__Host.deleteFileinThree(NODE.path)
        __visitedSourceFilesMap.delete(NODE.originalFileName)
        // __emitProgram 
        requesteCancell()
        __emitProgram()
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
    // const transpilerAfter = concatBeforOrAfterTransformers(after)
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
    // const isCssRegex = /\.(((c|le|sa|sc)ss)|styl)$/,
    const __moduleThree = compilerOptions.__moduleThree;
    const currentDirectory = oldhost.getCurrentDirectory(),
        getCanonicalFileName = createGetCanonicalFileName(oldhost.useCaseSensitiveFileNames()),
        moduleResolutionCache = createModuleResolutionCache(currentDirectory, getCanonicalFileName),
        Module_loader = (moduleName, containingFile, containinModuleInfo, redirectedReference, isMainAsyncModule) => {
            // console.log("🚀 --> file: utils.js --> line 255 --> useLocalFileHostModuleRegistrator --> redirectedReference", redirectedReference)
            let resolvedModule = containinModuleInfo.moduleColection[moduleName];

            // console.log("🚀 --> file: utils.js --> line 321 --> useLocalFileHostModuleRegistrator --> moduleName", moduleName)
            // console.log("🚀 --> file: utils.js --> line 272 --> useLocalFileHostModuleRegistrator --> moduleName", moduleName, resolvedModule?.resolvedFileName)
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
            const childModule = __moduleThree.get(modulePath);
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


            containinModuleInfo.moduleColection[moduleName] = moduleInfo;

            if (!childModule) {
                __moduleThree.set(modulePath, moduleInfo)
            }
            if (moduleInfo.isNodeModule) {
                moduleInfo.__Module_Window_Name = compilerOptions.__Node_Module_Window_Name;

                nodeModuleThree.set(modulePath, moduleInfo)

                compilerOptions.__resetModuleFiles()
                // resetModuleFiles

            }


            return resolvedModule
        }
    // console.log("🚀 --> file: utils.js --> line 348 --> useModuleFileHostModuleRegistrator --> moduleThree", moduleThree)
    const newHost = {
        ...oldhost,
        resolveModuleNames(moduleNames, containingFile, _reusedNames, redirectedReference, compilerOptions, sourceFile) {
            console.log(sourceFile.fileName)
            // console.log("🚀 --> file: utils.js --> line 422 --> loadWithLocalWithSourceFileCache --> __moduleThree", __moduleThree)
            // console.log("🚀 --> file: utils.js --> line 422 --> loadWithLocalWithSourceFileCache --> containingFile", containingFile)
            return loadWithLocalWithSourceFileCache(
                sourceFile.imports,
                containingFile,
                __moduleThree.get(containingFile),
                redirectedReference,
                Module_loader
            )
        }
    }
    return newHost
}







export const useModuleFileHostModuleRegistrator = (oldhost, compilerOptions) => {
    let incrementModuleIndex = startModulesIndex;
    const __moduleThree = compilerOptions.__moduleThree;
    const Module_loader = (moduleName, containingFile, containinModuleInfo, redirectedReference, isMainAsyncModule) => {
        let resolvedModule = containinModuleInfo.moduleColection[moduleName];
        // console.log("🚀 --> file: utils.js --> line 369 --> useModuleFileHostModuleRegistrator --> moduleName", moduleName)

        if (resolvedModule) {
            return resolvedModule.resolvedModule
        }

        resolvedModule = nodeModuleResolver(moduleName, path.dirname(containingFile));
        if (!resolvedModule) {
            return;
        }

        const modulePath = resolvedModule.resolvedFileName;
        const childModule = __moduleThree.get(modulePath)



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
            __moduleThree.set(modulePath, moduleInfo)
        }

        return resolvedModule
    }
    return {
        ...oldhost,
        resolveModuleNames(moduleNames, containingFile, _reusedNames, redirectedReference, compilerOptions, sourceFile) {
            // console.log("🚀 --> file: utils.js --> line 416 --> resolveModuleNames --> containingFile", containingFile)

            return loadWithLocalWithSourceFileCache(
                sourceFile.imports,
                containingFile,
                __moduleThree.get(containingFile),
                redirectedReference,
                Module_loader
            )
        }
    }
}


const loadWithLocalWithSourceFileCache = (imports, containingFile, containinModuleInfo, redirectedReference, loader) => {
    // console.log("🚀 --> file: utils.js --> line 429 --> loadWithLocalWithSourceFileCache --> containingFile", containingFile)

    return containinModuleInfo.resolvedModuleNames || (containinModuleInfo.resolvedModuleNames = (imports || []).flatMap(({ text, parent }) => {

        // console.log("🚀 --> file: utils.js --> line 433 --> returncontaininModuleInfo.resolvedModuleNames|| --> text", text)
        const resolved = loader(text, containingFile, containinModuleInfo, redirectedReference, parent?.expression?.kind === SyntaxKind.ImportKeyword);


        // console.log("🚀 --> file:  duleNames|| --> text", text, resolved)
        return resolved ? [resolved] : []
    }))



    // return ss

}




export const configCompilerOptions = (compilerOptions) => {


    // console.log("🚀 --> file: utils.js --> line 451 --> configCompilerOptions --> compilerOptions.__isNodeModuleBuilding", compilerOptions.__isNodeModuleBuilding)
    let exeCuteCode = "";
    if (compilerOptions.__isNodeModuleBuilding) {
        compilerOptions.__moduleThree = new Map([...nodeModuleThree])
        compilerOptions.__Host = compilerOptions.__Host || useModuleFileHostModuleRegistrator(App.__Host, compilerOptions)
        exeCuteCode += `\n${compilerOptions.__Node_Module_Window_Name}[${codeControlerIndex}];`

        // __executeCode = App.__Dev_Mode ? `${__Module_Window_Name}[${codeControlerIndex}]` : "",
    } else {
        compilerOptions.__moduleThree = new Map([
            ...defaultModuleThree,
            ...compilerOptions.__mainFilesPaths.map((modulePath) => {
                const moduleIndex = startModulesIndex++;
                exeCuteCode += `\n${compilerOptions.__Module_Window_Name}[${moduleIndex}];`
                return [modulePath, {
                    moduleIndex,
                    modulePath: modulePath,
                    isNodeModule: false,
                    __Module_Window_Name: compilerOptions.__Module_Window_Name,
                    moduleColection: {},
                    isAsyncModule: false,
                }]
            })
        ])


        compilerOptions.__Host = compilerOptions.__Host || useLocalFileHostModuleRegistrator(App.__Host, compilerOptions)
    }


    compilerOptions.writeFile = (requestPath, content) => compilerOptions.__writeFile(requestPath, content, exeCuteCode, compilerOptions)
} 