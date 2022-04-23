import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { getModuleInfo, ModuleInfoType } from "../../utils/getModuleInfo";
import resolve from "resolve";
import { isPathNodeModule } from "../../utils/isPathNodeModule";
import path from "path";
import { normalizeSlashes } from "../../utils/normalizeSlashes";
import fs from "fs";
import { getResolvedModuleObject } from "../../utils/getResolvedModuleObject";
// var resolve = require('resolve/async'); // or, require('resolve')
// resolve('tap', { basedir: __dirname }, function (err, res) {
//     if (err) console.error(err);
//     else console.log(res);
// });

const resolveModule = (moduleName: string, containingFile: string): ts.ResolvedModuleFull | undefined => {
    try {
        const resolvedFileName = normalizeSlashes(resolve.sync(moduleName, {
            basedir: path.dirname(containingFile),
            extensions: ['.js', '.jsx', path.extname(moduleName)]
        }))
        return getResolvedModuleObject(resolvedFileName)
    } catch (e) {
        const defaultModulePaths: Record<string, ts.ResolvedModuleFull> = {
            kix: {
                resolvedFileName: App.injectPaths.kixType,
                extension: ts.Extension.Dts,
                isExternalLibraryImport: false,
            }
        }
        return defaultModulePaths[moduleName]

        // if (defaultResolvedFileName) {
        //     return {
        //         resolvedFileName: normalizeSlashes(defaultResolvedFileName),
        //         isExternalLibraryImport: false,
        //         extension: ts.Extension.Js
        //     }
        // }
        // return defaultModulePaths[moduleName]
    }
}


const resolveName = (moduleName: string, containingFileModuleInfo: ModuleInfoType, host: createProgramHost) => {
    // console.log({
    //     containingFileModuleInfo,
    //     moduleName
    // })
    let resolvedModule = containingFileModuleInfo.moduleCollection[moduleName]?.resolvedModule

    if (resolvedModule) {
        return resolvedModule
    }

    resolvedModule = (ts.nodeModuleNameResolver(moduleName, containingFileModuleInfo.modulePath, host.options, host).resolvedModule ||
        resolveModule(moduleName, containingFileModuleInfo.modulePath))
    // console.log("🚀 --> file: resolveModuleNames.ts --> line 57 --> resolveName --> resolvedModule",  resolveModule(moduleName, containingFileModuleInfo.modulePath));
    // console.log("🚀 --> file: --> moduleNames", moduleName, ts.nodeModuleNameResolver(moduleName, containingFileModuleInfo.modulePath, host.options, host);
    // if ('kix' === moduleName) {
    //     console.log({
    //         moduleName,
    //         resolvedModule
    //     });
    // }
    if (!resolvedModule) return;

    // resolvedModule && (resolvedModule.isExternalLibraryImport = false)
    // ts.isExternalModuleIndicator


    const moduleInfo = getModuleInfo(resolvedModule.resolvedFileName);

    if (!host.sourceFileCache.has(resolvedModule.resolvedFileName)) {
        host.emitFileLobby.add(resolvedModule.resolvedFileName)
    }

    moduleInfo.resolvedModule = resolvedModule;

    // console.log("🚀 --> file: moduleInfo", /[/\\]node_modules[/\\]/.test(moduleInfo.modulePath), moduleInfo.isNodeModule, containingFileModuleInfo.isNodeModule);
    let resolvedModuleJsPath: ts.ResolvedModule | undefined = resolvedModule
    if (resolvedModule.resolvedFileName.endsWith(".d.ts")) {
        resolvedModuleJsPath = (
            getResolvedModuleObject(resolvedModule.resolvedFileName.replace(/(\.d\.ts)$/, ".js")) ||
            resolveModule(moduleName, containingFileModuleInfo.modulePath)
        );
    }

    if (resolvedModuleJsPath) {
        const jsResolvedModuleInfo = getModuleInfo(resolvedModuleJsPath.resolvedFileName);
        jsResolvedModuleInfo.resolvedModule = resolvedModule;
        moduleInfo.jsResolvedModule = jsResolvedModuleInfo;
    }

    if ((moduleInfo.isNodeModule = (moduleInfo.isNodeModule || containingFileModuleInfo.isNodeModule)) && resolvedModuleJsPath) {

        host.moduleRootNamesSet.add(resolvedModuleJsPath.resolvedFileName);
    } else {

        moduleInfo.rootWriters[containingFileModuleInfo.modulePath] = containingFileModuleInfo.rootWriters
    }
    host.localFileWatcher.add(moduleInfo.modulePath)



    containingFileModuleInfo.moduleCollection[moduleName] = moduleInfo;

    return resolvedModule
}


export function resolveModuleNames(this: createProgramHost, moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ts.ResolvedProjectReference | undefined, options: ts.CompilerOptions, containingSourceFile?: ts.SourceFile): (ts.ResolvedModule | undefined)[] {



    // console.log("🚀 --> file: resolveModuleNames.ts --> line 64 --> resolveModuleNames --> containingFile", containingFile);
    // console.log("🚀 --> file: resolveModuleNames.ts --> line 64 --> resolveModuleNames --> moduleNames", moduleNames);

    const containingFileModuleInfo = getModuleInfo(containingFile)
    const resolvedModuleNames = containingFileModuleInfo.resolvedModuleNames || (containingFileModuleInfo.resolvedModuleNames = moduleNames.map(moduleName => {

        return resolveName(moduleName, containingFileModuleInfo, this)
    }));

    return resolvedModuleNames
}
