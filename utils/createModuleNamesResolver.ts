import ts from "typescript";
import resolve from "resolve";
import { App } from "../app/index";
import { createModuleInfo, ModuleInfoType } from "./createModuleInfo";
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
    return loadWithLocalWithCache(
      moduleNames,
      moduleThree.get(containingFile),
      (moduleName: string) =>
        ts.resolveModuleName(
          moduleName,
          containingFile,
          compilerOptions,
          host,
          moduleResolutionCache,
          redirectedReference
        ).resolvedModule
    );
  };

  function loadWithLocalWithCache(
    moduleNames: string[],
    containinModuleInfo: ModuleInfoType,
    moduleResolver: ModuleResolverType
  ): ts.ResolvedModule[] {
    return (
      containinModuleInfo.resolvedModuleNames ||
      moduleNames.flatMap((moduleName) => {
        const resolved = loadResolver(
          moduleName,
          containinModuleInfo,
          moduleResolver
        );
        return resolved ? [resolved] : [];
      })
    );
  }

  function loadResolver(
    moduleName: string,
    containinModuleInfo: ModuleInfoType,
    moduleResolver: ModuleResolverType
  ) {
    const resolvedModule =
      containinModuleInfo.moduleColection[moduleName]?.resolvedModule ||
      moduleResolver(moduleName) ||
      nodeModuleResolver(
        moduleName,
        path.dirname(containinModuleInfo.modulePath)
      );

    if (!resolvedModule) {
      return;
    }

    const modulePath = resolvedModule.resolvedFileName;
    const childModule = moduleThree.get(modulePath);
    const moduleInfo = childModule || createModuleInfo(modulePath);

    containinModuleInfo.moduleColection[moduleName] = moduleInfo;

    return resolvedModule;
  }
};

function nodeModuleResolver(modulePath, fileDirectory) {
  try {
    return {
      resolvedFileName: ts["normalizeSlashes"](
        resolve.sync(modulePath, {
          basedir: fileDirectory,
          extensions: [".js", path.extname(modulePath)],
        })
      ),
      originalPath: undefined,
      extension: ts.Extension.Js,
      isExternalLibraryImport: false,
      packageId: undefined,
    };
  } catch {}
}
