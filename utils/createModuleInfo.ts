import ts from "typescript";

export type ModuleInfoType = {
  modulePath: string;
  moduleIndex: number;
  moduleCollection: Record<string, ModuleInfoType>;
  resolvedModuleNames?: (ts.ResolvedModule | undefined)[]
  resolvedModule?: ts.ResolvedModule;
  isNodeModule: boolean;
};

let globalModuleIndex = 1;
export const createModuleInfo = (modulePath: string): ModuleInfoType => {
  return {
    modulePath,
    moduleIndex: globalModuleIndex++,
    moduleCollection: {},
    isNodeModule: /[/\\]node_modules[/\\]/.test(modulePath),
  };
};
