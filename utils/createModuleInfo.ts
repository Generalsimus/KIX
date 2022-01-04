import ts from "typescript";

export type ModuleInfoType = {
  modulePath: string;
  moduleIndex: number;
  moduleColection: Record<string, ModuleInfoType>;
  resolvedModuleNames?: ts.ResolvedModule[];
  resolvedModule?: ts.ResolvedModule;
  isNodeModule: boolean;
};
let globalModuleIndex = 1;
export const createModuleInfo = (modulePath: string): ModuleInfoType => {
  return {
    modulePath,
    moduleIndex: globalModuleIndex++,
    moduleColection: {},
    isNodeModule: /[/\\]node_modules[/\\]/.test(modulePath),
  };
};
