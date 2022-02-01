import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { getModuleInfo, ModuleInfoType } from "../../utils/getModuleInfo";
import resolve from "resolve";
import { isPathNodeModule } from "../../utils/isPathNodeModule";
import path from "path";
import { normalizeSlashes } from "../../utils/normalizeSlashes";
// var resolve = require('resolve/async'); // or, require('resolve')
// resolve('tap', { basedir: __dirname }, function (err, res) {
//     if (err) console.error(err);
//     else console.log(res);
// });

const resolveModule = (moduleName: string, containingFile: string): ts.ResolvedModuleFull | undefined => {
    try {
        const resolvedFileName = resolve.sync(moduleName, {
            basedir: path.dirname(containingFile),
            extensions: ['.js', '.jsx', path.extname(moduleName)]
        })
        return {
            resolvedFileName,
            isExternalLibraryImport: isPathNodeModule(resolvedFileName),
            extension: ts.Extension.Js
        }
    } catch (e) {
        const defaultModulePaths: Record<string, string> = {
            kix: App.kixModulePath
        }
        const defaultResolvedFileName = defaultModulePaths[moduleName]

        if (defaultResolvedFileName) {
            return {
                resolvedFileName: normalizeSlashes(defaultResolvedFileName),
                isExternalLibraryImport: false,
                extension: ts.Extension.Js
            }
        }
        // return defaultModulePaths[moduleName]
    }
}


const resolveName = (moduleName: string, containingFileModuleInfo: ModuleInfoType, host: createProgramHost) => {
    let resolvedModule = containingFileModuleInfo.moduleCollection[moduleName]?.resolvedModule

    if (resolvedModule) {
        return resolvedModule
    }

    resolvedModule = (ts.nodeModuleNameResolver(moduleName, containingFileModuleInfo.modulePath, host.options, host).resolvedModule ||
        resolveModule(moduleName, containingFileModuleInfo.modulePath))
    if (!resolvedModule) return;

    // resolvedModule && (resolvedModule.isExternalLibraryImport = false)
    // ts.isExternalModuleIndicator
    const moduleInfo = getModuleInfo(resolvedModule.resolvedFileName);


    // console.log("🚀 --> file: resolveModuleNames.ts --> line 53 --> resolveName --> resolvedModule", resolvedModule);

    moduleInfo.resolvedModule = resolvedModule;

    // console.log("🚀 --> file: resolveModuleNames.ts --> line 47 --> resolveName --> moduleInfo", moduleInfo.modulePath, (moduleInfo.isNodeModule = (moduleInfo.isNodeModule || host.moduleRootNamesSet.has(moduleInfo.modulePath))));
    if ((moduleInfo.isNodeModule = (moduleInfo.isNodeModule || containingFileModuleInfo.isNodeModule))) {
        host.moduleRootNamesSet.add(moduleInfo.modulePath)
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
    }))
    // console.log("🚀 --> file: resolveModuleNames.ts --> line 71 --> resolveModuleNames --> resolvedModuleNames", resolvedModuleNames);
    return resolvedModuleNames
}
