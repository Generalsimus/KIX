import ts from "typescript";
import resolve from "resolve";
import { App } from "../index";
import {
  createModuleInfo,
  ModuleInfoType,
} from "../../utils/createModuleInfo";
import { formatDiagnosticsHost } from "./reportDiagnostic";
import path from "path";

type ModuleResolverType = (
  moduleNames: string
) => ts.ResolvedModule | undefined;
export const createModuleNamesResolver = (
  host: ts.WatchCompilerHostOfConfigFile<ts.SemanticDiagnosticsBuilderProgram>
) => {
  const moduleResolutionCache = ts.createModuleResolutionCache(
    App.runDirName,
    formatDiagnosticsHost.getCanonicalFileName
  ),
    moduleThree = App.moduleThree;
  return (
    moduleNames: string[],
    containingFile: string,
    reusedNames: string[] | undefined,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    compilerOptions: ts.CompilerOptions,
    containingSourceFile?: ts.SourceFile
  ) => {

    // console.log(containingFile)
    // console.log(
    //   "🚀 --> file: createModuleNamesResolver.ts --> line 30 --> containingFile",
    //   containingFile
    // );
    return loadWithLocalWithCache(
      moduleNames,
      (moduleName: string) =>
        ts.resolveModuleName(
          moduleName,
          containingFile,
          compilerOptions,
          host,
          moduleResolutionCache,
          redirectedReference
        ).resolvedModule,
      containingFile,
      moduleThree.get(containingFile),
    );
  };

  function loadWithLocalWithCache(
    moduleNames: string[],
    moduleResolver: ModuleResolverType,
    containingFile: string,
    containModuleInfo?: ModuleInfoType,
  ): (ts.ResolvedModule | undefined)[] {
    if (!containModuleInfo) {
      containModuleInfo = createModuleInfo(containingFile);
      moduleThree.set(containingFile, containModuleInfo);
    }
    return (containModuleInfo.resolvedModuleNames || (containModuleInfo.resolvedModuleNames = moduleNames.map((moduleName) => {
      return loadResolver(moduleName, containModuleInfo!, moduleResolver);
    }))
    );
  }

  function loadResolver(
    moduleName: string,
    containModuleInfo: ModuleInfoType,
    moduleResolver: ModuleResolverType
  ) {
    const resolvedModule =
      containModuleInfo.moduleCollection[moduleName]?.resolvedModule ||
      moduleResolver(moduleName) ||
      nodeModuleResolver(
        moduleName,
        path.dirname(containModuleInfo.modulePath)
      );

    if (!resolvedModule) {
      return;
    }

    const modulePath = resolvedModule.resolvedFileName;
    const childModule = moduleThree.get(modulePath);
    const moduleInfo = childModule || createModuleInfo(modulePath);


    if (!childModule) {
      App.moduleThree.set(modulePath, moduleInfo);
    }
    containModuleInfo.moduleCollection[moduleName] = moduleInfo;

    return resolvedModule;
  }
};

function nodeModuleResolver(modulePath: string, fileDirectory: string) {
  try {
    return {
      resolvedFileName:
        // ts["normalizeSlashes"](
        resolve.sync(modulePath, {
          basedir: fileDirectory,
          extensions: [".js", path.extname(modulePath)],
        })
      // )
      ,
      originalPath: undefined,
      extension: ts.Extension.Js,
      isExternalLibraryImport: false,
      packageId: undefined,
    };
  } catch { }
}
