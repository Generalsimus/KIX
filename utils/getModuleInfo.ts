import ts from "typescript";
import { App } from "../app";
import { isPathNodeModule } from "./isPathNodeModule";
import chokidar from "chokidar";

export type ModuleInfoType = {
  modulePath: string;
  moduleIndex: number;
  moduleCollection: Record<string, ModuleInfoType>;
  resolvedModuleNames?: (ts.ResolvedModule | undefined)[]
  resolvedModule?: ts.ResolvedModule;
  isNodeModule: boolean;
  // writers: Record<string, RootWriterCacheType>,
  watcher?: chokidar.FSWatcher
  // RootWriterCacheType
};

let globalModuleIndex = 1;
export const getModuleInfo = (modulePath: string): ModuleInfoType => {
  return App.moduleThree.get(modulePath) || {
    modulePath,
    moduleIndex: globalModuleIndex++,
    moduleCollection: {},
    // isNodeModule: ts.pathContainsNodeModules(modulePath),
    isNodeModule: isPathNodeModule(modulePath),
    // writers: {}
  };
};
