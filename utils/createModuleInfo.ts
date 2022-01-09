import ts from "typescript";
import { RootWriterCacheType } from "../app/compiler/getWriterProgram";

export type ModuleInfoType = {
  modulePath: string;
  moduleIndex: number;
  moduleCollection: Record<string, ModuleInfoType>;
  resolvedModuleNames?: (ts.ResolvedModule | undefined)[]
  resolvedModule?: ts.ResolvedModule;
  isNodeModule: boolean;
  writers: Record<string, RootWriterCacheType>,
  // RootWriterCacheType
};

let globalModuleIndex = 1;
export const createModuleInfo = (modulePath: string): ModuleInfoType => {
  return {
    modulePath,
    moduleIndex: globalModuleIndex++,
    moduleCollection: {},
    // isNodeModule: ts.pathContainsNodeModules(modulePath),
    isNodeModule: /[/\\]node_modules[/\\]/.test(modulePath),
    writers: {}
  };
};
