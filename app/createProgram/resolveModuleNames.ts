import ts from "typescript";
import { createProgramHost } from ".";
import { App } from "..";
import { getModuleInfo, ModuleInfoType } from "../../utils/getModuleInfo";
import resolve from "resolve";
import { isPathNodeModule } from "../../utils/isPathNodeModule";
import path from "path";
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

        return undefined;
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

    const moduleInfo = getModuleInfo(resolvedModule.resolvedFileName);

    moduleInfo.resolvedModule = resolvedModule;
    moduleInfo.rootWriters[containingFileModuleInfo.modulePath] = containingFileModuleInfo.rootWriters

    host.watcher.add(moduleInfo.modulePath)


    containingFileModuleInfo.moduleCollection[moduleName] = moduleInfo;

    return resolvedModule
}


export function resolveModuleNames(this: createProgramHost, moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ts.ResolvedProjectReference | undefined, options: ts.CompilerOptions, containingSourceFile?: ts.SourceFile): (ts.ResolvedModule | undefined)[] {

    const containingFileModuleInfo = getModuleInfo(containingFile)

    return containingFileModuleInfo.resolvedModuleNames || (containingFileModuleInfo.resolvedModuleNames = moduleNames.map(moduleName => {
        return resolveName(moduleName, containingFileModuleInfo, this)
    }))
}